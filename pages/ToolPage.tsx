
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FileImage, 
  FileText, 
  Layers, 
  FileSearch, 
  ChevronLeft, 
  Download, 
  RefreshCcw, 
  CheckCircle2, 
  X,
  Loader2,
  Trash2,
  Lock
} from 'lucide-react';
import { ToolType, FileItem } from '../types';
import Dropzone from '../components/Dropzone';
import { convertToPdf, convertPdfToImages, convertWordToPdf, convertPdfToWord } from '../services/converters';

const ToolConfigMap: Record<string, any> = {
  [ToolType.IMAGE_TO_PDF]: {
    name: 'Image to PDF',
    description: 'Transform your photos and graphics into high-quality PDF documents.',
    icon: FileImage,
    color: 'blue',
    allowedTypes: ['jpg', 'jpeg', 'png', 'webp'],
    maxFiles: 20
  },
  [ToolType.WORD_TO_PDF]: {
    name: 'Word to PDF',
    description: 'Convert DOC and DOCX files to clean, professional PDFs.',
    icon: FileText,
    color: 'indigo',
    allowedTypes: ['docx', 'doc'],
    maxFiles: 5
  },
  [ToolType.PDF_TO_IMAGE]: {
    name: 'PDF to Image',
    description: 'Extract pages from your PDFs and save them as separate image files.',
    icon: Layers,
    color: 'purple',
    allowedTypes: ['pdf'],
    maxFiles: 1
  },
  [ToolType.PDF_TO_WORD]: {
    name: 'PDF to Word',
    description: 'Convert fixed PDFs into editable Microsoft Word documents.',
    icon: FileSearch,
    color: 'emerald',
    allowedTypes: ['pdf'],
    maxFiles: 1
  }
};

