import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { FileText, CheckCircle } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { CandidateDetailModal } from './CandidateDetailModal';

const mockCandidates = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Senior Frontend Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    summary: '8+ years of experience building scalable web applications with React, TypeScript, and modern frontend technologies. Passionate about user experience and performance optimization.',
    matchedSkills: ['React', 'TypeScript', 'Redux', 'Jest', 'Webpack', 'CSS-in-JS'],
    missingSkills: ['GraphQL', 'Next.js'],
    experience: '8 years',
    location: 'San Francisco, CA',
    availability: 'Available in 2 weeks',
    matchScore: 94,
    email: 'sarah.johnson@example.com',
    mastodon: '@sarah@mastodon.social',
    phone: '+1 555 0182',
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'DevOps Engineer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    summary: '10+ years of experience in cloud infrastructure, CI/CD, and container orchestration. Expert in AWS and Kubernetes.',
    matchedSkills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'Python'],
    missingSkills: ['Azure', 'Ansible'],
    experience: '10 years',
    location: 'Seattle, WA',
    availability: 'Available immediately',
    matchScore: 91,
    email: 'michael.chen@example.com',
    mastodon: '@mchen@mastodon.cloud',
    phone: '+1 555 0234',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    title: 'Product Designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    summary: '6+ years designing user-centered digital products. Specializing in design systems and user research.',
    matchedSkills: ['Figma', 'UI/UX', 'Prototyping', 'User Research', 'Design Systems'],
    missingSkills: ['Adobe XD', 'Sketch'],
    experience: '6 years',
    location: 'Austin, TX',
    availability: 'Available in 1 month',
    matchScore: 88,
    email: 'emily.rodriguez@example.com',
    mastodon: '@emily@design.social',
    phone: '+1 555 0456',
  },
  {
    id: 4,
    name: 'James Wilson',
    title: 'Backend Engineer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    summary: '7+ years building scalable backend systems with Python and Django. Strong database design skills.',
    matchedSkills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'REST APIs'],
    missingSkills: ['Node.js', 'MongoDB'],
    experience: '7 years',
    location: 'Boston, MA',
    availability: 'Available in 3 weeks',
    matchScore: 92,
    email: 'james.wilson@example.com',
    mastodon: '@jwilson@fosstodon.org',
    phone: '+1 555 0789',
  },
  {
    id: 5,
    name: 'Sophia Lee',
    title: 'Mobile Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
    summary: '5+ years developing cross-platform mobile applications with React Native. Published 10+ apps.',
    matchedSkills: ['React Native', 'iOS', 'Android', 'JavaScript', 'Mobile UI'],
    missingSkills: ['Flutter', 'Swift'],
    experience: '5 years',
    location: 'New York, NY',
    availability: 'Available in 2 weeks',
    matchScore: 86,
    email: 'sophia.lee@example.com',
    mastodon: '@sophialee@mastodon.social',
    phone: '+1 555 0321',
  },
];

export type Candidate = typeof mockCandidates[0];

interface CandidateListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CandidateListModal({ open, onOpenChange }: CandidateListModalProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleViewDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setDetailOpen(true);
  };

  const handleBackToList = () => {
    setDetailOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[1100px] rounded-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Candidate Matches</DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 -mx-6">
            <div className="px-8">
              {mockCandidates.map((candidate, index) => (
                <div
                  key={candidate.id}
                  className={`
                    flex items-center gap-4 py-4 px-4 -mx-4
                    hover:bg-purple-500/5 cursor-pointer transition-colors
                    ${index !== mockCandidates.length - 1 ? 'border-b border-border/20' : ''}
                  `}
                  onClick={() => handleViewDetails(candidate)}
                >
                  {/* Left: Avatar + Content */}
                  <Avatar className="w-12 h-12 ring-2 ring-purple-500/20">
                    <AvatarImage src={candidate.avatar} />
                    <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <h4 className="truncate">{candidate.name}</h4>
                    <p className="text-sm text-muted-foreground truncate">{candidate.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>📍 {candidate.location}</span>
                      <span>•</span>
                      <span>{candidate.experience}</span>
                    </div>
                  </div>

                  {/* Right: Match Score + Actions */}
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs">
                      <CheckCircle className="w-3 h-3" />
                      <span>{candidate.matchScore}%</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg border-border h-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        // CV action placeholder
                      }}
                    >
                      <FileText className="w-3 h-3 mr-1.5" />
                      View CV
                    </Button>

                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-lg h-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(candidate);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {selectedCandidate && (
        <CandidateDetailModal
          open={detailOpen}
          onOpenChange={setDetailOpen}
          candidate={selectedCandidate}
          onBack={handleBackToList}
        />
      )}
    </>
  );
}
