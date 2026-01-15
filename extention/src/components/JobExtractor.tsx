import { Briefcase, Loader } from "lucide-react";
import { useState } from "react";
import { extractPageText } from "../services/chromeService";

interface JobExtractorProps {
  onJobExtracted: (text: string) => void;
  onAnalyze: (jobText: string) => Promise<void>;
  analyzing: boolean;
}

export default function JobExtractor({
  onJobExtracted,
  onAnalyze,
  analyzing,
}: JobExtractorProps) {
  const [extracting, setExtracting] = useState(false);
  const [jobText, setJobText] = useState<string>("");

  const handleScanPage = async () => {
    setExtracting(true);
    try {
      const text = await extractPageText();
      setJobText(text);
      onJobExtracted(text);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert(`Error: ${errorMessage}`);
      console.error(error);
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-600">
      {!jobText ? (
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
            <Briefcase className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-[10px] text-slate-400 font-semibold  mb-4">
            Scanner active, Navigate to a job post.
          </p>
          <button
            onClick={handleScanPage}
            disabled={extracting}
            className="w-full bg-slate-900 border border-slate-800 hover:bg-black text-white text-[12px] font-bold uppercase tracking-[0.1em] cursor-pointer py-3.5 px-6 rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {extracting ? (
              <>
                <Loader className="w-4 h-4 animate-spin text-brand-orange" />
                Scanning...
              </>
            ) : (
              "Scan Page"
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3 relative z-10">
              <p className="text-zinc-500 text-[11px] font-bold  tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse shadow-sm shadow-orange-200"></span>
                Extracted
              </p>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium mb-1 relative z-10">
              {jobText.substring(0, 150)}...
            </p>
            {/* Subtle background graphic */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
          </div>

          <button
            onClick={() => onAnalyze(jobText)}
            disabled={analyzing}
            className="w-full bg-brand-orange hover:bg-orange-600 text-white text-[12px] font-bold py-4 px-6 rounded-[2rem] shadow-lg shadow-orange-100 transition-all disabled:opacity-50 "
          >
            {analyzing ? "Thinking..." : "Analyze Match"}
          </button>
        </div>
      )}
    </div>
  );
}
