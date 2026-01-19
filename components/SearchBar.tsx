import React, { useState, useEffect, useRef } from 'react';
import { Search, X, SlidersHorizontal, Mic, MicOff, Stethoscope, Sparkles, LayoutGrid, List } from 'lucide-react';
import { SearchConfig, FilterField, MatchType } from '../types';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  config: SearchConfig;
  onConfigChange: (config: SearchConfig) => void;
  suggestions?: string[];
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
}

// Add type definition for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, config, onConfigChange, suggestions = [], viewMode, onViewModeChange }) => {
  const [localValue, setLocalValue] = useState(value);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value);
    }
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [localValue, onChange, value]);

  useEffect(() => {
    if (localValue.trim().length > 0 && suggestions.length > 0) {
        const lowerVal = localValue.toLowerCase();
        const filtered = suggestions
            .filter(item => item && item.toLowerCase().includes(lowerVal))
            .sort((a, b) => {
                const aStarts = a.toLowerCase().startsWith(lowerVal);
                const bStarts = b.toLowerCase().startsWith(lowerVal);
                if (aStarts && !bStarts) return -1;
                if (!aStarts && bStarts) return 1;
                return 0;
            })
            .slice(0, 5);
        setFilteredSuggestions(filtered);
    } else {
        setFilteredSuggestions([]);
    }
  }, [localValue, suggestions]);

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
              setShowSuggestions(false);
          }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'vi-VN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setLocalValue(transcript);
        onChange(transcript);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [onChange]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleFieldChange = (field: FilterField) => onConfigChange({ ...config, field });
  const handleTypeChange = (matchType: MatchType) => onConfigChange({ ...config, matchType });
  const toggleFavoritesOnly = () => onConfigChange({ ...config, showFavoritesOnly: !config.showFavoritesOnly });

  const handleSuggestionClick = (suggestion: string) => {
      setLocalValue(suggestion);
      onChange(suggestion);
      setShowSuggestions(false);
  };

  const handleClearSearch = () => {
      setLocalValue('');
      onChange('');
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto mb-10" ref={wrapperRef}>
      <div className="flex gap-4 items-stretch">
          {/* Main Input */}
          <div className="relative group z-30 flex-1">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-brand-400 group-focus-within:text-brand-600 dark:group-focus-within:text-brand-400 transition-all duration-300 group-focus-within:scale-110" />
            </div>
            
            <input
              type="text"
              value={localValue}
              onChange={(e) => {
                  setLocalValue(e.target.value);
                  setShowSuggestions(true);
              }}
              onFocus={() => {
                if (localValue.trim() && filteredSuggestions.length > 0) setShowSuggestions(true);
              }}
              className={`block w-full pl-16 pr-24 py-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 dark:focus:border-brand-500 focus:ring-0 transition-all text-lg font-medium shadow-xl shadow-slate-200/50 dark:shadow-black/20
                ${(isExpanded || (showSuggestions && filteredSuggestions.length > 0)) ? 'rounded-t-3xl border-b-slate-100 dark:border-b-slate-700' : 'rounded-[2rem] hover:border-brand-300 dark:hover:border-brand-700'}
                focus:animate-glow
              `}
              placeholder={isListening ? "Đang lắng nghe..." : "Nhập tên thuốc, hoạt chất hoặc mã số..."}
            />
            
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
              {/* Voice Search Button */}
              {recognitionRef.current && (
                <button
                  onClick={toggleListening}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isListening 
                      ? 'bg-red-50 text-red-600 animate-pulse ring-2 ring-red-200' 
                      : 'text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20'
                  }`}
                  title="Tìm kiếm bằng giọng nói"
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
              )}

              {localValue && (
                <button
                  onClick={handleClearSearch}
                  className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Xóa tìm kiếm"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Controls Group */}
          <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="hidden sm:flex bg-white dark:bg-slate-800 p-1.5 rounded-[1.5rem] border border-slate-200 dark:border-slate-700 shadow-sm items-center h-full">
                  <button
                    onClick={() => onViewModeChange('list')}
                    className={`h-full aspect-square flex items-center justify-center rounded-[1.2rem] transition-all ${viewMode === 'list' ? 'bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                  >
                      <List className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onViewModeChange('grid')}
                    className={`h-full aspect-square flex items-center justify-center rounded-[1.2rem] transition-all ${viewMode === 'grid' ? 'bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                  >
                      <LayoutGrid className="w-5 h-5" />
                  </button>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`h-full px-6 flex items-center gap-2 font-bold transition-all rounded-[1.5rem] border-2 shadow-sm active:scale-95
                  ${isExpanded || config.showFavoritesOnly
                    ? 'bg-brand-600 text-white border-brand-600 hover:bg-brand-700 shadow-brand-500/30' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-700'}
                `}
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span className="hidden xl:inline">Bộ lọc</span>
                {(config.showFavoritesOnly) && <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse border-2 border-brand-600"></span>}
              </button>
          </div>
      </div>

      {/* Visualizer for Voice Search */}
      {isListening && (
        <div className="absolute top-full left-0 right-0 mt-2 z-40 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl border border-red-200 dark:border-red-900/50 p-4 shadow-xl flex items-center justify-center gap-2 animate-in slide-in-from-top-2">
            <span className="text-red-500 font-bold text-sm animate-pulse">Đang nghe...</span>
            <div className="flex gap-1 h-4 items-center">
                <div className="w-1 bg-red-500 rounded-full animate-[gentleShake_0.5s_ease-in-out_infinite] h-full"></div>
                <div className="w-1 bg-red-500 rounded-full animate-[gentleShake_0.6s_ease-in-out_infinite] h-3/4"></div>
                <div className="w-1 bg-red-500 rounded-full animate-[gentleShake_0.7s_ease-in-out_infinite] h-1/2"></div>
                <div className="w-1 bg-red-500 rounded-full animate-[gentleShake_0.6s_ease-in-out_infinite] h-3/4"></div>
                <div className="w-1 bg-red-500 rounded-full animate-[gentleShake_0.5s_ease-in-out_infinite] h-full"></div>
            </div>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && !isListening && (
          <div className="absolute top-full mt-[-2px] left-0 w-[calc(100%-160px)] bg-white dark:bg-slate-800 border-x-2 border-b-2 border-slate-100 dark:border-slate-700 rounded-b-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/40 z-20 overflow-hidden backdrop-blur-xl bg-white/95 dark:bg-slate-800/95">
              <ul className="py-2">
                  {filteredSuggestions.map((suggestion, index) => (
                      <li key={index}>
                          <button
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="w-full text-left px-6 py-3.5 text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-700 dark:hover:text-brand-400 transition-colors flex items-center gap-3 group border-l-4 border-transparent hover:border-brand-500"
                          >
                              <Sparkles className="w-4 h-4 text-slate-300 group-hover:text-brand-500 dark:text-slate-600 dark:group-hover:text-brand-400" />
                              <span className="truncate font-medium">{suggestion}</span>
                          </button>
                      </li>
                  ))}
              </ul>
          </div>
      )}

      {/* Advanced Options Dropdown */}
      {isExpanded && !showSuggestions && !isListening && (
        <div className="absolute top-full mt-4 left-0 right-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl border border-slate-200 dark:border-slate-700 rounded-[2rem] shadow-2xl shadow-brand-900/5 dark:shadow-black/50 p-8 z-10 animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-slate-900/5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {/* Field Selection */}
            <div>
              <label className="flex items-center gap-2 text-xs font-extrabold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-5">
                <Stethoscope className="w-4 h-4" />
                Phạm vi tìm kiếm
              </label>
              <div className="space-y-4">
                <label className="flex items-center gap-4 cursor-pointer group p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors -ml-3">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="searchField"
                      checked={config.field === 'all'}
                      onChange={() => handleFieldChange('all')}
                      className="peer h-5 w-5 appearance-none border-2 border-slate-300 dark:border-slate-600 rounded-full checked:border-brand-500 checked:bg-brand-500 transition-all"
                    />
                    <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">Tất cả thông tin</span>
                </label>
                
                <label className="flex items-center gap-4 cursor-pointer group p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors -ml-3">
                   <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="searchField"
                      checked={config.field === 'name'}
                      onChange={() => handleFieldChange('name')}
                      className="peer h-5 w-5 appearance-none border-2 border-slate-300 dark:border-slate-600 rounded-full checked:border-brand-500 checked:bg-brand-500 transition-all"
                    />
                    <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">Tên thuốc / Biệt dược</span>
                </label>

                <label className="flex items-center gap-4 cursor-pointer group p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors -ml-3">
                   <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="searchField"
                      checked={config.field === 'stt'}
                      onChange={() => handleFieldChange('stt')}
                      className="peer h-5 w-5 appearance-none border-2 border-slate-300 dark:border-slate-600 rounded-full checked:border-brand-500 checked:bg-brand-500 transition-all"
                    />
                    <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">Số thứ tự (STT)</span>
                </label>
              </div>
            </div>

            {/* Match Type & Status */}
            <div>
              <label className="block text-xs font-extrabold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-5">
                Tùy chọn khác
              </label>
              <div className="space-y-4">
                <label className="flex items-center gap-4 cursor-pointer group p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors -ml-3">
                   <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="matchType"
                      checked={config.matchType === 'contains'}
                      onChange={() => handleTypeChange('contains')}
                      className="peer h-5 w-5 appearance-none border-2 border-slate-300 dark:border-slate-600 rounded-full checked:border-brand-500 checked:bg-brand-500 transition-all"
                    />
                    <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">Có chứa từ khóa</span>
                </label>

                <label className="flex items-center gap-4 cursor-pointer group p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors -ml-3">
                   <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="matchType"
                      checked={config.matchType === 'exact'}
                      onChange={() => handleTypeChange('exact')}
                      className="peer h-5 w-5 appearance-none border-2 border-slate-300 dark:border-slate-600 rounded-full checked:border-brand-500 checked:bg-brand-500 transition-all"
                    />
                    <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">Khớp chính xác 100%</span>
                </label>
                
                <div className="border-t border-slate-100 dark:border-slate-700 my-2 pt-2"></div>
                
                <label className="flex items-center gap-4 cursor-pointer group select-none p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors -ml-3">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={config.showFavoritesOnly || false}
                      onChange={toggleFavoritesOnly}
                      className="peer h-5 w-5 appearance-none border-2 border-yellow-400 rounded-md checked:bg-yellow-500 checked:border-yellow-500 transition-all"
                    />
                     <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transform scale-50 peer-checked:scale-100 transition-all">
                         <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                     </div>
                  </div>
                  <span className={`text-sm font-bold transition-colors ${config.showFavoritesOnly ? 'text-yellow-700 dark:text-yellow-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    Chỉ hiện mục đã lưu (Favorites)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;