import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, RotateCcw, Code2 } from 'lucide-react';
import { toast } from 'sonner';

interface CodeRunnerProps {
  code: string;
  title: string;
}

export const CodeRunner = ({ code, title }: CodeRunnerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const extractCode = (htmlContent: string) => {
    // Extract script content if it exists
    const scriptMatch = htmlContent.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
    const styleMatch = htmlContent.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    
    // If it's a complete HTML document
    if (htmlContent.includes('<!DOCTYPE') || htmlContent.includes('<html')) {
      return htmlContent;
    }
    
    // If it's just JavaScript
    if (htmlContent.trim().startsWith('function') || 
        htmlContent.includes('const ') || 
        htmlContent.includes('let ') ||
        htmlContent.includes('var ') ||
        htmlContent.includes('document.')) {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 20px; }
            * { box-sizing: border-box; }
          </style>
        </head>
        <body>
          <div id="app"></div>
          <script>
            try {
              ${htmlContent}
            } catch (error) {
              document.body.innerHTML = '<div style="color: red; padding: 20px;">Error: ' + error.message + '</div>';
            }
          </script>
        </body>
        </html>
      `;
    }
    
    // If it contains HTML elements
    if (htmlContent.includes('<') && htmlContent.includes('>')) {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 20px; }
            * { box-sizing: border-box; }
            ${styleMatch ? styleMatch[1] : ''}
          </style>
        </head>
        <body>
          ${bodyMatch ? bodyMatch[1] : htmlContent}
          ${scriptMatch ? `<script>${scriptMatch[1]}</script>` : ''}
        </body>
        </html>
      `;
    }
    
    return htmlContent;
  };

  const runCode = () => {
    if (!iframeRef.current) return;
    
    setIsRunning(true);
    const iframe = iframeRef.current;
    
    try {
      const executableCode = extractCode(code);
      const blob = new Blob([executableCode], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      iframe.onload = () => {
        setIsRunning(false);
        URL.revokeObjectURL(url);
      };
      
      iframe.src = url;
      toast.success('Tool is running!');
    } catch (error) {
      setIsRunning(false);
      toast.error('Error running the tool');
      console.error('Code execution error:', error);
    }
  };

  const resetTool = () => {
    if (iframeRef.current) {
      iframeRef.current.src = 'about:blank';
    }
  };

  useEffect(() => {
    // Auto-run the tool when component mounts
    setTimeout(runCode, 100);
  }, [code]);

  const isCodeContent = code.includes('<script') || 
                       code.includes('function') || 
                       code.includes('const ') || 
                       code.includes('document.') ||
                       (code.includes('<') && code.includes('>'));

  if (!isCodeContent) {
    // Not executable code, return regular content display
    return (
      <div 
        className="prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: code }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Button 
          onClick={runCode} 
          disabled={isRunning}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Play className="h-4 w-4 mr-1" />
          {isRunning ? 'Running...' : 'Run Tool'}
        </Button>
        
        <Button 
          onClick={resetTool} 
          variant="outline" 
          size="sm"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
        
        <Button 
          onClick={() => setShowCode(!showCode)} 
          variant="ghost" 
          size="sm"
        >
          <Code2 className="h-4 w-4 mr-1" />
          {showCode ? 'Hide Code' : 'View Code'}
        </Button>
      </div>

      {showCode && (
        <Card className="p-4">
          <pre className="text-sm overflow-x-auto bg-muted p-4 rounded">
            <code>{code}</code>
          </pre>
        </Card>
      )}

      <div className="border border-border rounded-lg overflow-hidden">
        <iframe
          ref={iframeRef}
          className="w-full h-96 bg-background"
          sandbox="allow-scripts allow-same-origin allow-forms"
          title={`${title} - Live Tool`}
        />
      </div>
    </div>
  );
};

export default CodeRunner;