import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { AnalysisResult } from "../types/index";

interface ResultsProps {
  data: AnalysisResult;
  onReset: () => void;
}

export default function Results({ data, onReset }: ResultsProps) {
  const { matchPercentage, matchingSkills, missingSkills, emailDraft } = data;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(emailDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SVG Progress Circle Math
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - (matchPercentage || 0) / 100);

  return (
    <div className="space-y-6 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Match Score & Progress */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="relative w-24 h-24 mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-50"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="text-brand-orange transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[18px] font-semibold text-slate-700">{matchPercentage}%</span>
          </div>
        </div>
        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.1em]">Profile Match</p>
      </div>

      {/* Matching Skills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[12px] font-bold text-slate-700">Matching Skills</h3>
          <span className="bg-green-100 text-green-600 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase">{matchingSkills.length} Found</span>
        </div>
        <div className="flex flex-wrap gap-2 px-1">
          {matchingSkills.length > 0 ? ( // Fixed: Replaced () with { and added (
            matchingSkills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-green-50 text-green-700 px-4 py-2 rounded-2xl text-[11px] font-semibold border border-green-100/50 shadow-sm"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-[10px] text-slate-400 font-medium px-2">No matching skills found</p>
          )}
        </div>
      </div>

      {/* Missing Skills */}
      {missingSkills.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[12px] font-bold text-slate-700">Missing Skills</h3>
            <span className="bg-rose-100 text-rose-500 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase">{missingSkills.length} Gaps</span>
          </div>
          <div className="flex flex-wrap gap-2 px-1">
            {missingSkills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-rose-50 text-rose-600 px-4 py-2 rounded-2xl text-[10px] font-semibold border border-rose-100/50 shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Email Draft Section */}
      <div className="bg-slate-900 rounded-[2.5rem] p-6 shadow-lg border border-slate-800 relative group overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <p className="text-brand-orange text-[10px] font-extrabold uppercase tracking-[0.2em]">Email Opportunity Draft</p>
          <button
            onClick={handleCopy}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <div className="max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-[11px] text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
            {emailDraft}
          </p>
        </div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Reset Button */}
      <div className="pt-2">
        <button
          onClick={onReset}
          className="w-full bg-brand-orange hover:bg-orange-600 text-white text-[14px] font-bold py-4 px-4 rounded-[2rem] transition-all  tracking-[0.1em]"
        >
          Start New Analysis
        </button>
      </div>
    </div>
  );
}