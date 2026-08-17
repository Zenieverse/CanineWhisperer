import { Keypair, PublicKey } from '@solana/web3.js';
import bs58Module from 'bs58';

const bs58 = (bs58Module as any).default || bs58Module;

const STORAGE_KEY = 'canine_whisperer_solana_keypair';

export interface LocalWallet {
  publicKey: string;
  secretKeyBase58: string;
  isCustom: boolean;
}

/**
 * Loads existing keypair from local storage or generates a brand new one
 */
export function getOrCreateLocalWallet(): LocalWallet {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.secretKeyBase58 && parsed.publicKey) {
        // Validate valid keypair
        const decoded = bs58.decode(parsed.secretKeyBase58);
        const kp = Keypair.fromSecretKey(decoded);
        return {
          publicKey: kp.publicKey.toBase58(),
          secretKeyBase58: parsed.secretKeyBase58,
          isCustom: true
        };
      }
    }
  } catch (err) {
    console.warn('Error reading stored Solana keypair:', err);
  }

  // Generate new keypair
  const newKp = Keypair.generate();
  const wallet: LocalWallet = {
    publicKey: newKp.publicKey.toBase58(),
    secretKeyBase58: bs58.encode(newKp.secretKey),
    isCustom: true
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
  return wallet;
}

/**
 * Saves a new or imported keypair
 */
export function saveLocalWallet(secretKeyBase58: string): LocalWallet {
  const decoded = bs58.decode(secretKeyBase58.trim());
  const kp = Keypair.fromSecretKey(decoded);
  const wallet: LocalWallet = {
    publicKey: kp.publicKey.toBase58(),
    secretKeyBase58: secretKeyBase58.trim(),
    isCustom: true
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
  return wallet;
}

/**
 * Generates a fresh keypair and saves to local storage
 */
export function generateNewWallet(): LocalWallet {
  const newKp = Keypair.generate();
  const wallet: LocalWallet = {
    publicKey: newKp.publicKey.toBase58(),
    secretKeyBase58: bs58.encode(newKp.secretKey),
    isCustom: true
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
  return wallet;
}

/**
 * Formats a Solana address for clean UI display (e.g. 7xKX...sgAsU)
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Generates official Solana Explorer URL for Devnet
 */
export function getSolanaExplorerTxUrl(txHash: string): string {
  return `https://explorer.solana.com/tx/${txHash}?cluster=devnet`;
}

export function getSolanaExplorerAddressUrl(address: string): string {
  return `https://explorer.solana.com/address/${address}?cluster=devnet`;
}

export function getSolscanTxUrl(txHash: string): string {
  return `https://solscan.io/tx/${txHash}?cluster=devnet`;
}
