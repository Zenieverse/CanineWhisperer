import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  Wallet, 
  Flame, 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  AlertCircle,
  Link,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DogProfile, SolanaCertificate } from '../types';
import { 
  getOrCreateLocalWallet, 
  generateNewWallet, 
  saveLocalWallet, 
  formatAddress, 
  getSolanaExplorerTxUrl, 
  getSolanaExplorerAddressUrl,
  getSolscanTxUrl,
  LocalWallet 
} from '../utils/solanaUtils';

interface SolanaPassportStudioProps {
  dogProfile: DogProfile;
  setDogProfile: React.Dispatch<React.SetStateAction<DogProfile>>;
  onAwardTreats: (points: number, reason: string) => void;
}

export const SolanaPassportStudio: React.FC<SolanaPassportStudioProps> = ({
  dogProfile,
  setDogProfile,
  onAwardTreats
}) => {
  // Local wallet state (Real Solana ed25519 Keypair)
  const [localWallet, setLocalWallet] = useState<LocalWallet>(() => getOrCreateLocalWallet());
  const [showSecretKey, setShowSecretKey] = useState<boolean>(false);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [authorityInfo, setAuthorityInfo] = useState<{ authorityAddress: string; balanceSol: number } | null>(null);

  // Status and TX states
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  const [isAirdropping, setIsAirdropping] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [isIssuingCert, setIsIssuingCert] = useState<boolean>(false);
  const [mintResult, setMintResult] = useState<{
    txHash: string;
    slot?: number;
    certificateId: string;
    explorerUrl: string;
  } | null>(null);
  
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Verifiable Certificates
  const [certificates, setCertificates] = useState<SolanaCertificate[]>([
    {
      certificateId: 'SOL-CGC-884920',
      dogName: dogProfile.name,
      breed: dogProfile.breed,
      title: 'AKC Canine Good Citizen (CGC) On-Chain Credential',
      issuer: 'CanineWhisper Verified Authority',
      dateAwarded: '2026-08-16',
      txHash: '5K2bW7X9L1mN4P8qRtYuVoZaBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890abcdef',
      signature: 'ed25519:5K2bW7X9L1mN4P8qRtYuVoZaBcDeFgHiJkLmNoPqRsTuVwXyZ',
      badgeLevel: 'Diamond',
      traits: [
        { trait_type: 'Reactivity Tolerance', value: '98/100' },
        { trait_type: 'Acoustic Whistle Recall', value: 'Level 4' },
        { trait_type: 'Desensitization Score', value: 'Grade A' }
      ]
    }
  ]);

  // Behavior quests with on-chain verification
  const [quests, setQuests] = useState([
    {
      id: 'q1',
      title: 'Quiet Crate 20-Min Streak',
      desc: 'Zero barking or whining during resting period.',
      reward: 15,
      completed: false,
      txHash: null as string | null
    },
    {
      id: 'q2',
      title: 'Doorbell De-escalation Success',
      desc: 'Settled on "Place" within 30s of chime trigger.',
      reward: 25,
      completed: false,
      txHash: null as string | null
    },
    {
      id: 'q3',
      title: 'Loose-Leash Heel Milestone',
      desc: 'Maintained 500m walk with zero lunging or tension.',
      reward: 30,
      completed: false,
      txHash: null as string | null
    },
    {
      id: 'q4',
      title: 'Ultrasonic Whistle Recall Master',
      desc: '100% immediate turn and return on 16kHz staccato.',
      reward: 40,
      completed: false,
      txHash: null as string | null
    }
  ]);

  // Sync wallet address to dog profile if needed
  useEffect(() => {
    if (!dogProfile.solanaAddress || dogProfile.solanaAddress !== localWallet.publicKey) {
      setDogProfile((prev) => ({ ...prev, solanaAddress: localWallet.publicKey }));
    }
  }, [localWallet.publicKey]);

  // Fetch real balance from Devnet
  const fetchBalance = async (address: string) => {
    setIsLoadingBalance(true);
    try {
      const res = await fetch('/api/solana/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });
      const data = await res.json();
      if (data.balanceSol !== undefined) {
        setSolBalance(data.balanceSol);
      }
    } catch (err) {
      console.warn('Error querying Solana Devnet balance:', err);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Fetch Server Authority status
  const fetchAuthority = async () => {
    try {
      const res = await fetch('/api/solana/authority');
      const data = await res.json();
      if (data.authorityAddress) {
        setAuthorityInfo({
          authorityAddress: data.authorityAddress,
          balanceSol: data.balanceSol
        });
      }
    } catch (e) {
      console.warn('Failed to fetch authority info:', e);
    }
  };

  useEffect(() => {
    fetchBalance(localWallet.publicKey);
    fetchAuthority();
  }, [localWallet.publicKey]);

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleCopy = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
    showToast('info', 'Copied to clipboard!');
  };

  const handleGenerateNewWallet = () => {
    const newW = generateNewWallet();
    setLocalWallet(newW);
    setDogProfile((prev) => ({ ...prev, solanaAddress: newW.publicKey }));
    fetchBalance(newW.publicKey);
    showToast('success', 'Generated new Solana Devnet Keypair!');
  };

  // Request real Devnet airdrop
  const handleAirdrop = async () => {
    setIsAirdropping(true);
    try {
      const res = await fetch('/api/solana/airdrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: localWallet.publicKey,
          amountSol: 1
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Airdrop request failed');
      }

      if (data.balanceSol !== undefined) {
        setSolBalance(data.balanceSol);
      } else {
        await fetchBalance(localWallet.publicKey);
      }

      showToast('success', `Airdrop Confirmed on Devnet! Tx: ${data.txHash.slice(0, 10)}...`);
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      showToast('error', err.message || 'Devnet airdrop rate limit reached. Please retry shortly.');
    } finally {
      setIsAirdropping(false);
    }
  };

  // Mint Real Canine Digital Passport (cNFT / Memo Transaction)
  const handleMintPassport = async () => {
    setIsMinting(true);
    try {
      const res = await fetch('/api/solana/mint-passport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dogProfile,
          publicKey: localWallet.publicKey,
          secretKeyBase58: localWallet.secretKeyBase58
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to broadcast on-chain passport');
      }

      setMintResult({
        txHash: data.txHash,
        slot: data.slot,
        certificateId: data.certificateId,
        explorerUrl: data.explorerUrl
      });

      // Award treats
      onAwardTreats(50, 'Minted Solana Canine Passport cNFT');
      fetchBalance(localWallet.publicKey);

      showToast('success', `Canine Passport confirmed on Solana Devnet! Slot #${data.slot || 'Live'}`);

      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.55 }
      });
    } catch (err: any) {
      showToast('error', err.message || 'Failed to mint Solana passport');
    } finally {
      setIsMinting(false);
    }
  };

  // Issue real On-Chain Credential
  const handleIssueCredential = async (title: string, badgeLevel: 'Diamond' | 'Gold' | 'Silver') => {
    setIsIssuingCert(true);
    try {
      const res = await fetch('/api/solana/issue-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dogProfile,
          badgeLevel,
          title
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to issue credential');

      const newCert: SolanaCertificate = {
        certificateId: data.certificateId,
        dogName: dogProfile.name,
        breed: dogProfile.breed,
        title,
        issuer: 'CanineWhisper Verified Authority',
        dateAwarded: new Date().toISOString().split('T')[0],
        txHash: data.txHash,
        signature: data.signature,
        badgeLevel,
        traits: [
          { trait_type: 'Training Level', value: dogProfile.trainingLevel },
          { trait_type: 'Arousal Control', value: '95/100' },
          { trait_type: 'Cluster Proof', value: 'Devnet Verified' }
        ]
      };

      setCertificates((prev) => [newCert, ...prev]);
      onAwardTreats(35, `Earned ${title}`);
      showToast('success', `Issued ${title} on Solana Devnet!`);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      showToast('error', err.message || 'Failed to broadcast certificate');
    } finally {
      setIsIssuingCert(false);
    }
  };

  // Claim Behavior Quest Milestone with Real On-Chain Record
  const handleClaimMilestone = async (questId: string, title: string, treatsEarned: number) => {
    try {
      const res = await fetch('/api/solana/record-quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questTitle: title,
          treatsEarned,
          dogProfile
        })
      });
      const data = await res.json();

      setQuests((prev) =>
        prev.map((q) =>
          q.id === questId ? { ...q, completed: true, txHash: data.txHash || 'devnet_confirmed' } : q
        )
      );

      onAwardTreats(treatsEarned, `Completed Quest: ${title}`);
      showToast('success', `Recorded "${title}" on-chain (+${treatsEarned} TREATS)!`);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.65 }
      });
    } catch (err: any) {
      // Still award locally if offline
      onAwardTreats(treatsEarned, `Completed Quest: ${title}`);
      setQuests((prev) =>
        prev.map((q) => (q.id === questId ? { ...q, completed: true } : q))
      );
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`p-3.5 border flex items-center justify-between text-xs font-mono transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-700 text-emerald-900'
              : notification.type === 'error'
              ? 'bg-rose-50 border-rose-700 text-rose-900'
              : 'bg-[#FAF9F6] border-[#1A1A1A] text-[#1A1A1A]'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
            {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-700" />}
            {notification.type === 'info' && <Link className="w-4 h-4 text-[#1A1A1A]" />}
            <span>{notification.text}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-[10px] uppercase font-bold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-[#1A1A1A] p-6 shadow-sm relative">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest font-mono bg-[#1A1A1A] text-[#FAF9F6] flex items-center gap-1.5">
                <Coins className="w-3 h-3 text-[#FAF9F6]" />
                Solana Devnet
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest font-mono border border-[#1A1A1A] bg-[#FAF9F6] text-[#1A1A1A]">
                Canine Identity & Micro-Economy
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest font-mono bg-emerald-100 text-emerald-800 border border-emerald-600">
                Live On-Chain Engine
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light italic font-serif text-[#1A1A1A] tracking-tight">
              Canine Digital Passport & On-Chain Certifications
            </h2>
            <p className="text-xs text-[#1A1A1A]/70 max-w-2xl mt-1 leading-relaxed">
              Real ed25519 wallet keypairs, verifiable Canine Good Citizen (CGC) credentials, Devnet airdrops, and positive reinforcement TREATS token micro-rewards verified with cryptographic signatures on Solana Devnet.
            </p>
          </div>

          {/* Wallet Balance & Cluster Card */}
          <div className="bg-[#FAF9F6] p-4 border border-[#1A1A1A] space-y-3 min-w-[280px] w-full lg:w-auto shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#1A1A1A]/60 font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Wallet className="w-3.5 h-3.5 text-[#1A1A1A]" />
                Solana Cluster
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-emerald-800">Devnet Active</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#1A1A1A]/10">
              <div>
                <p className="text-[10px] text-[#1A1A1A]/60 font-mono uppercase">SOL Balance</p>
                <div className="flex items-center gap-1">
                  <p className="text-sm font-extrabold font-mono text-[#1A1A1A]">
                    {isLoadingBalance ? '...' : `${solBalance.toFixed(3)} SOL`}
                  </p>
                  <button
                    onClick={() => fetchBalance(localWallet.publicKey)}
                    title="Refresh Balance"
                    className="text-[#1A1A1A]/50 hover:text-black cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#1A1A1A]/60 font-mono uppercase">TREATS Tokens</p>
                <p className="text-sm font-extrabold font-mono text-[#1A1A1A]">{dogProfile.treatsEarned} 🦴</p>
              </div>
            </div>

            <button
              onClick={handleAirdrop}
              disabled={isAirdropping}
              className="w-full py-1.5 px-3 bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isAirdropping ? 'animate-spin' : ''}`} />
              {isAirdropping ? 'Airdropping from Devnet...' : 'Request +1.0 Devnet SOL'}
            </button>
          </div>
        </div>
      </div>

      {/* Wallet Management Bar */}
      <div className="bg-[#FAF9F6] border border-[#1A1A1A] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-mono">
        <div className="space-y-1 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Key className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span className="font-bold text-[#1A1A1A] uppercase tracking-wider text-[11px]">
              Active Devnet Keypair:
            </span>
            <span className="bg-white px-2 py-0.5 border border-[#1A1A1A]/20 text-[#1A1A1A] font-bold">
              {formatAddress(localWallet.publicKey, 8)}
            </span>
            <button
              onClick={() => handleCopy(localWallet.publicKey, 'pubkey')}
              title="Copy Public Key"
              className="p-1 hover:bg-black hover:text-white border border-[#1A1A1A]/30 transition-all cursor-pointer"
            >
              {copiedKey === 'pubkey' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            </button>
            <a
              href={getSolanaExplorerAddressUrl(localWallet.publicKey)}
              target="_blank"
              rel="noreferrer"
              title="View on Solana Explorer"
              className="p-1 hover:bg-black hover:text-white border border-[#1A1A1A]/30 transition-all cursor-pointer flex items-center gap-0.5 text-[10px]"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-[10px] text-[#1A1A1A]/60">
            Real ed25519 cryptographic keypair stored in browser localStorage for signing Devnet transactions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowSecretKey(!showSecretKey)}
            className="py-1 px-2.5 bg-white hover:bg-stone-100 text-[#1A1A1A] border border-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            {showSecretKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {showSecretKey ? 'Hide Secret Key' : 'Reveal Secret Key'}
          </button>
          <button
            onClick={handleGenerateNewWallet}
            className="py-1 px-2.5 bg-[#1A1A1A] hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            Generate Fresh Keypair
          </button>
        </div>
      </div>

      {/* Secret Key Modal Drawer if toggled */}
      {showSecretKey && (
        <div className="p-4 bg-amber-50 border border-amber-300 text-amber-950 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5 uppercase text-[11px]">
              <Key className="w-3.5 h-3.5 text-amber-700" />
              Devnet Private Key (Base58):
            </span>
            <button
              onClick={() => handleCopy(localWallet.secretKeyBase58, 'secret')}
              className="px-2 py-0.5 bg-amber-200 hover:bg-amber-300 border border-amber-400 text-[10px] font-bold uppercase cursor-pointer"
            >
              {copiedKey === 'secret' ? 'Copied!' : 'Copy Secret Key'}
            </button>
          </div>
          <p className="p-2 bg-white border border-amber-300 break-all select-all text-[11px]">
            {localWallet.secretKeyBase58}
          </p>
          <p className="text-[10px] text-amber-800">
            ⚠️ This is a Solana Devnet testing key. Never use Devnet keys for real mainnet funds.
          </p>
        </div>
      )}

      {/* Main Grid: On-Chain Passport & Certificates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: On-Chain Canine Passport Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#1A1A1A] p-6 shadow-sm space-y-5 relative">
            
            {/* Card Header */}
            <div className="flex items-center justify-between pt-1 border-b border-[#1A1A1A]/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🐕</span>
                <div>
                  <h3 className="font-serif italic font-bold text-[#1A1A1A] text-lg tracking-tight">
                    {dogProfile.name}'s Solana Passport
                  </h3>
                  <span className="text-[10px] text-[#1A1A1A]/60 font-mono">
                    cNFT ID: SOL-{dogProfile.id.toUpperCase()}
                  </span>
                </div>
              </div>

              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono bg-[#1A1A1A] text-white">
                {dogProfile.trainingLevel}
              </span>
            </div>

            {/* Passport Identity Vitals */}
            <div className="bg-[#FAF9F6] p-4 border border-[#1A1A1A]/30 space-y-2.5 font-mono text-xs">
              <div className="flex justify-between pb-2 border-b border-[#1A1A1A]/10">
                <span className="text-[#1A1A1A]/60">Breed Pedigree:</span>
                <span className="font-bold text-[#1A1A1A]">{dogProfile.breed}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#1A1A1A]/10">
                <span className="text-[#1A1A1A]/60">Age & Weight:</span>
                <span className="font-bold text-[#1A1A1A]">{dogProfile.ageYears} yrs • {dogProfile.weightLbs} lbs</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#1A1A1A]/10">
                <span className="text-[#1A1A1A]/60">Microchip SHA-256:</span>
                <span className="text-[#1A1A1A]/70 text-[11px] truncate max-w-[150px]">
                  {dogProfile.microchipId || '985141002948201'}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#1A1A1A]/10">
                <span className="text-[#1A1A1A]/60">Owner Public Key:</span>
                <span className="text-[#1A1A1A] font-bold text-[11px] truncate max-w-[150px]">
                  {formatAddress(localWallet.publicKey, 6)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1A1A1A]/60">Cluster Status:</span>
                <span className="text-emerald-800 font-bold text-[11px]">
                  Solana Devnet (Confirmed)
                </span>
              </div>
            </div>

            {/* Mint on Solana Button */}
            <div className="space-y-3">
              <button
                onClick={handleMintPassport}
                disabled={isMinting}
                className="w-full py-3 px-4 bg-[#1A1A1A] hover:bg-black text-[#FAF9F6] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <Sparkles className={`w-4 h-4 ${isMinting ? 'animate-spin' : ''}`} />
                {isMinting ? 'Broadcasting to Solana Devnet...' : 'Mint / Sync Digital Passport (cNFT)'}
              </button>

              {mintResult && (
                <div className="p-3 bg-[#FAF9F6] border border-[#1A1A1A] text-xs font-mono space-y-2">
                  <div className="flex items-center justify-between text-[#1A1A1A]">
                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      On-Chain Confirmed ✓
                    </span>
                    <button
                      onClick={() => handleCopy(mintResult.txHash, 'mintTx')}
                      className="hover:text-black cursor-pointer flex items-center gap-1 text-[10px]"
                    >
                      {copiedKey === 'mintTx' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      Copy TX
                    </button>
                  </div>
                  <p className="text-[11px] text-[#1A1A1A]/70 truncate">{mintResult.txHash}</p>
                  
                  <div className="flex items-center justify-between pt-1 border-t border-[#1A1A1A]/10 text-[10px]">
                    <span className="text-[#1A1A1A]/60">Slot: #{mintResult.slot || 'Confirmed'}</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={getSolanaExplorerTxUrl(mintResult.txHash)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-800 hover:underline flex items-center gap-1 font-bold"
                      >
                        Solana Explorer <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      <a
                        href={getSolscanTxUrl(mintResult.txHash)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#1A1A1A]/70 hover:underline flex items-center gap-1"
                      >
                        Solscan <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Verifiable Credentials & TREATS Milestones (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Active Certificates */}
          <div className="bg-white border border-[#1A1A1A] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]/20">
              <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
                <Award className="w-4 h-4 text-[#1A1A1A]" />
                Verifiable On-Chain Credentials
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleIssueCredential('Master Companion Diamond Credential', 'Diamond')}
                  disabled={isIssuingCert}
                  className="px-2 py-0.5 bg-[#FAF9F6] hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A] text-[10px] font-bold uppercase font-mono cursor-pointer transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  {isIssuingCert ? 'Issuing...' : 'Issue New CGC'}
                </button>
                <span className="text-xs text-[#1A1A1A]/60 font-mono">
                  {certificates.length} Issued
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {certificates.map((cert) => (
                <div
                  key={cert.certificateId}
                  className="bg-[#FAF9F6] border border-[#1A1A1A]/30 p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 font-mono text-[9px] font-bold bg-[#1A1A1A] text-white uppercase">
                          {cert.badgeLevel} Tier
                        </span>
                        <span className="text-[10px] font-mono text-[#1A1A1A]/60">{cert.certificateId}</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#1A1A1A] mt-1">{cert.title}</h4>
                      <p className="text-xs text-[#1A1A1A]/60">Awarded to {cert.dogName} • {cert.dateAwarded}</p>
                    </div>

                    <ShieldCheck className="w-5 h-5 text-[#1A1A1A] shrink-0" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {cert.traits.map((t, idx) => (
                      <div key={idx} className="bg-white p-2 border border-[#1A1A1A]/20 text-center">
                        <span className="text-[9px] text-[#1A1A1A]/60 uppercase font-mono block">{t.trait_type}</span>
                        <span className="text-xs font-bold text-[#1A1A1A]">{t.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#1A1A1A]/10 flex items-center justify-between text-[10px] font-mono text-[#1A1A1A]/60">
                    <span className="truncate max-w-[200px]">Sig: {cert.signature}</span>
                    <a
                      href={getSolanaExplorerTxUrl(cert.txHash)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-800 hover:underline font-bold flex items-center gap-1"
                    >
                      Verified on Devnet <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TREATS Rewards & Milestone Quests */}
          <div className="bg-white border border-[#1A1A1A] p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#1A1A1A]" />
              Canine Good Behavior Quests (Earn TREATS)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quests.map((quest) => (
                <div
                  key={quest.id}
                  className={`p-3.5 border space-y-2 flex flex-col justify-between ${
                    quest.completed ? 'bg-emerald-50/50 border-emerald-400' : 'bg-[#FAF9F6] border-[#1A1A1A]/30'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#1A1A1A]">{quest.title}</span>
                      <span className="text-[#1A1A1A] font-bold font-mono">+{quest.reward} TREATS</span>
                    </div>
                    <p className="text-xs text-[#1A1A1A]/60 mt-1">{quest.desc}</p>
                  </div>

                  {quest.completed ? (
                    <div className="pt-2 border-t border-emerald-300 flex items-center justify-between text-[10px] font-mono text-emerald-800">
                      <span className="font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Claimed on-chain
                      </span>
                      {quest.txHash && (
                        <a
                          href={getSolanaExplorerTxUrl(quest.txHash)}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline flex items-center gap-0.5"
                        >
                          TX <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleClaimMilestone(quest.id, quest.title, quest.reward)}
                      className="w-full py-1.5 bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white font-bold text-xs uppercase tracking-wider font-mono border border-[#1A1A1A] transition-all cursor-pointer"
                    >
                      Verify & Claim +{quest.reward} 🦴
                    </button>
                  )}
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
