import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '../ui/button';
import { Calendar } from 'lucide-react';
import { Badge } from '../ui/badge';

const skillHeatmapData = [
  { skill: 'React', count: 45 },
  { skill: 'TypeScript', count: 38 },
  { skill: 'Python', count: 32 },
  { skill: 'AWS', count: 28 },
  { skill: 'Node.js', count: 25 },
  { skill: 'Docker', count: 22 },
  { skill: 'PostgreSQL', count: 20 },
  { skill: 'Figma', count: 18 },
];

const matchScoreData = [
  { job: 'React Dev', avgScore: 92 },
  { job: 'Designer', avgScore: 88 },
  { job: 'DevOps', avgScore: 85 },
  { job: 'Backend', avgScore: 91 },
  { job: 'Mobile', avgScore: 86 },
];

const responseRatesData = [
  { week: 'Week 1', responded: 45, total: 60 },
  { week: 'Week 2', responded: 52, total: 65 },
  { week: 'Week 3', responded: 48, total: 58 },
  { week: 'Week 4', responded: 58, total: 70 },
];

const offerStatusData = [
  { name: 'Accepted', value: 32, color: '#22c55e' },
  { name: 'Pending', value: 18, color: '#f59e0b' },
  { name: 'Declined', value: 8, color: '#ef4444' },
  { name: 'Negotiating', value: 12, color: '#6364FF' },
];

export function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Analytics</h2>
          <p className="text-muted-foreground">Track your recruitment performance and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-xl border-border">
            <Calendar className="w-4 h-4 mr-2" />
            Last 7 days
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl border-border">
            Last 30 days
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl border-border">
            Last 90 days
          </Button>
        </div>
      </div>

      {/* Top Row - Skill Heatmap & Match Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Heatmap */}
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader>
            <CardTitle>Most In-Demand Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillHeatmapData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 100, 255, 0.1)" />
                <XAxis type="number" stroke="#6b6b7b" />
                <YAxis dataKey="skill" type="category" stroke="#6b6b7b" width={80} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="count" fill="url(#skillGradient)" radius={[0, 8, 8, 0]} />
                <defs>
                  <linearGradient id="skillGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6364FF" />
                    <stop offset="100%" stopColor="#9b87f5" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Average Match Score per Job */}
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader>
            <CardTitle>Average Match Score per Job</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={matchScoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 100, 255, 0.1)" />
                <XAxis dataKey="job" stroke="#6b6b7b" />
                <YAxis stroke="#6b6b7b" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="avgScore" fill="url(#matchGradient)" radius={[8, 8, 0, 0]}>
                  {matchScoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="matchGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9b87f5" />
                    <stop offset="100%" stopColor="#6364FF" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Response Rates & Offer Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Response Rates */}
        <Card className="rounded-2xl border-border shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Response Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseRatesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 100, 255, 0.1)" />
                <XAxis dataKey="week" stroke="#6b6b7b" />
                <YAxis stroke="#6b6b7b" />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="responded"
                  stroke="#6364FF"
                  strokeWidth={3}
                  dot={{ fill: '#6364FF', r: 5 }}
                  name="Responded"
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#d6c8ff"
                  strokeWidth={3}
                  dot={{ fill: '#d6c8ff', r: 5 }}
                  name="Total Contacted"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Offer Status Distribution */}
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader>
            <CardTitle>Offer Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={offerStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {offerStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {offerStatusData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <Badge variant="secondary" className="rounded-lg">
                    {item.value}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Summary */}
      <Card className="rounded-2xl border-border shadow-sm bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-card">
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Avg. Time to Hire</div>
              <div className="text-2xl">18 days</div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">↓ 2 days from last month</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Offer Acceptance Rate</div>
              <div className="text-2xl">84%</div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">↑ 5% from last month</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Avg. Match Quality</div>
              <div className="text-2xl">89%</div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">↑ 3% from last month</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Active Candidates</div>
              <div className="text-2xl">156</div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">↑ 12 from last week</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
