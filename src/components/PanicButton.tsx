
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useSafety } from '@/context/SafetyContext';
import { useToast } from '@/hooks/use-toast';

interface PanicButtonProps {
  variant?: 'default' | 'discreet';
  size?: 'sm' | 'md' | 'lg';
}

const PanicButton: React.FC<PanicButtonProps> = ({ 
  variant = 'default', 
  size = 'md' 
}) => {
  const { triggerDistressSignal, distressData, cancelDistressSignal } = useSafety();
  const { toast } = useToast();
  
  const handlePanic = () => {
    if (distressData?.isActive) {
      // If already active, cancel it
      cancelDistressSignal();
      toast({
        title: 'Emergency mode deactivated',
        description: 'Distress signal has been cancelled',
        variant: 'default',
      });
    } else {
      // If not active, trigger it
      triggerDistressSignal();
      toast({
        title: 'Emergency mode activated',
        description: 'Distress signal has been sent to your emergency contacts',
        variant: 'destructive',
      });
    }
  };
  
  // If discreet mode is active, show a less obvious button
  if (variant === 'discreet') {
    return (
      <button 
        onClick={handlePanic}
        className={`p-${size === 'sm' ? '1' : size === 'md' ? '2' : '3'} opacity-70 hover:opacity-100`}
        aria-label="Emergency"
      >
        {distressData?.isActive ? '🔴' : '⚪'}
      </button>
    );
  }
  
  // Default panic button style
  return (
    <Button
      onClick={handlePanic}
      variant={distressData?.isActive ? 'outline' : 'destructive'}
      size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
      className={`${distressData?.isActive ? 'border-red-500 text-red-500' : ''} animate-pulse`}
    >
      <AlertCircle className="mr-2" size={size === 'sm' ? 16 : 20} />
      {distressData?.isActive ? 'Cancel Emergency' : 'Emergency'}
    </Button>
  );
};

export default PanicButton;
