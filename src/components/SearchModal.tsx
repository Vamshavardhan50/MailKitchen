import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import {
  BREAKFAST_ITEMS,
  NAAN_POCKET_ITEM,
  HAUSSPEZIALITAETEN_ITEMS,
  AUF_BESTELLUNG_ITEMS,
  NACHTISCH_ITEMS,
  COLD_DRINKS,
  HOT_DRINKS,
  ALKOHOLISCHE_GETRAENKE,
  COCKTAILS
} from '../data/june2026MenuData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ id: string; title: string; desc?: string; price: string; img?: string }[]>([]);

  const ALL_ITEMS = [
    ...BREAKFAST_ITEMS.map((i) => ({ id: i.id, title: `${i.titleDe} / ${i.titleEn}`, desc: i.descDe || i.descEn, price: i.price, img: i.img })),
    { id: NAAN_POCKET_ITEM.id, title: `${NAAN_POCKET_ITEM.titleDe} / ${NAAN_POCKET_ITEM.titleEn}`, desc: NAAN_POCKET_ITEM.descDe || NAAN_POCKET_ITEM.descEn, price: NAAN_POCKET_ITEM.price, img: NAAN_POCKET_ITEM.img },
    ...HAUSSPEZIALITAETEN_ITEMS.map((i) => ({ id: i.id, title: `${i.titleDe} / ${i.titleEn}`, desc: i.descDe || i.descEn, price: i.price, img: i.img })),
    ...AUF_BESTELLUNG_ITEMS.map((i) => ({ id: i.id, title: `${i.titleDe} / ${i.titleEn}`, desc: i.descDe || i.descEn, price: i.price, img: i.img })),
    ...NACHTISCH_ITEMS.map((i) => ({ id: i.id, title: `${i.titleDe} / ${i.titleEn}`, desc: i.descDe || i.descEn, price: i.price, img: i.img })),
    ...COLD_DRINKS.map((d) => ({ id: d.id, title: `${d.titleDe} / ${d.titleEn}`, desc: d.descDe || d.descEn, price: d.price, img: d.img })),
    ...HOT_DRINKS.map((d) => ({ id: d.id, title: `${d.titleDe} / ${d.titleEn}`, desc: d.descDe || d.descEn, price: d.price, img: d.img })),
    ...ALKOHOLISCHE_GETRAENKE.map((d) => ({ id: d.id, title: `${d.titleDe} / ${d.titleEn}`, desc: d.descDe || d.descEn, price: d.price, img: d.img })),
    ...COCKTAILS.map((d) => ({ id: d.id, title: `${d.titleDe} / ${d.titleEn}`, desc: d.descDe || d.descEn, price: d.price, img: d.img }))
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = ALL_ITEMS.filter(
      item => item.title.toLowerCase().includes(q) || (item.desc && item.desc.toLowerCase().includes(q))
    );
    setResults(filtered);
  }, [query]);

  const handleItemClick = (itemId: string) => {
    onClose();
    navigate('/menu');
    setTimeout(() => {
      const el = document.getElementById(itemId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-4', 'ring-[#d85c27]', 'scale-[1.02]');
        setTimeout(() => {
          el.classList.remove('ring-4', 'ring-[#d85c27]', 'scale-[1.02]');
        }, 2000);
      }
    }, 350);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-24 px-3 sm:px-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl sm:rounded-[24px] w-full max-w-[650px] overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[85vh]">

        {/* Search Bar Input */}
        <div className="p-3.5 sm:p-4 border-b border-gray-100 flex items-center gap-2.5 sm:gap-3 bg-[#f5f0e8]">
          <SearchIcon className="w-5 h-5 text-[#d85c27] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search menu items (e.g. Butter Chicken, Lassi)..."
            autoFocus
            className="w-full bg-transparent text-[15px] sm:text-[16px] font-medium text-[#1a1a1a] focus:outline-none placeholder:text-gray-400"
          />

          <kbd
            onClick={onClose}
            className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-bold text-gray-500 bg-gray-200/80 rounded border border-gray-300 shadow-sm cursor-pointer hover:bg-gray-300 transition-colors"
            title="Press Escape to close"
          >
            ESC
          </kbd>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-200/60 text-gray-600 transition-colors shrink-0"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[420px] overflow-y-auto p-3 sm:p-4 space-y-2.5">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-gray-400 text-[13.5px]">
              Type above to search our June 2026 MAATI Menu
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-[13.5px]">
              No menu items found for "{query}"
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-xl hover:bg-[#fdf5f0] hover:border-[#d85c27]/30 transition-all border border-gray-100 cursor-pointer group"
              >
                {item.img && (
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover bg-gray-100 shrink-0 group-hover:scale-105 transition-transform"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[14px] sm:text-[15px] text-[#1a1a1a] group-hover:text-[#d85c27] transition-colors truncate">
                    {item.title}
                  </h4>
                  {item.desc && <p className="text-[11.5px] sm:text-[12px] text-gray-500 line-clamp-1">{item.desc}</p>}
                </div>
                <span className="font-black text-[#d85c27] text-[13.5px] sm:text-[15px] shrink-0">{item.price}</span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
