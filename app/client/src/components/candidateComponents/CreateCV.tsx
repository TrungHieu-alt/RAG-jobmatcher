import { useState } from 'react';
import { Download, Save, ArrowLeft } from 'lucide-react';

export default function CreateCV({ onNavigateBack }) {
  const [template, setTemplate] = useState<'elegant' | 'modern' | 'minimalist'>('modern');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const [cvData, setCvData] = useState({
    name: 'John Doe',
    title: 'Senior Frontend Developer',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    summary: 'Experienced frontend developer with 5+ years of expertise in building modern web applications using React, TypeScript, and Tailwind CSS. Passionate about creating intuitive user interfaces and writing clean, maintainable code.',
    experience: [
      {
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        period: '2021 - Present',
        description: 'Led frontend development for multiple high-traffic web applications. Mentored junior developers and established coding standards.',
      },
      {
        title: 'Frontend Developer',
        company: 'WebSolutions',
        period: '2019 - 2021',
        description: 'Developed responsive web applications using React and modern CSS frameworks. Collaborated with design team to implement pixel-perfect UIs.',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of Technology',
        year: '2019',
      },
    ],
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Git', 'Figma'],
  });

  const templates = {
    elegant: {
      name: 'Elegant',
      primaryColor: 'from-slate-700 to-slate-900',
      accentColor: 'text-slate-700',
      font: 'font-serif',
    },
    modern: {
      name: 'Modern',
      primaryColor: 'from-purple-500 to-purple-700',
      accentColor: 'text-purple-600',
      font: 'font-sans',
    },
    minimalist: {
      name: 'Minimalist',
      primaryColor: 'from-gray-800 to-gray-900',
      accentColor: 'text-gray-800',
      font: 'font-mono',
    },
  };

  const currentTemplate = templates[template];

  const handleAddSkill = () => {
    const newSkill = prompt('Enter a new skill:');
    if (newSkill && newSkill.trim()) {
      setCvData({
        ...cvData,
        skills: [...cvData.skills, newSkill.trim()],
      });
    }
  };

  const handleRemoveSkill = (idx: number) => {
    setCvData({
      ...cvData,
      skills: cvData.skills.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onNavigateBack}
            className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl hover:bg-muted transition-colors"
            title="Go back to My CVs"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div>
            <h2 className="text-2xl font-bold">Create CV</h2>
            <p className="text-muted-foreground">Design your professional resume</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowTemplateSelector(true)}
            className="px-6 py-2.5 border border-border rounded-xl hover:bg-muted transition-colors font-medium"
          >
            Change Template
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 border border-border rounded-xl hover:bg-muted transition-colors font-medium">
            <Save className="w-4 h-4" />
            Save CV
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity font-medium">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Main Content - Preview */}
      <div className="flex justify-center bg-muted/50 rounded-2xl p-8 min-h-screen">
        <div className={`bg-white shadow-2xl rounded-2xl w-[210mm] min-h-[297mm] p-16 ${currentTemplate.font}`}>
          {/* Header */}
          <div className="mb-8">
            <div className={`bg-gradient-to-r ${currentTemplate.primaryColor} text-white p-8 -mx-16 -mt-16 mb-8 rounded-t-2xl`}>
              <input
                type="text"
                value={cvData.name}
                onChange={(e) => setCvData({ ...cvData, name: e.target.value })}
                className="bg-transparent border-none outline-none w-full text-4xl font-bold mb-2 placeholder-white/70"
                placeholder="Your Name"
              />
              <input
                type="text"
                value={cvData.title}
                onChange={(e) => setCvData({ ...cvData, title: e.target.value })}
                className="bg-transparent border-none outline-none w-full text-xl placeholder-white/70"
                placeholder="Your Title"
              />
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-500">EMAIL</label>
                <input
                  type="email"
                  value={cvData.email}
                  onChange={(e) => setCvData({ ...cvData, email: e.target.value })}
                  className="bg-transparent border-b border-gray-300 outline-none py-2 w-full hover:border-gray-400"
                  placeholder="Email"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-500">PHONE</label>
                <input
                  type="tel"
                  value={cvData.phone}
                  onChange={(e) => setCvData({ ...cvData, phone: e.target.value })}
                  className="bg-transparent border-b border-gray-300 outline-none py-2 w-full hover:border-gray-400"
                  placeholder="Phone"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold mb-1 text-gray-500">LOCATION</label>
                <input
                  type="text"
                  value={cvData.location}
                  onChange={(e) => setCvData({ ...cvData, location: e.target.value })}
                  className="bg-transparent border-b border-gray-300 outline-none py-2 w-full hover:border-gray-400"
                  placeholder="Location"
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          {cvData.summary && (
            <div className="mb-8">
              <h3 className={`text-lg font-bold mb-3 pb-2 border-b-2 ${currentTemplate.accentColor}`}>Professional Summary</h3>
              <textarea
                value={cvData.summary}
                onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
                className="w-full bg-transparent outline-none text-gray-700 text-sm leading-relaxed resize-none"
                rows={4}
                placeholder="Write a brief summary about yourself..."
              />
            </div>
          )}

          {/* Experience */}
          {cvData.experience.length > 0 && (
            <div className="mb-8">
              <h3 className={`text-lg font-bold mb-4 pb-2 border-b-2 ${currentTemplate.accentColor}`}>Experience</h3>
              <div className="space-y-6">
                {cvData.experience.map((exp, idx) => (
                  <div key={idx} className="border-l-4 border-gray-300 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => {
                            const newExp = [...cvData.experience];
                            newExp[idx].title = e.target.value;
                            setCvData({ ...cvData, experience: newExp });
                          }}
                          className="bg-transparent border-none outline-none text-base font-semibold text-gray-800"
                          placeholder="Job Title"
                        />
                        <div className="flex gap-4 mt-1">
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const newExp = [...cvData.experience];
                              newExp[idx].company = e.target.value;
                              setCvData({ ...cvData, experience: newExp });
                            }}
                            className="bg-transparent border-none outline-none text-sm text-gray-600 font-medium"
                            placeholder="Company"
                          />
                          <span className="text-gray-400">•</span>
                          <input
                            type="text"
                            value={exp.period}
                            onChange={(e) => {
                              const newExp = [...cvData.experience];
                              newExp[idx].period = e.target.value;
                              setCvData({ ...cvData, experience: newExp });
                            }}
                            className="bg-transparent border-none outline-none text-sm text-gray-600"
                            placeholder="Period"
                          />
                        </div>
                      </div>
                    </div>
                    <textarea
                      value={exp.description}
                      onChange={(e) => {
                        const newExp = [...cvData.experience];
                        newExp[idx].description = e.target.value;
                        setCvData({ ...cvData, experience: newExp });
                      }}
                      className="w-full bg-transparent outline-none text-sm text-gray-700 leading-relaxed resize-none"
                      rows={2}
                      placeholder="Description"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {cvData.education.length > 0 && (
            <div className="mb-8">
              <h3 className={`text-lg font-bold mb-4 pb-2 border-b-2 ${currentTemplate.accentColor}`}>Education</h3>
              <div className="space-y-4">
                {cvData.education.map((edu, idx) => (
                  <div key={idx}>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const newEdu = [...cvData.education];
                        newEdu[idx].degree = e.target.value;
                        setCvData({ ...cvData, education: newEdu });
                      }}
                      className="bg-transparent border-none outline-none text-base font-semibold text-gray-800"
                      placeholder="Degree"
                    />
                    <div className="flex gap-4 mt-1">
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => {
                          const newEdu = [...cvData.education];
                          newEdu[idx].school = e.target.value;
                          setCvData({ ...cvData, education: newEdu });
                        }}
                        className="bg-transparent border-none outline-none text-sm text-gray-600 font-medium flex-1"
                        placeholder="School"
                      />
                      <span className="text-gray-400">•</span>
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => {
                          const newEdu = [...cvData.education];
                          newEdu[idx].year = e.target.value;
                          setCvData({ ...cvData, education: newEdu });
                        }}
                        className="bg-transparent border-none outline-none text-sm text-gray-600"
                        placeholder="Year"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {cvData.skills.length > 0 && (
            <div>
              <h3 className={`text-lg font-bold mb-4 pb-2 border-b-2 ${currentTemplate.accentColor}`}>Skills</h3>
              <div className="flex flex-wrap gap-2">
                {cvData.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-card rounded-2xl max-w-2xl w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Choose Template</h3>
            <div className="grid grid-cols-3 gap-6 mb-8">
              {Object.entries(templates).map(([key, tmpl]) => (
                <button
                  key={key}
                  onClick={() => {
                    setTemplate(key as any);
                    setShowTemplateSelector(false);
                  }}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    template === key
                      ? 'border-primary bg-primary/10 shadow-lg'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`h-40 bg-gradient-to-br ${tmpl.primaryColor} rounded-lg mb-4`}></div>
                  <p className="text-center font-semibold">{tmpl.name}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowTemplateSelector(false)}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}