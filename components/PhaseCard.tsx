
import React from 'react';
import { featuresData } from '../constants';

interface SidebarProps {
  activePage: string;
  setActivePage: (pageId: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen, setIsOpen }) => {
  
  const handleNavigation = (pageId: string) => {
    setActivePage(pageId);
    setIsOpen(false);
  };
  
  const NavItem: React.FC<{feature: (typeof featuresData)[0]}> = ({ feature }) => {
    const isActive = activePage === feature.id;
    return (
      <li>
        <button
          onClick={() => handleNavigation(feature.id)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 ${
            isActive
              ? 'bg-sky-500/10 text-sky-400'
              : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
          }`}
          aria-current={isActive ? 'page' : undefined}
        >
          <feature.icon className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">{feature.title}</span>
        </button>
      </li>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/60 z-20 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>

      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex flex-col p-4 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between gap-3 mb-8">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleNavigation('dashboard')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-teal-400 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <h1 className="text-xl font-bold text-white">Career AI</h1>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden p-2 -mr-2 rounded-md text-slate-400 hover:bg-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {featuresData.map((feature) => (
              <NavItem key={feature.id} feature={feature} />
            ))}
          </ul>
        </nav>

        <div className="mt-auto pt-4">
          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-800/50">
            <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center text-slate-400">
              JD
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Jane Doe</p>
              <p className="text-xs text-slate-500">View Profile</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
