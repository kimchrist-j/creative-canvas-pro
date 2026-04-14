import { useState, useCallback, useMemo } from 'react';
import { WireframeElement, Framework } from './types';
import { generateCode } from './CodeGenerator';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Code2, Copy, Check } from 'lucide-react';

interface Props {
  elements: WireframeElement[];
  framework: Framework;
  onFrameworkChange: (f: Framework) => void;
  projectName: string;
  open: boolean;
  onToggle: () => void;
}

export default function CodePanel({ elements, framework, onFrameworkChange, projectName, open, onToggle }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const files = useMemo(() => generateCode(elements, framework, projectName), [elements, framework, projectName]);

  const fileNames = Object.keys(files);
  const [activeFile, setActiveFile] = useState(fileNames[0] || '');

  const currentFile = activeFile && files[activeFile] ? activeFile : fileNames[0] || '';

  const handleCopy = (fileName: string) => {
    navigator.clipboard.writeText(files[fileName]);
    setCopied(fileName);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!open) return null;

  return (
    <div className="w-80 border-l border-border bg-background flex flex-col shrink-0 overflow-hidden">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold">Generated Code</span>
        </div>
        <Select value={framework} onValueChange={(v) => onFrameworkChange(v as Framework)}>
          <SelectTrigger className="h-7 w-32 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="react-native">React Native</SelectItem>
            <SelectItem value="html">HTML/CSS/JS</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* File tabs */}
      <div className="border-b border-border overflow-x-auto flex">
        {fileNames.map(name => (
          <button
            key={name}
            onClick={() => setActiveFile(name)}
            className={`px-3 py-1.5 text-[10px] font-mono whitespace-nowrap border-b-2 transition-colors ${
              currentFile === name
                ? 'border-primary text-foreground bg-muted/50'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {name.split('/').pop()}
          </button>
        ))}
      </div>

      {/* File path */}
      <div className="px-3 py-1.5 flex items-center justify-between bg-muted/30">
        <span className="text-[10px] font-mono text-muted-foreground truncate">{currentFile}</span>
        <button onClick={() => handleCopy(currentFile)} className="text-muted-foreground hover:text-foreground">
          {copied === currentFile ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
        </button>
      </div>

      {/* Code viewer */}
      <div className="flex-1 overflow-auto">
        <pre className="text-[11px] font-mono p-3 leading-relaxed text-foreground whitespace-pre-wrap break-words">
          {files[currentFile] || '// No code generated yet.\n// Add components to the canvas to see code.'}
        </pre>
      </div>

      {elements.length === 0 && (
        <div className="p-4 text-center text-xs text-muted-foreground">
          Add components to the canvas to see generated code in real-time.
        </div>
      )}
    </div>
  );
}
