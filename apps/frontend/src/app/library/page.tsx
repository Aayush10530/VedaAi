'use client';

import React, { useState } from 'react';
import { FolderHeart, FileText, UploadCloud, Search, Trash2, Download, Eye, ExternalLink, Plus, BookOpen } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';

interface LibraryResource {
  id: string;
  title: string;
  category: 'template' | 'qbank' | 'pdf' | 'draft';
  addedDate: string;
  description: string;
  size?: string;
}

const INITIAL_RESOURCES: LibraryResource[] = [];

export default function MyLibraryPage() {
  const [resources, setResources] = useState<LibraryResource[]>(INITIAL_RESOURCES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'template' | 'qbank' | 'pdf' | 'draft'>('all');
  const [showUploadZone, setShowUploadZone] = useState(false);
  const { showToast } = useUiStore();

  const handleCreateResource = () => {
    showToast('Add new structural template flow triggered!', 'success');
  };

  const handleDelete = (id: string) => {
    setResources(resources.filter((r) => r.id !== id));
    showToast('Resource removed from your library', 'success');
  };

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedCategory === 'all') return matchesSearch;
    return r.category === selectedCategory && matchesSearch;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'template':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'qbank':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'pdf':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'draft':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-100';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'template':
        return 'Exam Template';
      case 'qbank':
        return 'Question Bank';
      case 'pdf':
        return 'Reference PDF';
      case 'draft':
        return 'Draft Paper';
      default:
        return 'Resource';
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="w-2 h-2 rounded-full bg-emerald-500 absolute" />
        <h1 className="text-lg font-black text-neutral-900 leading-none pl-2.5">My Library</h1>
      </div>
      <p className="text-xs text-neutral-500 -mt-4 pl-4.5 font-semibold">
        Your digital resource vault. Store reusable templates, reference guides, question pools, and drafts.
      </p>

      {/* Filter and Top controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`text-xs font-bold px-4 py-2 border rounded-full transition-all duration-300 shadow-sm active:scale-95 ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 border-neutral-950 text-white'
                : 'border-white/40 bg-white/40 text-neutral-600 hover:bg-white/70'
            }`}
          >
            All Resources
          </button>
          <button
            onClick={() => setSelectedCategory('template')}
            className={`text-xs font-bold px-4 py-2 border rounded-full transition-all duration-300 shadow-sm active:scale-95 ${
              selectedCategory === 'template'
                ? 'bg-blue-550 bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-600 text-white'
                : 'border-white/40 bg-white/40 text-neutral-600 hover:bg-white/70'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setSelectedCategory('qbank')}
            className={`text-xs font-bold px-4 py-2 border rounded-full transition-all duration-300 shadow-sm active:scale-95 ${
              selectedCategory === 'qbank'
                ? 'bg-emerald-550 bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-600 text-white'
                : 'border-white/40 bg-white/40 text-neutral-600 hover:bg-white/70'
            }`}
          >
            Question Pools
          </button>
          <button
            onClick={() => setSelectedCategory('pdf')}
            className={`text-xs font-bold px-4 py-2 border rounded-full transition-all duration-300 shadow-sm active:scale-95 ${
              selectedCategory === 'pdf'
                ? 'bg-purple-550 bg-gradient-to-r from-purple-500 to-pink-500 border-purple-600 text-white'
                : 'border-white/40 bg-white/40 text-neutral-600 hover:bg-white/70'
            }`}
          >
            PDF References
          </button>
          <button
            onClick={() => setSelectedCategory('draft')}
            className={`text-xs font-bold px-4 py-2 border rounded-full transition-all duration-300 shadow-sm active:scale-95 ${
              selectedCategory === 'draft'
                ? 'bg-amber-550 bg-gradient-to-r from-amber-500 to-orange-500 border-amber-600 text-white'
                : 'border-white/40 bg-white/40 text-neutral-600 hover:bg-white/70'
            }`}
          >
            Drafts
          </button>
        </div>

        <div className="flex items-center gap-3 w-full xl:w-auto">
          <div className="flex items-center gap-2 border border-white/30 rounded-full px-4 py-2 bg-white/30 backdrop-blur-md flex-1 xl:w-64 focus-within:border-brand-orange/40 focus-within:ring-4 focus-within:ring-orange-500/5 transition-all duration-300 shadow-sm">
            <Search className="w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search library resources"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs outline-none flex-1 text-neutral-800 placeholder-neutral-400 bg-transparent"
            />
          </div>

          <button
            onClick={() => setShowUploadZone(!showUploadZone)}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-orange to-red-500 hover:from-orange-600 hover:to-red-650 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow hover:scale-[1.02] active:scale-95 transition-all duration-300 whitespace-nowrap"
          >
            <UploadCloud className="w-4 h-4" /> Upload Reference
          </button>
        </div>
      </div>

      {/* Upload Zone Dropdown */}
      {showUploadZone && (
        <div className="glass-card rounded-2xl border-2 border-dashed border-white/60 p-8 text-center shadow-lg animate-fade-in-up">
          <UploadCloud className="w-8 h-8 text-[#E8521A] mx-auto mb-3 animate-bounce" />
          <p className="text-xs font-bold text-neutral-800">Drag & Drop reference textbook pages or materials here</p>
          <p className="text-[10px] text-neutral-400 mt-1 font-semibold">Accepts PDF, TXT or Markdown up to 10MB</p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => {
                setShowUploadZone(false);
                showToast('Reference file uploaded & added to library!', 'success');
              }}
              className="px-5 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-full shadow hover:bg-neutral-800 transition-all duration-300 active:scale-95"
            >
              Browse Files
            </button>
            <button
              onClick={() => setShowUploadZone(false)}
              className="px-4 py-2 border border-white/40 bg-white/20 text-neutral-700 text-xs font-semibold rounded-full hover:bg-white/40 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Library Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="glass-card-hover rounded-2xl border border-white/50 shadow-sm p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-md ${getCategoryColor(resource.category)}`}>
                  {getCategoryLabel(resource.category)}
                </span>
                {resource.size && (
                  <span className="text-[10px] text-neutral-400 font-bold">
                    {resource.size}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-neutral-950 text-sm mt-3 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-neutral-450" /> {resource.title}
              </h3>
              <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed font-semibold">
                {resource.description}
              </p>
            </div>

            <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-white/30">
              <span className="text-[10px] text-neutral-400 font-bold">
                ADDED: {resource.addedDate}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => showToast('Preview loading...', 'success')}
                  className="p-2 hover:bg-white/60 border border-white/30 rounded-full text-neutral-600 hover:text-neutral-900 transition-colors"
                  title="View Details"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => showToast('Resource downloaded!', 'success')}
                  className="p-2 hover:bg-white/60 border border-white/30 rounded-full text-neutral-600 hover:text-neutral-900 transition-colors"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(resource.id)}
                  className="p-2 hover:bg-red-50/50 border border-red-100 rounded-full text-red-500 hover:text-red-700 transition-colors"
                  title="Delete Resource"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredResources.length === 0 && (
          <div className="col-span-1 md:col-span-2 glass-card rounded-2xl border border-white/50 p-12 text-center space-y-4 shadow-lg max-w-md mx-auto mt-6 animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto text-indigo-650 shadow-inner">
              <FolderHeart className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="font-bold text-lg text-neutral-800">Your Resource Vault</h3>
            <p className="text-xs text-neutral-450 font-bold max-w-sm mx-auto leading-relaxed">
              Store syllabus books, custom exam templates, reference PDFs, and question pools to customize AI paper generation in seconds.
            </p>
            <button
              onClick={() => setShowUploadZone(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-brand-orange to-red-500 hover:from-orange-600 hover:to-red-650 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow hover:scale-[1.02] active:scale-95 transition-all duration-300 mx-auto"
            >
              <UploadCloud className="w-4 h-4" /> Upload Reference
            </button>
          </div>
        )}
      </div>

      {/* Direct Add Card Action */}
      <div className="rounded-2xl bg-gradient-to-r from-neutral-900/90 to-brand-dark/95 backdrop-blur-md p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 shadow-lg border border-white/10">
        <div>
          <h4 className="font-bold text-sm flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-450 animate-pulse" /> Need custom-structured exams?
          </h4>
          <p className="text-xs text-neutral-300 mt-1 font-semibold">
            Save custom layouts and exam outlines directly to templates. You can mix & match question matrices.
          </p>
        </div>
        <button
          onClick={handleCreateResource}
          className="flex items-center justify-center gap-1.5 bg-white text-neutral-950 text-xs font-bold px-4 py-2.5 rounded-full hover:bg-neutral-100 transition-all duration-300 active:scale-95 whitespace-nowrap shadow-md hover:scale-[1.02]"
        >
          <Plus className="w-3.5 h-3.5" /> Create Exam Template
        </button>
      </div>
    </div>
  );
}
