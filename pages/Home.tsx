
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileImage, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Lock,
  Layers,
  FileSearch,
  CheckCircle2,
  MousePointer2
} from 'lucide-react';
import { ToolType } from '../types';

const ToolCard = ({ 
  title, 
  description, 
  icon: Icon, 
  path, 
  color 
}: { 
  title: string; 
  description: string; 
  icon: any; 
  path: string; 
  color: string;
}) => (
  <Link 
    to={path} 
    className="group relative glass p-10 rounded-[2.5rem] hover:translate-y-[-8px] transition-all duration-500 tool-card overflow-hidden"
  >
    <div className={`absolute -top-10 -right-10 w-40 h-40 bg-${color}-500/10 blur-3xl rounded-full group-hover:bg-${color}-500/20 transition-all`}></div>
    <div className={`w-16 h-16 rounded-2xl bg-${color}-500/10 flex items-center justify-center mb-8 border border-${color}-500/20 group-hover:scale-110 transition-transform duration-500`}>
      <Icon className={`w-8 h-8 text-${color}-400`} />
    </div>
    <h3 className="text-2xl font-black text-white mb-4 group-hover:text-indigo-400 transition-colors">{title}</h3>
    <p className="text-gray-400 text-base leading-relaxed mb-10">{description}</p>
    <div className="inline-flex items-center gap-3 py-3 px-6 rounded-full bg-white/5 text-white font-bold text-sm group-hover:bg-indigo-600 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all">
      Open Tool <ArrowRight size={16} />
    </div>
  </Link>
);

const Home: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass text-indigo-400 text-xs font-black tracking-widest uppercase mb-10 border border-indigo-500/30">
             <MousePointer2 size={14} className="animate-bounce" /> Processing locally
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-10 leading-[1.05]">
            Convert Files with <br />
            <span className="shimmer">Zero Trace.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-medium mb-16 max-w-2xl mx-auto leading-relaxed">
            Premium, lightning-fast tools for PDFs, Images, and Documents. 100% browser-based. Secure by design.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to={`/tool/${ToolType.IMAGE_TO_PDF}`}
              className="px-10 py-5 bg-indigo-600 text-white rounded-full font-black text-lg shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:scale-105 transition-all w-full sm:w-auto"
            >
              Get Started Now
            </Link>
            <a href="#tools" className="text-gray-400 hover:text-white font-black text-lg transition-all flex items-center gap-2 underline underline-offset-8">
              Explore Tools
            </a>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <ToolCard 
              title="Image to PDF" 
              description="Batch convert JPG, PNG, and WebP into crisp, high-resolution PDF documents instantly."
              icon={FileImage}
              path={`/tool/${ToolType.IMAGE_TO_PDF}`}
              color="blue"
            />
            <ToolCard 
              title="Word to PDF" 
              description="Turn your Word documents into professional PDFs with one click. Fast and precise."
              icon={FileText}
              path={`/tool/${ToolType.WORD_TO_PDF}`}
              color="indigo"
            />
            <ToolCard 
              title="PDF to Image" 
              description="Extract high-quality images from any PDF page. Perfect for presentations and social media."
              icon={Layers}
              path={`/tool/${ToolType.PDF_TO_IMAGE}`}
              color="purple"
            />
            <ToolCard 
              title="PDF to Word" 
              description="Convert static PDFs into editable text documents. Extract content effortlessly."
              icon={FileSearch}
              path={`/tool/${ToolType.PDF_TO_WORD}`}
              color="emerald"
            />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            <div className="flex flex-col items-center text-center">
              <div className="p-5 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-8">
                <ShieldCheck size={40} />
              </div>
              <h4 className="text-xl font-black text-white mb-4">Privacy by Default</h4>
              <p className="text-gray-400 leading-relaxed">No tracking, no server logs. Your data never leaves your browser.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-8">
                <Zap size={40} />
              </div>
              <h4 className="text-xl font-black text-white mb-4">Instant Speed</h4>
              <p className="text-gray-400 leading-relaxed">Local processing means no upload or download latency. Lightning fast.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="p-5 rounded-3xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-8">
                <CheckCircle2 size={40} />
              </div>
              <h4 className="text-xl font-black text-white mb-4">Pro Quality</h4>
              <p className="text-gray-400 leading-relaxed">High-fidelity conversions with no compression artifacts or watermarks.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
