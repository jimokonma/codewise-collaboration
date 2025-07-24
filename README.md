# CodeTogether 🚀

> **Real-time collaborative coding platform for seamless team development**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

## 📸 Screenshot

![CodeTogether Application](/public//snapshot.png)

*CodeTogether's intuitive interface featuring a file explorer, Monaco code editor, and live preview panel*

## ✨ Features

### 🎯 Core Functionality
- **Real-time Collaboration**: Multiple developers can code simultaneously with instant sync
- **Live Preview**: See HTML/CSS/JS changes render instantly in the preview panel
- **Session-based Sharing**: Simple URL sharing for instant collaboration
- **No Authentication Required**: Jump straight into coding without sign-ups

### 📁 File Management
- **Hierarchical File Tree**: Organize code with folders and subfolders
- **File Operations**: Create, rename, delete files and folders
- **Multi-file Support**: Edit HTML, CSS, JavaScript, and more
- **Auto-save**: All changes are automatically saved and synced

### 🎨 Developer Experience
- **Monaco Editor**: Industry-standard code editor (same as VS Code)
- **Syntax Highlighting**: Full support for HTML, CSS, JavaScript, and more
- **Dark/Light Mode**: Toggle between themes for comfortable coding
- **Responsive Design**: Works seamlessly on desktop and tablet devices

### 🔄 Real-time Features
- **Instant Sync**: Changes appear across all connected users immediately
- **Session Persistence**: Code persists between browser sessions
- **Conflict Resolution**: Smart merging of concurrent edits
- **Connection Status**: Real-time indicators for collaboration status

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | React 18 + TypeScript | Modern, type-safe UI development |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Code Editor** | Monaco Editor | VS Code's powerful editor component |
| **Backend** | Supabase | PostgreSQL database + realtime subscriptions |
| **Build Tool** | Vite | Lightning-fast development server |
| **State Management** | React Query | Server state management |
| **Theming** | next-themes | Dark/light mode support |

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher
- **Supabase account** (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/codewise-collaboration.git
   cd codewise-collaboration
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   a. Create a new project at [supabase.com](https://supabase.com)
   
   b. Navigate to SQL Editor and run:
   ```sql
   -- Create sessions table for real-time collaboration
   CREATE TABLE sessions (
     session_id TEXT PRIMARY KEY,
     code_content TEXT,
     files JSONB,
     mouse_positions JSONB,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Enable Row Level Security (optional but recommended)
   ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
   
   -- Create policy to allow all operations (for demo purposes)
   CREATE POLICY "Allow all operations" ON sessions FOR ALL USING (true);
   ```

4. **Configure environment**
   
   Update `src/lib/supabase.ts` with your credentials:
   ```typescript
   const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:5173](http://localhost:5173)

## 📖 Usage Guide

### Creating a Session

1. **Automatic Session Creation**: CodeTogether automatically generates a unique session ID
2. **URL Sharing**: Copy the URL from your browser's address bar
3. **Collaboration**: Share the URL with team members to start coding together

### File Management

| Action | How to |
|--------|--------|
| **Create File** | Click the `+` button next to a folder |
| **Create Folder** | Click the `+` button and select "Folder" |
| **Rename** | Double-click the file/folder name or use the `✎` button |
| **Delete** | Click the `🗑️` button (confirmation required) |
| **Select File** | Click on any file to open it in the editor |

### Collaboration Features

- **Real-time Editing**: All connected users see changes instantly
- **Live Preview**: HTML/CSS/JS changes render immediately
- **Session Status**: See how many users are currently online
- **Share Button**: Quick copy of the session URL to clipboard

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save current file |
| `Ctrl/Cmd + /` | Toggle comment |
| `Ctrl/Cmd + F` | Find in editor |
| `Ctrl/Cmd + H` | Replace in editor |
| `F12` | Open browser dev tools |

## 🏗️ Project Structure

```
codewise-collaboration/
├── public/                 # Static assets
│   ├── favicon.svg        # Application icon
│   └── robots.txt         # SEO configuration
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI components
│   │   ├── CodeEditor.tsx # Monaco editor wrapper
│   │   ├── FilePreview.tsx # Live preview component
│   │   └── SessionHeader.tsx # Header with session info
│   ├── hooks/            # Custom React hooks
│   │   └── use-toast.ts  # Toast notification system
│   ├── lib/              # Utility functions
│   │   ├── supabase.ts   # Supabase client configuration
│   │   └── utils.ts      # Helper functions
│   ├── pages/            # Page components
│   │   ├── Index.tsx     # Main application page
│   │   └── NotFound.tsx  # 404 error page
│   ├── App.tsx           # Root application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies and scripts
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite build configuration
```

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Type checking
npm run type-check
```

### Environment Variables

Create a `.env.local` file for local development:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

### Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Push your code to GitHub
   - Connect your repository to Vercel

2. **Configure Environment Variables**
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Redeploy your application

3. **Custom Domain** (Optional)
   - Add your custom domain in Vercel dashboard
   - Configure DNS settings

### Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Environment Variables**: Add Supabase credentials

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** (if applicable)
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Add TypeScript types for new features
- Update documentation for API changes
- Test your changes thoroughly
- Keep commits atomic and well-described

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Monaco Editor** - Powerful code editing experience
- **Supabase** - Real-time database and backend services
- **Tailwind CSS** - Utility-first CSS framework
- **React Team** - Amazing frontend framework
- **Vite** - Lightning-fast build tool

## 📞 Support

- **Documentation**: [Read the docs](https://your-docs-url.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/codewise-collaboration/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/codewise-collaboration/discussions)
- **Email**: support@codewise-collaboration.com

## 📊 Project Status

![GitHub stars](https://img.shields.io/github/stars/yourusername/codewise-collaboration)
![GitHub forks](https://img.shields.io/github/forks/yourusername/codewise-collaboration)
![GitHub issues](https://img.shields.io/github/issues/yourusername/codewise-collaboration)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/codewise-collaboration)

---

**Made with ❤️ by Jim Okonma**
