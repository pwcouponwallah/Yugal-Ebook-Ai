
import React, { useState } from 'react';
import { EbookConfig } from '../types';

interface BookFormProps {
  onSubmit: (config: EbookConfig) => void;
}

const BookForm: React.FC<BookFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<EbookConfig>({
    topic: '',
    niche: '',
    authorName: '',
    targetPages: 35,
    tone: 'Professional'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">📚</span>
        Define Your Ebook
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Ebook Topic</label>
          <input
            required
            type="text"
            name="topic"
            placeholder="e.g. Master React in 30 Days"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            value={formData.topic}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Niche</label>
            <input
              required
              type="text"
              name="niche"
              placeholder="e.g. Programming"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={formData.niche}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tone / Style</label>
            <select
              name="tone"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
              value={formData.tone}
              onChange={handleChange}
            >
              <option value="Professional">Professional</option>
              <option value="Conversational">Conversational</option>
              <option value="Academic">Academic</option>
              <option value="Inspirational">Inspirational</option>
              <option value="Humorous">Humorous</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Author Name</label>
          <input
            required
            type="text"
            name="authorName"
            placeholder="Enter your name or pen name"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            value={formData.authorName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Target Length: <span className="text-indigo-600">{formData.targetPages} Pages</span>
          </label>
          <input
            type="range"
            min="30"
            max="40"
            name="targetPages"
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            value={formData.targetPages}
            onChange={handleChange}
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
            <span>Focused</span>
            <span>Comprehensive</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transform active:scale-[0.98] transition-all"
        >
          Generate Outline & Strategy
        </button>
      </form>
    </div>
  );
};

export default BookForm;
