import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function AnalyticsChart({ followerGrowth, engagementByPlatform, engagementByPostType }) {
  
  // Custom tooltips for nice UI
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow-lg">
          <p className="text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-bold" style={{ color: entry.color || entry.fill }}>
              {entry.name}: {new Intl.NumberFormat().format(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPercentTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow-lg">
          <p className="text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              Engagement: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const colors = {
    Twitter: '#38BDF8',
    LinkedIn: '#0284C7',
    Instagram: '#EC4899',
    Total: '#6366F1'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Follower Growth Trend Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">Follower Growth Trend</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Audience increase over the last 30 days</p>
          </div>
          <div className="flex gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-indigo-500"></span>Total</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-sky-400"></span>Twitter</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-600"></span>LinkedIn</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-pink-500"></span>Instagram</span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={followerGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.Total} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={colors.Total} stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.08)" />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                tickFormatter={(str) => {
                  const date = new Date(str);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Total" stroke={colors.Total} strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" name="Total Followers" />
              <Area type="monotone" dataKey="Twitter" stroke={colors.Twitter} strokeWidth={1.5} fill="transparent" name="Twitter/X" />
              <Area type="monotone" dataKey="LinkedIn" stroke={colors.LinkedIn} strokeWidth={1.5} fill="transparent" name="LinkedIn" />
              <Area type="monotone" dataKey="Instagram" stroke={colors.Instagram} strokeWidth={1.5} fill="transparent" name="Instagram" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Engagement by Platform Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="mb-6">
          <h4 className="font-bold text-slate-900 dark:text-white">Engagement Rate</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Average engagement rate by social network</p>
        </div>

        <div className="h-80 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engagementByPlatform} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.08)" />
              <XAxis 
                dataKey="name" 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip content={<CustomPercentTooltip />} />
              <Bar dataKey="engagement" radius={[8, 8, 0, 0]} barSize={40}>
                {engagementByPlatform.map((entry, index) => {
                  let barColor = colors.Total;
                  if (entry.name.includes('Twitter')) barColor = colors.Twitter;
                  else if (entry.name.includes('LinkedIn')) barColor = colors.LinkedIn;
                  else if (entry.name.includes('Instagram')) barColor = colors.Instagram;
                  
                  return <Cell key={`cell-${index}`} fill={barColor} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Engagement by Post Type Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm lg:col-span-3">
        <div className="mb-6">
          <h4 className="font-bold text-slate-900 dark:text-white">Engagement by Post Type</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Interaction performance breakdown by media format</p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engagementByPostType} layout="vertical" margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(226, 232, 240, 0.08)" />
              <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(val) => `${val}%`} />
              <YAxis dataKey="type" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomPercentTooltip />} />
              <Bar dataKey="engagement" fill="#6366F1" radius={[0, 6, 6, 0]} barSize={20}>
                {engagementByPostType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4F46E5' : '#818CF8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
