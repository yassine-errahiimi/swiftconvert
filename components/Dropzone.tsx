
import React from 'react';
import { Upload, Info, FileStack } from 'lucide-react';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  allowedTypes: string[];
  maxFiles?: number;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFilesSelected, allowedTypes, maxFiles = 10 }) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file => 
      allowedTypes.some(type => file.name.toLowerCase().endsWith(type))
    );
    if (files.length > 0) {
      onFilesSelected(files.slice(0, maxFiles));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onFilesSelected(files.slice(0, maxFiles));
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative group cursor-pointer border-2 border-dashed rounded-[3rem] p-16 transition-all duration-500 ${
        isDragging 
          ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02] shadow-[0_0_50px_rgba(79,70,229,0.2)]' 
          : 'border-white/10 glass hover:border-indigo-500/50'
      }`}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple={maxFiles > 1}
        accept={allowedTypes.map(t => `.${t}`).join(',')}
        onChange={handleFileChange}
      />
      
      <div className="flex flex-col items-center text-center">
        <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-10 transition-all duration-500 ${
          isDragging ? 'bg-indigo-600 text-white' : 'bg-white/5 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/10'
        }`}>
          <Upload size={40} className={isDragging ? 'animate-bounce' : ''} />
        </div>
        <h3 className="text-3xl font-black text-white mb-4">
          {isDragging ? 'Ready to process' : 'Select your files'}
        </h3>
        <p className="text-gray-400 text-lg max-w-sm mb-12">
          Drag and drop your {allowedTypes.join(', ').toUpperCase()} files here or click to browse.
        </p>
        
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl text-xs text-gray-400 font-black uppercase tracking-widest border border-white/5">
          <FileStack size={16} className="text-indigo-400" />
          Maximum {maxFiles} files
        </div>
      </div>
    </div>
  );
};

export default Dropzone;
