import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LabResultsUploaderProps {
  onUpload: (file: File) => Promise<boolean>;
  uploading: boolean;
}

export function LabResultsUploader({ onUpload, uploading }: LabResultsUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [lastUpload, setLastUpload] = useState<string | null>(null);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      const success = await onUpload(file);
      if (success) {
        setLastUpload(file.name);
      }
    }
  }, [onUpload]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const success = await onUpload(file);
      if (success) {
        setLastUpload(file.name);
      }
    }
  }, [onUpload]);

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-sm border border-border/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-eucalyptus-muted flex items-center justify-center">
          <FileText className="w-5 h-5 text-eucalyptus" />
        </div>
        <div>
          <h3 className="font-medium text-foreground">AI Blood Analyzer</h3>
          <p className="text-sm text-muted-foreground">Upload your lab results for instant analysis</p>
        </div>
      </div>

      <label
        htmlFor="lab-upload"
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`
          block border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
          ${dragOver 
            ? "border-eucalyptus bg-eucalyptus-muted scale-[1.02]" 
            : "border-border hover:border-eucalyptus/50 hover:bg-eucalyptus/5"
          }
          ${uploading ? "pointer-events-none opacity-50" : ""}
        `}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-eucalyptus animate-spin" />
            <p className="text-sm text-muted-foreground">Analyzing with Claude AI...</p>
          </div>
        ) : lastUpload ? (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle className="w-10 h-10 text-success" />
            <p className="text-sm text-foreground font-medium">Uploaded: {lastUpload}</p>
            <p className="text-xs text-muted-foreground">Drop another file or click to upload more</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-eucalyptus/10 flex items-center justify-center">
              <Upload className="w-7 h-7 text-eucalyptus" />
            </div>
            <div>
              <p className="font-medium text-foreground">Drop your lab results here</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
            </div>
            <p className="text-xs text-muted-foreground/70">PDF, PNG, JPG supported</p>
          </div>
        )}
      </label>

      <input
        type="file"
        id="lab-upload"
        className="hidden"
        accept=".pdf,image/*"
        onChange={handleFileSelect}
        disabled={uploading}
      />

      <Button
        variant="outline"
        className="w-full mt-4 rounded-xl"
        onClick={() => document.getElementById("lab-upload")?.click()}
        disabled={uploading}
      >
        <Upload className="w-4 h-4 mr-2" />
        Select File
      </Button>
    </motion.div>
  );
}
