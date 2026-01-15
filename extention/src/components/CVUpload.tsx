import { FileText, Upload } from "lucide-react";
import { useState } from "react";
import { extractPdfText } from "../services/pdfService";
import { saveToChrome, removeFromChrome } from "../services/chromeService";

interface CVUploadProps {
  onCVLoaded: (text: string | null) => void;
  cvSaved: boolean;
}

export default function CVUpload({ onCVLoaded, cvSaved }: CVUploadProps) {
  const [extracting, setExtracting] = useState(false);

  const handlePdfUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setExtracting(true);
    try {
      const text = await extractPdfText(file);
      await saveToChrome("cvText", text);
      onCVLoaded(text);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert(`Error reading PDF: ${errorMessage}`);
      console.error(error);
    } finally {
      setExtracting(false);
      // Reset input
      event.target.value = "";
    }
  };

  const handleDeleteCV = async () => {
    if (confirm("Are you sure? This will delete your saved CV.")) {
      try {
        await removeFromChrome("cvText");
        onCVLoaded(null);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        alert(`Error: ${errorMessage}`);
      }
    }
  };

  return (
    <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {!cvSaved ? (
        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2rem] p-8 text-center hover:border-brand-blue/30 hover:bg-white/50 transition-all group">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Resume.pdf</p>
          <label className="inline-block cursor-pointer">
            <input
              type="file"
              accept=".pdf"
              onChange={handlePdfUpload}
              disabled={extracting}
              className="hidden"
            />
            <span className="text-brand-blue text-[13px] font-bold uppercase tracking-[0.1em] cursor-pointer">
              {extracting ? "Processing..." : "Upload New"}
            </span>
          </label>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-[2rem] p-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            {/* Icon Container */}
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center shadow-inner">
              <FileText className="w-4 h-4 text-brand-blue" />
            </div>

            {/* Text and Button Container */}
            <div className="flex flex-col items-start">
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                Your Resume.pdf
              </p>
              <button
                onClick={handleDeleteCV}
                className="text-brand-blue text-[12px] font-bold uppercase hover:underline"
              >
                Upload New
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
