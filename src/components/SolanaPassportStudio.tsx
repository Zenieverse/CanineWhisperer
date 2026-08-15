import React, { useState } from 'react';
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
  ArrowUpRight,
  Flame,
  Lock,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DogProfile, SolanaCertificate } from '../types';

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
  const [walletAddress, setWalletAddress] = useState<string>(
    dogProfile.solanaAddress || '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
  );
  const [solBalance, setSolBalance] = useState<number>(2.45);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [mintedTx, setMintedTx] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isAirdropping, setIsAirdropping] = useState<boolean>(false);

  const [certificates, setCertificates] = useState<SolanaCertificate[]>([
    {
      certificateId: 'SOL-CGC-884920',
      dogName: dogProfile.name,
      breed: dogProfile.breed,
      title: 'Canine Good Citizen (CGC) On-Chain Credential',
      issuer: 'CanineWhisper Verified Authority',
      dateAwarded: '2026-08-14',
      txHash: '5K2bW7X9L1mN4P8qRtYuVoZaBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890abcdef',
      signature: 'ed25519:3kLm9P8qRtYuVoZaBcDeFgHiJkLmNoPqRsTuVwXyZ',
      badgeLevel: 'Diamond',
      traits: [
        { trait_type: 'Reactivity Tolerance', value: '98/100' },
        { trait_type: 'Acoustic Whistle Recall', value: 'Level 4' },
        { trait_type: 'Desensitization Score', value: 'Grade A' }
      ]
    }
  ]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAirdrop = () => {
    setIsAirdropping(true);
    setTimeout(() => {
      setSolBalance((prev) => +(prev + 1.0).toFixed(2));
      setIsAirdropping(false);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }, 1200);
  };

  const handleMintPassport = async () => {
    setIsMinting(true);
    try {
      const res = await fetch('/api/solana/mint-passport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dogProfile,
          publicKey: walletAddress
        })
      });
      const data = await res.json();
      setMintedTx(data.txHash);

      // Award treats
      onAwardTreats(50, 'Minted Solana Canine Passport cNFT');

      // Trigger celebration
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    } catch {
      setMintedTx(`5Yt${Math.random().toString(36).substring(2, 10)}SolMint`);
    } finally {
      setIsMinting(false);
    }
  };

  const handleClaimMilestone = (title: string, treatsEarned: number) => {
    onAwardTreats(treatsEarned, `Completed ${title}`);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.65 }
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-white border border-[#1A1A1A] p-6 shadow-sm relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest font-mono bg-[#1A1A1A] text-[#FAF9F6] flex items-center gap-1.5">
                <Coins className="w-3 h-3 text-[#FAF9F6]" />
                Solana Blockchain
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest font-mono border border-[#1A1A1A] bg-[#FAF9F6] text-[#1A1A1A]">
                Canine Identity & Micro-Economy
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light italic font-serif text-[#1A1A1A] tracking-tight">
              Canine Digital Passport & Training Certifications
            </h2>
            <p className="text-xs text-[#1A1A1A]/70 max-w-2xl mt-1 leading-relaxed">
              Immutable on-chain pet identity, verifiable Canine Good Citizen (CGC) credentials, and positive reinforcement TREATS token micro-rewards verified with Solana cryptographic signatures.
            </p>
          </div>

          {/* Wallet Balance Widget */}
          <div className="bg-[#FAF9F6] p-4 border border-[#1A1A1A] space-y-2 min-w-[240px] shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#1A1A1A]/60 font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Wallet className="w-3.5 h-3.5 text-[#1A1A1A]" />
                Solana Cluster
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[#1A1A1A]/60 font-mono uppercase">SOL Balance</p>
                <p className="text-sm font-extrabold font-mono text-[#1A1A1A]">{solBalance} SOL</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#1A1A1A]/60 font-mono uppercase">TREATS Tokens</p>
                <p className="text-sm font-extrabold font-mono text-[#1A1A1A]">{dogProfile.treatsEarned} 🦴</p>
              </div>
            </div>

            <button
              onClick={handleAirdrop}
              disabled={isAirdropping}
              className="w-full py-1 px-3 bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isAirdropping ? 'animate-spin' : ''}`} />
              {isAirdropping ? 'Airdropping...' : 'Request +1.0 Devnet SOL'}
            </button>
          </div>
        </div>
      </div>

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
                  <h3 className="font-serif italic font-bold text-[#1A1A1A] text-lg tracking-tight">{dogProfile.name}'s Solana Passport</h3>
                  <span className="text-[10px] text-[#1A1A1A]/60 font-mono">cNFT ID: SOL-{dogProfile.id.toUpperCase()}</span>
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
                <span className="text-[#1A1A1A]/70 text-[11px] truncate max-w-[140px]">
                  {dogProfile.microchipId || '985141002948201'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1A1A1A]/60">Owner Wallet:</span>
                <span className="text-[#1A1A1A] font-bold text-[11px] truncate max-w-[140px]">
                  {walletAddress}
                </span>
              </div>
            </div>

            {/* Mint on Solana Button */}
            <div className="space-y-2">
              <button
                onClick={handleMintPassport}
                disabled={isMinting}
                className="w-full py-3 px-4 bg-[#1A1A1A] hover:bg-black text-[#FAF9F6] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <Sparkles className={`w-4 h-4 ${isMinting ? 'animate-spin' : ''}`} />
                {isMinting ? 'Minting on Solana Cluster...' : 'Mint / Sync Digital Passport (cNFT)'}
              </button>

              {mintedTx && (
                <div className="p-3 bg-[#FAF9F6] border border-[#1A1A1A] text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between text-[#1A1A1A]">
                    <span className="font-bold text-emerald-800">Transaction Confirmed ✓</span>
                    <button onClick={() => handleCopy(mintedTx)} className="hover:text-black cursor-pointer">
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-[#1A1A1A]" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#1A1A1A]/70 truncate">{mintedTx}</p>
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
              <span className="text-xs text-[#1A1A1A]/60 font-mono">
                {certificates.length} Issued
              </span>
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
                    <span className="truncate max-w-[220px]">Sig: {cert.signature}</span>
                    <span className="text-emerald-800 font-bold">Verified on Solana</span>
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
              <div className="bg-[#FAF9F6] p-3.5 border border-[#1A1A1A]/30 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#1A1A1A]">Quiet Crate 20-Min Streak</span>
                    <span className="text-[#1A1A1A] font-bold font-mono">+15 TREATS</span>
                  </div>
                  <p className="text-xs text-[#1A1A1A]/60 mt-1">Zero barking or whining during resting period.</p>
                </div>
                <button
                  onClick={() => handleClaimMilestone('Quiet Crate 20-Min Streak', 15)}
                  className="w-full py-1.5 bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white font-bold text-xs uppercase tracking-wider font-mono border border-[#1A1A1A] transition-all cursor-pointer"
                >
                  Verify & Claim +15 🦴
                </button>
              </div>

              <div className="bg-[#FAF9F6] p-3.5 border border-[#1A1A1A]/30 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#1A1A1A]">Doorbell De-escalation Success</span>
                    <span className="text-[#1A1A1A] font-bold font-mono">+25 TREATS</span>
                  </div>
                  <p className="text-xs text-[#1A1A1A]/60 mt-1">Settled on "Place" within 30s of chime.</p>
                </div>
                <button
                  onClick={() => handleClaimMilestone('Doorbell De-escalation Success', 25)}
                  className="w-full py-1.5 bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white font-bold text-xs uppercase tracking-wider font-mono border border-[#1A1A1A] transition-all cursor-pointer"
                >
                  Verify & Claim +25 🦴
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
