interface FilePreviewProps {
  html: string;
  css: string;
  javascript: string;
}

const FilePreview = ({ html, css, javascript }: FilePreviewProps) => {
  const createPreviewContent = () => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <style>
          body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          try {
            ${javascript}
          } catch (error) {
            console.error('JavaScript execution error:', error);
          }
        </script>
      </body>
      </html>
    `;
  };

  return (
    <div className="h-full w-full border border-border rounded-md overflow-hidden">
      <iframe
        srcDoc={createPreviewContent()}
        className="w-full h-full border-0"
        title="Code Preview"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default FilePreview;