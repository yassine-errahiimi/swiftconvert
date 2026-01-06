
import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Files, 
  ShieldCheck, 
  Menu,
  X,
  Github,
  Twitter,
  ExternalLink
} from 'lucide-react';
import Home from './pages/Home';
import ToolPage from './pages/ToolPage';
import { ToolType } from './types';

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Image 2 PDF', path: `/tool/${ToolType.IMAGE_TO_PDF}` },
    { name: 'Word 2 PDF', path: `/tool/${ToolType.WORD_TO_PDF}` },
    { name: 'PDF 2 Image', path: `/tool/${ToolType.PDF_TO_IMAGE}` },
    { name: 'PDF 2 Word', path: `/tool/${ToolType.PDF_TO_WORD}` },
  ];

  return (
    <header className="bg-dark-950/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-indigo-600 p-2.5 rounded-2xl group-hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all">
              <Files className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Swift<span className="text-indigo-500">Convert</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold transition-all hover:text-white uppercase tracking-widest ${
                  location.pathname === link.path ? 'text-indigo-400' : 'text-gray-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <button className="px-6 py-2.5 bg-white text-dark-950 rounded-full text-sm font-black hover:bg-gray-200 transition-all">
              API Access
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-dark-950 border-b border-white/5 p-6 animate-in slide-in-from-top duration-300">
          <div className="space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block py-4 text-xl font-bold text-gray-300 hover:text-indigo-400 border-b border-white/5"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

const Footer = () => (
  <footer className="bg-dark-950 border-t border-white/5 pt-20 pb-10">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-3 mb-6">
             <div className="bg-indigo-600 p-2 rounded-xl"><Files className="w-5 h-5 text-white" /></div>
             <span className="text-2xl font-black text-white">SwiftConvert</span>
          </Link>
          <p className="text-gray-400 max-w-sm mb-8">
            The world's most private and fastest file conversion tool. Processing 100% locally in your browser. No server storage, no tracking.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-white transition-all"><Twitter size={20}/></a>
            <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-white transition-all"><Github size={20}/></a>
          </div>
        </div>
        <div>
          <h3 className="text-white font-black uppercase text-xs tracking-widest mb-6">Tools</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li><Link to={`/tool/${ToolType.IMAGE_TO_PDF}`} className="hover:text-white transition-all">Image Converter</Link></li>
            <li><Link to={`/tool/${ToolType.WORD_TO_PDF}`} className="hover:text-white transition-all">Word to PDF</Link></li>
            <li><Link to={`/tool/${ToolType.PDF_TO_IMAGE}`} className="hover:text-white transition-all">PDF to JPG</Link></li>
            <li><Link to={`/tool/${ToolType.PDF_TO_WORD}`} className="hover:text-white transition-all">PDF to Word</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-black uppercase text-xs tracking-widest mb-6">Security</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck size={18} />
              <span className="text-sm font-bold uppercase tracking-tight">Zero Cloud Storage</span>
            </div>
            <p className="text-xs text-gray-500">Every byte stays on your local machine.</p>
          </div>
        </div>
      </div>
      <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-4">
        <p className="text-xs text-gray-600 font-bold uppercase tracking-[0.2em]">&copy; 2024 SwiftConvert — Designed for the Future</p>
        <div className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-all cursor-default">
          Created by 
          <span className="text-indigo-500 group-hover:text-indigo-400 transition-colors">Yassine Errahimi</span>
        </div>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col selection:bg-indigo-500/30">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tool/:toolType" element={<ToolPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
