import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';

const candidates = [
  { id: 1, name: 'Sarah Johnson', role: 'Senior Frontend Developer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', skills: ['React', 'TypeScript', 'CSS'], location: 'San Francisco, CA', matchScore: 94 },
  { id: 2, name: 'Michael Chen', role: 'DevOps Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', skills: ['AWS', 'Docker', 'Kubernetes'], location: 'Seattle, WA', matchScore: 91 },
  { id: 3, name: 'Emily Rodriguez', role: 'Product Designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily', skills: ['Figma', 'UI/UX', 'Prototyping'], location: 'Austin, TX', matchScore: 88 },
  { id: 4, name: 'James Wilson', role: 'Backend Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', skills: ['Python', 'Django', 'PostgreSQL'], location: 'Boston, MA', matchScore: 92 },
  { id: 5, name: 'Sophia Lee', role: 'Mobile Developer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia', skills: ['React Native', 'iOS', 'Android'], location: 'New York, NY', matchScore: 86 },
];

export function CandidateManager() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2>Candidate Manager</h2>
          <p className="text-muted-foreground">View and manage all candidates in your pipeline</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input-background border-border rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredCandidates.map((candidate) => (
          <Card key={candidate.id} className="rounded-2xl border-border shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16 ring-2 ring-purple-500/20">
                  <AvatarImage src={candidate.avatar} />
                  <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="truncate">{candidate.name}</h3>
                      <div className="text-sm text-muted-foreground">{candidate.role}</div>
                    </div>
                    <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 ml-2">
                      {candidate.matchScore}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{candidate.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {candidate.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="rounded-lg">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl">
                      <Mail className="w-3 h-3 mr-2" />
                      Contact
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-xl border-border">
                      <Phone className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
