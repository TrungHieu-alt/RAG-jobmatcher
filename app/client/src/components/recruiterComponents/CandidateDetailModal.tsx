import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { FileText, CheckCircle, X, ArrowLeft, Mail, AtSign, Phone } from 'lucide-react';

export interface Candidate {
  id: number;
  name: string;
  title: string;
  avatar: string;
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  experience: string;
  location: string;
  availability: string;
  matchScore: number;
  email?: string;
  mastodon?: string;
  phone?: string;
}

interface CandidateDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: Candidate;
  onBack?: () => void;
}

export function CandidateDetailModal({ open, onOpenChange, candidate, onBack }: CandidateDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Candidate Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto flex-1">
          {/* Back Button */}
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="rounded-xl -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </Button>
          )}

          {/* Header */}
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20 ring-4 ring-purple-500/20">
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3>{candidate.name}</h3>
              <p className="text-muted-foreground">{candidate.title}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>📍 {candidate.location}</span>
                <span>⏱️ {candidate.experience}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CheckCircle className="w-4 h-4" />
                <span>{candidate.matchScore}% Match</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{candidate.availability}</p>
            </div>
          </div>

          <Separator />

          {/* Summary */}
          <div>
            <h4 className="mb-2">Summary</h4>
            <p className="text-muted-foreground">{candidate.summary}</p>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="mb-3">Contact Information</h4>
            <div className="space-y-2">
              {candidate.email && (
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">Email</span>
                  </div>
                  <span className="text-sm">{candidate.email}</span>
                </div>
              )}
              {candidate.mastodon && (
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AtSign className="w-4 h-4" />
                    <span className="text-sm">Mastodon</span>
                  </div>
                  <span className="text-sm">{candidate.mastodon}</span>
                </div>
              )}
              {candidate.phone && (
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">Phone</span>
                  </div>
                  <span className="text-sm">{candidate.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Matched Skills */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h4>Matched Skills</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {candidate.matchedSkills.map((skill, idx) => (
                <Badge 
                  key={idx}
                  className="bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300 rounded-lg"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <X className="w-5 h-5 text-orange-500" />
              <h4>Skills to Develop</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {candidate.missingSkills.map((skill, idx) => (
                <Badge 
                  key={idx}
                  variant="secondary"
                  className="bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 rounded-lg"
                >
                  <X className="w-3 h-3 mr-1" />
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-4">
            <Button 
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Accept
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 rounded-xl border-red-500 text-red-500 hover:bg-red-300 dark:hover:bg-red-950/20 hover:text-red-600"
            >
              <X className="w-4 h-4 mr-2" />
              Decline
            </Button>
            <Button variant="outline" className="flex-1 rounded-xl border-border">
              <FileText className="w-4 h-4 mr-2" />
              View CV
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
