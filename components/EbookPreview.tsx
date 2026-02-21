
import React, { useState } from 'react';
import { FullEbook } from '../types';
import { Printer, BookOpen, Share2, ArrowLeft, FileText, Download, CheckCircle2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { exportToDocx } from '../utils/docxExport';

interface EbookPreviewProps {
  ebook: FullEbook;
  onReset: () => void;
}

const EbookPreview: React.FC<EbookPreviewProps> = ({ ebook, onReset }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDocxExport = async () => {
    setIsExporting(true);
    try {
      await exportToDocx(ebook);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const calculateStats = () => {
    const fullText = [
      ebook.outline.introduction,
      ...ebook.chapters.map(c => c.content),
      ebook.outline.conclusion
    ].join(' ');
    const wordCount = fullText.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Avg 200 wpm
    return { wordCount, readingTime };
  };

  const { wordCount, readingTime } = calculateStats();

  const handleShare = () => {
    const text = `Check out my new ebook: ${ebook.outline.title} by ${ebook.config.authorName}. Created with Yugal Ebook AI.`;
    navigator.clipboard.writeText(text);
    alert('Ebook details copied to clipboard!');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 no-print">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-800">Your Masterpiece</h2>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-slate-500">Ready for publishing and sale.</p>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              <span>{wordCount.toLocaleString()} Words</span>
              <span className="w-1 h-1 bg-indigo-300 rounded-full"></span>
              <span>{readingTime} Min Read</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button 
            onClick={handleShare}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-semibold shadow-sm"
            title="Share Ebook"
          >
            <Share2 size={18} />
          </button>
          <button 
            onClick={onReset}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-white transition-all font-semibold"
          >
            <ArrowLeft size={18} />
            Start New
          </button>
          <button 
            onClick={handleDocxExport}
            disabled={isExporting}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-all font-bold shadow-sm group disabled:opacity-50"
          >
            {exportComplete ? (
              <>
                <CheckCircle2 size={18} className="text-emerald-500" />
                DOCX Ready
              </>
            ) : (
              <>
                <FileText size={18} className="group-hover:scale-110 transition-transform" />
                {isExporting ? 'Generating...' : 'Download DOCX'}
              </>
            )}
          </button>
          <button 
            onClick={handlePrint}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-xl shadow-indigo-100 group"
          >
            <Printer size={18} className="group-hover:scale-110 transition-transform" />
            Download PDF Masterpiece
          </button>
        </div>
      </div>

      <div className="bg-white shadow-2xl rounded-lg overflow-hidden min-h-[11in] print:shadow-none border border-slate-100">
        {/* Cover Page */}
        <div className="book-page flex flex-col items-center justify-center min-h-[11in] bg-indigo-900 text-white p-20 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-800 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600 rounded-full opacity-30 blur-3xl"></div>
          
          <div className="relative z-10 w-full flex flex-col items-center">
            <div className="w-20 h-2 bg-indigo-400 mb-12 rounded-full"></div>
            <h1 className="text-6xl md:text-7xl font-display font-black mb-8 leading-[1.1] tracking-tight">{ebook.outline.title}</h1>
            <div className="h-0.5 w-40 bg-white/20 mb-12"></div>
            <p className="text-2xl text-indigo-200 mb-20 font-serif italic tracking-wide">Essential Wisdom & Practical Mastery</p>
            <div className="flex flex-col items-center">
              <p className="text-sm uppercase tracking-[0.4em] text-white/50 mb-3">Authored By</p>
              <p className="text-3xl font-serif text-white">{ebook.config.authorName}</p>
            </div>
            <div className="mt-32 pt-10 border-t border-white/10 w-full text-white/30 text-[10px] tracking-[0.3em] font-bold">
              CREATED BY YUGAL EBOOK AI • PREMIUM PUBLISHING 2026
            </div>
            <div className="mt-4 text-white/20 text-[8px] tracking-[0.2em] uppercase">
              Made in India by Yugal
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="book-page bg-white p-20 min-h-[11in] flex flex-col">
          <h2 className="text-4xl font-display font-bold text-slate-800 mb-16 border-b-2 border-slate-100 pb-8 tracking-tight">Contents</h2>
          <div className="space-y-6 flex-1">
            <div className="flex justify-between items-end border-b border-dotted border-slate-300 pb-1 hover:text-indigo-600 transition-colors">
              <span className="font-bold text-xl font-serif">Introduction</span>
              <span className="text-slate-400 font-mono">01</span>
            </div>
            {ebook.chapters.map((chapter, idx) => (
              <div key={idx} className="flex justify-between items-end border-b border-dotted border-slate-300 pb-1">
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-bold text-indigo-500 mb-1">Chapter {idx + 1}</span>
                  <span className="font-medium text-slate-800 text-lg font-serif leading-none">{chapter.title}</span>
                </div>
                <span className="text-slate-400 font-mono">{String(idx + 2).padStart(2, '0')}</span>
              </div>
            ))}
            <div className="flex justify-between items-end border-b border-dotted border-slate-300 pb-1">
              <span className="font-bold text-xl font-serif">Final Thoughts</span>
              <span className="text-slate-400 font-mono">{String(ebook.chapters.length + 2).padStart(2, '0')}</span>
            </div>
          </div>
          <div className="mt-20 text-center text-slate-300 text-[10px] tracking-widest uppercase italic">
            Copyright © 2026 {ebook.config.authorName} • Created by Yugal Ebook AI
          </div>
          <div className="mt-2 text-center text-slate-200 text-[8px] tracking-widest uppercase">
            Made in India by Yugal
          </div>
        </div>

        {/* Introduction */}
        <div className="book-page p-20 min-h-[11in]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-display font-bold text-slate-800 mb-12 tracking-tight">Introduction</h2>
            <div className="prose prose-slate max-w-none font-serif text-xl leading-relaxed text-slate-700 first-letter:text-7xl first-letter:font-bold first-letter:text-indigo-600 first-letter:mr-3 first-letter:float-left">
              <Markdown>{ebook.outline.introduction}</Markdown>
            </div>
          </div>
        </div>

        {/* Chapters */}
        {ebook.chapters.map((chapter, idx) => (
          <div key={idx} className="book-page min-h-[11in]">
            {/* Chapter Header Page */}
            <div className="chapter-title-page h-[11in] flex flex-col justify-center items-center text-center p-20 bg-slate-50 border-b border-slate-100">
               <div className="text-indigo-600 text-sm font-black uppercase tracking-[0.5em] mb-6">Chapter {idx + 1}</div>
               <div className="h-1 w-20 bg-indigo-200 mb-8 rounded-full"></div>
               <h2 className="text-6xl font-display font-black text-slate-900 leading-tight tracking-tighter">{chapter.title}</h2>
            </div>
            
            {/* Chapter Content */}
            <div className="p-20 min-h-[11in]">
              <div className="max-w-3xl mx-auto">
                <div className="prose prose-xl prose-slate max-w-none font-serif leading-relaxed text-slate-800">
                  <Markdown>{chapter.content}</Markdown>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Conclusion */}
        <div className="book-page p-20 min-h-[11in] flex flex-col justify-center bg-slate-900 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-5xl font-display font-bold mb-12 tracking-tight">Final Thoughts</h2>
            <div className="prose prose-invert prose-slate max-w-none font-serif text-xl leading-relaxed opacity-90 italic">
              <Markdown>{ebook.outline.conclusion}</Markdown>
            </div>
            <div className="mt-20 h-0.5 w-20 bg-indigo-500 mx-auto"></div>
            <p className="mt-10 font-display text-2xl">The End</p>
            <div className="mt-20 pt-10 border-t border-white/10 text-white/20 text-[10px] tracking-[0.3em] uppercase">
              Created by Yugal Ebook AI • Made in India by Yugal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EbookPreview;
