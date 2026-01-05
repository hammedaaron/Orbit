
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ArrowRight, User, Lock, Mail, AlertCircle, Database, ShieldAlert, Zap, Key, ShieldCheck } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { signIn, signUp, sendOtp, verifyOtp, logout, enterLocalMode, isGuest, unlockVault, isVaultUnlocked } = useAuth();
  const [authMode, setAuthMode] = useState<'password' | 'otp' | 'vault'>('otp');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpToken, setOtpToken] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isVerifying && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [isVerifying]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otpToken];
    newOtp[index] = value;
    setOtpToken(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpToken[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (authMode === 'vault') {
        await unlockVault(password);
      } else if (authMode === 'password') {
        if (isSignUp) {
          await signUp(email, password);
          setError("Confirmation email sent! Check your inbox.");
        } else {
          await signIn(email, password);
        }
      } else {
        if (!isVerifying) {
          await sendOtp(email);
          setIsVerifying(true);
        } else {
          await verifyOtp(email, otpToken.join(''));
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
      if (err.message?.toLowerCase().includes('otp')) {
        setOtpToken(['', '', '', '', '', '']);
      }
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
          <div className={`w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transition-colors ${authMode === 'vault' ? 'bg-emerald-600 shadow-emerald-900/50' : 'bg-blue-600 shadow-blue-900/50'}`}>
             {authMode === 'vault' ? <ShieldCheck className="text-white" size={24} /> : authMode === 'otp' ? <Key className="text-white" size={24} /> : <User className="text-white" size={24} />}
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {authMode === 'vault' ? 'Unlock Vault' : isVerifying ? 'Verify Identity' : authMode === 'otp' ? 'Magic Access' : (isSignUp ? 'Initialize Orbit' : 'Access Vault')}
          </h2>
          <p className="text-zinc-400 text-sm">
            {authMode === 'vault' ? 'Deriving local keys...' : isVerifying ? `Code sent to ${email}` : authMode === 'otp' ? 'Enter with your 6-digit magic code' : 'Access via secure credentials'}
          </p>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2 ${error.includes('sent') ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="text-xs font-bold leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'vault' ? (
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase ml-1">Vault Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-zinc-500" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-emerald-500/20 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                  placeholder="Enter vault secret..."
                  required
                />
              </div>
            </div>
          ) : !isVerifying ? (
            <>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-zinc-500" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-700 font-medium"
                    placeholder="commander@orbit.os"
                    required
                  />
                </div>
              </div>

              {authMode === 'password' && (
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase ml-1">Secure Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-zinc-500" size={18} />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-700 font-medium"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-between gap-2 py-4">
              {otpToken.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => otpRefs.current[idx] = el}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={e => handleOtpChange(idx, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(idx, e)}
                  className="w-full h-14 bg-black/40 border border-white/10 rounded-xl text-center text-xl font-black text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              ))}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-black text-sm shadow-lg transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-tight ${authMode === 'vault' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20' : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-900/20'} text-white`}
          >
            {loading ? 'Processing...' : authMode === 'vault' ? 'Decrypt Vault' : isVerifying ? 'Verify & Access' : authMode === 'otp' ? 'Send Magic Code' : (isSignUp ? 'Initialize Orbit' : 'Access Terminal')} 
            <ArrowRight size={16} />
          </button>
          
          {isVerifying && (
            <button 
              type="button" 
              onClick={() => { setIsVerifying(false); setOtpToken(['','','','','','']); setError(null); }}
              className="w-full text-center text-[10px] uppercase font-black text-zinc-500 hover:text-white transition-colors"
            >
              Wait, I used the wrong email
            </button>
          )}
        </form>

        <div className="mt-8 flex flex-col gap-4">
          <div className="relative py-2">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
             <div className="relative flex justify-center text-[10px] uppercase font-black text-zinc-600 bg-transparent"><span className="bg-[#09090b] px-4">Vault Settings</span></div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => {
                setAuthMode(authMode === 'password' ? 'otp' : 'password');
                setIsVerifying(false);
                setError(null);
              }}
              className="py-3 bg-zinc-800/20 hover:bg-zinc-800/40 border border-white/10 text-zinc-300 rounded-xl font-bold text-[10px] transition-all flex items-center justify-center gap-2 group uppercase tracking-widest"
            >
              {authMode === 'password' ? <Key size={12} /> : <Lock size={12} />}
              {authMode === 'password' ? 'Use Code' : 'Use Pass'}
            </button>
            <button 
              onClick={() => {
                if(isGuest && authMode !== 'vault') setAuthMode('vault');
                else enterLocalMode();
              }}
              className={`py-3 bg-zinc-800/20 hover:bg-zinc-800/40 border border-white/10 text-zinc-300 rounded-xl font-bold text-[10px] transition-all flex items-center justify-center gap-2 group uppercase tracking-widest ${authMode === 'vault' ? 'border-emerald-500/40 text-emerald-400' : ''}`}
            >
              <Database size={12} className={authMode === 'vault' ? 'text-emerald-500' : 'text-blue-500'} />
              {authMode === 'vault' ? 'Abort Unlock' : 'Local Vault'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
