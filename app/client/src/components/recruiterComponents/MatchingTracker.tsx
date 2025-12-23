import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Users, Calendar, Plus, MoreVertical, Edit, XCircle, Trash2, Loader, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as apiPredict from '@/api/predict';
import * as apiJobs from '@/api/jobs';

// ============= APPLICANTS MODAL =============
function ApplicantsModal({ jobId, jobTitle, open, onOpenChange }) {
  const [activeTab, setActiveTab] = useState<'applicants' | 'matched'>('applicants');
  const [minScore, setMinScore] = useState(70);
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [matched, setMatched] = useState([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch applicants and matches
  useEffect(() => {
    if (open && jobId) {
      fetchData();
    }
  }, [open, jobId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch applicants
      const appResult = await apiPredict.getApplicationsByJob(jobId);
      const applicantList = appResult.applications.map((app) => ({
        app_id: app.app_id,
        cv_id: app.cv_id || app.app_id,
        name: `Candidate ${app.app_id}`,
        title: app.job?.role || 'Professional',
        location: app.job?.location || 'Unknown',
        applied_at: app.applied_at,
        status: app.status,
        email: `candidate${app.app_id}@example.com`,
        match_score: app.match_score ? Math.round(app.match_score * 100) : null,
      }));
      setApplicants(applicantList);

      // Fetch matches
      const matchResult = await apiPredict.getMatchesForJob(jobId, 0);
      const matchedList = matchResult.matches.map((match) => ({
        match_id: match.match_id,
        cv_id: match.cv_id,
        user_id: match.cv.user_id,
        name: match.cv?.title || `CV ${match.cv_id}`,
        title: 'Professional',
        location: match.cv?.location || 'Unknown',
        matched_at: match.created_at,
        status: 'matched',
        email: `candidate${match.cv_id}@example.com`,
        match_score: Math.round(match.score * 100),
        metadata: match.metadata,
      }));
      setMatched(matchedList);
    } catch (err: any) {
      const msg = err?.message || 'Failed to load candidates';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRunMatching = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiPredict.runMatchingForJob(jobId, 50, 0);
      await fetchData();
      toast.success('Matching completed!');
    } catch (err: any) {
      const msg = err?.message || 'Failed to run matching';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (candidate) => {
    setSelectedCandidate(candidate);
    setDetailOpen(true);
  };

  const handleApply = async (candidate) => {
    try {
      await apiPredict.createApplication(jobId, candidate.user_id, candidate.cv_id);
      toast.success('Application created successfully!');
      await fetchData(); // Refresh the data
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create application');
    }
  };

  const displayList = activeTab === 'applicants' 
    ? applicants 
    : matched
        .filter(c => (c.metadata?.llm_score || 0) >= minScore)
        .sort((a, b) => {
          const aAiScore = a.metadata?.llm_score || 0;
          const bAiScore = b.metadata?.llm_score || 0;
          return bAiScore - aAiScore; // Sort by AI score descending
        });

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-border shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Matching for {jobTitle}</h3>
              <p className="text-sm text-muted-foreground">{applicants.length} applicants, {matched.length} matched</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-border px-6 flex gap-0">
            <button
              onClick={() => setActiveTab('applicants')}
              className={`px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'applicants'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Applicants ({applicants.length})
            </button>
            <button
              onClick={() => setActiveTab('matched')}
              className={`px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'matched'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Matched Candidates ({matched.length})
            </button>
          </div>

          {/* Controls (only on Matched tab) */}
          {activeTab === 'matched' && (
            <div className="border-b border-border p-6 space-y-4 bg-muted/30">
              <div className="flex items-center gap-4">
                <label className="text-sm text-muted-foreground min-w-fit">Min AI Score:</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  className="flex-1 max-w-xs"
                />
                <span className="text-sm font-medium min-w-fit">{minScore}%</span>
              </div>

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleRunMatching}
                  disabled={loading}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all ${
                    loading
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:opacity-90'
                  }`}
                >
                  {loading ? 'Running...' : 'Run Matching'}
                </button>
                <button 
                  onClick={fetchData}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 border border-border rounded-xl hover:bg-muted transition-colors disabled:opacity-50"
                >
                  Refresh
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Candidates List - 2 Column Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading && displayList.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <Loader className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : displayList.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {applicants.length === 0
                    ? 'No applicants yet'
                    : 'No candidates match your score filter'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayList.map((candidate) => (
                  <div
                    key={candidate.app_id || candidate.match_id}
                    className="bg-muted/50 rounded-xl p-4 border border-border hover:border-purple-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{candidate.name}</h4>
                        <p className="text-sm text-muted-foreground truncate">{candidate.title}</p>
                      </div>
                      {candidate.match_score && (
                        <div className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 px-2.5 py-1 rounded-full flex-shrink-0">
                          <span className="text-xs font-medium text-purple-700 dark:text-purple-300">⭐ {candidate.metadata.llm_score}%</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground mb-3">
                      <div className="truncate">{candidate.location}</div>
                      <div>{activeTab === 'applicants' ? 'Applied' : 'Matched'}: {candidate.applied_at?.split('T')[0] || candidate.matched_at?.split('T')[0]}</div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          // Set status to pending
                          toast.success('Contacted! Waiting for response...');
                        }}
                        className="flex-1 px-3 py-2 border border-border rounded-lg hover:bg-muted text-xs transition-colors whitespace-nowrap"
                      >
                        Contact
                      </button>
                      <button className="flex-1 px-3 py-2 border border-border rounded-lg hover:bg-muted text-xs transition-colors whitespace-nowrap">
                        View CV
                      </button>
                      <button
                        onClick={() => handleViewDetail(candidate)}
                        className="flex-1 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-xs transition-colors whitespace-nowrap"
                      >
                        Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCandidate && detailOpen && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          onBack={() => {
            setDetailOpen(false);
            setSelectedCandidate(null);
          }}
          jobId={jobId}
        />
      )}
    </>
  );
}

// ============= CANDIDATE DETAIL MODAL =============
function CandidateDetailModal({ candidate, open, onOpenChange, onBack, jobId }) {
  const [status, setStatus] = useState(candidate.status || 'pending');
  const [loading, setLoading] = useState(false);

  const handleContact = async () => {
    setLoading(true);
    try {
      if (candidate.app_id) {
        await apiPredict.updateApplicationStatus(candidate.app_id, 'pending');
        setStatus('pending');
        toast.success('Contacted! Waiting for response...');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to contact candidate');
    } finally {
      setLoading(false);
    }
  };

  const handleHire = async () => {
    setLoading(true);
    try {
      if (candidate.app_id) {
        await apiPredict.updateApplicationStatus(candidate.app_id, 'hired');
        setStatus('hired');
        toast.success('Candidate hired!');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to hire candidate');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      if (candidate.app_id) {
        await apiPredict.updateApplicationStatus(candidate.app_id, 'rejected');
        setStatus('rejected');
        toast.success('Candidate rejected');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reject candidate');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-border shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{candidate.name}</h3>
            <p className="text-sm text-muted-foreground">{candidate.title}</p>
            {candidate.match_score && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm font-medium text-purple-600">⭐ {candidate.match_score}% Match</span>
              </div>
            )}
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              ← Back to List
            </button>
          )}

          {/* Basic Info */}
          <div className="space-y-3 border border-border rounded-lg p-4 bg-muted/50">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Location</span>
              <span className="font-medium">{candidate.location}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-border pt-3">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{candidate.email}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-border pt-3">
              <span className="text-muted-foreground">Status</span>
              <span className={`font-medium capitalize px-2.5 py-1 rounded-full text-xs ${
                status === 'hired' ? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300' :
                status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300' :
                'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300'
              }`}>
                {status}
              </span>
            </div>
          </div>

          {/* Match Analysis (if available) */}
          {candidate.metadata && (
            <div>
              <h4 className="font-semibold mb-3">Match Analysis</h4>
              <div className="space-y-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
                {candidate.metadata.reason && (
                  <p>{candidate.metadata.reason}</p>
                )}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {candidate.metadata.cosine_ann !== undefined && (
                    <div>
                      <p className="text-xs text-muted-foreground">Vector Similarity</p>
                      <p className="font-medium text-foreground">{Math.round(candidate.metadata.cosine_ann * 100)}%</p>
                    </div>
                  )}
                  {candidate.metadata.weighted_sim !== undefined && (
                    <div>
                      <p className="text-xs text-muted-foreground">Weighted Match</p>
                      <p className="font-medium text-foreground">{Math.round(candidate.metadata.weighted_sim * 100)}%</p>
                    </div>
                  )}
                  {candidate.metadata.llm_score !== undefined && (
                    <div>
                      <p className="text-xs text-muted-foreground">AI Score</p>
                      <p className="font-medium text-foreground">{candidate.metadata.llm_score}%</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Skills (if available) */}
          {candidate.skills && candidate.skills.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, idx) => (
                  <Badge key={idx} className="bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border p-6 flex gap-3">
          <button
            onClick={handleContact}
            disabled={loading || status === 'pending'}
            className="flex-1 px-6 py-3 border border-border rounded-xl hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Contact
          </button>
          <button
            onClick={() => {/* Open CV viewer */}}
            className="flex-1 px-6 py-3 border border-border rounded-xl hover:bg-muted transition-colors text-sm font-medium"
          >
            View CV
          </button>
          <button
            onClick={handleHire}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Hire
          </button>
          <button
            onClick={handleReject}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

// ============= MAIN MATCHING TRACKER =============
export function MatchingTracker({ onNavigateToCreateJob }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recruiterId = (() => {
    const v = localStorage.getItem("user_id");
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  })();

  // Fetch jobs on mount
  useEffect(() => {
    if (recruiterId) {
      fetchJobs();
    }
  }, [recruiterId]);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const jobList = await apiJobs.getRecruiterJobs(recruiterId!);
      setJobs(jobList);
    } catch (err: any) {
      const msg = err?.message || 'Failed to load jobs';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (job.skills && job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleViewMatching = (job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2>Matching Tracker</h2>
          <p className="text-muted-foreground">Track candidate matches across all active job posts</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Filter by hashtag / date / skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input-background border-border rounded-xl"
            />
          </div>
          <Button 
            onClick={onNavigateToCreateJob}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Job Post
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Job Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className="rounded-2xl border-border shadow-sm">
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="mb-2">No job posts found</h3>
            <p className="text-muted-foreground">Create a new job post to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredJobs.map((job) => (
            <Card key={job.job_id} className="rounded-2xl border-border shadow-sm hover:shadow-md transition-all hover:border-purple-500/50">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="mb-1">{job.title}</CardTitle>
                    <Badge className="h-5 px-2 text-[11px] rounded-md bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                      Open
                    </Badge>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span>0 Applicants</span>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-xl">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                      <DropdownMenuItem className="rounded-lg cursor-pointer">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Post
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg cursor-pointer">
                        <XCircle className="w-4 h-4 mr-2" />
                        Close Post
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg cursor-pointer text-red-600 dark:text-red-400">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Tags/Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 4).map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                        #{skill}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Action Button */}
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl"
                  onClick={() => handleViewMatching(job)}
                >
                  View Matching Candidates
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Applicants Modal */}
      {selectedJob && (
        <ApplicantsModal
          jobId={selectedJob.job_id}
          jobTitle={selectedJob.title}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      )}
    </div>
  );
}