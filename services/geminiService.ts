import { GoogleGenAI, LiveServerMessage, Modality, Blob, Type, FunctionDeclaration } from "@google/genai";
import { LogEntry, Item, Group } from "../types";

// Helper for PCM Audio Blob creation
function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const generateInsights = async (item: Item, logs: LogEntry[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const logText = logs.map(l => `- [${l.type.toUpperCase()}] ${new Date(l.createdAt).toLocaleDateString()}: ${l.content}`).join('\n');
  
  const prompt = `Analyze this Web3 project based on my logs.
  Project: ${item.title}
  Current Progress: ${item.progress}%
  Logs:
  ${logText}
  
  Provide a concise, bulleted summary of the project status and suggest 2 next steps. Keep it under 150 words.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  
  return response.text;
};

export const speakText = async (text: string): Promise<AudioBuffer | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return null;

    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      outputAudioContext,
      24000,
      1,
    );
    return audioBuffer;
  } catch (e) {
    console.error("TTS Error:", e);
    return null;
  }
};

const openProjectTool: FunctionDeclaration = {
  name: "open_project",
  description: "Opens the details/notes view for a specific project. Use this when the user asks to see, open, or work on a specific project.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      projectId: {
        type: Type.STRING,
        description: "The ID of the project to open.",
      },
    },
    required: ["projectId"],
  },
};

export class LiveSession {
  private ai: GoogleGenAI;
  private sessionPromise: Promise<any> | null = null;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private nextStartTime = 0;
  private sources = new Set<AudioBufferSourceNode>();
  private active = false;
  private onOpenItemCallback: ((id: string) => void) | null = null;
  
  constructor(private onStatusChange: (status: string) => void) {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async start(contextData: { groups: Group[], items: Item[], logs: LogEntry[], onOpenItem: (id: string) => void }) {
    if (this.active) return;
    this.active = true;
    this.onOpenItemCallback = contextData.onOpenItem;
    this.onStatusChange('connecting');

    const dbContext = contextData.groups.map(g => {
      const groupItems = contextData.items.filter(i => i.groupId === g.id);
      if (groupItems.length === 0) return `Folder: ${g.name} (Empty)`;
      
      return `Folder: ${g.name}\n` + groupItems.map(item => {
         const itemLogs = contextData.logs
            .filter(l => l.itemId === item.id)
            .sort((a,b) => b.createdAt - a.createdAt);
         
         const logsText = itemLogs.length > 0 
            ? itemLogs.map(l => {
                const cleanContent = l.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                return `    - [${l.type.toUpperCase()}] ${new Date(l.createdAt).toLocaleDateString()}: "${cleanContent}"`;
              }).join('\n')
            : "    (No notes yet)";

         return `  Project: "${item.title}" (ID: ${item.id}, Status: ${item.progress}%)\n  Notes:\n${logsText}`;
      }).join('\n');
    }).join('\n\n');

    const onboardingScript = `
    ONBOARDING PERSONA:
    You are the "Orbit Onboarding Agent." Your goal is to guide the user through their Command Center.
    
    DEMO CONTEXT:
    If you see a folder named "🚀 Demo: Start Here", help the user explore it.
    - Right panel (folders) is where they categorize their world.
    - Main screen (projects) displays project cards for a bird's-eye view.
    - The Vault: When a card is opened, the user sees their private logs and social icons (X, YouTube, etc.) to plan execution.
    
    INSTRUCTIONS:
    - Refer to Groups as "Folders".
    - If the user asks what to do, suggest they open the 'Soccer Airdrop' project to see how notes and links stay organized.
    - Use the 'open_project' tool if they ask to see a project.
    `;

    const systemInstruction = `You are "Orbit", an advanced Web3 operating system voice AI.
    
    ${onboardingScript}

    CURRENT VAULT STATE (Organized by Folder):
    ${dbContext}
    
    INSTRUCTIONS:
    - Keep responses professional, secure, and helpful.
    - Refer to the "Vault" as the source of truth.
    - Keep responses short and focused.
    `;

    this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
    this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    
    const outputNode = this.outputAudioContext!.createGain();
    outputNode.connect(this.outputAudioContext!.destination);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    this.sessionPromise = this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: systemInstruction,
        tools: [{ functionDeclarations: [openProjectTool] }],
      },
      callbacks: {
        onopen: () => {
          this.onStatusChange('active');
          const source = this.inputAudioContext!.createMediaStreamSource(stream);
          const scriptProcessor = this.inputAudioContext!.createScriptProcessor(4096, 1, 1);
          
          scriptProcessor.onaudioprocess = (e) => {
            if (!this.active) return;
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = createBlob(inputData);
            this.sessionPromise?.then(session => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };

          source.connect(scriptProcessor);
          scriptProcessor.connect(this.inputAudioContext!.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          if (message.toolCall) {
            const functionResponses = message.toolCall.functionCalls.map(fc => {
              if (fc.name === 'open_project') {
                 const projectId = (fc.args as any).projectId;
                 if (this.onOpenItemCallback) this.onOpenItemCallback(projectId);
                 return {
                    id: fc.id,
                    name: fc.name,
                    response: { result: `Project ${projectId} opened.` }
                 };
              }
              return { id: fc.id, name: fc.name, response: { result: "Unknown" } };
            });
            this.sessionPromise?.then(session => {
               session.sendToolResponse({ functionResponses });
            });
          }

          const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio && this.outputAudioContext) {
            this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
            const audioBuffer = await decodeAudioData(
              decode(base64Audio),
              this.outputAudioContext,
              24000,
              1
            );
            const source = this.outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputNode);
            source.start(this.nextStartTime);
            this.nextStartTime += audioBuffer.duration;
            source.onended = () => this.sources.delete(source);
            this.sources.add(source);
          }
        },
        onclose: () => this.onStatusChange('disconnected'),
        onerror: (e) => {
          console.error("Live API Error", e);
          this.onStatusChange('error');
        }
      }
    });
  }

  async stop() {
    this.active = false;
    if (this.sessionPromise) {
      const session = await this.sessionPromise;
      session.close();
    }
    this.sources.forEach(s => s.stop());
    this.sources.clear();
    if (this.inputAudioContext) this.inputAudioContext.close();
    if (this.outputAudioContext) this.outputAudioContext.close();
    this.onStatusChange('idle');
  }
}