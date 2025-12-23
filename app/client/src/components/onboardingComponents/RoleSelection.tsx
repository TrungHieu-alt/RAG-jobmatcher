import { Briefcase, UserCircle2 } from 'lucide-react';

type UserRole = 'candidate' | 'recruiter' | null;

interface RoleSelectionProps {
  selectedRole: UserRole;
  onSelect: (role: UserRole) => void;
  onNext: () => void;
}

export function RoleSelection({ selectedRole, onSelect, onNext }: RoleSelectionProps) {
  return (
    <div className="h-screen flex flex-col items-center justify-center px-6 md:px-12">
      <div className="w-full max-w-5xl mx-auto">
        {/* Glass Container */}
        <div className="bg-white/25 backdrop-blur-2xl rounded-3xl p-12 md:p-16 shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] border border-white/20">
          <div className="text-center mb-16">
            <h1 className="text-gray-900">Who are you?</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <button
              onClick={() => onSelect('candidate')}
              className={`group relative p-10 rounded-2xl transition-all duration-200 ${
                selectedRole === 'candidate'
                  ? 'bg-white/40 border-2 border-white/50 shadow-lg shadow-purple-500/20'
                  : 'bg-white/20 border-2 border-white/30 hover:bg-white/30 hover:border-white/40'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className={`p-4 rounded-full transition-all ${
                  selectedRole === 'candidate' ? 'bg-purple-100/50' : 'bg-white/30'
                }`}>
                  <UserCircle2 className={`w-12 h-12 ${
                    selectedRole === 'candidate' ? 'text-purple-700' : 'text-gray-700'
                  }`} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className={`mb-2 ${
                    selectedRole === 'candidate' ? 'text-gray-900' : 'text-gray-800'
                  }`}>
                    Candidate
                  </h3>
                  <p className="text-gray-700">
                    Find jobs tailored to your skills
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => onSelect('recruiter')}
              className={`group relative p-10 rounded-2xl transition-all duration-200 ${
                selectedRole === 'recruiter'
                  ? 'bg-white/40 border-2 border-white/50 shadow-lg shadow-purple-500/20'
                  : 'bg-white/20 border-2 border-white/30 hover:bg-white/30 hover:border-white/40'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className={`p-4 rounded-full transition-all ${
                  selectedRole === 'recruiter' ? 'bg-purple-100/50' : 'bg-white/30'
                }`}>
                  <Briefcase className={`w-12 h-12 ${
                    selectedRole === 'recruiter' ? 'text-purple-700' : 'text-gray-700'
                  }`} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className={`mb-2 ${
                    selectedRole === 'recruiter' ? 'text-gray-900' : 'text-gray-800'
                  }`}>
                    Recruiter
                  </h3>
                  <p className="text-gray-700">
                    Hire the right talent for your company
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onNext}
              disabled={!selectedRole}
              className="min-w-48 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
