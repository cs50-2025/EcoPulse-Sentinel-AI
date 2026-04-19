import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Activity, ShieldAlert, Database, Leaf } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Activity },
    { name: 'Detection Hub', path: '/hub', icon: ShieldAlert },
    { name: 'Conservation Logs', path: '/logs', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-[#050B0D] text-white">
      <nav className="border-b border-white/5 bg-[#081215]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-teal-400" />
              <span className="font-bold text-xl tracking-tight">EcoPulse Sentinel AI</span>
            </div>
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                        isActive 
                          ? "bg-teal-500/10 text-teal-400" 
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
