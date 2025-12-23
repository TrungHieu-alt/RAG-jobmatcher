import { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { CheckCircle2, Upload, X } from 'lucide-react';
import { createRecruiterProfile } from '@/api/users';
interface RecruiterFlowProps {
  step: number;
  data: any;
  onNext: (data?: any) => void;
  onBack: () => void;
}

export function RecruiterFlow({ step, data, onNext, onBack }: RecruiterFlowProps) {
  const [companyName, setCompanyName] = useState(data.companyName || '');
  const [title, setTitle] = useState(data.title || '');
  const [companyLogo, setCompanyLogo] = useState(data.companyLogo || '');
  const [companyDescription, setCompanyDescription] = useState(data.companyDescription || '');
  const [hiringIndustry, setHiringIndustry] = useState<string[]>(data.hiringIndustry || []);
  const [industryInput, setIndustryInput] = useState('');

  const suggestedIndustries = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'E-commerce',
    'Marketing', 'Consulting', 'Manufacturing', 'Retail', 'Media'
  ];

  const handleAddIndustry = (industry: string) => {
    if (industry && !hiringIndustry.includes(industry)) {
      setHiringIndustry([...hiringIndustry, industry]);
      setIndustryInput('');
    }
  };

  const handleRemoveIndustry = (industryToRemove: string) => {
    setHiringIndustry(hiringIndustry.filter(i => i !== industryToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIndustry(industryInput);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };



  // Step 0: Company Name
  if (step === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-6 md:px-12">
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white/25 backdrop-blur-2xl rounded-3xl p-12 md:p-16 shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] border border-white/20">
            <h1 className="mb-12 text-center text-gray-900">What's your company name?</h1>
            
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Corp, TechStart, InnovateCo…"
              className="w-full text-center text-xl px-5 py-3.5 mb-12 bg-white/40 border border-white/50 rounded-2xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              autoFocus
            />

            <div className="flex justify-center">
              <button
                onClick={() => onNext({ companyName })}
                disabled={!companyName.trim()}
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

  // Step 1: Title
  if (step === 1) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-6 md:px-12">
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white/25 backdrop-blur-2xl rounded-3xl p-12 md:p-16 shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] border border-white/20">
            <h1 className="mb-12 text-center text-gray-900">What's your title?</h1>
            
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="HR Manager, Talent Acquisition, CTO…"
              className="w-full text-center text-xl px-5 py-3.5 mb-12 bg-white/40 border border-white/50 rounded-2xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              autoFocus
            />

            <div className="flex justify-center">
              <button
                onClick={() => onNext({ title })}
                disabled={!title.trim()}
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

  // Step 2: Company Logo
  if (step === 2) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-6 md:px-12">
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white/25 backdrop-blur-2xl rounded-3xl p-12 md:p-16 shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] border border-white/20">
            <h1 className="mb-12 text-center text-gray-900">Upload your company logo</h1>
            
            <div className="mb-12">
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="logo-upload"
                className="block w-full max-w-md mx-auto p-16 border-2 border-dashed border-white/40 bg-white/20 rounded-2xl cursor-pointer hover:border-white/60 hover:bg-white/30 transition-colors"
              >
                {companyLogo ? (
                  <div className="space-y-4">
                    <img
                      src={companyLogo}
                      alt="Company logo"
                      className="w-32 h-32 object-contain mx-auto"
                    />
                    <p className="text-purple-700">Click to change logo</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-16 h-16 text-gray-600 mx-auto" strokeWidth={1.5} />
                    <div>
                      <p className="text-gray-700">Click to upload</p>
                      <p className="text-sm text-gray-600 mt-2">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => onNext({ companyLogo })}
                className="min-w-48 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02] transition-all duration-200"
              >
                {companyLogo ? 'Next' : 'Skip'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Company Description
  if (step === 3) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-6 md:px-12">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white/25 backdrop-blur-2xl rounded-3xl p-12 md:p-16 shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] border border-white/20">
            <h1 className="mb-12 text-center text-gray-900">Tell us about your company</h1>
            
            <Textarea
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              placeholder="What does your company do? What makes it special? What's your mission?"
              className="text-lg py-4 px-5 mb-12 min-h-64 resize-none bg-white/40 border border-white/50 rounded-2xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              autoFocus
            />

            <div className="flex justify-center">
              <button
                onClick={() => onNext({ companyDescription })}
                disabled={!companyDescription.trim()}
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

  // Step 4: Hiring Industry
  if (step === 4) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-6 md:px-12">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white/25 backdrop-blur-2xl rounded-3xl p-12 md:p-16 shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] border border-white/20">
            <h1 className="mb-10 text-center text-gray-900">What industry are you hiring for?</h1>
            
            <div className="mb-8">
              <input
                value={industryInput}
                onChange={(e) => setIndustryInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type an industry and press Enter"
                className="w-full text-center text-xl px-5 py-3.5 bg-white/40 border border-white/50 rounded-2xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              />
            </div>

            {hiringIndustry.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center mb-8 min-h-16">
                {hiringIndustry.map((industry) => (
                  <Badge
                    key={industry}
                    variant="secondary"
                    className="px-4 py-2 bg-white/40 text-purple-900 hover:bg-white/50 border border-white/30"
                  >
                    {industry}
                    <button
                      onClick={() => handleRemoveIndustry(industry)}
                      className="ml-2 hover:text-purple-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="mb-12">
              <p className="text-gray-700 mb-4 text-center">Suggested industries:</p>
              <div className="flex flex-wrap gap-3 justify-center">
                {suggestedIndustries
                  .filter(i => !hiringIndustry.includes(i))
                  .map((industry) => (
                    <Badge
                      key={industry}
                      variant="outline"
                      className="px-4 py-2 cursor-pointer bg-white/20 hover:bg-white/30 border-white/30 text-gray-800"
                      onClick={() => handleAddIndustry(industry)}
                    >
                      + {industry}
                    </Badge>
                  ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => onNext({ hiringIndustry })}
                disabled={hiringIndustry.length === 0}
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

  // Step 5: Completion
  if (step === 5) {
    async function finish() {
      console.log("1");
      const userId = Number(localStorage.getItem("user_id"));

      await createRecruiterProfile(userId, {
        companyName: data.companyName ?? null,
        title: data.title ?? null,
        companyLogo: data.companyLogo ?? null,
        companyDescription: data.companyDescription ?? null,
        hiringIndustry: data.hiringIndustry ?? null,
      });

      alert("Onboarding complete!");
    };
    return (
      <div className="h-screen flex flex-col items-center justify-center px-6 md:px-12">
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white/25 backdrop-blur-2xl rounded-3xl p-12 md:p-16 shadow-[0_8px_32px_0_rgba(139,92,246,0.15)] border border-white/20 text-center">
            <div className="mb-8">
              <CheckCircle2 className="w-24 h-24 text-purple-600 mx-auto mb-8" strokeWidth={1.5} />
            </div>
            
            <h1 className="mb-6 text-gray-900">You're all set!</h1>
            
            <p className="text-xl text-gray-700 mb-12">
              Your company profile is complete. Start posting jobs and finding top talent.
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
