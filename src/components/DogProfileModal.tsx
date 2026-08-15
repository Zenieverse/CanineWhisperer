import React, { useState } from 'react';
import { X, Dog, Check, Sparkles } from 'lucide-react';
import { DogProfile, VoicePersonaId } from '../types';
import { VOICE_PERSONAS } from '../data/dogScenarios';

interface DogProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  dogProfile: DogProfile;
  setDogProfile: React.Dispatch<React.SetStateAction<DogProfile>>;
}

export const DogProfileModal: React.FC<DogProfileModalProps> = ({
  isOpen,
  onClose,
  dogProfile,
  setDogProfile
}) => {
  const [formData, setFormData] = useState<DogProfile>({ ...dogProfile });

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setDogProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/60 backdrop-blur-xs font-sans">
      <div className="bg-white border border-[#1A1A1A] w-full max-w-lg p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 bg-white border border-[#1A1A1A]/30 hover:border-[#1A1A1A] text-[#1A1A1A] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-lg">
            🐾
          </div>
          <div>
            <h3 className="text-xl font-serif italic text-[#1A1A1A]">Edit Canine Profile</h3>
            <p className="text-xs text-[#1A1A1A]/60">Personalize AI behavioral models & speech synthesis</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest block mb-1">Dog Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/30 focus:border-[#1A1A1A] px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest block mb-1">Breed / Mix</label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                required
                className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/30 focus:border-[#1A1A1A] px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest block mb-1">Age (Years)</label>
              <input
                type="number"
                min="0.5"
                max="20"
                step="0.5"
                value={formData.ageYears}
                onChange={(e) => setFormData({ ...formData, ageYears: parseFloat(e.target.value) })}
                className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/30 focus:border-[#1A1A1A] px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest block mb-1">Weight (lbs)</label>
              <input
                type="number"
                min="2"
                max="200"
                value={formData.weightLbs}
                onChange={(e) => setFormData({ ...formData, weightLbs: parseInt(e.target.value) })}
                className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/30 focus:border-[#1A1A1A] px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest block mb-1">Training Level</label>
            <select
              value={formData.trainingLevel}
              onChange={(e) => setFormData({ ...formData, trainingLevel: e.target.value as any })}
              className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/30 focus:border-[#1A1A1A] px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none"
            >
              <option value="Puppy Basics">Puppy Basics (Under 1 Year)</option>
              <option value="Intermediate Obedience">Intermediate Obedience</option>
              <option value="Canine Good Citizen">Canine Good Citizen (CGC)</option>
              <option value="Master Companion">Master Companion</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest block mb-1">Voice Persona (ElevenLabs)</label>
            <select
              value={formData.voicePersona}
              onChange={(e) => setFormData({ ...formData, voicePersona: e.target.value as VoicePersonaId })}
              className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/30 focus:border-[#1A1A1A] px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none"
            >
              {VOICE_PERSONAS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.avatar} {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-[#1A1A1A]/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#1A1A1A]/30 hover:border-[#1A1A1A] bg-white hover:bg-[#FAF9F6] text-xs font-bold uppercase tracking-wider text-[#1A1A1A] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1A1A1A] hover:bg-black text-[#FAF9F6] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
