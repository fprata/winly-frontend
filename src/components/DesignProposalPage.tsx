import React from 'react';
import { 
  Bell, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Filter,
  BarChart3
} from 'lucide-react';

export default function DesignProposalPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-1">
              Market Intelligence
            </h1>
            <p className="text-sm text-zinc-500">
              Overview of active public tenders and your competitive pipeline.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Feed Active
            </span>
          </div>
        </div>

        {/* Stats Grid - Replaces old "StatCard" with a cleaner, flatter look */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-zinc-500">Active Matches</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Bell size={16} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tight text-zinc-900">142</div>
              <div className="mt-2 flex items-center gap-1 text-sm">
                <span className="text-blue-600 font-medium hover:underline cursor-pointer flex items-center gap-1">
                  Manage pipeline <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-zinc-500">High Confidence</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShieldCheck size={16} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tight text-zinc-900">28</div>
              <div className="mt-2 flex items-center gap-1.5 text-sm text-zinc-500">
                <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                  &gt; 75% Score
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-zinc-500">Pipeline Value</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <BarChart3 size={16} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tight text-zinc-900">€4.2M</div>
              <div className="mt-2 flex items-center gap-1.5 text-sm text-zinc-500">
                Aggregated active contracts
              </div>
            </div>
          </div>

        </div>

        {/* Section: Tender Explorer */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">Recent Opportunities</h2>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm">
                <Filter size={16} />
                Filters
              </button>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Search tenders..." 
                  className="w-64 rounded-lg border border-zinc-300 py-1.5 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-500 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-shadow"
                />
              </div>
            </div>
          </div>

          {/* New Tender List Item Design */}
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm transition-all hover:border-blue-500 hover:shadow-md cursor-pointer group">
                <div className="flex items-start justify-between gap-6">
                  
                  {/* Left content */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div>
                      <h3 className="text-base font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        Provision of Advanced Cloud Infrastructure and Analytics Services for the Ministry of Health
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="flex items-center gap-1.5 text-sm text-zinc-500 font-medium">
                          <Building2 size={14} className="text-zinc-400" />
                          <span className="truncate max-w-[250px]">Ministério da Saúde - Serviços Partilhados</span>
                        </span>
                        <span className="text-zinc-300">•</span>
                        <span className="text-sm text-zinc-500">🇵🇹 Portugal</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        72000000 - IT Services
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        Active
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
                        88% Match
                      </span>
                      
                      <div className="w-px h-4 bg-zinc-200 mx-1"></div>

                      <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                        <Calendar size={12} />
                        Published 2d ago
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                        <Clock size={12} />
                        Closes in 5d
                      </span>
                    </div>
                  </div>

                  {/* Right Content */}
                  <div className="text-right shrink-0 flex flex-col items-end justify-between h-full">
                    <div className="text-lg font-bold text-zinc-900 tabular-nums">
                      €1,250,000
                    </div>
                    <div className="mt-4 w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
