import React from 'react';
import { Moon, Sun, Bell, User, Menu, Eye, EyeOff } from 'lucide-react';
import { useApp, entities } from '../contexts/AppContext';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { NotificationPanel } from './NotificationPanel';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { selectedEntity, setSelectedEntity, theme, toggleTheme, unreadCount, setCurrentPage, visibilityEditMode, setVisibilityEditMode } = useApp();
  const [showNotifications, setShowNotifications] = React.useState(false);

  // Get the display name based on selected entity
  const displayName = entities.find(e => e.id === selectedEntity)?.name || 'InFocus Ministries';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card dark:bg-card">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Organization Name */}
        <div className="hidden md:block mr-4">
        </div>

        {/* Entity Selector */}
        <div className="flex-1 max-w-md mx-auto">
          <Select value={selectedEntity} onValueChange={setSelectedEntity}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {displayName}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {entities.map(entity => (
                <SelectItem key={entity.id} value={entity.id}>
                  <div className="flex flex-col">
                    <span>{entity.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{entity.type}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Visibility Toggle */}
          <Button
            variant={visibilityEditMode ? "default" : "ghost"}
            size="icon"
            onClick={() => setVisibilityEditMode(!visibilityEditMode)}
            className="relative"
            title={visibilityEditMode ? "Exit visibility mode" : "Customize visible items"}
          >
            {visibilityEditMode ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
            {showNotifications && (
              <NotificationPanel onClose={() => setShowNotifications(false)} />
            )}
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 dark:bg-[#3d4d6b] text-blue-600 dark:text-white">
                    JD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCurrentPage('settings')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentPage('settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
