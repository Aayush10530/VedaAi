'use client';

import React, { useState } from 'react';
import { Sparkles, Sliders, MessageSquare, BookOpen, Key, FileText, CheckCircle2, ChevronRight, Award, Info, Beaker } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';

interface AiToolkitPanelProps {
  mode: 'form' | 'result';
  additionalInstructions?: string;
  onApplyInstructions?: (instructions: string) => void;
  onRegenerateWithRules?: (rules: string) => void;
  onToggleAnswerKey?: () => void;
}

export function AiToolkitPanel({
  mode,
  additionalInstructions = '',
  onApplyInstructions,
  onRegenerateWithRules,
  onToggleAnswerKey,
}: AiToolkitPanelProps) {
  const [activeTab, setActiveTab] = useState<'directives' | 'difficulty' | 'pedagogical'>('directives');
  const [easyPercent, setEasyPercent] = useState(30);
  const [modPercent, setModPercent] = useState(50);
  const [hardPercent, setHardPercent] = useState(20);
  const [chatMessage, setChatMessage] = useState('');
  const [showAidsContent, setShowAidsContent] = useState<'rubric' | 'studyGuide' | 'vocab' | null>(null);
  
  const { showToast } = useUiStore();

  const presets = [
    {
      title: '🧪 Focus on Practical Labs',
      prompt: 'Ensure at least 30% of the questions focus on real-world laboratory setups, experiments, safety protocols, and observational biology.',
    },
    {
      title: '📈 CBSE Central Board Format',
      prompt: 'Structure the language, difficulty, and question schemas exactly following the latest CBSE Grade 8 mock exam standards and NCERT guidelines.',
    },
    {
      title: '🧩 Simplify Wording',
      prompt: 'Adjust vocabulary to be easy to comprehend for secondary ESL language learners while preserving technical science terms.',
    },
    {
      title: '🧠 Critical Thinking Focus',
      prompt: 'Incorporate application-based and case-study questions that require analytical thought rather than direct rote memorization.',
    },
  ];

  const handleApplyPreset = (prompt: string) => {
    if (onApplyInstructions) {
      onApplyInstructions(prompt);
      showToast('AI prompt optimization preset applied successfully!', 'success');
    }
  };

  const handleApplyDifficulty = () => {
    const prompt = `Question paper difficulty distribution must be: ${easyPercent}% Easy, ${modPercent}% Moderate, ${hardPercent}% Challenging questions.`;
    if (onApplyInstructions) {
      onApplyInstructions(prompt);
      showToast('Difficulty distribution directive injected!', 'success');
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    if (mode === 'form') {
      if (onApplyInstructions) {
        onApplyInstructions(chatMessage);
        showToast('Instruction added to the prompt context', 'success');
      }
    } else {
      if (onRegenerateWithRules) {
        onRegenerateWithRules(chatMessage);
        showToast('Directing VedaAI to regenerate with rules...', 'success');
      }
    }
    setChatMessage('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-neutral-100 p-5 md:p-6 space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3.5 border-b border-neutral-100">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-orange to-red-500 flex items-center justify-center shadow-inner text-white shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
            AI Teacher's Toolkit
          </h3>
          <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed">
            {mode === 'form' 
              ? 'Optimize prompts & difficulty parameters before generating'
              : 'Access auxiliary grading rubrics, study guides, and fine-tuner controls'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border border-neutral-100 rounded-xl p-1 bg-neutral-50/50">
        <button
          onClick={() => { setActiveTab('directives'); setShowAidsContent(null); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${
            activeTab === 'directives'
              ? 'bg-white shadow-2xs text-neutral-950 font-black'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Presets
        </button>
        <button
          onClick={() => { setActiveTab('difficulty'); setShowAidsContent(null); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${
            activeTab === 'difficulty'
              ? 'bg-white shadow-2xs text-neutral-950 font-black'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" /> Weights
        </button>
        <button
          onClick={() => { setActiveTab('pedagogical'); setShowAidsContent(null); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${
            activeTab === 'pedagogical'
              ? 'bg-white shadow-2xs text-neutral-950 font-black'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Aids
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'directives' && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">Expert Presets</h4>
            <p className="text-[10px] text-neutral-500 leading-normal font-medium">Click a helper capsule to automatically optimize the AI generation directive.</p>
          </div>

          <div className="space-y-2">
            {presets.map((preset, idx) => (
              <div
                key={idx}
                onClick={() => handleApplyPreset(preset.prompt)}
                className="p-3 bg-neutral-50/50 hover:bg-neutral-50 border border-neutral-100 hover:border-neutral-200 rounded-xl transition-all cursor-pointer flex justify-between items-center group"
              >
                <div className="min-w-0 flex-1 space-y-0.5">
                  <h5 className="font-bold text-xs text-neutral-800">{preset.title}</h5>
                  <p className="text-[9px] text-neutral-400 font-medium truncate leading-relaxed">
                    {preset.prompt}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'difficulty' && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">Difficulty Weights</h4>
            <p className="text-[10px] text-neutral-500 leading-normal font-medium">Adjust steppers to set relative weightage for questions. Target must equal 100%.</p>
          </div>

          <div className="space-y-3.5 bg-neutral-50/50 rounded-2xl border border-neutral-100 p-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-neutral-700">
                <span>🟢 Easy Questions</span>
                <span>{easyPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={easyPercent}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setEasyPercent(val);
                  // simple auto balancing logic
                  const rem = 100 - val;
                  setModPercent(Math.round(rem * 0.7));
                  setHardPercent(Math.round(rem * 0.3));
                }}
                className="w-full accent-emerald-500 h-1 bg-neutral-200 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-neutral-700">
                <span>🟡 Moderate Questions</span>
                <span>{modPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={modPercent}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setModPercent(val);
                  const rem = 100 - val;
                  setEasyPercent(Math.round(rem * 0.5));
                  setHardPercent(Math.round(rem * 0.5));
                }}
                className="w-full accent-amber-500 h-1 bg-neutral-200 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-neutral-700">
                <span>🔴 Challenging Questions</span>
                <span>{hardPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={hardPercent}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setHardPercent(val);
                  const rem = 100 - val;
                  setEasyPercent(Math.round(rem * 0.4));
                  setModPercent(Math.round(rem * 0.6));
                }}
                className="w-full accent-red-500 h-1 bg-neutral-200 rounded-lg cursor-pointer"
              />
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-neutral-100 text-[10px] font-bold text-neutral-400">
              <span>Total Distribution: {easyPercent + modPercent + hardPercent}%</span>
              <button
                type="button"
                onClick={handleApplyDifficulty}
                className="bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-1.5 rounded-full text-[9px] shadow hover:shadow-md transition-all active:scale-95"
              >
                Inject Difficulty Guidelines
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pedagogical' && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">
              {mode === 'form' ? 'Pre-formulation Aids' : 'Pedagogical Aids'}
            </h4>
            <p className="text-[10px] text-neutral-500 leading-normal font-medium">
              {mode === 'form' 
                ? 'Generate mock structures or rubrics templates.' 
                : 'Click an aid to instantly overlay generated rubrics, vocabulary references, or study outlines.'}
            </p>
          </div>

          {mode === 'form' ? (
            <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl text-center space-y-2">
              <Info className="w-5 h-5 text-amber-500 mx-auto" />
              <h5 className="font-bold text-xs text-amber-800">Available post-generation</h5>
              <p className="text-[9px] text-amber-600 font-medium leading-relaxed">
                Auxiliary workflows such as Study Outlines, Vocab Guides, and Rubrics will open automatically after you submit and generate the exam sheet.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {/* Answer Key Toggle */}
              <button
                onClick={() => {
                  if (onToggleAnswerKey) onToggleAnswerKey();
                  showToast('Answer Key visibility toggled!', 'success');
                }}
                className="w-full flex items-center justify-between p-3 border border-neutral-200 hover:border-neutral-350 bg-white hover:bg-neutral-50 rounded-xl text-left transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Key className="w-4.5 h-4.5 text-neutral-500" />
                  <span className="text-xs font-bold text-neutral-800">🔑 Toggle Answer Key Visibility</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              {/* Grading Rubric Aid */}
              <button
                onClick={() => setShowAidsContent(showAidsContent === 'rubric' ? null : 'rubric')}
                className={`w-full flex items-center justify-between p-3 border rounded-xl text-left transition-all ${
                  showAidsContent === 'rubric'
                    ? 'border-indigo-400 bg-indigo-50/20'
                    : 'border-neutral-200 hover:border-neutral-350 bg-white hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4.5 h-4.5 text-neutral-500" />
                  <span className="text-xs font-bold text-neutral-800">📝 Create Evaluation Rubric</span>
                </div>
                <ChevronRight className={`w-4 h-4 text-neutral-400 transition-transform ${showAidsContent === 'rubric' ? 'rotate-90' : ''}`} />
              </button>

              {/* Study Guide Outlines */}
              <button
                onClick={() => setShowAidsContent(showAidsContent === 'studyGuide' ? null : 'studyGuide')}
                className={`w-full flex items-center justify-between p-3 border rounded-xl text-left transition-all ${
                  showAidsContent === 'studyGuide'
                    ? 'border-emerald-400 bg-emerald-50/20'
                    : 'border-neutral-200 hover:border-neutral-350 bg-white hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4.5 h-4.5 text-neutral-500" />
                  <span className="text-xs font-bold text-neutral-800">📚 Generate Student Study Outline</span>
                </div>
                <ChevronRight className={`w-4 h-4 text-neutral-400 transition-transform ${showAidsContent === 'studyGuide' ? 'rotate-90' : ''}`} />
              </button>

              {/* Vocabulary References */}
              <button
                onClick={() => setShowAidsContent(showAidsContent === 'vocab' ? null : 'vocab')}
                className={`w-full flex items-center justify-between p-3 border rounded-xl text-left transition-all ${
                  showAidsContent === 'vocab'
                    ? 'border-purple-400 bg-purple-50/20'
                    : 'border-neutral-200 hover:border-neutral-350 bg-white hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Beaker className="w-4.5 h-4.5 text-neutral-500" />
                  <span className="text-xs font-bold text-neutral-800">🧪 Generate Lab Activity Sheet</span>
                </div>
                <ChevronRight className={`w-4 h-4 text-neutral-400 transition-transform ${showAidsContent === 'vocab' ? 'rotate-90' : ''}`} />
              </button>
            </div>
          )}

          {/* Aids Mockup Content Rendering */}
          {showAidsContent === 'rubric' && (
            <div className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100 space-y-2.5 animate-in slide-in-from-top-2 duration-200">
              <h5 className="font-bold text-xs text-indigo-900 flex items-center gap-1">
                🏆 Generated Evaluation Rubric
              </h5>
              <div className="text-[10px] text-neutral-600 space-y-1.5 leading-relaxed font-medium">
                <p><strong>Criteria 1 (Concept Comprehension) [40%]:</strong> Student correctly identifies core definitions and states functions.</p>
                <p><strong>Criteria 2 (Practical Application) [40%]:</strong> Applies concepts to chemistry/physics problem models.</p>
                <p><strong>Criteria 3 (Nomenclature & Math Accuracy) [20%]:</strong> Accurate notations, decimal placements, and labels.</p>
              </div>
            </div>
          )}

          {showAidsContent === 'studyGuide' && (
            <div className="p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100 space-y-2.5 animate-in slide-in-from-top-2 duration-200">
              <h5 className="font-bold text-xs text-emerald-900 flex items-center gap-1">
                📖 Secondary Student Study Guide
              </h5>
              <div className="text-[10px] text-neutral-600 space-y-2 leading-relaxed font-medium">
                <p><strong>Summary Core Concepts:</strong> 1. Electroplating fundamentals. 2. Circuit continuity & chemical shifts. 3. Solid vs liquid conduction differences.</p>
                <p><strong>Recommended Study Sequence:</strong> Review CBSE NCERT Chapter 3 examples, attempt mock quiz, memorize ion transfers.</p>
              </div>
            </div>
          )}

          {showAidsContent === 'vocab' && (
            <div className="p-4 bg-purple-50/30 rounded-2xl border border-purple-100 space-y-2.5 animate-in slide-in-from-top-2 duration-200">
              <h5 className="font-bold text-xs text-purple-900 flex items-center gap-1">
                🧪 Class Practical Extension Activity
              </h5>
              <div className="text-[10px] text-neutral-600 space-y-2 leading-relaxed font-medium">
                <p><strong>Laboratory Setup:</strong> Set up a small copper plating bath (Copper Sulfate solution, copper anode, iron nail cathode). Apply 4.5V DC power for 15 minutes.</p>
                <p><strong>Classroom Questions:</strong> Observe mass shifts on iron cathodes. Detail color changes from deep blue to turquoise.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active AI Prompt Chat box */}
      <form onSubmit={handleSendChat} className="pt-3 border-t border-neutral-100 space-y-2">
        <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block">
          ✦ Direct AI Refinement
        </label>
        <div className="flex items-center gap-2 border border-neutral-200 rounded-full px-3.5 py-1.5 bg-neutral-50 focus-within:border-neutral-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-neutral-100 transition-all">
          <MessageSquare className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            placeholder={
              mode === 'form'
                ? 'Tweak AI parameters...'
                : 'Instruct AI to rewrite or tweak result...'
            }
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            className="text-xs outline-none bg-transparent flex-1 text-neutral-800 placeholder-neutral-400 min-w-0"
          />
          <button
            type="submit"
            disabled={!chatMessage.trim()}
            className="bg-neutral-900 text-white p-1 rounded-full hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
