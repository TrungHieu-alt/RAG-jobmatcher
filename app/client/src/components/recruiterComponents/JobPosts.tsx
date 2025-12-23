import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { MapPin, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadJobText } from '../../api/jobs';

export function JobPosts() {
  // Form fields
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [descriptionText, setDescriptionText] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [experienceLevel, setExperienceLevel] = useState('Mid-level');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecruiterIdFromStorage = (): number | null => {
    const v = localStorage.getItem("user_id");
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const handleSaveJobPost = async () => {
    // Validation
    if (!jobTitle.trim()) {
      toast.error("Job title is required");
      return;
    }

    if (!descriptionText.trim()) {
      toast.error("Job description is required");
      return;
    }

    if (!location.trim()) {
      toast.error("Location is required");
      return;
    }

    const recruiterId = getRecruiterIdFromStorage();
    if (!recruiterId) {
      toast.error("No recruiter_id found. Please log in.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await uploadJobText(
        recruiterId,
        descriptionText,
        {
          title: jobTitle,
          role: jobTitle, // Use title as role if not specified
          location: location,
          job_type: jobType,
          experience_level: experienceLevel,
          salary_min: salaryMin ? parseFloat(salaryMin) : null,
          salary_max: salaryMax ? parseFloat(salaryMax) : null,
        }
      );

      // Success
      toast.success(`Job "${result.title}" posted successfully!`);
      
      // Reset form
      setJobTitle('');
      setCompanyName('');
      setLocation('');
      setDescriptionText('');
      setJobType('Full-time');
      setExperienceLevel('Mid-level');
      setSalaryMin('');
      setSalaryMax('');
    } catch (err: any) {
      const msg = err?.message || "Failed to post job";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Create a Job Post</h2>
        <p className="text-muted-foreground">Create and preview how your job post appears to candidates</p>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        {/* Main Card Container */}
        <Card className="rounded-2xl border-border shadow-sm overflow-hidden">
          
          {/* Header Section */}
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between mb-4 gap-2 border-b border-border pb-4">
              <Input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="flex-1 border-0 bg-transparent hover:bg-accent/30 focus:bg-accent/50 rounded-xl px-3 py-2 transition-colors !text-2xl font-black h-15 text-[#a332ff]"
                placeholder="Job Title"
              />
            </div>

            {/* Company Info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full border-0 bg-transparent hover:bg-accent/30 focus:bg-accent/50 rounded-lg px-2 py-1 text-sm transition-colors h-auto"
                    placeholder="Company Name"
                  />
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="flex-1 border-0 bg-transparent hover:bg-accent/30 focus:bg-accent/50 rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors h-auto min-w-0"
                      placeholder="Location"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Description Section */}
          <div className="p-5 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl text-purple-700 ml-3 font-bold">Job Description</span>
            </div>

            <Textarea
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
              placeholder="Type job description here…"
              className="w-full min-h-[180px] bg-accent/50 border-border rounded-2xl p-4 resize-none focus:ring-2 focus:ring-primary/20 transition-all text-sm leading-relaxed"
              style={{
                height: "auto",
                minHeight: "180px",
              }}
            />
          </div>

          {/* Job Details Section */}
          <div className="p-5 border-t border-border space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Job Type</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-input border border-border rounded-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-4 py-2.5 bg-input border border-border rounded-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors"
                >
                  <option value="Entry-level">Entry-level</option>
                  <option value="Mid-level">Mid-level</option>
                  <option value="Senior">Senior</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Salary Min</label>
                <Input
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  placeholder="e.g., 50000"
                  className="w-full px-4 py-2.5 bg-input border border-border rounded-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Salary Max</label>
                <Input
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  placeholder="e.g., 100000"
                  className="w-full px-4 py-2.5 bg-input border border-border rounded-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-5 mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="p-6 pt-4 border-t border-border">
            <div className="flex gap-3">
              <Button
                onClick={handleSaveJobPost}
                disabled={isLoading}
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Save Job Post"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}