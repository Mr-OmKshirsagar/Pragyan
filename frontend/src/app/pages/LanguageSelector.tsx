import { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { Icons } from '../components/Icons';

interface LanguageSelectorProps {
  onContinue: (language: string) => void;
}

export function LanguageSelector({ onContinue }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  const languages = [
    { id: 'english', name: 'English', flag: '🇺🇸', native: 'English' },
    { id: 'hindi', name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
    { id: 'spanish', name: 'Spanish', flag: '🇪🇸', native: 'Español' },
    { id: 'french', name: 'French', flag: '🇫🇷', native: 'Français' },
    { id: 'german', name: 'German', flag: '🇩🇪', native: 'Deutsch' },
    { id: 'chinese', name: 'Chinese', flag: '🇨🇳', native: '中文' },
    { id: 'japanese', name: 'Japanese', flag: '🇯🇵', native: '日本語' },
    { id: 'arabic', name: 'Arabic', flag: '🇸🇦', native: 'العربية' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-3xl">🌍</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Choose Your Language
          </h1>
          <p className="text-sm md:text-base text-gray-400">
            Select your preferred language for the best experience
          </p>
        </div>

        <GlassCard strong className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  selectedLanguage === lang.id
                    ? 'gradient-primary shadow-lg shadow-indigo-500/50'
                    : 'glass hover:glass-strong'
                }`}
              >
                <div className="text-3xl mb-2">{lang.flag}</div>
                <div className={`font-semibold text-sm mb-0.5 ${
                  selectedLanguage === lang.id ? 'text-white' : 'text-gray-300'
                }`}>
                  {lang.name}
                </div>
                <div className={`text-xs ${
                  selectedLanguage === lang.id ? 'text-indigo-200' : 'text-gray-500'
                }`}>
                  {lang.native}
                </div>
              </button>
            ))}
          </div>

          <div className="glass rounded-lg p-3 mb-4 flex items-center gap-2">
            <Icons.Sparkles />
            <p className="text-xs text-gray-400">
              Don't worry! You can change your language anytime from settings
            </p>
          </div>

          <GlassButton
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => onContinue(selectedLanguage)}
          >
            Continue to Assessment →
          </GlassButton>
        </GlassCard>
      </div>
    </div>
  );
}
