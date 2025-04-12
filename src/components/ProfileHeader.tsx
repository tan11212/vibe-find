
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { UserCircle, Settings, Heart, LogOut, UserPlus } from 'lucide-react';

const ProfileHeader: React.FC = () => {
  const { user, signOut } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
  };
  
  return (
    <div className="flex items-center">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 hover:bg-transparent">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || 'User'} />
                <AvatarFallback className="bg-appPurple text-white">
                  {user.email ? user.email[0].toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center cursor-pointer">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/favorites" className="flex items-center cursor-pointer">
                <Heart className="mr-2 h-4 w-4" />
                <span>Favorites</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to="/auth">
          <Button variant="outline" size="sm" className="text-sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </Link>
      )}
    </div>
  );
};

export default ProfileHeader;
