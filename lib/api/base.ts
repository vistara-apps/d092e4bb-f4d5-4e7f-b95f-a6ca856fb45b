import { createPublicClient, http, formatEther, type Address } from 'viem';
import { base } from 'viem/chains';
import { ApiResponse, MicroTransaction, User } from '../types';

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org';

export class BaseAPI {
  private client: any;

  constructor() {
    this.client = createPublicClient({
      chain: base,
      transport: http(BASE_RPC_URL)
    });
  }

  /**
   * Get user's wallet balance
   */
  async getBalance(address: Address): Promise<ApiResponse<string>> {
    try {
      const balance = await this.client.getBalance({ address });
      const balanceInEth = formatEther(balance);

      return { success: true, data: balanceInEth };
    } catch (error) {
      console.error('Error fetching balance:', error);
      return {
        success: false,
        error: 'Failed to fetch wallet balance'
      };
    }
  }

  /**
   * Get transaction history for an address
   */
  async getTransactionHistory(address: Address, limit = 10): Promise<ApiResponse<any[]>> {
    try {
      // Note: This is a simplified implementation
      // In production, you might want to use a more comprehensive indexer
      const blockNumber = await this.client.getBlockNumber();

      // Get recent transactions (this is a basic implementation)
      const transactions = [];

      // This would require a more sophisticated indexer in production
      // For now, return empty array
      return { success: true, data: transactions };
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return {
        success: false,
        error: 'Failed to fetch transaction history'
      };
    }
  }

  /**
   * Validate wallet address
   */
  isValidAddress(address: string): boolean {
    try {
      // Basic validation - check if it's a valid Ethereum address format
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    } catch {
      return false;
    }
  }

  /**
   * Get gas price for transactions
   */
  async getGasPrice(): Promise<ApiResponse<string>> {
    try {
      const gasPrice = await this.client.getGasPrice();
      return { success: true, data: gasPrice.toString() };
    } catch (error) {
      console.error('Error fetching gas price:', error);
      return {
        success: false,
        error: 'Failed to fetch gas price'
      };
    }
  }

  /**
   * Estimate gas for a transaction
   */
  async estimateGas(transaction: any): Promise<ApiResponse<string>> {
    try {
      const gasEstimate = await this.client.estimateGas(transaction);
      return { success: true, data: gasEstimate.toString() };
    } catch (error) {
      console.error('Error estimating gas:', error);
      return {
        success: false,
        error: 'Failed to estimate gas'
      };
    }
  }

  /**
   * Get current block number
   */
  async getBlockNumber(): Promise<ApiResponse<number>> {
    try {
      const blockNumber = await this.client.getBlockNumber();
      return { success: true, data: Number(blockNumber) };
    } catch (error) {
      console.error('Error fetching block number:', error);
      return {
        success: false,
        error: 'Failed to fetch block number'
      };
    }
  }

  /**
   * Check if user has sufficient balance for micro-transaction
   */
  async canAffordTransaction(address: Address, amountInEth: string): Promise<ApiResponse<boolean>> {
    try {
      const balanceResult = await this.getBalance(address);
      if (!balanceResult.success) {
        return balanceResult as ApiResponse<boolean>;
      }

      const balance = parseFloat(balanceResult.data!);
      const required = parseFloat(amountInEth);

      return { success: true, data: balance >= required };
    } catch (error) {
      console.error('Error checking transaction affordability:', error);
      return {
        success: false,
        error: 'Failed to check transaction affordability'
      };
    }
  }

  /**
   * Get network information
   */
  getNetworkInfo() {
    return {
      name: 'Base',
      chainId: 8453,
      rpcUrl: BASE_RPC_URL,
      blockExplorer: 'https://basescan.org',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
      }
    };
  }

  /**
   * Format address for display
   */
  formatAddress(address: string): string {
    if (!this.isValidAddress(address)) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  /**
   * Get user's transaction count (nonce)
   */
  async getTransactionCount(address: Address): Promise<ApiResponse<number>> {
    try {
      const nonce = await this.client.getTransactionCount({ address });
      return { success: true, data: nonce };
    } catch (error) {
      console.error('Error fetching transaction count:', error);
      return {
        success: false,
        error: 'Failed to fetch transaction count'
      };
    }
  }
}

// Export singleton instance
export const baseAPI = new BaseAPI();

