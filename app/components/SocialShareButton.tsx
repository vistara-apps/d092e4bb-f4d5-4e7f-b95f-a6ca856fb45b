'use client';

import { motion } from 'framer-motion';
import { Share2, MessageCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SocialShareVariant } from '@/lib/types';
import { Button } from './ui/button';

interface SocialShareButtonProps {
  variant?: SocialShareVariant;
  content: {
    text: string;
    url?: string;
    image?: string;
  };
  onShare?: () => void;
  className?: string;
}

export function SocialShareButton({
  variant = 'farcaster',
  content,
  onShare,
  className
}: SocialShareButtonProps) {
  const getShareIcon = () => {
    switch (variant) {
      case 'farcaster': return <MessageCircle className="h-4 w-4" />;
      case 'direct': return <Send className="h-4 w-4" />;
      default: return <Share2 className="h-4 w-4" />;
    }
  };

  const getShareLabel = () => {
    switch (variant) {
      case 'farcaster': return 'Share on Farcaster';
      case 'direct': return 'Share Alert';
      default: return 'Share';
    }
  };

  const handleShare = () => {
    if (variant === 'farcaster') {
      // In a real implementation, this would integrate with Farcaster
      const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
        `${content.text}${content.url ? ` ${content.url}` : ''}`
      )}`;
      window.open(farcasterUrl, '_blank');
    } else if (variant === 'direct') {
      // Direct sharing using Web Share API if available
      if (navigator.share) {
        navigator.share({
          title: 'FloodAlert NG - Flood Warning',
          text: content.text,
          url: content.url
        });
      } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(`${content.text}${content.url ? ` ${content.url}` : ''}`);
      }
    }

    onShare?.();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn('inline-block', className)}
    >
      <Button
        variant="outline"
        onClick={handleShare}
        className={cn(
          'flex items-center space-x-2 transition-all duration-200',
          variant === 'farcaster' && 'border-purple-200 hover:border-purple-300 hover:bg-purple-50',
          variant === 'direct' && 'border-blue-200 hover:border-blue-300 hover:bg-blue-50'
        )}
      >
        {getShareIcon()}
        <span>{getShareLabel()}</span>
      </Button>
    </motion.div>
  );
}

// Additional share options component for multiple sharing methods
export function ShareOptions({
  content,
  onShare
}: {
  content: { text: string; url?: string; image?: string };
  onShare?: () => void;
}) {
  const shareOptions = [
    { variant: 'farcaster' as const, label: 'Farcaster' },
    { variant: 'direct' as const, label: 'Direct Share' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-wrap gap-2"
    >
      {shareOptions.map((option) => (
        <SocialShareButton
          key={option.variant}
          variant={option.variant}
          content={content}
          onShare={onShare}
        />
      ))}
    </motion.div>
  );
}

