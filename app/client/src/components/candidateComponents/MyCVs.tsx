import { Download, Edit, Trash2, Plus, Upload, FileText, ChevronDown, ChevronUp, MoreVertical, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { uploadCv, getUserCvs, deleteCv, uploadCvText } from "../../api/cvs";
import JobMatching from "./JobMatching";

type CvItem = {
  id: number;
  name: string;
  template?: string;
  lastUpdated?: string;
  thumbnail?: string;

  title?: string;
  location?: string;
  experience?: string;
  skills?: string[];
  summary?: string | null;
  fullText?: string | null;
};

interface MyCVsProps {
  onNavigateToCreateCV?: () => void;
}

export default function MyCVs({ onNavigateToCreateCV }: MyCVsProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTextUploadModal, setShowTextUploadModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  const [textInput, setTextInput] = useState("");

  const [extractedData, setExtractedData] = useState({
    title: "",
    location: "",
    experience: "",
    skills: "",
    summary: "",
    fullText: "",
  });

  const [cvs, setCvs] = useState<CvItem[]>([]);
  const [loadingCvs, setLoadingCvs] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Matching modal state
  const [selectedCvForMatching, setSelectedCvForMatching] = useState<CvItem | null>(null);

  // Menu dropdown state
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const getUserIdFromStorage = (): number | null => {
    const v = localStorage.getItem("user_id");
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  // ================================
  // LOAD USER CV LIST
  // ================================
  useEffect(() => {
    const fetchCvs = async () => {
      const userId = getUserIdFromStorage();
      if (!userId) return;

      setLoadingCvs(true);
      setApiError(null);

      try {
        const res = await getUserCvs(userId);

        const mapped: CvItem[] = res.map((c) => ({
          id: c.id,
          name: c.title ?? `CV ${c.id}`,
          template: "Imported",
          lastUpdated: new Date(c.createdAt).toLocaleDateString(),
          thumbnail: "from-purple-500 to-purple-700",

          title: c.title,
          location: c.location ?? "",
          experience: c.experience ?? "",
          skills: c.skills,
          summary: c.summary,
          fullText: c.fullText,
        }));

        setCvs(mapped);
      } catch (err: any) {
        const msg = err?.message || "Failed to load CVs";
        setApiError(msg);
        toast.error(msg);
      } finally {
        setLoadingCvs(false);
      }
    };

    void fetchCvs();
  }, []);

  // ================================
  // FILE UPLOAD HANDLERS (PDF/TEXT)
  // ================================
  const handleFileSelect = (file: File) => {
    if (file.type === "application/pdf" || file.type === "text/plain") {
      setSelectedFile(file);
    } else {
      toast.error("PDF or text files only");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  // ================================
  // UPLOAD FILE (PDF or TEXT)
  // ================================
  const handleContinueUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setApiError(null);

    try {
      const userId = getUserIdFromStorage();
      if (!userId) {
        toast.error("No user_id found");
        return;
      }

      const res = await uploadCv(userId, selectedFile);

      setExtractedData({
        title: res.title ?? "",
        location: res.location ?? "",
        experience: res.experience ?? "",
        skills: res.skills?.join(", ") ?? "",
        summary: res.summary ?? "",
        fullText: res.fullText ?? "",
      });

      setShowUploadModal(false);
      setShowReviewModal(true);
    } catch (err: any) {
      const msg = err?.message || "Upload failed";
      setApiError(msg);
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  // ================================
  // UPLOAD TEXT
  // ================================
  const handleContinueTextUpload = async () => {
    if (!textInput.trim()) {
      toast.error("Please enter CV text");
      return;
    }

    setUploading(true);
    setApiError(null);

    try {
      const userId = getUserIdFromStorage();
      if (!userId) {
        toast.error("No user_id found");
        return;
      }

      const res = await uploadCvText(userId, textInput);

      setExtractedData({
        title: res.title ?? "",
        location: res.location ?? "",
        experience: res.experience ?? "",
        skills: res.skills?.join(", ") ?? "",
        summary: res.summary ?? "",
        fullText: res.fullText ?? "",
      });

      setShowTextUploadModal(false);
      setShowReviewModal(true);
    } catch (err: any) {
      const msg = err?.message || "Upload failed";
      setApiError(msg);
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleOkAfterUpload = async () => {
    setSaving(true);
    setApiError(null);

    try {
      // Refresh CV list to get the new CV
      const userId = getUserIdFromStorage();
      if (userId) {
        const res = await getUserCvs(userId);
        const mapped: CvItem[] = res.map((c) => ({
          id: c.id,
          name: c.title ?? `CV ${c.id}`,
          template: "Imported",
          lastUpdated: new Date(c.createdAt).toLocaleDateString(),
          thumbnail: "from-purple-500 to-purple-700",
          title: c.title,
          location: c.location ?? "",
          experience: c.experience ?? "",
          skills: c.skills,
          summary: c.summary,
          fullText: c.fullText,
        }));
        setCvs(mapped);
      }

      setShowReviewModal(false);
      setSelectedFile(null);
      setTextInput("");
      setExtractedData({
        title: "",
        location: "",
        experience: "",
        skills: "",
        summary: "",
        fullText: "",
      });

      toast.success("CV uploaded successfully!");
    } catch (err: any) {
      const msg = err?.message || "Failed to save CV";
      setApiError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelReview = () => {
    setShowReviewModal(false);
    setSelectedFile(null);
    setTextInput("");
    setExtractedData({
      title: "",
      location: "",
      experience: "",
      skills: "",
      summary: "",
      fullText: "",
    });
  };

  // ================================
  // DELETE CV
  // ================================
  const handleDeleteCv = async (cvId: number) => {
    if (!confirm("Are you sure you want to delete this CV?")) return;

    try {
      await deleteCv(cvId);
      setCvs((prev) => prev.filter((c) => c.id !== cvId));
      setOpenMenuId(null);
      toast.success("CV deleted successfully");
    } catch (err: any) {
      const msg = err?.message || "Failed to delete CV";
      toast.error(msg);
    }
  };

  // ================================
  // CREATE NEW CV HANDLER
  // ================================
  const handleCreateNewCV = () => {
    if (onNavigateToCreateCV) {
      onNavigateToCreateCV();
    } else {
      toast.info("Navigation handler not available");
    }
  };

  const cvsToShow = cvs.length > 0 ? cvs : [];

  // ================================
  // JSX RETURN
  // ================================
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2>My CVs</h2>
          <p className="text-muted-foreground">Manage your professional resumes</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 border border-border rounded-xl hover:bg-muted transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import PDF
          </button>

          <button
            onClick={() => setShowTextUploadModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 border border-border rounded-xl hover:bg-muted transition-colors"
          >
            <FileText className="w-4 h-4" />
            Paste Text
          </button>

          <button
            onClick={handleCreateNewCV}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Create New CV
          </button>
        </div>
      </div>

      {/* CV GRID */}
      {loadingCvs ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : cvsToShow.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No CVs yet. Upload or create one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvsToShow.map((cv) => (
            <div
              key={cv.id}
              className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all group overflow-hidden"
            >
              <div className={`h-64 bg-linear-to-br ${cv.thumbnail} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]">
                  <div className="p-8 text-white">
                    <div className="h-3 bg-white/30 rounded mb-3 w-3/4"></div>
                    <div className="h-2 bg-white/20 rounded mb-2 w-full"></div>
                    <div className="h-2 bg-white/20 rounded mb-2 w-5/6"></div>
                    <div className="h-2 bg-white/20 rounded mb-6 w-4/6"></div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-1 truncate">{cv.name}</h4>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{cv.template} Template</span>
                      <span>•</span>
                      <span>Updated {cv.lastUpdated}</span>
                    </div>
                  </div>

                  {/* Menu 3 chấm */}
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === cv.id ? null : cv.id)}
                      className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuId === cv.id && (
                      <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-lg z-40 min-w-[180px]">
                        <button
                          onClick={() => {
                            setSelectedCvForMatching(cv);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-muted transition-colors text-sm border-b border-border flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          View Matching
                        </button>

                        <button
                          onClick={() => {
                            // TODO: Implement edit
                            setOpenMenuId(null);
                            toast.info("Edit feature coming soon");
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-muted transition-colors text-sm border-b border-border flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            handleDeleteCv(cv.id);
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-destructive/10 hover:text-destructive transition-colors text-sm flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD PDF MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-card rounded-2xl max-w-lg w-full border border-border shadow-2xl">
            <div className="p-6 border-b border-border">
              <h3 className="mb-1">Upload CV (PDF)</h3>
              <p className="text-sm text-muted-foreground">Upload your resume to import and extract information</p>
            </div>

            <div className="p-6">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-xl p-12 transition-all cursor-pointer ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : selectedFile
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
                onClick={() => document.getElementById("pdf-upload")?.click()}
              >
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    {selectedFile ? (
                      <FileText className="w-8 h-8 text-primary" />
                    ) : (
                      <Upload className="w-8 h-8 text-primary" />
                    )}
                  </div>

                  {selectedFile ? (
                    <>
                      <p className="mb-1 font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mb-2 font-medium">Drag & drop your PDF here or click to upload</p>
                      <p className="text-sm text-muted-foreground">PDF only, max 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-6 py-2.5 border border-border rounded-xl hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleContinueUpload}
                disabled={!selectedFile || uploading}
                className={`flex-1 px-6 py-2.5 rounded-xl transition-opacity ${
                  selectedFile
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {uploading ? "Uploading..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PASTE TEXT MODAL */}
      {showTextUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-card rounded-2xl max-w-lg w-full border border-border shadow-2xl">
            <div className="p-6 border-b border-border">
              <h3 className="mb-1">Upload CV (Text)</h3>
              <p className="text-sm text-muted-foreground">Paste your resume text to import and extract information</p>
            </div>

            <div className="p-6">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste your CV text here..."
                className="w-full h-64 px-4 py-3 bg-input border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="p-6 border-t border-border flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowTextUploadModal(false);
                  setTextInput("");
                }}
                className="flex-1 px-6 py-2.5 border border-border rounded-xl hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleContinueTextUpload}
                disabled={!textInput.trim() || uploading}
                className={`flex-1 px-6 py-2.5 rounded-xl transition-opacity ${
                  textInput.trim()
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {uploading ? "Uploading..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-card rounded-2xl max-w-2xl w-full border border-border shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">

            <div className="p-6 border-b border-border">
              <h3 className="mb-1">Review Extracted Information</h3>
              <p className="text-sm text-muted-foreground">
                Confirm or edit the information extracted from your upload
              </p>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Title + Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2 text-muted-foreground">Title</label>
                  <input
                    type="text"
                    value={extractedData.title}
                    onChange={(e) => setExtractedData({ ...extractedData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input border border-border rounded-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-muted-foreground">Location</label>
                  <input
                    type="text"
                    value={extractedData.location}
                    onChange={(e) => setExtractedData({ ...extractedData, location: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input border border-border rounded-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm mb-2 text-muted-foreground">Experience</label>
                <input
                  type="text"
                  value={extractedData.experience}
                  onChange={(e) => setExtractedData({ ...extractedData, experience: e.target.value })}
                  className="w-full px-4 py-2.5 bg-input border border-border rounded-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm mb-2 text-muted-foreground">Skills (comma-separated)</label>
                <textarea
                  value={extractedData.skills}
                  onChange={(e) => setExtractedData({ ...extractedData, skills: e.target.value })}
                  className="w-full px-4 py-2.5 bg-input border border-border rounded-xl resize-none focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                  rows={3}
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block text-sm mb-2 text-muted-foreground">Summary</label>
                <textarea
                  value={extractedData.summary}
                  onChange={(e) => setExtractedData({ ...extractedData, summary: e.target.value })}
                  className="w-full px-4 py-2.5 bg-input border border-border rounded-xl resize-none focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                  rows={4}
                />
              </div>

              {/* Full Text Collapsible */}
              <div className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowFullText(!showFullText)}
                  className="w-full px-4 py-3 bg-muted/50 hover:bg-muted flex items-center justify-between transition-colors"
                >
                  <span className="text-sm font-medium">Full Text (optional)</span>
                  {showFullText ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showFullText && (
                  <div className="p-4 border-t border-border">
                    <textarea
                      readOnly
                      value={extractedData.fullText}
                      className="w-full px-4 py-2.5 bg-muted/50 rounded-lg text-sm resize-none"
                      rows={10}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-border flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCancelReview}
                className="flex-1 px-6 py-2.5 border border-border rounded-xl hover:bg-muted transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleOkAfterUpload}
                disabled={saving}
                className={`flex-1 px-6 py-2.5 rounded-xl transition-opacity ${
                  saving
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {saving ? "Saving..." : "Save & Continue"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Matching Modal */}
      {selectedCvForMatching && (
        <JobMatching
          cvId={selectedCvForMatching.id}
          cvTitle={selectedCvForMatching.name}
          isOpen={!!selectedCvForMatching}
          onClose={() => setSelectedCvForMatching(null)}
        />
      )}
    </div>
  );
}