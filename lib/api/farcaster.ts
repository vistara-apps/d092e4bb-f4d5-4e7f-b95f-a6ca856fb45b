import axios from 'axios';
import { ApiResponse, ShareData, FrameData } from '../types';

const FARCASTER_HUB_API_BASE = 'https://api.farcaster.xyz';
const FARCASTER_API_KEY = process.env.FARCASTER_API_KEY;

export class FarcasterAPI {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || FARCASTER_API_KEY || '';
  }

  /**
   * Get user profile by FID
   */
  async getUserProfile(fid: number): Promise<ApiResponse<any>> {
    try {
      const response = await axios.get(`${FARCASTER_HUB_API_BASE}/v1/user`, {
        params: { fid },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return {
        success: false,
        error: 'Failed to fetch user profile'
      };
    }
  }

  /**
   * Get user's casts
   */
  async getUserCasts(fid: number, limit = 10): Promise<ApiResponse<any[]>> {
    try {
      const response = await axios.get(`${FARCASTER_HUB_API_BASE}/v1/casts`, {
        params: { fid, limit },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return { success: true, data: response.data.casts || [] };
    } catch (error) {
      console.error('Error fetching user casts:', error);
      return {
        success: false,
        error: 'Failed to fetch user casts'
      };
    }
  }

  /**
   * Post a cast (requires authentication)
   */
  async postCast(text: string, embeds?: any[]): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(`${FARCASTER_HUB_API_BASE}/v1/casts`, {
        text,
        embeds
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error posting cast:', error);
      return {
        success: false,
        error: 'Failed to post cast'
      };
    }
  }

  /**
   * Share flood alert on Farcaster
   */
  async shareFloodAlert(shareData: ShareData): Promise<ApiResponse<any>> {
    try {
      const { location, riskLevel, message, hashtags } = shareData;

      const castText = `${message}\n\nLocation: ${location.city || `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`}\nRisk Level: ${riskLevel.toUpperCase()}\n\n${hashtags.map(tag => `#${tag}`).join(' ')}\n\n#FloodAlertNG`;

      const embeds = [{
        url: `${process.env.NEXT_PUBLIC_APP_URL}/alerts?lat=${location.lat}&lon=${location.lon}`,
        title: 'View Flood Alert Details'
      }];

      return await this.postCast(castText, embeds);
    } catch (error) {
      console.error('Error sharing flood alert:', error);
      return {
        success: false,
        error: 'Failed to share flood alert'
      };
    }
  }

  /**
   * Get casts by channel or topic
   */
  async getCastsByChannel(channelId: string, limit = 20): Promise<ApiResponse<any[]>> {
    try {
      const response = await axios.get(`${FARCASTER_HUB_API_BASE}/v1/casts`, {
        params: {
          channel: channelId,
          limit
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return { success: true, data: response.data.casts || [] };
    } catch (error) {
      console.error('Error fetching channel casts:', error);
      return {
        success: false,
        error: 'Failed to fetch channel casts'
      };
    }
  }

  /**
   * Search for casts by text
   */
  async searchCasts(query: string, limit = 20): Promise<ApiResponse<any[]>> {
    try {
      const response = await axios.get(`${FARCASTER_HUB_API_BASE}/v1/search`, {
        params: {
          q: query,
          limit
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return { success: true, data: response.data.casts || [] };
    } catch (error) {
      console.error('Error searching casts:', error);
      return {
        success: false,
        error: 'Failed to search casts'
      };
    }
  }

  /**
   * Get trending topics related to floods/weather
   */
  async getTrendingTopics(): Promise<ApiResponse<string[]>> {
    try {
      // This would typically use Farcaster's trending API
      // For now, return predefined flood-related hashtags
      const trendingTopics = [
        'flood',
        'weather',
        'storm',
        'emergency',
        'preparedness',
        'climate',
        'floodalert'
      ];

      return { success: true, data: trendingTopics };
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      return {
        success: false,
        error: 'Failed to fetch trending topics'
      };
    }
  }

  /**
   * Validate frame data from Farcaster frame action
   */
  validateFrameData(frameData: FrameData): boolean {
    try {
      // Basic validation - in production, you should verify signatures
      return !!(
        frameData.fid &&
        frameData.url &&
        frameData.messageHash &&
        frameData.timestamp &&
        frameData.buttonIndex
      );
    } catch {
      return false;
    }
  }

  /**
   * Get user's followers
   */
  async getUserFollowers(fid: number, limit = 50): Promise<ApiResponse<any[]>> {
    try {
      const response = await axios.get(`${FARCASTER_HUB_API_BASE}/v1/followers`, {
        params: { fid, limit },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return { success: true, data: response.data.followers || [] };
    } catch (error) {
      console.error('Error fetching user followers:', error);
      return {
        success: false,
        error: 'Failed to fetch user followers'
      };
    }
  }

  /**
   * Get users following a specific user
   */
  async getUserFollowing(fid: number, limit = 50): Promise<ApiResponse<any[]>> {
    try {
      const response = await axios.get(`${FARCASTER_HUB_API_BASE}/v1/following`, {
        params: { fid, limit },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return { success: true, data: response.data.following || [] };
    } catch (error) {
      console.error('Error fetching user following:', error);
      return {
        success: false,
        error: 'Failed to fetch user following'
      };
    }
  }

  /**
   * Create a frame for flood alerts
   */
  createFloodAlertFrame(alertData: any): any {
    return {
      version: 'vNext',
      image: {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/alert/${alertData.id}`,
        aspectRatio: '1.91:1'
      },
      buttons: [
        {
          label: 'View Details',
          action: 'post',
          target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/alert/${alertData.id}`
        },
        {
          label: 'Share Alert',
          action: 'post',
          target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/share/${alertData.id}`
        },
        {
          label: 'Get Guidance',
          action: 'post',
          target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/guidance/${alertData.id}`
        }
      ],
      input: {
        text: 'Enter your location for personalized alerts'
      },
      state: {
        alertId: alertData.id,
        riskLevel: alertData.riskLevel
      }
    };
  }
}

// Export singleton instance
export const farcasterAPI = new FarcasterAPI();

