'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, MessageCircle, Send, Twitter, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShareData } from '@/lib/types';

interface SocialShareButtonProps {
  shareData: ShareData;
  variant?: 'farcaster' | 'direct';
  className?: string;
  onShare?: (platform: string) => void;
}

const platformConfig = {
  farcaster: {
    name: 'Farcaster',
    icon: MessageCircle,
    color: 'text-purple-600 hover:text-purple-700',
    bgColor: 'bg-purple-50 hover:bg-purple-100'
  },
  twitter: {
    name: 'Twitter',
    icon: Twitter,
    color: 'text-blue-600 hover:text-blue-700',
    bgColor: 'bg-blue-50 hover:bg-blue-100'
  },
  telegram: {
    name: 'Telegram',
    icon: Send,
    color: 'text-blue-500 hover:text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100'
  }
};

export function SocialShareButton({
  shareData,
  variant = 'farcaster',
  className,
  onShare
}: SocialShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async (platform: string) => {
    setIsSharing(true);

    try {
      if (platform === 'copy') {
        await navigator.clipboard.writeText(shareData.message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        onShare?.(platform);
        return;
      }

      const shareUrls = {
        farcaster: `https://warpcast.com/~/compose?text=${encodeURIComponent(shareData.message)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.message)}&hashtags=${shareData.hashtags.join(',')}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareData.message)}`
      };

      const url = shareUrls[platform as keyof typeof shareUrls];
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
        onShare?.(platform);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  if (variant === 'direct') {
    return (
      <div className={cn('flex gap-2', className)}>
        {Object.entries(platformConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <motion.button
              key={key}
              onClick={() => handleShare(key)}
              disabled={isSharing}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
                config.bgColor,
                config.color,
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{config.name}</span>
            </motion.button>
          );
        })}

        {/* Copy link button */}
        <motion.button
          onClick={() => handleShare('copy')}
          disabled={isSharing}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
            'bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-700',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">
            {copied ? 'Copied!' : 'Copy'}
          </span>
        </motion.button>
      </div>
    );
  }

  // Default farcaster variant
  const config = platformConfig.farcaster;
  const Icon = config.icon;

  return (
    <motion.button
      onClick={() => handleShare('farcaster')}
      disabled={isSharing}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
        config.bgColor,
        config.color,
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isSharing ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <Icon className="h-4 w-4" />
      )}
      <span className="font-medium">Share Alert</span>
    </motion.button>
  );
}

// Share modal component for more detailed sharing
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareData: ShareData;
}

export function ShareModal({ isOpen, onClose, shareData }: ShareModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-background rounded-lg shadow-modal p-6 max-w-md w-full mx-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Share Flood Alert</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-muted transition-colors"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">Alert Message:</p>
          <div className="p-3 bg-muted rounded-lg text-sm">
            {shareData.message}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">Share on:</p>
          <SocialShareButton
            shareData={shareData}
            variant="direct"
            onShare={(platform) => {
              console.log(`Shared on ${platform}`);
              // Could add analytics here
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

