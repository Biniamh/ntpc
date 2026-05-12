import { useGetLatestScripture } from "@workspace/api-client-react";
import { useState, useEffect } from "react";
import { X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DailyScripture() {
  const { data: scripture } = useGetLatestScripture();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (scripture) {
      // Delay showing it to not overlap with initial animations
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [scripture]);

  if (!scripture || !isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500 max-w-sm">
      <div className="bg-card border-2 border-primary/20 shadow-2xl rounded-lg p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2">
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => setIsVisible(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-full shrink-0">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-primary mb-1">Daily Word</h4>
            <p className="text-sm italic text-foreground/90 leading-relaxed">"{scripture.verse}"</p>
            <p className="text-xs font-bold text-muted-foreground mt-2">— {scripture.reference}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
