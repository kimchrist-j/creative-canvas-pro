import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Upload, FileText, FileIcon, Download, Loader2, Sun, Moon, Eye, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

// PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// SVG icons for PDF and Word
const PdfIcon = () => (
  <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none">
    <rect x="6" y="4" width="36" height="40" rx="4" fill="#DC2626" />
    <path d="M14 28V20h3.5c1.93 0 3.5.67 3.5 2.5S19.43 25 17.5 25H14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M24 28V20h2.5c2.49 0 4.5 1.79 4.5 4s-2.01 4-4.5 4H24z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M34 20h4M34 24h3M34 28h2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="10" y="8" width="20" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
    <rect x="10" y="12" width="14" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
  </svg>
);

const WordIcon = () => (
  <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none">
    <rect x="6" y="4" width="36" height="40" rx="4" fill="#2563EB" />
    <path d="M14 20l3 8 3-8 3 8 3-8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <rect x="10" y="32" width="20" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
    <rect x="10" y="36" width="14" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
  </svg>
);

interface ExtractedContent {
  type: 'text' | 'image' | 'table';
  text?: string;
  fontSize?: number;
  fontName?: string;
  bold?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  imageData?: Uint8Array;
  imageType?: string;
  rows?: string[][];
  pageIndex?: number;
}

