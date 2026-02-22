
import React, { useState, useEffect } from 'react';
import { FullEbook } from '../types';
import { Printer, BookOpen, Share2, ArrowLeft, FileText, Download, CheckCircle2, Sun, Moon, Coffee, ChevronRight, ChevronLeft } from 'lucide-react';
import Markdown from 'react-markdown';
import { exportToDocx } from '../utils/docxExport';

interface EbookPreviewProps {
  ebook: FullEbook;
  onReset: () => void;
}

type Theme = 'light' | 'dark' | 'sepia';

const EbookPreview: React.FC<EbookPreviewProps> = ({ ebook, onReset }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    if (navigator.share) {
      navigator.share({
        title: ebook.outline.title,
        text: text,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert('Ebook details copied to clipboard!');
    }
  };

  const themeClasses = {
    light: 'bg-white text-slate-900',
    dark: 'bg-slate-900 text-slate-100',
    sepia: 'bg-[#f4ecd8] text-[#5b4636]'
  };

  const proseClasses = {
    light: 'prose-slate',
    dark: 'prose-invert prose-indigo',
    sepia: 'prose-stone'
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses[theme]}`}>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[100] no-print">
        <div 
          className="h-full bg-indigo-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-20 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 no-print">
          <div>
            <h2 className="text-3xl font-display font-bold">Your Masterpiece</h2>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <p className="text-sm opacity-60">Ready for publishing and sale.</p>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50/50 px-3 py-1 rounded-full border border-indigo-100">
                <span>{wordCount.toLocaleString()} Words</span>
                <span className="w-1 h-1 bg-indigo-300 rounded-full"></span>
                <span>{readingTime} Min Read</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Theme Switcher */}
            <div className="flex items-center bg-slate-100/50 p-1 rounded-xl border border-slate-200 mr-2">
              <button 
                onClick={() => setTheme('light')}
                className={`p-2 rounded-lg transition-all ${theme === 'light' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="Light Mode"
              >
                <Sun size={16} />
              </button>
              <button 
                onClick={() => setTheme('sepia')}
                className={`p-2 rounded-lg transition-all ${theme === 'sepia' ? 'bg-[#e8dfc8] shadow-sm text-[#5b4636]' : 'text-slate-400 hover:text-slate-600'}`}
                title="Sepia Mode"
              >
                <Coffee size={16} />
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'bg-slate-800 shadow-sm text-indigo-400' : 'text-slate-400 hover:text-slate-600'}`}
                title="Dark Mode"
              >
                <Moon size={16} />
              </button>
            </div>

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
                  {isExporting ? 'Generating...' : 'DOCX'}
                </>
              )}
            </button>
            <button 
              onClick={handlePrint}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-xl shadow-indigo-100 group"
            >
              <Printer size={18} className="group-hover:scale-110 transition-transform" />
              PDF Masterpiece
            </button>
          </div>
        </div>

        <div className={`shadow-2xl rounded-2xl overflow-hidden min-h-[11in] print:shadow-none border border-black/5 transition-colors duration-300 ${themeClasses[theme]}`}>
          {/* Cover Page */}
          <div className="book-page flex flex-col items-center justify-center min-h-[11in] bg-indigo-900 text-white p-8 md:p-20 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-800 rounded-full opacity-30 blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600 rounded-full opacity-30 blur-3xl"></div>
            
            <div className="relative z-10 w-full flex flex-col items-center">
              <div className="w-16 md:w-20 h-2 bg-indigo-400 mb-8 md:mb-12 rounded-full"></div>
              <h1 className="text-4xl md:text-7xl font-display font-black mb-6 md:mb-8 leading-[1.1] tracking-tight">{ebook.outline.title}</h1>
              <div className="h-0.5 w-32 md:w-40 bg-white/20 mb-8 md:mb-12"></div>
              <p className="text-xl md:text-2xl text-indigo-200 mb-12 md:mb-20 font-serif italic tracking-wide">Essential Wisdom & Practical Mastery</p>
              <div className="flex flex-col items-center">
                <p className="text-[10px] md:text-sm uppercase tracking-[0.4em] text-white/50 mb-3">Authored By</p>
                <p className="text-2xl md:text-3xl font-serif text-white">{ebook.config.authorName}</p>
              </div>
              <div className="mt-20 md:mt-32 pt-10 border-t border-white/10 w-full text-white/30 text-[10px] tracking-[0.3em] font-bold">
                CREATED BY YUGAL EBOOK AI • PREMIUM PUBLISHING 2026
              </div>
              <div className="mt-4 text-white/20 text-[8px] tracking-[0.2em] uppercase">
                Made in India by Yugal
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className={`book-page p-8 md:p-20 min-h-[11in] flex flex-col ${themeClasses[theme]}`}>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-12 md:mb-16 border-b-2 border-current/10 pb-8 tracking-tight">Contents</h2>
            <div className="space-y-4 md:space-y-6 flex-1">
              <div className="flex justify-between items-end border-b border-dotted border-current/20 pb-1 hover:text-indigo-600 transition-colors cursor-pointer">
                <span className="font-bold text-lg md:text-xl font-serif">Introduction</span>
                <span className="opacity-40 font-mono">01</span>
              </div>
              {ebook.chapters.map((chapter, idx) => (
                <div key={idx} className="flex justify-between items-end border-b border-dotted border-current/20 pb-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-indigo-500 mb-1">Chapter {idx + 1}</span>
                    <span className="font-medium text-base md:text-lg font-serif leading-none">{chapter.title}</span>
                  </div>
                  <span className="opacity-40 font-mono">{String(idx + 2).padStart(2, '0')}</span>
                </div>
              ))}
              <div className="flex justify-between items-end border-b border-dotted border-current/20 pb-1">
                <span className="font-bold text-lg md:text-xl font-serif">Final Thoughts</span>
                <span className="opacity-40 font-mono">{String(ebook.chapters.length + 2).padStart(2, '0')}</span>
              </div>
            </div>
            <div className="mt-20 text-center opacity-40 text-[10px] tracking-widest uppercase italic">
              Copyright © 2026 {ebook.config.authorName} • Created by Yugal Ebook AI
            </div>
            <div className="mt-2 text-center opacity-30 text-[8px] tracking-widest uppercase">
              Made in India by Yugal
            </div>
          </div>

          {/* Introduction */}
          <div className={`book-page p-8 md:p-20 min-h-[11in] ${themeClasses[theme]}`}>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-10 md:mb-12 tracking-tight">Introduction</h2>
              <div className={`prose ${proseClasses[theme]} first-letter:text-6xl md:first-letter:text-7xl first-letter:font-bold first-letter:text-indigo-600 first-letter:mr-3 first-letter:float-left`}>
                <Markdown>{ebook.outline.introduction}</Markdown>
              </div>
            </div>
          </div>

          {/* Chapters */}
          {ebook.chapters.map((chapter, idx) => (
            <div key={idx} className={`book-page min-h-[11in] ${themeClasses[theme]}`}>
              {/* Chapter Header Page */}
              <div className="chapter-title-page h-[11in] flex flex-col justify-center items-center text-center p-8 md:p-20 bg-black/5 border-b border-black/5 relative">
                 <div className="absolute top-10 left-10 no-print">
                   <button 
                     onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                     className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2"
                   >
                     <ChevronLeft size={12} /> Back to Cover
                   </button>
                 </div>
                 <div className="text-indigo-600 text-xs md:text-sm font-black uppercase tracking-[0.5em] mb-6">Chapter {idx + 1}</div>
                 <div className="h-1 w-16 md:w-20 bg-indigo-200 mb-8 rounded-full"></div>
                 <h2 className="text-4xl md:text-6xl font-display font-black leading-tight tracking-tighter mb-6">{chapter.title}</h2>
                 <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                   Estimated {Math.ceil(chapter.content.split(/\s+/).length / 200)} Minute Read
                 </div>
              </div>
              
              {/* Chapter Content */}
              <div className="p-8 md:p-20 min-h-[11in]">
                <div className="max-w-3xl mx-auto">
                  <div className={`prose ${proseClasses[theme]}`}>
                    <Markdown>{chapter.content}</Markdown>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Conclusion */}
          <div className="book-page p-8 md:p-20 min-h-[11in] flex flex-col justify-center bg-slate-900 text-white text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-10 md:mb-12 tracking-tight">Final Thoughts</h2>
              <div className="prose prose-invert italic opacity-90">
                <Markdown>{ebook.outline.conclusion}</Markdown>
              </div>
              <div className="mt-16 md:mt-20 h-0.5 w-16 md:w-20 bg-indigo-500 mx-auto"></div>
              <p className="mt-8 md:mt-10 font-display text-xl md:text-2xl">The End</p>
              <div className="mt-16 md:mt-20 pt-10 border-t border-white/10 text-white/20 text-[10px] tracking-[0.3em] uppercase">
                Created by Yugal Ebook AI • Made in India by Yugal
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Scroll to Top */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 p-4 bg-indigo-600 text-white rounded-full shadow-2xl transition-all duration-300 no-print z-50 hover:scale-110 active:scale-95 ${scrollProgress > 10 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <ChevronRight className="-rotate-90" size={24} />
      </button>
    </div>
  );
};

export default EbookPreview;
