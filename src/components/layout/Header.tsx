import { ArrowLeft, Bell, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showNotifications?: boolean;
  showMenu?: boolean;
  rightContent?: React.ReactNode;
}

export function Header({ 
  title, 
  showBack = false, 
  showNotifications = false,
  showMenu = false,
  rightContent 
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 safe-top">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          {title && (
            <h1 className="font-display font-semibold text-lg">{title}</h1>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {rightContent}
          {showNotifications && (
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
            </Button>
          )}
          {showMenu && (
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
