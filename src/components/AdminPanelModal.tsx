import React, { useState } from 'react';
import { X, Plus, Database, RefreshCw, Check } from 'lucide-react';
import { LunchItem } from '../data/content';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLunchItem: (item: LunchItem) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ isOpen, onClose, onAddLunchItem }) => {
  const [sanityProjectId, setSanityProjectId] = useState('');
  const [sanityDataset, setSanityDataset] = useState('production');
  const [connected, setConnected] = useState(false);

  // New Item Form
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('€10.9');
  const [badge, setBadge] = useState<'NON-VEGETARIAN' | 'VEGETARIAN' | 'VEGAN'>('NON-VEGETARIAN');
  const [img, setImg] = useState('/assets/Delhi-BteN_mdh.png');

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveSanity = (e: React.FormEvent) => {
    e.preventDefault();
    setConnected(true);
    alert(`Sanity.io configuration saved! Connected to project: ${sanityProjectId || 'Default'}`);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc) return;

    const newItem: LunchItem = {
      id: `custom-${Date.now()}`,
      title,
      desc,
      price,
      badge,
      img
    };

    onAddLunchItem(newItem);
    setTitle('');
    setDesc('');
    alert('New menu item added successfully to active menu!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[24px] w-full max-w-[800px] max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8">

        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#d85c27]/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-[#d85c27]" />
            </div>
            <div>
              <h3 className="text-[20px] font-black text-[#1a1a1a]">MAATI Admin Panel & Sanity CMS</h3>
              <p className="text-[12px] text-[#777]">Manage menu items dynamically with Sanity.io</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Section 1: Sanity CMS Config */}
        <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-[16px] p-5 mb-8 space-y-4">
          <h4 className="font-black text-[15px] text-[#1a1a1a] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#d85c27]" />
            Sanity.io Connection Setup
          </h4>
          <form onSubmit={handleSaveSanity} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#555] mb-1">Sanity Project ID</label>
              <input
                type="text"
                value={sanityProjectId}
                onChange={(e) => setSanityProjectId(e.target.value)}
                placeholder="e.g. xyz12345"
                className="w-full border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#d85c27]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#555] mb-1">Dataset</label>
              <input
                type="text"
                value={sanityDataset}
                onChange={(e) => setSanityDataset(e.target.value)}
                placeholder="production"
                className="w-full border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#d85c27]"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-[#1e382f] text-white font-bold text-[13px] py-2 rounded-lg hover:bg-[#152721] transition-colors flex items-center justify-center gap-1.5"
              >
                {connected ? <Check className="w-4 h-4 text-green-400" /> : <RefreshCw className="w-4 h-4" />}
                {connected ? 'Connected' : 'Save Sanity Config'}
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Add New Menu Item */}
        <div className="space-y-4">
          <h4 className="font-black text-[16px] text-[#1a1a1a] flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#d85c27]" />
            Add New Menu Item (Admin Quick Insert)
          </h4>

          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Item Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mumbai Pav Bhaji Bowl"
                  required
                  className="w-full border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Price</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Dietary Badge</label>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value as any)}
                  className="w-full border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                >
                  <option value="NON-VEGETARIAN">NON-VEGETARIAN</option>
                  <option value="VEGETARIAN">VEGETARIAN</option>
                  <option value="VEGAN">VEGAN</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Image Path / URL</label>
                <input
                  type="text"
                  value={img}
                  onChange={(e) => setImg(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">Description</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
                placeholder="Delicious description of ingredients..."
                required
                className="w-full border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#d85c27] text-white font-bold py-3.5 rounded-xl text-[15px] hover:bg-[#c2501f] transition-colors"
            >
              Add Item to Menu
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
