import { useState, useEffect } from 'react';
import { MapPin, Briefcase, Star, X, Loader, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import * as api from '@/api/predict';

interface JobMatchingProps {
  cvId: number;
  cvTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobMatching({ cvId, cvTitle, isOpen, onClose }: JobMatchingProps) {
  const [matches, setMatches] = useState<api.MatchWithJob[]>([]);
  const [total, setTotal] = useState(0);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [errorMatches, setErrorMatches] = useState<string | null>(null);

  const [loadingApply, setLoadingApply] = useState(false);
  const [errorApply, setErrorApply] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    minScore: 0,
  });

  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // Get user ID from storage
  useEffect(() => {
    const uid = localStorage.getItem("user_id");
    if (uid) {
      const n = Number(uid);
      if (Number.isFinite(n)) {
        setUserId(n);
      }
    }
  }, []);

  // Fetch matches when modal opens
  useEffect(() => {
    if (isOpen && cvId) {
      fetchMatches();
    }
  }, [isOpen, cvId]);

  // ==================== Fetch Matches ====================
  const fetchMatches = async () => {
    setLoadingMatches(true);
    setErrorMatches(null);

    try {
      // Backend now returns enriched data directly - no need for manual enrichment!
      const result = await api.getMatchesForCv(cvId, 0);
      
      setMatches(result.matches || []);
      setTotal(result.total || 0);
    } catch (err: any) {
      setErrorMatches(err.message || "Failed to load matches");
      toast.error(err.message || "Failed to load matches");
    } finally {
      setLoadingMatches(false);
    }
  };

  // ==================== Run Matching ====================
  const handleRunMatching = async () => {
    setLoadingMatches(true);
    setErrorMatches(null);

    try {
      await api.runMatchingForCv(cvId, 50, 0);
      await fetchMatches();
      toast.success("Matching completed!");
    } catch (err: any) {
      setErrorMatches(err.message || "Failed to run matching");
      toast.error(err.message || "Failed to run matching");
    } finally {
      setLoadingMatches(false);
    }
  };

  // ==================== Apply for Job ====================
  const handleApplyNow = async (jobId: number) => {
    if (!userId || !cvId) {
      setErrorApply("Missing user or CV information");
      return;
    }

    setLoadingApply(true);
    setErrorApply(null);

    try {
      await api.createApplication(jobId, userId, cvId);
      setMatches(prev => prev.filter(m => m.job_id !== jobId));
      setTotal(prev => prev - 1);
      setSelectedJobId(null);
      toast.success("Applied successfully!");
    } catch (err: any) {
      setErrorApply(err.message || "Failed to apply");
      toast.error(err.message || "Failed to apply");
    } finally {
      setLoadingApply(false);
    }
  };

  if (!isOpen) return null;

  const selectedMatch = matches.find(m => m.job_id === selectedJobId);
const displayMatches = matches.filter(m => (m.metadata?.llm_score || 0) >= filters.minScore);

  return (
    <>
      {/* Main Matching Modal */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-border shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Matching Jobs for {cvTitle}</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered job recommendations {total > 0 && `(${total} matches)`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Controls */}
          <div className="border-b border-border p-6 space-y-4 bg-muted/30">
            <div className="flex items-center gap-4">
              <label className="text-sm text-muted-foreground min-w-fit">Min AI Score:</label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={filters.minScore}
                onChange={(e) => setFilters({ minScore: Number(e.target.value) })}
                className="flex-1 max-w-xs"
              />
              <span className="text-sm font-medium min-w-fit">{filters.minScore}%</span>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleRunMatching}
                disabled={loadingMatches}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all ${
                  loadingMatches
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${loadingMatches ? "animate-spin" : ""}`} />
                {loadingMatches ? "Running..." : "Run Matching"}
              </button>
              <button
                onClick={fetchMatches}
                disabled={loadingMatches}
                className="flex items-center gap-2 px-6 py-2.5 border border-border rounded-xl hover:bg-muted disabled:opacity-50 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Error Messages */}
          {errorMatches && (
            <div className="mx-6 mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300 text-sm">{errorMatches}</p>
            </div>
          )}

          {errorApply && (
            <div className="mx-6 mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300 text-sm">{errorApply}</p>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loadingMatches && matches.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <Loader className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : displayMatches.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {matches.length === 0
                    ? "No matching jobs yet. Click 'Run Matching' to find jobs for this CV."
                    : "No jobs match your current score filter."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayMatches.map((match) => (
                  <div
                    key={match.job_id}
                    onClick={() => setSelectedJobId(match.job_id)}
                    className="bg-muted/50 rounded-xl p-4 border border-border hover:border-primary/50 hover:shadow-md cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{match.job.title}</h4>
                        <p className="text-sm text-muted-foreground truncate">{match.job.role}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full flex-shrink-0">
                        <Star className="w-4 h-4 text-purple-600 dark:text-purple-400 fill-current" />
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                          {Math.round(match.score * 100)}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      {match.job.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{match.job.location}</span>
                        </div>
                      )}
                      {match.job.job_type && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Briefcase className="w-4 h-4 flex-shrink-0" />
                          <span>{match.job.job_type}</span>
                        </div>
                      )}
                    </div>

                    {match.metadata?.reason && (
                      <p className="mt-3 text-xs text-muted-foreground line-clamp-2">
                        {match.metadata.reason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJobId && selectedMatch && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-border shadow-2xl flex flex-col">
            
            {/* Header */}
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold truncate">{selectedMatch.job.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedMatch.job.role}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-4 h-4 text-purple-600 fill-current" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    {Math.round(selectedMatch.score * 100)}% Match
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedJobId(null)}
                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors flex-shrink-0 ml-4"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex flex-wrap gap-4">
                {selectedMatch.job.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span>{selectedMatch.job.location}</span>
                  </div>
                )}
                {selectedMatch.job.job_type && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span>{selectedMatch.job.job_type}</span>
                  </div>
                )}
                {selectedMatch.job.experience_level && (
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span>{selectedMatch.job.experience_level}</span>
                  </div>
                )}
              </div>

              {/* Match Details */}
              {selectedMatch.metadata && (
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-semibold mb-3">Match Analysis</h4>
                  <div className="space-y-2 text-sm">
                    {selectedMatch.metadata.reason && (
                      <p className="text-muted-foreground">{selectedMatch.metadata.reason}</p>
                    )}
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {selectedMatch.metadata.cosine_ann !== undefined && (
                        <div>
                          <p className="text-xs text-muted-foreground">Vector Similarity</p>
                          <p className="font-medium">{Math.round(selectedMatch.metadata.cosine_ann * 100)}%</p>
                        </div>
                      )}
                      {selectedMatch.metadata.weighted_sim !== undefined && (
                        <div>
                          <p className="text-xs text-muted-foreground">Weighted Match</p>
                          <p className="font-medium">{Math.round(selectedMatch.metadata.weighted_sim * 100)}%</p>
                        </div>
                      )}
                      {selectedMatch.metadata.llm_score !== undefined && (
                        <div>
                          <p className="text-xs text-muted-foreground">AI Score</p>
                          <p className="font-medium">{selectedMatch.metadata.llm_score}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {selectedMatch.job.skills && selectedMatch.job.skills.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMatch.job.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border p-6 flex gap-3">
              <button
                onClick={() => handleApplyNow(selectedJobId)}
                disabled={loadingApply}
                className={`flex-1 px-6 py-3 rounded-xl transition-all font-medium ${
                  loadingApply
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {loadingApply ? "Applying..." : "Apply Now"}
              </button>
              <button
                onClick={() => setSelectedJobId(null)}
                className="flex-1 px-6 py-3 border border-border rounded-xl hover:bg-muted transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}