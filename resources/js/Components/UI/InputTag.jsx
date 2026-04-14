import { useState, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

const focusLater = (ref) => requestAnimationFrame(() => ref.current?.focus());

/**
 * InputTag — tag-style text input that keeps focus after each tag is added.
 *
 * Props:
 *   tags       : string[]  — current list of tags
 *   onChange   : (tags) => void
 *   placeholder: string
 *   suggestions: string[] (optional) — shown as dropdown hints
 */
export default function InputTag({ tags = [], onChange, placeholder = 'Type and press Enter…', suggestions = [] }) {
    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);

    const addTag = useCallback((value) => {
        const trimmed = value.trim();
        if (trimmed && !tags.includes(trimmed)) {
            onChange([...tags, trimmed]);
        }
        setInput('');
        setShowSuggestions(false);
        // Defer focus to after React's DOM commit so re-renders don't steal it back
        focusLater(inputRef);
    }, [tags, onChange]);

    const removeTag = useCallback((index) => {
        onChange(tags.filter((_, i) => i !== index));
        focusLater(inputRef);
    }, [tags, onChange]);

    const handleKeyDown = (e) => {
        if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
            e.preventDefault();
            addTag(input);
        } else if (e.key === 'Backspace' && !input && tags.length > 0) {
            onChange(tags.slice(0, -1));
        }
    };

    const filteredSuggestions = suggestions.filter(
        (s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
    );

    return (
        <div className="relative">
            <div
                className="field flex flex-wrap gap-1.5 min-h-[46px] cursor-text py-2 px-3"
                onClick={() => inputRef.current?.focus()}
            >
                {tags.map((tag, i) => (
                    <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium"
                        style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeTag(i); }}
                            className="hover:text-white transition-colors ml-0.5"
                        >
                            <X size={10} />
                        </button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    placeholder={tags.length === 0 ? placeholder : ''}
                    onChange={(e) => { setInput(e.target.value); setShowSuggestions(true); }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="flex-1 min-w-[80px] bg-transparent outline-none text-sm text-white placeholder-white/30"
                />
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && input && filteredSuggestions.length > 0 && (
                <div
                    className="absolute left-0 right-0 top-full mt-1 rounded-xl z-50 overflow-hidden"
                    style={{ background: 'rgba(15,15,50,0.98)', border: '1px solid rgba(212,175,55,0.2)', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                >
                    {filteredSuggestions.slice(0, 6).map((s) => (
                        <button
                            key={s}
                            type="button"
                            onMouseDown={(e) => {
                            // Prevent blur from firing before addTag — keeps focus on input
                            e.preventDefault();
                            addTag(s);
                        }}
                            className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/5 transition-colors"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
