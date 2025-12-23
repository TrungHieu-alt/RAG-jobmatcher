// Topbar.tsx
import { Bell, Moon, Sun, FileStack, Send, Settings, Home, LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';

interface TopbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Topbar({ activePage, onNavigate, isDark, onToggleTheme }: TopbarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'my-cvs', label: 'My CVs', icon: FileStack },
    { id: 'applied-jobs', label: 'Applied Jobs', icon: Send },
  ];

  return (
    <header className="h-16 bg-card border-b border-border sticky top-0 z-20 px-6 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
          <span className="text-white font-bold text-lg">JH</span>
        </div>
        <div>
          <h1 className="text-foreground font-semibold text-lg">Job Hub</h1>
          <p className="text-xs text-muted-foreground">Candidate</p>
        </div>
      </div>

      {/* Center: Navigation */}
      <nav className="hidden md:flex items-center gap-1 justify-between">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden lg:inline">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleTheme}
          className="rounded-xl"
        >
          {isDark ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative rounded-xl">
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-xs">
            3
          </Badge>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-xl px-3 gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Candidate" />
                <AvatarFallback>CD</AvatarFallback>
              </Avatar>
              <div className="text-left hidden lg:block">
                <div className="text-sm font-medium">John Doe</div>
                <div className="text-xs text-muted-foreground">Candidate</div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <User className="w-4 h-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="gap-2 cursor-pointer"
              onClick={() => onNavigate('settings')}
            >
              <Settings className="w-4 h-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive gap-2 cursor-pointer">
              <LogOut className="w-4 h-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}