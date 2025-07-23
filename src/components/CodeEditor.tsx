import { Editor } from '@monaco-editor/react';
import { useState } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  onCursorMove?: (position: { line: number; column: number }) => void;
}

const CodeEditor = ({ value, onChange, language, onCursorMove }: CodeEditorProps) => {
  const [isEditorReady, setIsEditorReady] = useState(false);

  const handleEditorDidMount = (editor: any) => {
    setIsEditorReady(true);
    
    // Track cursor position changes
    editor.onDidChangeCursorPosition((e: any) => {
      const position = e.position;
      onCursorMove?.({ line: position.lineNumber, column: position.column });
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          wordWrap: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 2,
          insertSpaces: true,
        }}
      />
      {!isEditorReady && (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;