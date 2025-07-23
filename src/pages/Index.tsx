import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeEditor from '@/components/CodeEditor';
import FilePreview from '@/components/FilePreview';
import SessionHeader from '@/components/SessionHeader';
import { useSocket } from '@/hooks/useSocket';

const Index = () => {
  const [sessionId, setSessionId] = useState('');
  const [html, setHtml] = useState('<h1>Hello World!</h1>\n<p>Start coding...</p>');
  const [css, setCss] = useState('body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n  background: #f0f0f0;\n}\n\nh1 {\n  color: #333;\n}');
  const [javascript, setJavascript] = useState('console.log("CodeTogether is ready!");');
  
  const { isConnected, connectedUsers, emitCodeChange } = useSocket({
    sessionId,
    onCodeChange: (code, language) => {
      // Handle incoming code changes from other users
      console.log('Received code change:', { code: code.length, language });
    },
  });

  useEffect(() => {
    // Get session ID from URL params or create new one
    const urlParams = new URLSearchParams(window.location.search);
    const existingSession = urlParams.get('session');
    
    if (existingSession) {
      setSessionId(existingSession);
    } else {
      const newSessionId = nanoid(12);
      setSessionId(newSessionId);
      // Update URL without refreshing
      window.history.replaceState({}, '', `?session=${newSessionId}`);
    }
  }, []);

  const handleCodeChange = (code: string, language: string) => {
    emitCodeChange(code, language);
    
    switch (language) {
      case 'html':
        setHtml(code);
        break;
      case 'css':
        setCss(code);
        break;
      case 'javascript':
        setJavascript(code);
        break;
    }
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading session...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <SessionHeader sessionId={sessionId} connectedUsers={connectedUsers} />
      
      <div className="flex-1 flex">
        <div className="w-1/2 border-r border-border">
          <Tabs defaultValue="html" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="javascript">JS</TabsTrigger>
            </TabsList>
            
            <TabsContent value="html" className="flex-1 m-0">
              <CodeEditor
                value={html}
                onChange={(value) => handleCodeChange(value, 'html')}
                language="html"
              />
            </TabsContent>
            
            <TabsContent value="css" className="flex-1 m-0">
              <CodeEditor
                value={css}
                onChange={(value) => handleCodeChange(value, 'css')}
                language="css"
              />
            </TabsContent>
            
            <TabsContent value="javascript" className="flex-1 m-0">
              <CodeEditor
                value={javascript}
                onChange={(value) => handleCodeChange(value, 'javascript')}
                language="javascript"
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="w-1/2 p-4">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          <FilePreview html={html} css={css} javascript={javascript} />
        </div>
      </div>
      
      <div className="h-8 border-t border-border bg-muted/50 flex items-center px-4">
        <span className="text-xs text-muted-foreground">
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'} • Session: {sessionId}
        </span>
      </div>
    </div>
  );
};

export default Index;