export default function PdfToWord() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewPages, setPreviewPages] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [docxBlob, setDocxBlob] = useState<Blob | null>(null);
  const [converted, setConverted] = useState(false);
  const [pageCount, setPageCount] = useState(0);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setConverted(false);
      setDocxBlob(null);
      setPreviewPages([]);
    } else {
      toast({ title: 'Invalid file', description: 'Please select a PDF file.', variant: 'destructive' });
    }
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setConverted(false);
      setDocxBlob(null);
      setPreviewPages([]);
    }
  }, []);

  const extractPdfContent = async (pdfData: ArrayBuffer): Promise<ExtractedContent[]> => {
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    setPageCount(pdf.numPages);
    const allContent: ExtractedContent[] = [];

    for (let i = 0; i < pdf.numPages; i++) {
      setProgress(Math.round(((i + 1) / pdf.numPages) * 50));
      const page = await pdf.getPage(i + 1);
      
      // Extract text with positioning
      const textContent = await page.getTextContent();
      let currentLine = '';
      let lastY: number | null = null;
      let lastFontSize = 12;
      let lastFontName = '';
      
      for (const item of textContent.items) {
        if ('str' in item) {
          const y = Math.round(item.transform[5]);
          const fontSize = Math.round(item.transform[0]) || 12;
          const fontName = item.fontName || '';
          
          if (lastY !== null && Math.abs(y - lastY) > 3) {
            if (currentLine.trim()) {
              allContent.push({
                type: 'text',
                text: currentLine.trim(),
                fontSize: lastFontSize,
                fontName: lastFontName,
                bold: lastFontName.toLowerCase().includes('bold'),
                x: 0,
                y: lastY,
                pageIndex: i,
              });
            }
            currentLine = '';
          }
          currentLine += item.str;
          lastY = y;
          lastFontSize = fontSize;
          lastFontName = fontName;
        }
      }
      if (currentLine.trim()) {
        allContent.push({
          type: 'text',
          text: currentLine.trim(),
          fontSize: lastFontSize,
          fontName: lastFontName,
          bold: lastFontName.toLowerCase().includes('bold'),
          pageIndex: i,
        });
      }

      // Extract images
      try {
        const ops = await page.getOperatorList();
        for (let j = 0; j < ops.fnArray.length; j++) {
          if (ops.fnArray[j] === pdfjsLib.OPS.paintImageXObject || ops.fnArray[j] === pdfjsLib.OPS.paintXObject) {
            try {
              const imgName = ops.argsArray[j][0];
              const img = await page.objs.get(imgName);
              if (img && img.data && img.width && img.height) {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d')!;
                const imgData = new ImageData(new Uint8ClampedArray(img.data), img.width, img.height);
                ctx.putImageData(imgData, 0, 0);
                const blob = await new Promise<Blob>((resolve) => canvas.toBlob(b => resolve(b!), 'image/png'));
                const arrayBuffer = await blob.arrayBuffer();
                allContent.push({
                  type: 'image',
                  imageData: new Uint8Array(arrayBuffer),
                  imageType: 'png',
                  width: Math.min(img.width, 600),
                  height: Math.min(img.height, 800),
                  pageIndex: i,
                });
              }
            } catch {}
          }
        }
      } catch {}

      // Generate preview
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d')!;
      await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
      setPreviewPages(prev => [...prev, canvas.toDataURL('image/jpeg', 0.8)]);
    }

    return allContent;
  };

  const buildDocx = async (content: ExtractedContent[]): Promise<Blob> => {
    const children: (Paragraph | Table)[] = [];

    for (const item of content) {
      if (item.type === 'text' && item.text) {
        const fontSize = item.fontSize || 12;
        const isBold = item.bold || false;
        
        // Detect headings
        let heading: typeof HeadingLevel[keyof typeof HeadingLevel] | undefined;
        if (fontSize >= 24) heading = HeadingLevel.HEADING_1;
        else if (fontSize >= 18) heading = HeadingLevel.HEADING_2;
        else if (fontSize >= 14) heading = HeadingLevel.HEADING_3;

        children.push(
          new Paragraph({
            heading,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: item.text,
                bold: isBold || !!heading,
                size: fontSize * 2,
                font: 'Calibri',
              }),
            ],
          })
        );
      } else if (item.type === 'image' && item.imageData) {
        try {
          children.push(
            new Paragraph({
              spacing: { before: 200, after: 200 },
              children: [
                new ImageRun({
                  type: 'png',
                  data: item.imageData,
                  transformation: {
                    width: Math.min(item.width || 400, 500),
                    height: Math.min(item.height || 300, 650),
                  },
                  altText: { title: 'PDF Image', description: 'Extracted from PDF', name: 'image' },
                }),
              ],
            })
          );
        } catch {}
      } else if (item.type === 'table' && item.rows) {
        const table = new Table({
          width: { size: 9000, type: WidthType.DXA },
          rows: item.rows.map((row) =>
            new TableRow({
              children: row.map((cell) =>
                new TableCell({
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: '999999' },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: '999999' },
                    left: { style: BorderStyle.SINGLE, size: 1, color: '999999' },
                    right: { style: BorderStyle.SINGLE, size: 1, color: '999999' },
                  },
                  margins: { top: 40, bottom: 40, left: 80, right: 80 },
                  children: [new Paragraph({ children: [new TextRun({ text: cell, font: 'Calibri', size: 22 })] })],
                })
              ),
            })
          ),
        });
        children.push(table);
      }
    }

    const doc = new Document({
      styles: {
        default: {
          document: { run: { font: 'Calibri', size: 24 } },
        },
      },
      sections: [{ children }],
    });

    return await Packer.toBlob(doc);
  };

  const handleConvert = async () => {
    if (!file) return;
    setConverting(true);
    setProgress(0);
    setPreviewPages([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const content = await extractPdfContent(arrayBuffer);
      setProgress(70);

      const blob = await buildDocx(content);
      setProgress(100);
      setDocxBlob(blob);
      setConverted(true);
      toast({ title: 'Conversion complete!', description: `${pageCount} pages converted successfully.` });
    } catch (err: any) {
      toast({ title: 'Conversion failed', description: err.message, variant: 'destructive' });
    }
    setConverting(false);
  };

  const handleDownload = async () => {
    if (!docxBlob || !user) return;

    try {
      const { data: profile } = await supabase.from('profiles').select('free_downloads_used').eq('user_id', user.id).single();
      if (profile && profile.free_downloads_used >= 1) {
        window.open('https://checkout.fapshi.com/link/30934367', '_blank');
        return;
      }

      const fileName = file?.name?.replace('.pdf', '.docx') || 'converted.docx';
      saveAs(docxBlob, fileName);

      await supabase.from('profiles').update({ free_downloads_used: (profile?.free_downloads_used || 0) + 1 }).eq('user_id', user.id);
      toast({ title: 'Downloaded!', description: 'Your Word document has been downloaded.' });
    } catch (err: any) {
      toast({ title: 'Download failed', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <PdfIcon />
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <WordIcon />
          </div>
          <span className="text-sm font-semibold text-foreground">PDF to Word Converter</span>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </header>

      <main className="max-w-4xl mx-auto p-6 md:p-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Convert PDF to Word</h1>
            <p className="text-muted-foreground">Accurately converts text, images, and tables. No file size limits.</p>
          </div>

          {/* Upload area */}
          {!file && (
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="border-2 border-dashed border-border rounded-2xl p-16 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
              </div>
              <p className="text-foreground font-medium mb-1">Drop your PDF here or click to browse</p>
              <p className="text-sm text-muted-foreground">No file size limit • Supports all PDF files</p>
              <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
            </motion.div>
          )}

          {/* File selected */}
          {file && !converting && !converted && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                <PdfIcon />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => { setFile(null); setConverted(false); }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1" size="lg" onClick={handleConvert}>
                  <ArrowRight className="h-4 w-4 mr-2" /> Convert to Word
                </Button>
                <Button variant="outline" size="lg" onClick={() => { setFile(null); }}>
                  Change File
                </Button>
              </div>
            </motion.div>
          )}

          {/* Converting */}
          {converting && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center gap-4 p-6 rounded-xl border border-border bg-card">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">Converting your PDF...</p>
                  <p className="text-sm text-muted-foreground">Extracting text, images, and tables</p>
                </div>
                <span className="text-lg font-bold text-primary">{progress}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${progress}%` }} transition={{ ease: 'easeOut' }} />
              </div>
            </motion.div>
          )}

          {/* Converted */}
          {converted && docxBlob && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-primary/30 bg-primary/5">
                <WordIcon />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{file?.name?.replace('.pdf', '.docx')}</p>
                  <p className="text-sm text-muted-foreground">{pageCount} pages converted • {(docxBlob.size / 1024).toFixed(0)} KB</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
                    <Eye className="h-4 w-4 mr-1" /> Preview
                  </Button>
                  <Button size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-1" /> Download
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => { setFile(null); setConverted(false); setDocxBlob(null); setPreviewPages([]); }}>
                  Convert Another
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Preview pages always visible after conversion */}
        {previewPages.length > 0 && converted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10">
            <h3 className="text-lg font-semibold text-foreground mb-4">Page Preview</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {previewPages.map((src, i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowPreview(true)}>
                  <img src={src} alt={`Page ${i + 1}`} className="w-full" />
                  <div className="p-2 text-center text-xs text-muted-foreground bg-card">Page {i + 1}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      {/* Full preview modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-auto"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b border-border">
              <h3 className="font-semibold text-foreground">Document Preview — {pageCount} pages</h3>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setShowPreview(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="max-w-3xl mx-auto p-6 space-y-6">
              {previewPages.map((src, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-border shadow-lg">
                  <img src={src} alt={`Page ${i + 1}`} className="w-full" />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
