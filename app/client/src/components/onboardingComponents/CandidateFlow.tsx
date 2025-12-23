import { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { CheckCircle2, X } from 'lucide-react';
import { createCandidateProfile } from '@/api/users';
interface CandidateFlowProps {
  step: number;
  data: any;
  onNext: (data?: any) => void;
  onBack: () => void;
}

export function CandidateFlow({ step, data, onNext, onBack }: CandidateFlowProps) {
  const [full_name, setfull_name] = useState(data.full_name || '');
  const [field, setField] = useState(data.field || '');
  const [desiredRole, setDesiredRole] = useState(data.desiredRole || '');
  const [location, setLocation] = useState(data.location || '');
  const [experience, setExperience] = useState(data.experience || '');
  const [skills, setSkills] = useState<string[]>(data.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [bio, setBio] = useState(data.bio || '');

  const suggestedSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript',
    'Leadership', 'Communication', 'Project Management', 'SQL', 'AWS'
  ];

  const experienceLevels = [
    { value: '0-1', label: '0-1 years' },
    { value: '1-2', label: '1-2 years' },
    { value: '2-3', label: '2-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-7', label: '5-7 years' },
    { value: '7-10', label: '7-10 years' },
    { value: '10+', label: '10+ years' }
  ];

  const handleAddSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(skillInput);
    }
  };

  if (step === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-6 md:px-12">
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white/25 backdrop-blur-2xl rounded-3xl p-12 md:p-16 shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] border border-white/20">
            <h1 className="mb-12 text-center text-gray-900">What's your name?</h1>
            
            <input
              value={full_name}
              onChange={(e) => setfull_name(e.target.value)}
              placeholder="Acme Corp, TechStart, InnovateCo…"
              className="w-full text-center text-xl px-5 py-3.5 mb-12 bg-white/40 border border-white/50 rounded-2xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              autoFocus
            />

            <div className="flex justify-center">
              <button
                onClick={() => onNext({ full_name })}
                disabled={!full_name.trim()}
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

  // Step 1: Field/Industry
  if (step === 1) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-6 md:px-12">
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white/25 backdrop-blur-2xl rounded-3xl p-12 md:p-16 shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] border border-white/20">
            <h1 className="mb-12 text-center text-gray-900">Which field or industry are you working in?</h1>
            
            <input
              value={field}
              onChange={(e) => setField(e.target.value)}
              placeholder="Software Engineering, Data Science, Marketing…"
              className="w-full text-center text-xl px-5 py-3.5 mb-12 bg-white/40 border border-white/50 rounded-2xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              autoFocus
            />

            <div className="flex justify-center">
              <button
                onClick={() => onNext({ field })}
                disabled={!field.trim()}
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

  // Step 2: Desired Role
  if (step === 2) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-6 md:px-12">
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white/25 backdrop-blur-2xl rounded-3xl p-12 md:p-16 shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] border border-white/20">
            <h1 className="mb-12 text-center text-gray-900">Which role are you looking for?</h1>
            
            <input
              value={desiredRole}
              onChange={(e) => setDesiredRole(e.target.value)}
              placeholder="Senior Software Engineer, Product Manager…"
              className="w-full text-center text-xl px-5 py-3.5 mb-12 bg-white/40 border border-white/50 rounded-2xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              autoFocus
            />

            <div className="flex justify-center">
              <button
                onClick={() => onNext({ desiredRole })}
                disabled={!desiredRole.trim()}
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

  // Step 3: Location
  if (step === 3) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-6 md:px-12">
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white/25 backdrop-blur-2xl rounded-3xl p-12 md:p-16 shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] border border-white/20">
            <h1 className="mb-12 text-center text-gray-900">Where are you based?</h1>
            
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="San Francisco, Remote, New York…"
              className="w-full text-center text-xl px-5 py-3.5 mb-12 bg-white/40 border border-white/50 rounded-2xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              autoFocus
            />

            <div className="flex justify-center">
              <button
                onClick={() => onNext({ location })}
                disabled={!location.trim()}
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

  // Step 4: Experience
  if (step === 4) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-6 md:px-12">
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white/25 backdrop-blur-2xl rounded-3xl p-12 md:p-16 shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] border border-white/20">
            <h1 className="mb-12 text-center text-gray-900">How many years of experience do you have?</h1>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              {experienceLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setExperience(level.value)}
                  className={`px-6 py-4 rounded-2xl transition-all duration-200 ${
                    experience === level.value
                      ? 'bg-white/40 border-2 border-white/50 shadow-lg shadow-purple-500/20 text-gray-900'
                      : 'bg-white/20 border-2 border-white/30 hover:bg-white/30 text-gray-800'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => onNext({ experience })}
                disabled={!experience}
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

  // Step 5: Skills
  if (step === 5) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-6 md:px-12">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white/25 backdrop-blur-2xl rounded-3xl p-12 md:p-16 shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] border border-white/20">
            <h1 className="mb-10 text-center text-gray-900">What skills do you have?</h1>
            
            <div className="mb-8">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a skill and press Enter"
                className="w-full text-center text-xl px-5 py-3.5 bg-white/40 border border-white/50 rounded-2xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              />
            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center mb-8 min-h-16">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-4 py-2 bg-white/40 text-purple-900 hover:bg-white/50 border border-white/30"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 hover:text-purple-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="mb-12">
              <p className="text-gray-700 mb-4 text-center">Suggested skills:</p>
              <div className="flex flex-wrap gap-3 justify-center">
                {suggestedSkills
                  .filter(s => !skills.includes(s))
                  .map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="px-4 py-2 cursor-pointer bg-white/20 hover:bg-white/30 border-white/30 text-gray-800"
                      onClick={() => handleAddSkill(skill)}
                    >
                      + {skill}
                    </Badge>
                  ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => onNext({ skills })}
                disabled={skills.length === 0}
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

  // Step 6: Bio
  if (step === 6) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-6 md:px-12">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white/25 backdrop-blur-2xl rounded-3xl p-12 md:p-16 shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] border border-white/20">
            <h1 className="mb-12 text-center text-gray-900">Write a short introduction about yourself</h1>
            
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your background, achievements, and what you're looking for..."
              className="text-lg py-4 px-5 mb-12 min-h-64 resize-none bg-white/40 border border-white/50 rounded-2xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              autoFocus
            />

            <div className="flex justify-center">
              <button
                onClick={() => onNext({ bio })}
                disabled={!bio.trim()}
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

  // Step 7: Completion
  if (step === 7) {

    async function finish() {
      const userId = Number(localStorage.getItem("user_id"));
      console.log("1");
      await createCandidateProfile(userId, {
        full_name: data.full_name,
        location: data.location,
        experience: data.experience,
        skills: data.skills,
        bio: data.bio,
      });

      alert("Onboarding complete!");
    }

    return (
      <div className="h-screen flex flex-col items-center justify-center px-6 md:px-12">
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white/25 backdrop-blur-2xl rounded-3xl p-12 md:p-16 shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] border border-white/20 text-center">
            <div className="mb-8">
              <CheckCircle2 className="w-24 h-24 text-purple-600 mx-auto mb-8" strokeWidth={1.5} />
            </div>
            
            <h1 className="mb-6 text-gray-900">You're all set!</h1>
            
            <p className="text-xl text-gray-700 mb-12">
              Your profile is complete. Let's start finding the perfect opportunities for you.
            </p>

            <div className="flex justify-center">
              <button
                onClick={finish}
                className="min-w-48 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02] transition-all duration-200"
              >
                Finish Setup
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
