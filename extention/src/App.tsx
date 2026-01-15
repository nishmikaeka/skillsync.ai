import { useState, useEffect } from "react";
import CVUpload from "./components/CVUpload";
import JobExtractor from "./components/JobExtractor";
import Results from "./components/Results";
import { getFromChrome, analyzeWithBackend } from "./services/chromeService";
import type { AnalysisResult } from "./types/index";
import "./App.css";

export default function App() {
  const [cvText, setCvText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load CV from storage on mount
  useEffect(() => {
    const loadCV = async () => {
      try {
        const savedCV = await getFromChrome("cvText");
        if (savedCV) {
          setCvText(savedCV);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error("Failed to load CV:", errorMessage);
      }
    };

    loadCV();
  }, []);

  const handleAnalyze = async (jobDescription: string): Promise<void> => {
    if (!cvText) {
      setError("Please upload your CV first");
      return;
    }

    setLoading(true);
    setResults(null);
    setError(null);

    try {
      const analysisResults = await analyzeWithBackend(cvText, jobDescription);
      setResults(analysisResults);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Analysis error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (): void => {
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="pb-3 border-b border-slate-100 mb-3 flex items-center justify-center">
          <div>
            <h1 className="text-[14px] font-bold tracking-tight text-gradient-gray-purple">SkillSync.Ai</h1>
            <p className="text-[9px] text-slate-400 font-semibold text-center tracking-wider">
              Profile Matcher
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3 mb-4">
            <p className="text-rose-600 text-[10px] font-bold">Error: {error}</p>
          </div>
        )}

        {/* Results Section */}
        {results && <Results data={results} onReset={handleReset} />}

        {/* CV Upload */}
        {!results && (
          <CVUpload onCVLoaded={setCvText} cvSaved={cvText !== null} />
        )}

        {/* Job Extractor */}
        {!results && cvText && (
          <JobExtractor
            onJobExtracted={() => { }}
            onAnalyze={handleAnalyze}
            analyzing={loading}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className="py-10 text-center">
            <div className="relative inline-block">
              <div className="w-10 h-10 border-2 border-slate-100 rounded-full"></div>
              <div className="absolute top-0 left-0 w-10 h-10 border-2 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-[9px] text-slate-400 font-bold  tracking-[0.1em]">
              Analyzing Profile
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
