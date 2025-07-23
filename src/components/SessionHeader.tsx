import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Users } from "lucide-react";
import { toast } from "sonner";

interface SessionHeaderProps {
  sessionId: string;
  connectedUsers: number;
}

const SessionHeader = ({ sessionId, connectedUsers }: SessionHeaderProps) => {
  const shareSession = () => {
    const url = `${window.location.origin}?session=${sessionId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Session link copied to clipboard!");
    });
  };

  return (
    <header className="h-14 border-b border-border bg-background px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">CodeTogether</h1>
        <Badge variant="secondary" className="text-xs">
          Session: {sessionId.slice(0, 8)}...
        </Badge>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{connectedUsers} online</span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={shareSession}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </header>
  );
};

export default SessionHeader;