import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function MetricCard({ title, value, change, isPositive, icon: Icon, format = 'number' }) {
  
  const formatValue = (val) => {
    if (format === 'percent') {
      return `${val}%`;
    }
    if (format === 'number') {
      return new Intl.NumberFormat().format(val);
    }
    return val;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="text-2xl md:text-3xl font-bold mt-2 text-slate-900 dark:text-white">
            {formatValue(value)}
          </h3>
        </div>
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
          <Icon size={22} />
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-4">
        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
          isPositive 
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
        }`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(change)}%
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500">vs last 7 days</span>
      </div>
    </div>
  );
}
