import { Share2, Users, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface SessionHeaderProps {
  sessionId: string;
  connectedUsers: number;
}

const SessionHeader = ({ sessionId, connectedUsers }: SessionHeaderProps) => {
  const { theme, setTheme } = useTheme();

  const shareSession = () => {
    const url = `${window.location.origin}?session=${sessionId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Session link copied to clipboard!");
    });
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="h-14 border-b border-border bg-background px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">CodeTogether</h1>
        <span className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md">
          Session: {sessionId.slice(0, 8)}...
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{connectedUsers} online</span>
        </div>
        
        <button
          onClick={toggleTheme}
          className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        
        <button
          onClick={shareSession}
          className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>
    </header>
  );
};

export default SessionHeader;