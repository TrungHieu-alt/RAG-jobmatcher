import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Search, MapPin, DollarSign, Clock, X } from 'lucide-react';
import { listJobs, type JobPostResponse } from '@/api/jobs';
import { getRecruiterProfile, type RecruiterProfileResponse } from '@/api/users';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  posted: string;
  type: string;
  experience: string;
}

interface Filters {
  location: string[];
  jobType: string[];
}

const locationOptions: string[] = ['Ho Chi Minh', 'Hanoi', 'Da Nang'];
const jobTypeOptions: string[] = ['Full-time', 'Part-time', 'Remote'];

export default function Dashboard(){
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    location: [],
    jobType: [],
  });
  const [sortBy, setSortBy] = useState<'recent' | 'match'>('recent');

  useEffect(() => {
    async function loadJobs() {
      try {
        const jobResponses: JobPostResponse[] = await listJobs();
        
        const jobsData: Job[] = await Promise.all(
          jobResponses.map(async (jobRes: JobPostResponse) => {
            try {
              const recruiterProfile: RecruiterProfileResponse = await getRecruiterProfile(jobRes.recruiter_id);
              
              const salary = jobRes.salary_min && jobRes.salary_max 
                ? `${jobRes.salary_min}-${jobRes.salary_max}`
                : jobRes.salary_min 
                  ? `${jobRes.salary_min}+`
                  : jobRes.salary_max 
                    ? `Up to ${jobRes.salary_max}`
                    : 'Not specified';
              
              return {
                id: jobRes.job_id,
                title: jobRes.title,
                company: recruiterProfile.company_name || 'Unknown Company',
                location: jobRes.location,
                salary,
                posted: new Date(jobRes.created_at).toISOString().split('T')[0], // YYYY-MM-DD format
                type: jobRes.job_type,
                experience: jobRes.experience_level,
              };
            } catch (err) {
              console.error('Error fetching recruiter profile:', err);
              return {
                id: jobRes.job_id,
                title: jobRes.title,
                company: 'Unknown Company',
                location: jobRes.location,
                salary: jobRes.salary_min && jobRes.salary_max 
                  ? `${jobRes.salary_min}-${jobRes.salary_max}`
                  : 'Not specified',
                posted: new Date(jobRes.created_at).toISOString().split('T')[0],
                type: jobRes.job_type,
                experience: jobRes.experience_level,
              };
            }
          })
        );
        
        setJobs(jobsData);
      } catch (err) {
        console.error('Error loading jobs:', err);
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  const filteredJobs = useMemo<Job[]>(() => {
    let result = jobs.filter((job: Job): boolean => {
      const matchesSearch: boolean = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLocation: boolean = filters.location.length === 0 || 
                             filters.location.includes(job.location);
      
      const matchesType: boolean = filters.jobType.length === 0 || 
                         filters.jobType.includes(job.type);

      return matchesSearch && matchesLocation && matchesType;
    });

    if (sortBy === 'recent') {
      result.sort((a: Job, b: Job): number => new Date(b.posted).getTime() - new Date(a.posted).getTime());
    } else if (sortBy === 'match') {
      result.sort((a: Job, b: Job): number => new Date(b.posted).getTime() - new Date(a.posted).getTime());
    }

    return result;
  }, [jobs, searchQuery, filters, sortBy]);

  const toggleFilter = (type: 'location' | 'jobType', value: string): void => {
    setFilters((prev: Filters): Filters => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((v: string): boolean => v !== value)
        : [...prev[type], value]
    }));
  };

  const clearFilters = (): void => {
    setFilters({ location: [], jobType: [] });
    setSearchQuery('');
  };

  const hasActiveFilters: boolean = filters.location.length > 0 || filters.jobType.length > 0 || searchQuery !== '';

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="rounded-2xl border-border shadow-sm bg-linear-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-card sticky top-6">
              <CardContent className="space-y-6 mt-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-10 bg-slate-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <div className="animate-pulse">
              <div className="h-6 bg-slate-200 rounded mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="rounded-2xl border-border shadow-sm">
                    <CardContent className="p-6">
                      <div className="h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                    </CardContent>
                  </Card>
                ))}
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
                <Briefcase className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 mb-2">{error}</p>
                <p className="text-sm text-slate-500 dark:text-slate-500">Please try again later</p>
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
                  Search Jobs
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Job title or company..."
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

              {/* Job Type Filter */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Job Type
                </label>
                <div className="space-y-2">
                  {jobTypeOptions.map((type: string) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.jobType.includes(type)}
                        onChange={(): void => toggleFilter('jobType', type)}
                        className="w-4 h-4 rounded border-slate-300 text-purple-600 dark:text-purple-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{type}</span>
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
                    {filters.jobType.map((type: string) => (
                      <Badge key={type} variant="outline" className="gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700">
                        {type}
                        <X className="w-3 h-3 cursor-pointer" onClick={(): void => toggleFilter('jobType', type)} />
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
              Found <span className="font-bold text-slate-900 dark:text-white">{filteredJobs.length}</span> jobs
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

          {/* Job Cards */}
          {filteredJobs.length > 0 ? (
            <div className="space-y-3">
              {filteredJobs.map((job: Job) => (
                <Card key={job.id} className="rounded-2xl border-border shadow-sm bg-linear-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-card hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{job.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{job.company}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">{job.salary}$</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">{job.experience}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                      <button className="ml-4 cursor-pointer px-6 py-2 bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200">
                        View
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="rounded-2xl border-border shadow-sm bg-linear-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-card">
              <CardContent className="p-12 text-center">
                <Briefcase className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 mb-2">No jobs found</p>
                <p className="text-sm text-slate-500 dark:text-slate-500">Try adjusting your filters or search query</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}