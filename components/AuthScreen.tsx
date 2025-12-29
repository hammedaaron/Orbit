import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ArrowRight, User, Lock, Mail, AlertCircle } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { signIn, signUp, logout } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        alert("Success! Please check your email for a confirmation link.");
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full stars-bg opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-300">
        <button 
          onClick={logout} 
          className="absolute top-6 left-6 text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-900/50">
             <User className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{isSignUp ? 'Initialize Orbit' : 'Access Vault'}</h2>
          <p className="text-zinc-400 text-sm">{isSignUp ? 'Create your decentralized context' : 'Enter the Command Center'}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 animate-in slide-in-from-top-2">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="text-xs font-bold leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-zinc-500" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-700"
                placeholder="commander@orbit.os"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase ml-1">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-zinc-500" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-700"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isSignUp ? 'Begin Mission' : 'Access Terminal'} <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm">
            {isSignUp ? "Already secured?" : "New Commander?"}{" "}
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-white font-bold hover:text-blue-400 transition-colors"
            >
              {isSignUp ? "Sign In" : "Register Vault"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};