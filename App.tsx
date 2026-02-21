
import React, { useState } from 'react';
import { AppStep, EbookConfig, EbookOutline, ChapterContent, FullEbook } from './types';
import { generateOutline, generateChapterContent } from './services/geminiService';
import BookForm from './components/BookForm';
import StepIndicator from './components/StepIndicator';
import EbookPreview from './components/EbookPreview';
import { Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.CONFIG);
  const [config, setConfig] = useState<EbookConfig | null>(null);
  const [outline, setOutline] = useState<EbookOutline | null>(null);
  const [fullEbook, setFullEbook] = useState<FullEbook | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [genStatus, setGenStatus] = useState({
    totalChapters: 0,
    currentChapter: 0,
    currentTitle: '',
    isWriting: false
  });

  const handleConfigSubmit = async (data: EbookConfig) => {
    setConfig(data);
    setError(null);
    setStep(AppStep.OUTLINING);
    
    try {
      const result = await generateOutline(data);
      setOutline(result);
    } catch (err: any) {
      console.error(err);
      setError("Failed to create the book outline. Please check your API key and connection.");
      setStep(AppStep.CONFIG);
    }
  };

  const startWriting = async () => {
    if (!outline || !config) return;
    
    setStep(AppStep.GENERATING);
    setGenStatus({
      totalChapters: outline.chapters.length,
      currentChapter: 1,
      currentTitle: outline.chapters[0].title,
      isWriting: true
    });

    const completedChapters: ChapterContent[] = [];
    
    try {
      for (let i = 0; i < outline.chapters.length; i++) {
        const chapter = outline.chapters[i];
        setGenStatus(prev => ({ 
          ...prev, 
          currentChapter: i + 1,
          currentTitle: chapter.title
        }));
        
        const content = await generateChapterContent(config, chapter, outline);
        completedChapters.push({
          title: chapter.title,
          content: content
        });
      }

      setFullEbook({
        config,
        outline,
        chapters: completedChapters
      });
      setStep(AppStep.PREVIEW);
    } catch (err) {
      console.error(err);
      setError("Something went wrong during the writing phase. The generation may have timed out.");
      setStep(AppStep.OUTLINING);
    } finally {
      setGenStatus(prev => ({ ...prev, isWriting: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 overflow-x-hidden">
      {/* Premium Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 py-4 mb-8 no-print">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-100 group transition-all">
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 leading-tight tracking-tight">YUGAL EBOOK AI</h1>
              <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-black">Digital Publishing Platform</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
            Powered by Gemini 3 Pro
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        <div className="no-print mb-12">
          <StepIndicator currentStep={step} />
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {/* Step: CONFIG */}
        {step === AppStep.CONFIG && <BookForm onSubmit={handleConfigSubmit} />}

        {/* Step: OUTLINING */}
        {step === AppStep.OUTLINING && (
          <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            {!outline ? (
              <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm border border-slate-200">
                <Loader2 className="animate-spin mx-auto text-indigo-600 mb-6" size={56} strokeWidth={1.5} />
                <h3 className="text-2xl font-display font-bold text-slate-800">Architecting Your Ebook...</h3>
                <p className="text-slate-400 mt-2 max-w-sm mx-auto">Analyzing niche strategy, logical flow, and monetization potential.</p>
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100">
                <div className="mb-10 text-center">
                  <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">Proposed Masterpiece</span>
                  <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">{outline.title}</h2>
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-widest">{config?.niche}</span>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest">{config?.tone} Style</span>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Logical Chapters</h3>
                    <div className="space-y-3">
                      {outline.chapters.map((ch, idx) => (
                        <div key={idx} className="group p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all cursor-default">
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black shrink-0">{idx + 1}</span>
                            <div>
                                <div className="font-bold text-slate-800 text-sm">{ch.title}</div>
                                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{ch.summary}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Publishing Strategy</h3>
                    <div className="p-6 bg-indigo-600 rounded-[2rem] text-white">
                        <h4 className="font-display text-xl font-bold mb-4">Market Readiness</h4>
                        <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                            This outline is structured to guide the reader from beginner foundations to advanced implementation, maximizing customer satisfaction and positive reviews.
                        </p>
                        <ul className="space-y-3">
                            {['SEO Optimized Structure', 'Problem-Solution Oriented', 'Actionable Conclusions'].map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-xs font-bold">
                                    <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={() => setStep(AppStep.CONFIG)}
                        className="flex-1 px-8 py-5 border border-slate-200 text-slate-500 rounded-2xl hover:bg-slate-50 transition-all font-bold uppercase tracking-widest text-xs"
                    >
                        Adjust Concept
                    </button>
                    <button 
                        onClick={startWriting}
                        className="flex-[2] px-8 py-5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                    >
                        Confirm & Begin Ghostwriting
                        <Sparkles size={16} />
                    </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step: GENERATING */}
        {step === AppStep.GENERATING && (
          <div className="max-w-2xl mx-auto text-center py-24 bg-white rounded-[3rem] shadow-2xl border border-slate-100 px-10 animate-in fade-in zoom-in-95">
            <div className="relative inline-block mb-12">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-10 animate-pulse"></div>
                <div className="w-40 h-40 rounded-full border-[6px] border-slate-50 flex items-center justify-center overflow-hidden relative shadow-inner">
                    <div 
                        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-indigo-700 to-indigo-500 transition-all duration-1000 ease-in-out"
                        style={{ height: `${(genStatus.currentChapter / genStatus.totalChapters) * 100}%` }}
                    />
                    <div className="relative z-10 flex flex-col items-center">
                        <span className="text-4xl font-black text-slate-800 tracking-tighter">
                            {Math.round((genStatus.currentChapter / genStatus.totalChapters) * 100)}%
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                    </div>
                </div>
            </div>
            
            <h3 className="text-3xl font-display font-black text-slate-900 mb-3">Ghostwriting Chapter {genStatus.currentChapter}</h3>
            <p className="text-indigo-600 font-bold mb-6 italic">"{genStatus.currentTitle}"</p>
            <p className="text-slate-400 max-w-sm mx-auto mb-10 text-sm leading-relaxed">
                The AI is synthesizing specialized knowledge, structuring chapters, and applying professional formatting for your sellable ebook.
            </p>
            
            <div className="flex flex-col gap-4 max-w-xs mx-auto text-left">
                {[
                  'Synthesizing deep-domain insights...',
                  'Formatting headers and typography...',
                  'Crafting actionable summaries...'
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className={`w-2 h-2 rounded-full ${i < 2 ? 'bg-emerald-500' : 'bg-indigo-500 animate-ping'}`}></div>
                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{text}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Step: PREVIEW */}
        {step === AppStep.PREVIEW && fullEbook && (
          <EbookPreview 
            ebook={fullEbook} 
            onReset={() => {
                if(confirm("Are you sure? You'll lose this generated ebook.")) {
                    setFullEbook(null);
                    setOutline(null);
                    setStep(AppStep.CONFIG);
                }
            }} 
          />
        )}
      </main>

      {/* Footer Branding */}
      <footer className="mt-24 border-t border-slate-200/50 py-12 text-center no-print">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center text-slate-500 font-bold text-sm mb-4 grayscale opacity-50">Y</div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">© 2026 Yugal Ebook AI • Created by Yugal Ebook AI</p>
            <p className="mt-2 text-slate-300 text-[9px] uppercase tracking-widest">Made in India by Yugal</p>
            <p className="mt-4 text-slate-300 text-[10px] max-w-xs mx-auto">Create high-quality, actionable, and sellable content with the power of world-class AI ghostwriting.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
