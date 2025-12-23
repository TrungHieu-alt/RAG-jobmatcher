import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Search, MapPin, DollarSign, Clock, X, User } from 'lucide-react';
import { listCandidates, ListCandidate } from '../../api/users';

interface Candidate {
  id: number;
  name: string;
  skills: string[];
  location: string;
  salary: string;
  posted: string;
  experience: string;
  workfield: string;
}

interface Filters {
  location: string[];
  experience: string[];
  workfield: string[];
}

const locationOptions: string[] = ['Ho Chi Minh', 'Hanoi', 'Da Nang'];
const experienceOptions: string[] = ['1+ years', '2+ years', '3+ years', '4+ years', '5+ years'];
const workfieldOptions: string[] = ['tech', 'healthcare', 'finance', 'education', 'marketing'];

export function Dashboard(){
  const [candidates, setCandidates] = useState<ListCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    location: [],
    experience: [],
    workfield: [],
  });
  const [sortBy, setSortBy] = useState<'recent' | 'match'>('recent');

  useEffect(() => {
    async function loadCandidates() {
      try {
        const data = await listCandidates();
        setCandidates(data);
      } catch (err) {
        console.error('Error loading candidates:', err);
        setError('Failed to load candidates');
      } finally {
        setLoading(false);
      }
    }

    loadCandidates();
  }, []);

  const filteredCandidates = useMemo<Candidate[]>(() => {
    let result = candidates.map((c: ListCandidate): Candidate => ({
      id: c.user_id,
      name: c.full_name || 'Unknown',
      skills: c.skills || [],
      location: c.location || '',
      salary: '', // Not available from API
      posted: '', // Not available from API
      experience: c.experience_years ? `${c.experience_years}+ years` : '',
      workfield: '', // Not available from API
    })).filter((candidate: Candidate): boolean => {
      const matchesSearch: boolean = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesLocation: boolean = filters.location.length === 0 || 
                             filters.location.includes(candidate.location);
      
      const matchesExperience: boolean = filters.experience.length === 0 || 
                             filters.experience.includes(candidate.experience);

      const matchesWorkfield: boolean = filters.workfield.length === 0 || 
                             filters.workfield.includes(candidate.workfield);

      return matchesSearch && matchesLocation && matchesExperience && matchesWorkfield;
    });

    if (sortBy === 'recent') {
      result.sort((a: Candidate, b: Candidate): number => new Date(b.posted).getTime() - new Date(a.posted).getTime());
    } else if (sortBy === 'match') {
      result.sort((a: Candidate, b: Candidate): number => new Date(b.posted).getTime() - new Date(a.posted).getTime());
    }

    return result;
  }, [candidates, searchQuery, filters, sortBy]);

  const toggleFilter = (type: 'location' | 'experience' | 'workfield', value: string): void => {
    setFilters((prev: Filters): Filters => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((v: string): boolean => v !== value)
        : [...prev[type], value]
    }));
  };

  const clearFilters = (): void => {
    setFilters({ location: [], experience: [], workfield: [] });
    setSearchQuery('');
  };

  const hasActiveFilters: boolean = filters.location.length > 0 || filters.experience.length > 0 || filters.workfield.length > 0 || searchQuery !== '';

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="rounded-2xl border-border shadow-sm bg-linear-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-card sticky top-6">
              <CardContent className="space-y-6 mt-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="h-3 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <div className="animate-pulse">
              <div className="h-6 bg-slate-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-32 bg-slate-200 rounded"></div>
                <div className="h-32 bg-slate-200 rounded"></div>
                <div className="h-32 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 lg:col-start-2">
            <Card className="rounded-2xl border-border shadow-sm">
              <CardContent className="p-12 text-center">
                <User className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">{error}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card className="rounded-2xl border-border shadow-sm bg-linear-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-card sticky top-6 ">
            <CardContent className="space-y-6 mt-4">
              {/* Search Input */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Search Candidates
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Candidate name or skills..."
                    value={searchQuery}
                    onChange={(e): void => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <div className="space-y-2">
                  {locationOptions.map((location: string) => (
                    <label key={location} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.location.includes(location)}
                        onChange={(): void => toggleFilter('location', location)}
                        className="w-4 h-4 rounded border-slate-300 text-purple-600 dark:text-purple-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Filter */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Experience
                </label>
                <div className="space-y-2">
                  {experienceOptions.map((exp: string) => (
                    <label key={exp} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.experience.includes(exp)}
                        onChange={(): void => toggleFilter('experience', exp)}
                        className="w-4 h-4 rounded border-slate-300 text-purple-600 dark:text-purple-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{exp}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Workfield Filter */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Workfield
                </label>
                <div className="space-y-2">
                  {workfieldOptions.map((field: string) => (
                    <label key={field} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.workfield.includes(field)}
                        onChange={(): void => toggleFilter('workfield', field)}
                        className="w-4 h-4 rounded border-slate-300 text-purple-600 dark:text-purple-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{field}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Active Filters Tags */}
              {hasActiveFilters && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Active Filters</p>
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <Badge variant="outline" className="gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700">
                        {searchQuery}
                        <X className="w-3 h-3 cursor-pointer" onClick={(): void => setSearchQuery('')} />
                      </Badge>
                    )}
                    {filters.location.map((loc: string) => (
                      <Badge key={loc} variant="outline" className="gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700">
                        {loc}
                        <X className="w-3 h-3 cursor-pointer" onClick={(): void => toggleFilter('location', loc)} />
                      </Badge>
                    ))}
                    {filters.experience.map((exp: string) => (
                      <Badge key={exp} variant="outline" className="gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700">
                        {exp}
                        <X className="w-3 h-3 cursor-pointer" onClick={(): void => toggleFilter('experience', exp)} />
                      </Badge>
                    ))}
                    {filters.workfield.map((field: string) => (
                      <Badge key={field} variant="outline" className="gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700">
                        {field}
                        <X className="w-3 h-3 cursor-pointer" onClick={(): void => toggleFilter('workfield', field)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Job Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <p className="text-slate-600 dark:text-slate-400">
              Found <span className="font-bold text-slate-900 dark:text-white">{filteredCandidates.length}</span> candidates
            </p>
            <select
              value={sortBy}
              onChange={(e): void => setSortBy(e.target.value as 'recent' | 'match')}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="recent">Most Recent</option>
              <option value="match">Best Match</option>
            </select>
          </div>

          {/* Candidate Cards */}
          {filteredCandidates.length > 0 ? (
            <div className="space-y-3">
              {filteredCandidates.map((candidate: Candidate) => (
                <Card key={candidate.id} className="rounded-2xl border-border shadow-sm bg-linear-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-card hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{candidate.name}</h3>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 3).map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{candidate.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">{candidate.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">{candidate.experience}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">{candidate.salary}$</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">{candidate.workfield}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                      <button className="ml-4 cursor-pointer px-6 py-2 bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200">
                        View Resume
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="rounded-2xl border-border shadow-sm bg-linear-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-card">
              <CardContent className="p-12 text-center">
                <User className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 mb-2">No candidates found</p>
                <p className="text-sm text-slate-500 dark:text-slate-500">Try adjusting your filters or search query</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}