const ToolPage: React.FC = () => {
  const { toolType } = useParams<{ toolType: string }>();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResult, setProcessedResult] = useState<{ url: string, name: string } | null>(null);

  const config = toolType ? ToolConfigMap[toolType] : null;

  useEffect(() => {
    return () => {
      if (processedResult?.url) URL.revokeObjectURL(processedResult.url);
      files.forEach(f => { if (f.previewUrl) URL.revokeObjectURL(f.previewUrl); });
    };
  }, [processedResult, files]);

  if (!config) {
    useEffect(() => { navigate('/'); }, [navigate]);
    return null;
  }

  const handleFilesSelected = (newFiles: File[]) => {
    const items: FileItem[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      status: 'pending',
      progress: 0
    }));
    setFiles(prev => [...prev, ...items]);
  };

  const removeFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl);
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      let result;
      switch (toolType) {
        case ToolType.IMAGE_TO_PDF: result = await convertToPdf(files.map(f => f.file)); break;
        case ToolType.PDF_TO_IMAGE: result = await convertPdfToImages(files[0].file); break;
        case ToolType.WORD_TO_PDF: result = await convertWordToPdf(files[0].file); break;
        case ToolType.PDF_TO_WORD: result = await convertPdfToWord(files[0].file); break;
        default: throw new Error('Unsupported conversion');
      }
      setProcessedResult(result);
    } catch (err) {
      alert('Conversion failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    if (processedResult?.url) URL.revokeObjectURL(processedResult.url);
    files.forEach(f => { if (f.previewUrl) URL.revokeObjectURL(f.previewUrl); });
    setFiles([]);
    setProcessedResult(null);
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 animate-in slide-in-from-bottom-8 duration-700">
      <Link to="/" className="inline-flex items-center text-sm font-black text-gray-500 hover:text-white mb-12 transition-colors uppercase tracking-[0.2em]">
        <ChevronLeft size={18} className="mr-2" /> Back to Tools
      </Link>

      <div className="mb-20">
        <div className={`w-20 h-20 rounded-3xl glass flex items-center justify-center mb-10 text-${config.color}-400 border border-${config.color}-500/30`}>
          <config.icon size={36} />
        </div>
        <h1 className="text-5xl font-black text-white mb-6 tracking-tight">{config.name}</h1>
        <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-2xl">{config.description}</p>
      </div>

      {!processedResult ? (
        <div className="space-y-12">
          {files.length === 0 ? (
            <Dropzone 
              onFilesSelected={handleFilesSelected} 
              allowedTypes={config.allowedTypes} 
              maxFiles={config.maxFiles}
            />
          ) : (
            <div className="glass rounded-[3rem] border border-white/5 overflow-hidden animate-in zoom-in-95 duration-500">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/2">
                <h3 className="font-black text-white text-lg tracking-tight uppercase tracking-widest">Selected Files ({files.length})</h3>
                <button 
                  onClick={() => {
                    files.forEach(f => { if(f.previewUrl) URL.revokeObjectURL(f.previewUrl) });
                    setFiles([]);
                  }} 
                  className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={14} className="inline mr-2" /> Reset
                </button>
              </div>
              <div className="max-h-[400px] overflow-y-auto divide-y divide-white/5">
                {files.map((item) => (
                  <div key={item.id} className="p-6 flex items-center justify-between group hover:bg-white/2 transition-all">
                    <div className="flex items-center gap-6">
                      {item.previewUrl ? (
                        <div className="w-16 h-16 rounded-2xl bg-white/5 overflow-hidden border border-white/10 p-1 flex-shrink-0">
                          <img src={item.previewUrl} className="w-full h-full object-cover rounded-xl" alt="" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 text-indigo-400">
                          <FileText size={28} />
                        </div>
                      )}
                      <div>
                        <p className="text-lg font-bold text-white mb-1 truncate max-w-[200px] md:max-w-md">{item.file.name}</p>
                        <p className="text-xs text-gray-500 font-black uppercase tracking-widest">{(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFile(item.id)}
                      className="p-3 text-gray-500 hover:text-red-500 bg-white/5 rounded-full hover:bg-white/10 transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-10 bg-dark-900/50 flex flex-col md:flex-row gap-6">
                <button
                  disabled={isProcessing}
                  onClick={handleConvert}
                  className="flex-1 py-5 bg-indigo-600 text-white rounded-full font-black text-lg hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(79,70,229,0.3)] flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      Run Conversion
                    </>
                  )}
                </button>
                <button 
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.multiple = config.maxFiles > 1;
                    input.accept = config.allowedTypes.map((t: string) => `.${t}`).join(',');
                    input.onchange = (e: any) => handleFilesSelected(Array.from(e.target.files));
                    input.click();
                  }}
                  className="px-10 py-5 bg-white/5 text-white border border-white/10 rounded-full font-black text-lg hover:bg-white/10 transition-all"
                >
                  Add More
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="glass rounded-[4rem] border border-white/10 p-12 text-center animate-in zoom-in-95 duration-700">
          <div className="w-28 h-28 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
            <CheckCircle2 size={56} />
          </div>
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Success!</h2>
          <p className="text-lg text-gray-400 font-medium mb-12">Your files were converted locally. You can download them below.</p>
          
          <div className="glass rounded-3xl p-8 mb-12 flex items-center justify-between border border-white/5 text-left group">
            <div className="flex items-center gap-6 overflow-hidden">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                <Download size={28} />
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-white text-xl truncate mb-1">{processedResult.name}</p>
                <p className="text-xs text-indigo-400 font-black uppercase tracking-widest">Ready for export</p>
              </div>
            </div>
            <a 
              href={processedResult.url} 
              download={processedResult.name}
              className="ml-6 px-10 py-4 bg-white text-dark-950 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Download
            </a>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={reset}
              className="px-10 py-4 bg-white/5 text-gray-400 border border-white/10 rounded-full font-black text-sm hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <RefreshCcw size={18} /> New Conversion
            </button>
          </div>
        </div>
      )}

      {/* Security Disclaimer */}
      <div className="mt-24 p-12 glass rounded-[3rem] flex flex-col md:flex-row items-center gap-10 border border-indigo-500/20">
        <div className="w-20 h-20 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 flex-shrink-0">
          <Lock size={32} />
        </div>
        <div className="text-center md:text-left">
          <h4 className="text-2xl font-black text-white mb-3">Enterprise-Grade Privacy</h4>
          <p className="text-gray-400 font-medium leading-relaxed">
            SwiftConvert operates 100% on-device. No images, documents, or metadata are transmitted to our cloud servers. 
            All conversion logic is executed in your browser's sandboxed environment using your local hardware.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ToolPage;
