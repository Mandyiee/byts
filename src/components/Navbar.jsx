import {  MonitorSmartphone, GitBranch} from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-[#111] text-[var(--color-text)] shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <MonitorSmartphone className="h-8 w-8 text-white stroke-1" />
            <span className="font-bold text-xl text-[var(--color-text)]">Byts</span>
          </div>

          <a 
            href="https://github.com/Mandyiee/byts.git" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[var(--color-text)] opacity-80 hover:opacity-100 transition-opacity"
          >
            <GitBranch size={24} className='stroke-1' />
          </a>
        </div>
      </div>
    </nav>
  );
}