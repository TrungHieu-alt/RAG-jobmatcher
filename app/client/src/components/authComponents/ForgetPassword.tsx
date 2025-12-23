import { useState } from 'react';
import { Briefcase } from 'lucide-react';

interface ForgotPasswordProps {
  onNavigate: (screen: 'signin' | 'signup' | 'forgot') => void;
  onOpenPolicy: () => void;
}

export function ForgotPassword({ onNavigate, onOpenPolicy }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-linear-to-br from-[#A78BFA] to-[#C7D2FE]">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-32 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md">
        <div 
          className="bg-white/25 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl shadow-purple-900/10"
          style={{
            boxShadow: '0 8px 32px 0 rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.3)'
          }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Briefcase className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center text-gray-900 mb-1">
            Forgot your password?
          </h1>

          {/* Subtitle */}
          <p className="text-center text-gray-700 mb-5">
            Enter your email to receive a reset link.
          </p>

          {/* Email Input */}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/40 backdrop-blur-sm border border-white/50 rounded-2xl px-5 py-3.5 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-white/60 transition-all"
            />
          </div>

          {/* Primary Button */}
          <button className="w-full bg-linear-to-r from-purple-600 to-purple-500 text-white py-3.5 rounded-2xl mb-3 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
            Send Reset Link
          </button>

          {/* Links */}
          <div className="flex flex-col items-center gap-2.5 mb-3">
            <button
              onClick={() => onNavigate('signin')}
              className="text-purple-900 hover:text-purple-950 transition-colors underline decoration-1 underline-offset-4"
            >
              Back to Sign In
            </button>
          </div>

          {/* Legal Notice */}
          <div className="text-center text-gray-600">
            By using our service, you agree to our{' '}
            <button
              onClick={onOpenPolicy}
              className="text-purple-900 hover:text-purple-950 transition-colors underline decoration-1 underline-offset-4"
            >
              Terms & Privacy Policy
            </button>
            .
          </div>
        </div>
      </div>
    </div>
  );
}