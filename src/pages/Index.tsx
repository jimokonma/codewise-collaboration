import { useState, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import { supabase } from '@/lib/supabase';
import CodeEditor from '@/components/CodeEditor';
import FilePreview from '@/components/FilePreview';
import SessionHeader from '@/components/SessionHeader';

// Nested file tree structure
const defaultFiles = [
  {
    id: '1',
    name: 'public',
    type: 'folder',
    children: [
      {
        id: '2',
        name: 'index.html',
        type: 'file',
        content: '<h1>Hello World!</h1>\n<p>Start coding...</p>'
      },
      {
        id: '3',
        name: 'style.css',
        type: 'file',
        content: 'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n  background: #f0f0f0;\n}\n\nh1 {\n  color: #333;\n}'
      },
      {
        id: '4',
        name: 'script.js',
        type: 'file',
        content: 'console.log("CodeTogether is ready!");'
      }
    ]
  },
  {
    id: '5',
    name: 'README.md',
    type: 'file',
    content: '# Welcome to your collaborative project!'
  }
];

function findFileById(tree, id) {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.type === 'folder' && node.children) {
      const found = findFileById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function updateFileContent(tree, id, content) {
  return tree.map(node => {
    if (node.id === id && node.type === 'file') {
      return { ...node, content };
    }
    if (node.type === 'folder' && node.children) {
      return { ...node, children: updateFileContent(node.children, id, content) };
    }
    return node;
  });
}

function addNode(tree, parentId, node) {
  return tree.map(item => {
    if (item.id === parentId && item.type === 'folder') {
      return { ...item, children: [...(item.children || []), node] };
    }
    if (item.type === 'folder' && item.children) {
      return { ...item, children: addNode(item.children, parentId, node) };
    }
    return item;
  });
}

function renameNode(tree, id, newName) {
  return tree.map(item => {
    if (item.id === id) {
      return { ...item, name: newName };
    }
    if (item.type === 'folder' && item.children) {
      return { ...item, children: renameNode(item.children, id, newName) };
    }
    return item;
  });
}

function deleteNode(tree, id) {
  return tree.filter(item => {
    if (item.id === id) return false;
    if (item.type === 'folder' && item.children) {
      item.children = deleteNode(item.children, id);
    }
    return true;
  });
}

const Index = () => {
  const [sessionId, setSessionId] = useState('');
  const [files, setFiles] = useState(defaultFiles);
  const [selectedFileId, setSelectedFileId] = useState('2');
  const [loading, setLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState({ '1': true });
  const supabaseChannelRef = useRef(null);
  const [showAddMenu, setShowAddMenu] = useState(null); // id of folder to add to
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const existingSession = urlParams.get('session');
    let newSessionId = existingSession;
    if (!existingSession) {
      newSessionId = nanoid(12);
      window.history.replaceState({}, '', `?session=${newSessionId}`);
    }
    setSessionId(newSessionId!);
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select('files')
        .eq('session_id', sessionId)
        .single();
      if (data && data.files) {
        setFiles(data.files);
      } else {
        await supabase.from('sessions').insert({
          session_id: sessionId,
          files: defaultFiles,
        });
        setFiles(defaultFiles);
      }
      setLoading(false);
    })();
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    const channel = supabase
      .channel('sessions-files-' + sessionId)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          if (payload.new && payload.new.files) {
            setFiles(payload.new.files);
          }
        }
      )
      .subscribe();
    supabaseChannelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const handleCodeChange = (code: string) => {
    setFiles(files => {
      const updated = updateFileContent(files, selectedFileId, code);
      supabase.from('sessions').update({ files: updated }).eq('session_id', sessionId);
      return updated;
    });
  };

  const handleFileSelect = (id: string) => {
    setSelectedFileId(id);
  };

  const handleToggleFolder = (id: string) => {
    setExpandedFolders(f => ({ ...f, [id]: !f[id] }));
  };

  const handleAdd = (parentId, type) => {
    const newId = nanoid(8);
    const newNode = type === 'file'
      ? { id: newId, name: 'untitled.txt', type: 'file', content: '' }
      : { id: newId, name: 'New Folder', type: 'folder', children: [] };
    setFiles(files => {
      const updated = addNode(files, parentId, newNode);
      supabase.from('sessions').update({ files: updated }).eq('session_id', sessionId);
      return updated;
    });
    setShowAddMenu(null);
  };

  const handleRename = (id) => {
    setFiles(files => {
      const updated = renameNode(files, id, renameValue);
      supabase.from('sessions').update({ files: updated }).eq('session_id', sessionId);
      return updated;
    });
    setRenamingId(null);
    setRenameValue('');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this item?')) return;
    setFiles(files => {
      const updated = deleteNode(files, id);
      supabase.from('sessions').update({ files: updated }).eq('session_id', sessionId);
      return updated;
    });
    if (selectedFileId === id) setSelectedFileId('2'); // fallback to index.html
  };

  const selectedFile = findFileById(files, selectedFileId);

  function renderFileTree(tree) {
    return (
      <ul className="pl-2">
        {tree.map(node => (
          <li key={node.id}>
            {node.type === 'folder' ? (
              <>
                <div className={`flex items-center cursor-pointer select-none ${expandedFolders[node.id] ? 'font-bold' : ''}`}
                  onClick={() => handleToggleFolder(node.id)}>
                  <span className="mr-1">{expandedFolders[node.id] ? '📂' : '📁'}</span>
                  {renamingId === node.id ? (
                    <input
                      value={renameValue}
                      onChange={e => setRenameValue(e.target.value)}
                      onBlur={() => handleRename(node.id)}
                      onKeyDown={e => e.key === 'Enter' && handleRename(node.id)}
                      autoFocus
                      className="px-1 text-sm rounded border"
                    />
                  ) : (
                    <span onDoubleClick={() => { setRenamingId(node.id); setRenameValue(node.name); }}>{node.name}</span>
                  )}
                  <button className="ml-2 text-xs" onClick={e => { e.stopPropagation(); setShowAddMenu(node.id); }}>＋</button>
                  <button className="ml-1 text-xs" onClick={e => { e.stopPropagation(); setRenamingId(node.id); setRenameValue(node.name); }}>✎</button>
                  <button className="ml-1 text-xs" onClick={e => { e.stopPropagation(); handleDelete(node.id); }}>🗑️</button>
                </div>
                {showAddMenu === node.id && (
                  <div className="ml-6 mt-1 flex gap-1">
                    <button className="text-xs px-1 py-0.5 bg-accent rounded" onClick={() => handleAdd(node.id, 'file')}>File</button>
                    <button className="text-xs px-1 py-0.5 bg-accent rounded" onClick={() => handleAdd(node.id, 'folder')}>Folder</button>
                    <button className="text-xs px-1 py-0.5" onClick={() => setShowAddMenu(null)}>✕</button>
                  </div>
                )}
                {expandedFolders[node.id] && node.children && renderFileTree(node.children)}
              </>
            ) : (
              <div className={`flex items-center cursor-pointer px-2 py-1 rounded ${selectedFileId === node.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                onClick={() => handleFileSelect(node.id)}>
                {renamingId === node.id ? (
                  <input
                    value={renameValue}
                    onChange={e => setRenameValue(e.target.value)}
                    onBlur={() => handleRename(node.id)}
                    onKeyDown={e => e.key === 'Enter' && handleRename(node.id)}
                    autoFocus
                    className="px-1 text-sm rounded border"
                  />
                ) : (
                  <span onDoubleClick={() => { setRenamingId(node.id); setRenameValue(node.name); }}>{node.name}</span>
                )}
                <button className="ml-2 text-xs" onClick={e => { e.stopPropagation(); setRenamingId(node.id); setRenameValue(node.name); }}>✎</button>
                <button className="ml-1 text-xs" onClick={e => { e.stopPropagation(); handleDelete(node.id); }}>🗑️</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  }

  if (!sessionId || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading session...</p>
      </div>
    );
  }

  // For preview, find the main files
  const htmlFile = findFileById(files, '2');
  const cssFile = findFileById(files, '3');
  const jsFile = findFileById(files, '4');

  return (
    <div className="h-screen flex flex-col bg-background">
      <SessionHeader sessionId={sessionId} connectedUsers={1} />
      <div className="flex-1 flex">
        {/* Sidebar file tree */}
        <div className="w-64 border-r border-border p-2 bg-muted/30 overflow-y-auto">
          <div className="font-semibold mb-2">Files</div>
          {renderFileTree(files)}
        </div>
        {/* Editor and preview */}
        <div className="flex-1 flex">
          <div className="w-1/2 border-r border-border flex flex-col">
            {selectedFile && selectedFile.type === 'file' && (
              <CodeEditor
                value={selectedFile.content}
                onChange={handleCodeChange}
                language={selectedFile.name.endsWith('.js') ? 'javascript' : selectedFile.name.endsWith('.css') ? 'css' : 'html'}
              />
            )}
          </div>
          <div className="w-1/2 p-4">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            <FilePreview
              html={htmlFile?.content || ''}
              css={cssFile?.content || ''}
              javascript={jsFile?.content || ''}
            />
          </div>
        </div>
      </div>
      <div className="h-8 border-t border-border bg-muted/50 flex items-center px-4">
        <span className="text-xs text-muted-foreground">
          Session: {sessionId}
        </span>
      </div>
    </div>
  );
};

export default Index;
