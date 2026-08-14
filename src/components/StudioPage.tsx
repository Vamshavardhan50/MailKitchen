import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Database,
  Plus,
  Trash2,
  Edit3,
  Check,
  Save,
  Utensils,
  FolderTree,
  Sliders,
  Home,
  ExternalLink,
  Star,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Upload,
  Lock,
  LogOut,
  Sparkles,
  Info,
  DollarSign,
  Grid,
  Search,
  X,
  Flame,
  Globe,
  FolderOpen,
  FolderClosed,
  Layers,
  PlusCircle
} from 'lucide-react';
import {
  SanityMenuItem,
  SanityCategoryWithItems,
  FoodType,
  useSanityMenu,
  useHomepageContent,
  useSiteSettings,
  HomepageContent,
  MaatiWayStep
} from '../lib/sanityService';
import { sanityConfig } from '../lib/sanity';

// Available gallery assets for instant selection
const AVAILABLE_ASSETS = [
  { name: "Chettinad Bowl", path: "/assets/Chettinad-D21PABvG.png", category: "Bowls" },
  { name: "Delhi Butter Chicken", path: "/assets/Delhi-BteN_mdh.png", category: "Bowls" },
  { name: "Bihar Lentil Potato", path: "/assets/bihar-lentil-potato.png", category: "Bowls" },
  { name: "Bengal Fish Curry", path: "/assets/Bengal-birKfnj1.png", category: "Bowls" },
  { name: "Goa Prawn Curry", path: "/assets/Goa-DLdcEMCP.png", category: "Bowls" },
  { name: "Kashmir Lamb Rogan", path: "/assets/Kashmir-Z2M0N-Rm.png", category: "Bowls" },
  { name: "Rajasthan Laal Maas", path: "/assets/Rajasthan-DL_KoxiT.png", category: "Bowls" },
  { name: "Pondicherry Caesar Salad", path: "/assets/Pondichery-Cesear-Salad.png", category: "Bowls" },
  { name: "Mango Salad", path: "/assets/Mango Salad.png", category: "Bowls" },
  { name: "Punjab Naan Pocket", path: "/assets/punjab-naan-pocket.jpg", category: "Naan" },
  { name: "Butter Chicken Naan", path: "/assets/Naan-Pocket-Butter-Chicken.jpg", category: "Naan" },
  { name: "Paneer Tikka Naan", path: "/assets/Naan-Pocket-Paneer-Tikka.jpg", category: "Naan" },
  { name: "Green Chutney Croissant", path: "/assets/croissant-green-chutney.jpg", category: "Bakery" },
  { name: "Mango Lassi", path: "/assets/Mango Lassi.png", category: "Drinks" },
  { name: "Rose Milk", path: "/assets/Rosemilk.png", category: "Drinks" },
  { name: "Buttermilk (Chaas)", path: "/assets/Buttermilk.png", category: "Drinks" },
  { name: "Fresh Lemonade", path: "/assets/Lemonade.png", category: "Drinks" },
  { name: "Sugarcane Juice", path: "/assets/Sugarcane Juice.png", category: "Drinks" },
  { name: "Cafe Latte", path: "/assets/Cafe Latte_Maati.png", category: "Coffee" },
  { name: "Flat White", path: "/assets/FlatWhite_Maati.png", category: "Coffee" },
  { name: "Americano", path: "/assets/Americano_Maati.png", category: "Coffee" },
  { name: "Matcha Latte", path: "/assets/Matcha Latte_Maati.png", category: "Coffee" },
  { name: "Brownie with Sea Salt", path: "/assets/Brownie mit Meersalzflocken_Maati.png", category: "Desserts" },
  { name: "Milk Cake", path: "/assets/MilkCake_Maati.png", category: "Desserts" },
  { name: "Signature Cocktail 1", path: "/assets/cocktail-1.jpg", category: "Cocktails" },
  { name: "Signature Cocktail 2", path: "/assets/cocktail-2.jpg", category: "Cocktails" },
  { name: "Signature Cocktail 3", path: "/assets/cocktail-3.jpg", category: "Cocktails" },
  { name: "Signature Cocktail 4", path: "/assets/cocktail-4.jpg", category: "Cocktails" },
  { name: "Signature Cocktail 5", path: "/assets/cocktail-5.jpg", category: "Cocktails" },
  { name: "Signature Cocktail 6", path: "/assets/cocktail-6.jpg", category: "Cocktails" },
  { name: "Hero Spread Flatlay", path: "/assets/hero-flatlay.jpg", category: "Showcase" },
  { name: "Interior Ambience 1", path: "/assets/show5-BiQql1jr.jpeg", category: "Showcase" },
  { name: "Interior Ambience 2", path: "/assets/show2-CM6MShfY.jpeg", category: "Showcase" },
  { name: "Catering Spread Photo", path: "/assets/show3-D0blnzja.jpeg", category: "Showcase" },
  { name: "Coca-Cola", path: "/assets/cola.png", category: "Bottled" },
  { name: "Fanta", path: "/assets/fanta.png", category: "Bottled" },
  { name: "Mezzo Mix", path: "/assets/Mezo-Mix.png", category: "Bottled" },
  { name: "Vio Schorle", path: "/assets/vio-schorle.png", category: "Bottled" },
  { name: "Water", path: "/assets/water.png", category: "Bottled" }
];

export const StudioPage: React.FC = () => {
  // ── Authentication State ──
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('maati_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const { categories: initialCategories } = useSanityMenu();
  const { content: initialHomepage } = useHomepageContent();
  const { settings: initialSettings } = useSiteSettings();

  const [activeTab, setActiveTab] = useState<'items' | 'homepage' | 'categories' | 'settings'>('items');
  const [categories, setCategories] = useState<SanityCategoryWithItems[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string>('all');
  
  // Site settings state
  const [siteSettings, setSiteSettings] = useState(initialSettings);
  // Homepage state
  const [homepageContent, _setHomepageContent] = useState<HomepageContent>(initialHomepage);

  // Auto-track changes
  const setHomepageContent = (val: HomepageContent | ((prev: HomepageContent) => HomepageContent)) => {
    _setHomepageContent(val);
    setHasUnsavedChanges(true);
  };

  // Gallery state for homepage sections
  const activeGallerySectionRef = useRef<string | null>(null);
  const [activeGallerySection, setActiveGallerySection] = useState<string | null>(null);

  // Accordion open states for Homepage editor
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    hero: true,
    favorites: true,
    maatiWay: true,
    experience: true,
    catering: true,
    footerCta: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Edit / New Modal State
  const [editingItem, setEditingItem] = useState<SanityMenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  // Item Form Fields
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formTitleDe, setFormTitleDe] = useState('');
  const [formDescEn, setFormDescEn] = useState('');
  const [formDescDe, setFormDescDe] = useState('');
  
  // Pricing Strategy (Single vs Double / Multi Pricing)
  const [priceType, setPriceType] = useState<'single' | 'double'>('single');
  const [formPrice, setFormPrice] = useState('€11,5');
  
  // Double pricing options
  const [opt1LabelEn, setOpt1LabelEn] = useState('Chicken');
  const [opt1LabelDe, setOpt1LabelDe] = useState('Hähnchen');
  const [opt1Price, setOpt1Price] = useState('€12,5');
  
  const [opt2LabelEn, setOpt2LabelEn] = useState('Prawns');
  const [opt2LabelDe, setOpt2LabelDe] = useState('Garnelen');
  const [opt2Price, setOpt2Price] = useState('€14,5');

  const [formFoodType, setFormFoodType] = useState<FoodType>('vegetarian');
  const [formImg, setFormImg] = useState('');
  const [formCatId, setFormCatId] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formAvailable, setFormAvailable] = useState(true);
  const [formSpicy, setFormSpicy] = useState(false);

  // Category Modal & Management State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SanityCategoryWithItems | null>(null);
  const [catNameEn, setCatNameEn] = useState('');
  const [catNameDe, setCatNameDe] = useState('');
  const [catDescEn, setCatDescEn] = useState('');
  const [catDescDe, setCatDescDe] = useState('');

  // Content Language Toggle for Admin (EN / DE)
  const [adminContentLang, setAdminContentLang] = useState<'en' | 'de'>('en');
  const [openSteps, setOpenSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (stepIdOrIdx: string | number) => {
    const key = String(stepIdOrIdx);
    setOpenSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Category Collapsing State
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (catId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const handleCollapseAllCategories = () => {
    const nextState: Record<string, boolean> = {};
    categories.forEach((c) => {
      nextState[c._id] = true;
    });
    setCollapsedCategories(nextState);
  };

  const handleExpandAllCategories = () => {
    setCollapsedCategories({});
  };

  // Add Dish to Category Picker Modal
  const [assignModalCatId, setAssignModalCatId] = useState<string | null>(null);
  const [assignModalTab, setAssignModalTab] = useState<'existing' | 'new'>('existing');
  const [assignSearchQuery, setAssignSearchQuery] = useState('');

  const handleOpenAddDishToCategory = (catId: string) => {
    setAssignModalCatId(catId);
    setAssignModalTab('existing');
    setAssignSearchQuery('');
  };

  // Bottom Center Toast & Unsaved Changes State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveAllGlobal = () => {
    localStorage.setItem('maati_admin_menu', JSON.stringify(categories));
    localStorage.setItem('maati_admin_homepage', JSON.stringify(homepageContent));
    localStorage.setItem('maati_admin_settings', JSON.stringify(siteSettings));
    window.dispatchEvent(new Event('maati_menu_updated'));
    window.dispatchEvent(new Event('maati_homepage_updated'));
    window.dispatchEvent(new Event('maati_settings_updated'));
    setHasUnsavedChanges(false);
    showToast('All changes saved successfully!');
  };

  // Search in Admin Panel
  const [adminSearchQuery, setAdminSearchQuery] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedMenu = localStorage.getItem('maati_admin_menu');
    if (savedMenu) {
      try {
        setCategories(JSON.parse(savedMenu));
      } catch {
        setCategories(initialCategories);
      }
    } else {
      setCategories(initialCategories);
    }

    const savedSettings = localStorage.getItem('maati_admin_settings');
    if (savedSettings) {
      try {
        setSiteSettings(JSON.parse(savedSettings));
      } catch {}
    }

    const savedHome = localStorage.getItem('maati_admin_homepage');
    if (savedHome) {
      try {
        _setHomepageContent(JSON.parse(savedHome));
      } catch {}
    }
  }, [initialCategories, initialSettings, initialHomepage]);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin' || passwordInput === 'maati2026' || passwordInput === 'maati') {
      setIsAuthenticated(true);
      sessionStorage.setItem('maati_admin_auth', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('maati_admin_auth');
  };

  const saveAllToLocal = (newCats: SanityCategoryWithItems[]) => {
    setCategories(newCats);
    localStorage.setItem('maati_admin_menu', JSON.stringify(newCats));
    window.dispatchEvent(new Event('maati_menu_updated'));
    showToast('Menu items updated successfully!');
  };

  const showSuccessToast = () => {
    window.dispatchEvent(new Event('maati_homepage_updated'));
    showToast('Homepage changes saved successfully!');
  };

  // Add an existing menu item into a category
  const handleAddExistingDishToCategory = (item: SanityMenuItem, targetCatId: string) => {
    const clonedItem: SanityMenuItem = {
      ...item,
      _id: `custom-clone-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      id: `clone-${Date.now()}`,
    };

    const updated = categories.map((cat) => {
      if (cat._id === targetCatId) {
        return {
          ...cat,
          items: [clonedItem, ...cat.items],
        };
      }
      return cat;
    });

    saveAllToLocal(updated);
    const targetCat = categories.find((c) => c._id === targetCatId);
    showToast(`Added "${item.titleEn}" to ${targetCat ? targetCat.name : 'category'}!`);
  };

  // Move an existing dish from one category to another
  const handleMoveExistingDishToCategory = (item: SanityMenuItem, fromCatId: string, targetCatId: string) => {
    if (fromCatId === targetCatId) return;

    let updated = categories.map((cat) => {
      if (cat._id === fromCatId) {
        return {
          ...cat,
          items: cat.items.filter((it) => it._id !== item._id && it.id !== item.id),
        };
      }
      return cat;
    });

    updated = updated.map((cat) => {
      if (cat._id === targetCatId) {
        return {
          ...cat,
          items: [item, ...cat.items],
        };
      }
      return cat;
    });

    saveAllToLocal(updated);
    const targetCat = categories.find((c) => c._id === targetCatId);
    showToast(`Moved "${item.titleEn}" to ${targetCat ? targetCat.name : 'category'}!`);
  };

  // Generic File Upload helper
  const handleGenericFileUpload = (callback: (dataUrl: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB. Please choose an optimized image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  // Open Modal for New Item
  const handleOpenNewItem = (catId?: string) => {
    setEditingItem(null);
    setFormTitleEn('');
    setFormTitleDe('');
    setFormDescEn('');
    setFormDescDe('');
    setPriceType('single');
    setFormPrice('€11,5');
    setOpt1LabelEn('Chicken');
    setOpt1LabelDe('Hähnchen');
    setOpt1Price('€12,5');
    setOpt2LabelEn('Prawns');
    setOpt2LabelDe('Garnelen');
    setOpt2Price('€14,5');
    setFormFoodType('vegetarian');
    setFormImg('');
    setFormCatId(catId || categories[0]?._id || 'cat-lunch-bowls');
    setFormFeatured(false);
    setFormAvailable(true);
    setFormSpicy(false);
    setShowGallery(false);
    setIsModalOpen(true);
  };

  // Open Modal for Edit Item
  const handleOpenEditItem = (item: SanityMenuItem, catId: string) => {
    setEditingItem(item);
    setFormTitleEn(item.titleEn || '');
    setFormTitleDe(item.titleDe || '');
    setFormDescEn(item.descEn || '');
    setFormDescDe(item.descDe || '');

    if (item.priceEn && item.priceDe && (item.price.includes('|') || item.priceEn.includes('|'))) {
      setPriceType('double');
      const partsEn = (item.priceEn || item.price).split('|').map(s => s.trim());
      const partsDe = (item.priceDe || item.price).split('|').map(s => s.trim());
      
      const m1En = partsEn[0]?.match(/^([A-Za-z0-9ÄöüäÖÜß\s/,\.-]+)\s*([€\d.,]+)$/u);
      const m2En = partsEn[1]?.match(/^([A-Za-z0-9ÄöüäÖÜß\s/,\.-]+)\s*([€\d.,]+)$/u);
      const m1De = partsDe[0]?.match(/^([A-Za-z0-9ÄöüäÖÜß\s/,\.-]+)\s*([€\d.,]+)$/u);
      const m2De = partsDe[1]?.match(/^([A-Za-z0-9ÄöüäÖÜß\s/,\.-]+)\s*([€\d.,]+)$/u);

      setOpt1LabelEn(m1En ? m1En[1].trim() : 'Option 1');
      setOpt1Price(m1En ? m1En[2].trim() : '€12,5');
      setOpt2LabelEn(m2En ? m2En[1].trim() : 'Option 2');
      setOpt2Price(m2En ? m2En[2].trim() : '€14,5');

      setOpt1LabelDe(m1De ? m1De[1].trim() : 'Option 1');
      setOpt2LabelDe(m2De ? m2De[1].trim() : 'Option 2');
      setFormPrice(item.price);
    } else {
      setPriceType('single');
      setFormPrice(item.price || '€11,5');
      setOpt1LabelEn('Chicken');
      setOpt1LabelDe('Hähnchen');
      setOpt1Price('€12,5');
      setOpt2LabelEn('Prawns');
      setOpt2LabelDe('Garnelen');
      setOpt2Price('€14,5');
    }

    setFormFoodType(item.foodType || 'vegetarian');
    setFormImg(item.img || '');
    setFormCatId(catId);
    setFormFeatured(Boolean(item.featured));
    setFormAvailable(item.available !== false);
    setFormSpicy(Boolean(item.isSpicy));
    setShowGallery(false);
    setIsModalOpen(true);
  };

  // Save Item (New or Edit)
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitleEn) return;

    let computedPrice = formPrice;
    let computedPriceEn = undefined;
    let computedPriceDe = undefined;

    if (priceType === 'double') {
      computedPriceEn = `${opt1LabelEn} ${opt1Price} | ${opt2LabelEn} ${opt2Price}`;
      computedPriceDe = `${opt1LabelDe} ${opt1Price} | ${opt2LabelDe} ${opt2Price}`;
      computedPrice = computedPriceEn;
    }

    const targetCatId = formCatId;
    const newItemData: SanityMenuItem = {
      _id: editingItem ? editingItem._id : `custom-item-${Date.now()}`,
      id: editingItem ? editingItem.id || editingItem._id : `custom-${Date.now()}`,
      titleEn: formTitleEn,
      titleDe: formTitleDe || formTitleEn,
      descEn: formDescEn,
      descDe: formDescDe || formDescEn,
      price: computedPrice,
      priceEn: computedPriceEn,
      priceDe: computedPriceDe,
      foodType: formFoodType,
      img: formImg,
      featured: formFeatured,
      available: formAvailable,
      isSpicy: formSpicy,
      isVeganLeaf: formFoodType === 'vegan',
    };

    let updated = [...categories];

    if (editingItem) {
      updated = updated.map((cat) => ({
        ...cat,
        items: cat.items.filter((it) => it._id !== editingItem._id && it.id !== editingItem.id),
      }));
    }

    updated = updated.map((cat) => {
      if (cat._id === targetCatId) {
        return {
          ...cat,
          items: [newItemData, ...cat.items],
        };
      }
      return cat;
    });

    saveAllToLocal(updated);
    setIsModalOpen(false);
  };

  // Delete Item
  const handleDeleteItem = (itemId: string, catId: string) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    const updated = categories.map((cat) => {
      if (cat._id === catId) {
        return {
          ...cat,
          items: cat.items.filter((it) => it._id !== itemId && it.id !== itemId),
        };
      }
      return cat;
    });
    saveAllToLocal(updated);
  };

  // Toggle Item Availability
  const handleToggleAvailable = (itemId: string, catId?: string) => {
    let foundTitle = '';
    let isNowAvailable = true;

    const updated = categories.map((cat) => {
      if (!catId || cat._id === catId) {
        return {
          ...cat,
          items: cat.items.map((it) => {
            if (it._id === itemId || it.id === itemId) {
              foundTitle = it.titleEn || it.titleDe || 'Dish';
              const currentAvailable = it.available !== false; // true if undefined
              isNowAvailable = !currentAvailable;
              return { ...it, available: isNowAvailable };
            }
            return it;
          }),
        };
      }
      return cat;
    });

    saveAllToLocal(updated);
    showToast(
      isNowAvailable
        ? `"${foundTitle || 'Dish'}" is now marked as AVAILABLE`
        : `"${foundTitle || 'Dish'}" is now marked as SOLD OUT`
    );
  };

  // Toggle Item Featured (assigning next chronological order or removing)
  const handleToggleFeatured = (itemId: string, catId: string) => {
    const currentFeatured = categories.flatMap(c => c.items).filter(it => it.featured);
    const maxOrder = currentFeatured.reduce((max, it) => Math.max(max, it.featuredOrder || 0), 0);

    const updated = categories.map((cat) => {
      if (cat._id === catId) {
        return {
          ...cat,
          items: cat.items.map((it) => {
            if (it._id === itemId || it.id === itemId) {
              const willBeFeatured = !it.featured;
              return {
                ...it,
                featured: willBeFeatured,
                featuredOrder: willBeFeatured ? maxOrder + 1 : undefined,
              };
            }
            return it;
          }),
        };
      }
      return cat;
    });
    saveAllToLocal(updated);
  };

  // Reorder Featured Items on Homepage
  const handleMoveFeatured = (itemId: string, direction: 'prev' | 'next') => {
    const featuredList = categories
      .flatMap((c) => c.items.map((it) => ({ ...it, catId: c._id })))
      .filter((it) => it.featured)
      .sort((a, b) => (a.featuredOrder || 999) - (b.featuredOrder || 999));

    const idx = featuredList.findIndex((it) => it._id === itemId || it.id === itemId);
    if (idx === -1) return;

    const targetIdx = direction === 'prev' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= featuredList.length) return;

    const currentItem = featuredList[idx];
    const targetItem = featuredList[targetIdx];

    const currentOrder = currentItem.featuredOrder || (idx + 1);
    const targetOrder = targetItem.featuredOrder || (targetIdx + 1);

    const updated = categories.map((cat) => ({
      ...cat,
      items: cat.items.map((it) => {
        if (it._id === currentItem._id || it.id === currentItem.id) {
          return { ...it, featuredOrder: targetOrder };
        }
        if (it._id === targetItem._id || it.id === targetItem.id) {
          return { ...it, featuredOrder: currentOrder };
        }
        return it;
      }),
    }));

    saveAllToLocal(updated);
  };

  // ── Category Management Handlers ──
  const handleOpenNewCategory = () => {
    setEditingCategory(null);
    setCatNameEn('');
    setCatNameDe('');
    setCatDescEn('');
    setCatDescDe('');
    setIsCatModalOpen(true);
  };

  const handleOpenEditCategory = (cat: SanityCategoryWithItems) => {
    setEditingCategory(cat);
    setCatNameEn(cat.name || '');
    setCatNameDe(cat.nameDe || '');
    setCatDescEn(cat.description || '');
    setCatDescDe(cat.descriptionDe || '');
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameEn.trim()) return;

    if (editingCategory) {
      const updated = categories.map((c) => {
        if (c._id === editingCategory._id) {
          return {
            ...c,
            name: catNameEn.trim(),
            nameDe: catNameDe.trim() || catNameEn.trim(),
            description: catDescEn.trim(),
            descriptionDe: catDescDe.trim() || catDescEn.trim(),
          };
        }
        return c;
      });
      saveAllToLocal(updated);
    } else {
      const slugBase = catNameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newCategory: SanityCategoryWithItems = {
        _id: `cat-${slugBase}-${Date.now()}`,
        name: catNameEn.trim(),
        nameDe: catNameDe.trim() || catNameEn.trim(),
        description: catDescEn.trim(),
        descriptionDe: catDescDe.trim() || catDescEn.trim(),
        displayOrder: categories.length + 1,
        items: [],
      };
      saveAllToLocal([...categories, newCategory]);
    }
    setIsCatModalOpen(false);
  };

  const handleDeleteCategory = (catId: string) => {
    const cat = categories.find((c) => c._id === catId);
    if (!cat) return;
    const confirmMsg = cat.items.length > 0
      ? `Are you sure you want to delete category "${cat.name}" and all its ${cat.items.length} items?`
      : `Are you sure you want to delete category "${cat.name}"?`;
    if (!window.confirm(confirmMsg)) return;

    const updated = categories.filter((c) => c._id !== catId);
    saveAllToLocal(updated);
  };

  const handleMoveCategory = (catId: string, direction: 'up' | 'down') => {
    const idx = categories.findIndex((c) => c._id === catId);
    if (idx === -1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= categories.length) return;

    const updated = [...categories];
    const [moved] = updated.splice(idx, 1);
    updated.splice(targetIdx, 0, moved);

    const reordered = updated.map((c, i) => ({ ...c, displayOrder: i + 1 }));
    saveAllToLocal(reordered);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('maati_admin_settings', JSON.stringify(siteSettings));
    showSuccessToast();
  };

  // Save Homepage
  const handleSaveHomepage = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('maati_admin_homepage', JSON.stringify(homepageContent));
    showSuccessToast();
  };

  // Flattened items for filter
  const allItemsWithCat = categories.flatMap((c) =>
    c.items.map((it) => ({ ...it, catId: c._id, catName: c.name }))
  );

  const adminQuery = adminSearchQuery.trim().toLowerCase();

  const displayedItems = allItemsWithCat.filter((it) => {
    const matchesCat = selectedCatId === 'all' || it.catId === selectedCatId;
    if (!matchesCat) return false;

    if (!adminQuery) return true;

    const titleEn = (it.titleEn || '').toLowerCase();
    const titleDe = (it.titleDe || '').toLowerCase();
    const descEn = (it.descEn || '').toLowerCase();
    const descDe = (it.descDe || '').toLowerCase();
    const catName = (it.catName || '').toLowerCase();
    const foodType = (it.foodType || '').toLowerCase();
    const price = (it.price || '').toLowerCase();

    return (
      titleEn.includes(adminQuery) ||
      titleDe.includes(adminQuery) ||
      descEn.includes(adminQuery) ||
      descDe.includes(adminQuery) ||
      catName.includes(adminQuery) ||
      foodType.includes(adminQuery) ||
      price.includes(adminQuery)
    );
  });

  // Step Cards Management for The MAATI Way
  const handleAddStepCard = () => {
    const currentSteps = homepageContent.maatiWaySteps || [];
    const nextNum = currentSteps.length + 1;
    const newStep: MaatiWayStep = {
      id: `step-${Date.now()}`,
      step: nextNum,
      title: `Step ${nextNum}: New Step Title`,
      titleDe: `Schritt ${nextNum}: Neuer Titel`,
      items: ['Option 1', 'Option 2', 'Option 3'],
      itemsDe: ['Option 1', 'Option 2', 'Option 3']
    };
    setHomepageContent({
      ...homepageContent,
      maatiWaySteps: [...currentSteps, newStep]
    });
  };

  const handleUpdateStep = (index: number, updated: Partial<MaatiWayStep>) => {
    const currentSteps = [...(homepageContent.maatiWaySteps || [])];
    currentSteps[index] = { ...currentSteps[index], ...updated };
    setHomepageContent({
      ...homepageContent,
      maatiWaySteps: currentSteps
    });
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    const currentSteps = [...(homepageContent.maatiWaySteps || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentSteps.length) return;
    const temp = currentSteps[index];
    currentSteps[index] = currentSteps[targetIndex];
    currentSteps[targetIndex] = temp;
    currentSteps.forEach((s, idx) => { s.step = idx + 1; });
    setHomepageContent({
      ...homepageContent,
      maatiWaySteps: currentSteps
    });
  };

  const handleDeleteStep = (index: number) => {
    if (!window.confirm('Are you sure you want to delete this step card?')) return;
    const currentSteps = (homepageContent.maatiWaySteps || []).filter((_, idx) => idx !== index);
    currentSteps.forEach((s, idx) => { s.step = idx + 1; });
    setHomepageContent({
      ...homepageContent,
      maatiWaySteps: currentSteps
    });
  };

  // ═══════════════════════════════════════════════
  // 1. LOGIN SCREEN GATE
  // ═══════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-4 pt-20 pb-16">
        <div className="w-full max-w-[440px] bg-white rounded-[32px] p-8 md:p-10 shadow-2xl border border-[#ebdcd0] text-center animate-fadeInUp">
          
          <div className="w-16 h-16 rounded-2xl bg-[#d85c27] text-white flex items-center justify-center mx-auto mb-6 shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <h1 className="text-[28px] font-black text-[#1e382f] mb-2">
            MAATI Studio Admin
          </h1>
          <p className="text-[14px] text-[#666] mb-8">
            Enter your admin passcode to access live menu management and homepage controls.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-[12px] font-extrabold uppercase tracking-wider text-[#333] mb-1.5">
                Admin Passcode
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => { setPasswordInput(e.target.value); setAuthError(false); }}
                placeholder="Enter passcode..."
                autoFocus
                required
                className="w-full border-2 border-[#ebdcd0] focus:border-[#d85c27] rounded-2xl px-4 py-3.5 text-[15px] font-bold focus:outline-none transition-colors"
              />
              {authError && (
                <p className="text-rose-600 text-[12px] font-bold mt-1.5 animate-fadeIn">
                  Incorrect passcode. Please try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold py-4 rounded-2xl text-[15px] shadow-md hover:shadow-lg transition-all transform hover:scale-[1.01]"
            >
              Unlock Admin Panel
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-[12px] text-gray-500">
            <span>MAATI Kitchen Berlin Mitte • Authorized Staff Only</span>
          </div>

        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════
  // 2. MAIN ADMIN DASHBOARD
  // ═══════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#f5f0e8] pt-28 pb-20 px-4 sm:px-8 md:px-12 lg:px-20">
      <div className="max-w-[1360px] mx-auto">

        {/* ── Top Bar ── */}
        <div className="bg-[#fffdfa] rounded-[28px] p-6 md:p-8 border border-[#ebdcd0] shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="p-2.5 rounded-xl bg-[#d85c27] text-white">
                <Database className="w-6 h-6" />
              </span>
              <h1 className="text-[26px] md:text-[32px] font-black text-[#1e382f]">
                MAATI Kitchen Admin Panel
              </h1>
            </div>
            <p className="text-[#666] text-[14px]">
              Direct live control over all menu dishes, double pricing, photos, and homepage sections.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[13px] font-bold px-3 py-1.5 rounded-full animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-600" />
                Changes Saved Live!
              </span>
            )}
            <Link
              to="/"
              className="bg-white hover:bg-gray-50 text-[#1e382f] border-2 border-[#ebdcd0] font-extrabold px-4 py-2 rounded-full text-[13px] shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5"
            >
              <ExternalLink className="w-4 h-4 text-[#d85c27]" />
              <span>View Website</span>
            </Link>
            <button
              onClick={() => handleOpenNewItem()}
              className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-5 py-2.5 rounded-full text-[14px] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Navigation Tabs ── */}
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-[#fffdfa] p-2 rounded-2xl border border-[#ebdcd0] shadow-sm">
          <button
            onClick={() => setActiveTab('items')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[14px] transition-all ${
              activeTab === 'items'
                ? 'bg-[#1e382f] text-white shadow-sm'
                : 'text-[#1e382f] hover:bg-[#1e382f]/5'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Menu Items ({allItemsWithCat.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('homepage')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[14px] transition-all ${
              activeTab === 'homepage'
                ? 'bg-[#1e382f] text-white shadow-sm'
                : 'text-[#1e382f] hover:bg-[#1e382f]/5'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Homepage (All Sections)</span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[14px] transition-all ${
              activeTab === 'categories'
                ? 'bg-[#1e382f] text-white shadow-sm'
                : 'text-[#1e382f] hover:bg-[#1e382f]/5'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[14px] transition-all ${
              activeTab === 'settings'
                ? 'bg-[#1e382f] text-white shadow-sm'
                : 'text-[#1e382f] hover:bg-[#1e382f]/5'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Site Settings</span>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════
            TAB 1: MENU ITEMS (NO INTERNAL IDS SHOWN)
        ═══════════════════════════════════════════════ */}
        {activeTab === 'items' && (
          <div className="space-y-6">

            {/* ── Featured Items Live Order Bar ── */}
            {(() => {
              const featuredList = allItemsWithCat
                .filter((it) => it.featured)
                .sort((a, b) => (a.featuredOrder || 999) - (b.featuredOrder || 999));

              if (featuredList.length === 0) return null;

              return (
                <div className="bg-[#fffdfa] rounded-[24px] border-2 border-amber-200 p-5 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-amber-500 text-white">
                        <Star className="w-4 h-4 fill-white" />
                      </span>
                      <h3 className="text-[15px] font-black text-[#1e382f]">
                        Homepage Featured Cards Order ({featuredList.length} dishes active)
                      </h3>
                    </div>
                    <span className="text-[12px] text-gray-500 font-medium">
                      Dishes appear on homepage in this exact order (#1, #2, #3...)
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    {featuredList.map((item, idx) => (
                      <div
                        key={item._id || item.id}
                        className="bg-[#fcf8f3] border border-amber-300 rounded-xl px-3 py-2 flex items-center gap-2 shadow-xs"
                      >
                        <span className="bg-amber-500 text-white font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-[13px] font-extrabold text-[#1a1a1a] max-w-[140px] truncate">
                          {item.titleEn}
                        </span>
                        
                        <div className="flex items-center gap-0.5 ml-1 border-l border-amber-200 pl-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveFeatured(item._id || item.id || '', 'prev')}
                            title="Move Left / Earlier in order"
                            className="p-1 text-gray-500 hover:text-black disabled:opacity-30 rounded hover:bg-amber-100"
                          >
                            ◀
                          </button>
                          <button
                            type="button"
                            disabled={idx === featuredList.length - 1}
                            onClick={() => handleMoveFeatured(item._id || item.id || '', 'next')}
                            title="Move Right / Later in order"
                            className="p-1 text-gray-500 hover:text-black disabled:opacity-30 rounded hover:bg-amber-100"
                          >
                            ▶
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(item._id || item.id || '', item.catId)}
                            title="Remove from Homepage"
                            className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ── Admin Menu Search Bar ── */}
            <div className="bg-[#fffdfa] rounded-[22px] p-4 border border-[#ebdcd0] shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-[560px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={adminSearchQuery}
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  placeholder="Search dishes by name (EN/DE), description, ingredients, price..."
                  className="w-full bg-white border border-[#ebdcd0] focus:border-[#d85c27] rounded-xl pl-10 pr-10 py-2.5 text-[14px] font-semibold text-[#1a1a1a] focus:outline-none transition-colors"
                />
                {adminSearchQuery && (
                  <button
                    onClick={() => setAdminSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="text-[13px] font-bold text-[#666] shrink-0 self-center sm:self-auto">
                Showing <span className="text-[#d85c27] font-black">{displayedItems.length}</span> of {allItemsWithCat.length} dishes
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedCatId('all')}
                className={`px-4 py-1.5 rounded-full text-[13px] font-extrabold transition-all ${
                  selectedCatId === 'all'
                    ? 'bg-[#d85c27] text-white shadow-sm'
                    : 'bg-white text-[#1e382f] hover:bg-white/80 border border-[#ebdcd0]'
                }`}
              >
                All Categories ({allItemsWithCat.length})
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  onClick={() => setSelectedCatId(c._id)}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-extrabold transition-all ${
                    selectedCatId === c._id
                      ? 'bg-[#d85c27] text-white shadow-sm'
                      : 'bg-white text-[#1e382f] hover:bg-white/80 border border-[#ebdcd0]'
                  }`}
                >
                  {c.name} ({c.items.length})
                </button>
              ))}
            </div>

            {/* Items Table / Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedItems.map((item) => {
                const isVeg = item.foodType === 'vegetarian';
                const isVegan = item.foodType === 'vegan';
                const featuredIdx = allItemsWithCat
                  .filter((it) => it.featured)
                  .sort((a, b) => (a.featuredOrder || 999) - (b.featuredOrder || 999))
                  .findIndex((x) => x._id === item._id || x.id === item.id);

                return (
                  <div
                    key={item._id || item.id}
                    className={`bg-[#fffdfa] rounded-[24px] overflow-hidden border border-[#ebdcd0] shadow-sm flex flex-col justify-between p-5 transition-all ${
                      item.available === false ? 'opacity-50 grayscale' : ''
                    }`}
                  >
                    <div>
                      {/* Top bar with food image and pills */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#fae8d8] shrink-0 border border-[#ebdcd0]">
                          {item.img ? (
                            <img src={item.img} alt={item.titleEn} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400">
                              MAATI
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-black tracking-wider uppercase text-[#d85c27]">
                            {item.catName}
                          </span>
                          <h3 className="font-extrabold text-[16px] text-[#1a1a1a] truncate">
                            {item.titleEn}
                          </h3>
                          <p className="text-[13px] text-[#777] truncate">
                            {item.titleDe}
                          </p>
                        </div>
                      </div>

                      {/* Badges & Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full text-white ${
                            isVegan
                              ? 'bg-[#2d6a4f]'
                              : isVeg
                              ? 'bg-[#1e382f]'
                              : 'bg-[#d85c27]'
                          }`}
                        >
                          {isVegan ? 'VEGAN' : isVeg ? 'VEGETARIAN' : 'NON-VEGETARIAN'}
                        </span>
                        {item.isSpicy && (
                          <span className="p-1 rounded-md bg-orange-50 text-orange-600 flex items-center" title="Spicy">
                            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-600" />
                          </span>
                        )}
                        {item.featured && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            #{featuredIdx + 1} on Homepage
                          </span>
                        )}
                        {item.available === false && (
                          <span className="text-[10px] font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">
                            Sold Out
                          </span>
                        )}
                      </div>

                      {/* Price Badge (Supports Multi-price) */}
                      <div className="mb-4 flex flex-wrap items-center gap-1.5">
                        {item.price.includes('|') ? (
                          item.price.split('|').map((p, idx) => (
                            <span key={idx} className="inline-flex items-center bg-[#1e382f]/5 px-2.5 py-1 rounded-md text-[12px] font-black text-[#d85c27]">
                              {p.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="inline-flex items-center bg-[#1e382f]/5 px-2.5 py-1 rounded-md text-[13px] font-black text-[#d85c27]">
                            {item.price}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-[#ebdcd0] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleAvailable(item._id || item.id || '', item.catId)}
                          title={item.available === false ? 'Mark Available' : 'Mark Unavailable'}
                          className={`p-2 rounded-lg transition-colors ${
                            item.available === false
                              ? 'text-gray-400 hover:bg-gray-100'
                              : 'text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {item.available === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(item._id || item.id || '', item.catId)}
                          title={item.featured ? 'Remove from Homepage' : 'Feature on Homepage'}
                          className={`p-2 rounded-lg transition-colors ${
                            item.featured
                              ? 'text-amber-500 hover:bg-amber-50'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${item.featured ? 'fill-amber-500' : ''}`} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditItem(item, item.catId)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Item"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item._id || item.id || '', item.catId)}
                          className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            TAB 2: HOMEPAGE (CLEAN WITH EN/DE TOGGLE)
        ═══════════════════════════════════════════════ */}
        {activeTab === 'homepage' && (
          <form onSubmit={handleSaveHomepage} className="space-y-6">
            
            {/* Top Save Action Bar with EN / DE Switcher */}
            <div className="sticky top-6 z-20 bg-[#fffdfa]/95 backdrop-blur-md p-4 rounded-2xl border border-[#ebdcd0] shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div>
                <h2 className="text-[18px] font-black text-[#1e382f]">Edit Homepage Sections & Copy</h2>
                <p className="text-[12px] text-[#777]">Choose language below to edit cleanly without clutter. Click Save when done.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* ── Language Switcher Toggle Pill ── */}
                <div className="flex items-center gap-1 bg-[#f5f0e8] p-1 rounded-xl border border-[#ebdcd0]">
                  <button
                    type="button"
                    onClick={() => setAdminContentLang('en')}
                    className={`px-4 py-2 rounded-lg text-[13px] font-extrabold transition-all flex items-center gap-1.5 ${
                      adminContentLang === 'en'
                        ? 'bg-[#1e382f] text-white shadow-xs'
                        : 'text-[#1e382f] hover:bg-white/60'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>English (EN)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminContentLang('de')}
                    className={`px-4 py-2 rounded-lg text-[13px] font-extrabold transition-all flex items-center gap-1.5 ${
                      adminContentLang === 'de'
                        ? 'bg-[#1e382f] text-white shadow-xs'
                        : 'text-[#1e382f] hover:bg-white/60'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Deutsch (DE)</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-6 py-2.5 rounded-full text-[14px] shadow-sm hover:shadow-md transition-all flex items-center gap-2 shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Changes</span>
                </button>
              </div>
            </div>

            {/* ── SECTION 1: HERO ── */}
            <div className="bg-[#fffdfa] rounded-[24px] border border-[#ebdcd0] shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('hero')}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-black/2 transition-colors border-b border-[#ebdcd0]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#d85c27] text-white font-black text-[13px] flex items-center justify-center">1</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[18px] font-black text-[#1e382f]">1. Hero Section (Top of Homepage)</h3>
                      <span className="text-[11px] font-black bg-[#1e382f]/10 text-[#1e382f] px-2 py-0.5 rounded-md uppercase">
                        Editing {adminContentLang.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#777]">Main headline, subtitle, buttons, feature pills, and food photo</p>
                  </div>
                </div>
                {openSections.hero ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>

              {openSections.hero && (
                <div className="p-6 md:p-8 space-y-5">
                  {/* Top Pill Badge */}
                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">
                      Top Pill Badge ({adminContentLang === 'en' ? 'English' : 'German'})
                    </label>
                    <input
                      type="text"
                      value={adminContentLang === 'en' ? (homepageContent.heroBadgeEn || '') : (homepageContent.heroBadgeDe || '')}
                      onChange={(e) =>
                        setHomepageContent(
                          adminContentLang === 'en'
                            ? { ...homepageContent, heroBadgeEn: e.target.value }
                            : { ...homepageContent, heroBadgeDe: e.target.value }
                        )
                      }
                      placeholder={adminContentLang === 'en' ? 'FAST CASUAL • INDIAN SOUL' : 'FAST CASUAL • INDISCHE KÜCHE'}
                      className="w-full border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                    />
                  </div>

                  {/* Headline Line 1 & Line 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-[#333] mb-1">
                        Headline Line 1 ({adminContentLang === 'en' ? 'English' : 'German'})
                      </label>
                      <input
                        type="text"
                        value={adminContentLang === 'en' ? (homepageContent.heroTitle1En || '') : (homepageContent.heroTitle1De || '')}
                        onChange={(e) =>
                          setHomepageContent(
                            adminContentLang === 'en'
                              ? { ...homepageContent, heroTitle1En: e.target.value }
                              : { ...homepageContent, heroTitle1De: e.target.value }
                          )
                        }
                        placeholder={adminContentLang === 'en' ? 'Craft Your Own' : 'Kreieren Sie Ihre eigene'}
                        className="w-full border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-[#333] mb-1">
                        Headline Line 2 / Accent ({adminContentLang === 'en' ? 'English' : 'German'})
                      </label>
                      <input
                        type="text"
                        value={adminContentLang === 'en' ? (homepageContent.heroTitle2En || '') : (homepageContent.heroTitle2De || '')}
                        onChange={(e) =>
                          setHomepageContent(
                            adminContentLang === 'en'
                              ? { ...homepageContent, heroTitle2En: e.target.value }
                              : { ...homepageContent, heroTitle2De: e.target.value }
                          )
                        }
                        placeholder={adminContentLang === 'en' ? 'Flavor Journey' : 'Geschmacksreise'}
                        className="w-full border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">
                      Hero Description ({adminContentLang === 'en' ? 'English' : 'German'})
                    </label>
                    <textarea
                      rows={2}
                      value={adminContentLang === 'en' ? (homepageContent.heroDescEn || '') : (homepageContent.heroDescDe || '')}
                      onChange={(e) =>
                        setHomepageContent(
                          adminContentLang === 'en'
                            ? { ...homepageContent, heroDescEn: e.target.value }
                            : { ...homepageContent, heroDescDe: e.target.value }
                        )
                      }
                      placeholder="Fresh, vibrant Indian ingredients..."
                      className="w-full border rounded-xl px-4 py-2 text-[14px] focus:outline-none focus:border-[#d85c27] resize-none"
                    />
                  </div>

                  {/* Buttons Text */}
                  <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-2xl p-4 space-y-3">
                    <label className="text-[12px] font-black text-[#1e382f] uppercase tracking-wider block">
                      Hero Buttons ({adminContentLang === 'en' ? 'English' : 'German'})
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-[#555] mb-1">Menu Button Text</label>
                        <input
                          type="text"
                          value={adminContentLang === 'en' ? (homepageContent.heroBtnMenuEn || '') : (homepageContent.heroBtnMenuDe || '')}
                          onChange={(e) =>
                            setHomepageContent(
                              adminContentLang === 'en'
                                ? { ...homepageContent, heroBtnMenuEn: e.target.value }
                                : { ...homepageContent, heroBtnMenuDe: e.target.value }
                            )
                          }
                          placeholder={adminContentLang === 'en' ? 'View Menu' : 'Speisekarte'}
                          className="w-full bg-white border rounded-xl px-3 py-2 text-[13px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#555] mb-1">Reservation Button Text</label>
                        <input
                          type="text"
                          value={adminContentLang === 'en' ? (homepageContent.heroBtnResEn || '') : (homepageContent.heroBtnResDe || '')}
                          onChange={(e) =>
                            setHomepageContent(
                              adminContentLang === 'en'
                                ? { ...homepageContent, heroBtnResEn: e.target.value }
                                : { ...homepageContent, heroBtnResDe: e.target.value }
                            )
                          }
                          placeholder={adminContentLang === 'en' ? 'Reservations' : 'Reservierungen'}
                          className="w-full bg-white border rounded-xl px-3 py-2 text-[13px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3 Feature Badges */}
                  <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-2xl p-4 space-y-3">
                    <label className="text-[12px] font-black text-[#1e382f] uppercase tracking-wider block">
                      3 Feature Badges Below Buttons ({adminContentLang === 'en' ? 'English' : 'German'})
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#555] mb-1">Badge 1</label>
                        <input
                          type="text"
                          value={adminContentLang === 'en' ? (homepageContent.heroPill1En || '') : (homepageContent.heroPill1De || '')}
                          onChange={(e) =>
                            setHomepageContent(
                              adminContentLang === 'en'
                                ? { ...homepageContent, heroPill1En: e.target.value }
                                : { ...homepageContent, heroPill1De: e.target.value }
                            )
                          }
                          placeholder={adminContentLang === 'en' ? 'FRESH INGREDIENTS' : 'FRISCHE ZUTATEN'}
                          className="w-full bg-white border rounded-xl px-3 py-2 text-[12px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#555] mb-1">Badge 2</label>
                        <input
                          type="text"
                          value={adminContentLang === 'en' ? (homepageContent.heroPill2En || '') : (homepageContent.heroPill2De || '')}
                          onChange={(e) =>
                            setHomepageContent(
                              adminContentLang === 'en'
                                ? { ...homepageContent, heroPill2En: e.target.value }
                                : { ...homepageContent, heroPill2De: e.target.value }
                            )
                          }
                          placeholder={adminContentLang === 'en' ? 'AUTHENTIC SPICES' : 'AUTHENTISCHE GEWÜRZE'}
                          className="w-full bg-white border rounded-xl px-3 py-2 text-[12px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#555] mb-1">Badge 3</label>
                        <input
                          type="text"
                          value={adminContentLang === 'en' ? (homepageContent.heroPill3En || '') : (homepageContent.heroPill3De || '')}
                          onChange={(e) =>
                            setHomepageContent(
                              adminContentLang === 'en'
                                ? { ...homepageContent, heroPill3En: e.target.value }
                                : { ...homepageContent, heroPill3De: e.target.value }
                            )
                          }
                          placeholder={adminContentLang === 'en' ? 'READY IN MINUTES' : 'SCHNELL SERVIERT'}
                          className="w-full bg-white border rounded-xl px-3 py-2 text-[12px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hero Image Upload Block */}
                  <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-[13px] font-black text-[#1e382f] flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-[#d85c27]" />
                          Hero Food Photo (Large flatlay)
                        </label>
                        <p className="text-[11.5px] text-[#666]">Recommended: <strong>1200 x 900 px</strong> (4:3 ratio), under 2MB.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveGallerySection(activeGallerySection === 'hero' ? null : 'hero')}
                        className="text-[12px] font-bold text-[#d85c27] hover:underline flex items-center gap-1"
                      >
                        <Grid className="w-3.5 h-3.5" />
                        {activeGallerySection === 'hero' ? 'Hide Gallery' : 'Choose Existing Image'}
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shrink-0 border border-[#ebdcd0]">
                        {homepageContent.heroImage ? (
                          <img src={homepageContent.heroImage} alt="Hero" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-bold">No Img</div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleGenericFileUpload((url) => setHomepageContent({ ...homepageContent, heroImage: url }))}
                            className="bg-[#1e382f] hover:bg-[#152721] text-white text-[13px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                          >
                            <Upload className="w-4 h-4" />
                            Upload Hero Photo
                          </button>
                          {homepageContent.heroImage && (
                            <button
                              type="button"
                              onClick={() => setHomepageContent({ ...homepageContent, heroImage: '' })}
                              className="text-rose-600 hover:bg-rose-50 text-[12px] font-bold px-3 py-1.5 rounded-lg border border-rose-200"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={homepageContent.heroImage || ''}
                          onChange={(e) => setHomepageContent({ ...homepageContent, heroImage: e.target.value })}
                          placeholder="/assets/hero-flatlay.jpg"
                          className="w-full bg-white border rounded-xl px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#d85c27]"
                        />
                      </div>
                    </div>

                    {activeGallerySection === 'hero' && (
                      <div className="mt-3 pt-3 border-t border-[#ebdcd0] space-y-2 animate-fadeIn">
                        <p className="text-[12px] font-bold text-gray-700">Click to select photo:</p>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[200px] overflow-y-auto p-1 bg-white rounded-xl border">
                          {AVAILABLE_ASSETS.map((asset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => { setHomepageContent({ ...homepageContent, heroImage: asset.path }); setActiveGallerySection(null); }}
                              className="rounded-xl overflow-hidden aspect-square border hover:border-[#d85c27] transition-all"
                            >
                              <img src={asset.path} alt={asset.name} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── SECTION 2: HOUSE FAVORITES ── */}
            <div className="bg-[#fffdfa] rounded-[24px] border border-[#ebdcd0] shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('favorites')}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-black/2 transition-colors border-b border-[#ebdcd0]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#d85c27] text-white font-black text-[13px] flex items-center justify-center">2</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[18px] font-black text-[#1e382f]">2. House Favorites ("Treat Your Tastebuds")</h3>
                      <span className="text-[11px] font-black bg-[#1e382f]/10 text-[#1e382f] px-2 py-0.5 rounded-md uppercase">
                        Editing {adminContentLang.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#777]">Green background section displaying your featured dishes</p>
                  </div>
                </div>
                {openSections.favorites ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>

              {openSections.favorites && (
                <div className="p-6 md:p-8 space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-[13px] text-amber-900 font-medium">
                    💡 <strong>Tip:</strong> The dishes displayed here are selected by clicking the <strong>⭐ Star</strong> button on dishes in the <strong>Menu Items</strong> or <strong>Categories</strong> tab.
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">
                      Section Heading ({adminContentLang === 'en' ? 'English' : 'German'})
                    </label>
                    <input
                      type="text"
                      value={adminContentLang === 'en' ? (homepageContent.lunchTitleEn || '') : (homepageContent.lunchTitleDe || '')}
                      onChange={(e) =>
                        setHomepageContent(
                          adminContentLang === 'en'
                            ? { ...homepageContent, lunchTitleEn: e.target.value }
                            : { ...homepageContent, lunchTitleDe: e.target.value }
                        )
                      }
                      placeholder={adminContentLang === 'en' ? 'Treat Your Tastebuds' : 'Verwöhnen Sie Ihren Gaumen'}
                      className="w-full border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">
                      Section Description ({adminContentLang === 'en' ? 'English' : 'German'})
                    </label>
                    <textarea
                      rows={2}
                      value={adminContentLang === 'en' ? (homepageContent.lunchDescEn || '') : (homepageContent.lunchDescDe || '')}
                      onChange={(e) =>
                        setHomepageContent(
                          adminContentLang === 'en'
                            ? { ...homepageContent, lunchDescEn: e.target.value }
                            : { ...homepageContent, lunchDescDe: e.target.value }
                        )
                      }
                      placeholder="Discover our most-loved signature combinations..."
                      className="w-full border rounded-xl px-4 py-2 text-[14px] focus:outline-none focus:border-[#d85c27] resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ── SECTION 3: THE MAATI WAY (COLLAPSIBLE STEP CARDS) ── */}
            <div className="bg-[#fffdfa] rounded-[24px] border border-[#ebdcd0] shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('maatiWay')}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-black/2 transition-colors border-b border-[#ebdcd0]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#d85c27] text-white font-black text-[13px] flex items-center justify-center">3</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[18px] font-black text-[#1e382f]">3. The MAATI Way Section ("Customized to your taste")</h3>
                      <span className="text-[11px] font-black bg-[#1e382f]/10 text-[#1e382f] px-2 py-0.5 rounded-md uppercase">
                        Editing {adminContentLang.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#777]">Step customization cards explaining bowls & naan pockets</p>
                  </div>
                </div>
                {openSections.maatiWay ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>

              {openSections.maatiWay && (
                <div className="p-6 md:p-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-[#333] mb-1">
                        Top Eyebrow Badge ({adminContentLang === 'en' ? 'English' : 'German'})
                      </label>
                      <input
                        type="text"
                        value={adminContentLang === 'en' ? (homepageContent.maatiWayBadgeEn || '') : (homepageContent.maatiWayBadgeDe || '')}
                        onChange={(e) =>
                          setHomepageContent(
                            adminContentLang === 'en'
                              ? { ...homepageContent, maatiWayBadgeEn: e.target.value }
                              : { ...homepageContent, maatiWayBadgeDe: e.target.value }
                          )
                        }
                        placeholder={adminContentLang === 'en' ? 'CUSTOMIZED TO YOUR TASTE' : 'INDIVIDUELL NACH IHREM GESCHMACK'}
                        className="w-full border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-[#333] mb-1">
                        Section Heading ({adminContentLang === 'en' ? 'English' : 'German'})
                      </label>
                      <input
                        type="text"
                        value={adminContentLang === 'en' ? (homepageContent.maatiWayTitleEn || '') : (homepageContent.maatiWayTitleDe || '')}
                        onChange={(e) =>
                          setHomepageContent(
                            adminContentLang === 'en'
                              ? { ...homepageContent, maatiWayTitleEn: e.target.value }
                              : { ...homepageContent, maatiWayTitleDe: e.target.value }
                          )
                        }
                        placeholder={adminContentLang === 'en' ? 'The MAATI Way' : 'Der MAATI Weg'}
                        className="w-full border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                      />
                    </div>
                  </div>

                  {/* ── Collapsible Step Cards Builder ── */}
                  <div className="pt-6 border-t border-[#ebdcd0] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fcf8f3] p-4 rounded-2xl border border-[#ebdcd0]">
                      <div>
                        <h4 className="text-[15px] font-black text-[#1e382f]">
                          Step Customization Cards ({(homepageContent.maatiWaySteps || []).length})
                        </h4>
                        <p className="text-[12px] text-[#666]">
                          Click any step to expand and edit its options. Cards stay collapsed to keep things organized.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddStepCard}
                        className="bg-[#d85c27] hover:bg-[#c24f1c] text-white text-[13px] font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs self-start sm:self-auto"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Step Card</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(homepageContent.maatiWaySteps || []).map((step, sIdx) => {
                        const isExpanded = openSteps[step.id || String(sIdx)] || false;
                        const activeTitle = adminContentLang === 'en' ? step.title : (step.titleDe || step.title);
                        const activeItems = adminContentLang === 'en' ? step.items : (step.itemsDe || step.items);

                        return (
                          <div
                            key={step.id || sIdx}
                            className="bg-white border border-[#ebdcd0] rounded-2xl overflow-hidden shadow-xs transition-all"
                          >
                            {/* Collapsed Header Bar */}
                            <div className="p-4 flex items-center justify-between gap-3 bg-white hover:bg-gray-50/70 transition-colors">
                              <button
                                type="button"
                                onClick={() => toggleStep(step.id || String(sIdx))}
                                className="flex-1 flex items-center gap-3 text-left"
                              >
                                <span className="w-8 h-8 rounded-full bg-[#d85c27] text-white font-black text-[13px] flex items-center justify-center shrink-0">
                                  {step.step || sIdx + 1}
                                </span>
                                <div className="min-w-0">
                                  <h5 className="font-extrabold text-[15px] text-[#1e382f] truncate">
                                    {activeTitle || `Step ${sIdx + 1}`}
                                  </h5>
                                  <span className="text-[12px] font-bold text-gray-500">
                                    {activeItems.length} options listed • Click to {isExpanded ? 'collapse' : 'edit'}
                                  </span>
                                </div>
                              </button>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  disabled={sIdx === 0}
                                  onClick={() => handleMoveStep(sIdx, 'up')}
                                  title="Move Up"
                                  className="p-1.5 text-gray-600 hover:text-black disabled:opacity-30 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  ▲
                                </button>
                                <button
                                  type="button"
                                  disabled={sIdx === (homepageContent.maatiWaySteps || []).length - 1}
                                  onClick={() => handleMoveStep(sIdx, 'down')}
                                  title="Move Down"
                                  className="p-1.5 text-gray-600 hover:text-black disabled:opacity-30 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  ▼
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteStep(sIdx)}
                                  title="Delete Step"
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleStep(step.id || String(sIdx))}
                                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
                                >
                                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            {/* Expanded Body Form */}
                            {isExpanded && (
                              <div className="p-5 border-t border-[#ebdcd0] bg-[#fcf8f3]/60 space-y-3 animate-fadeIn">
                                <div>
                                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                                    Step Title ({adminContentLang === 'en' ? 'English' : 'German'})
                                  </label>
                                  <input
                                    type="text"
                                    value={adminContentLang === 'en' ? step.title : (step.titleDe || '')}
                                    onChange={(e) =>
                                      handleUpdateStep(
                                        sIdx,
                                        adminContentLang === 'en'
                                          ? { title: e.target.value }
                                          : { titleDe: e.target.value }
                                      )
                                    }
                                    placeholder={adminContentLang === 'en' ? 'Choose your base (Upto 1)' : 'Wählen Sie Ihre Basis'}
                                    className="w-full bg-white border rounded-xl px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#d85c27]"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                                    Options / Ingredients List ({adminContentLang === 'en' ? 'English' : 'German'} — one option per line)
                                  </label>
                                  <textarea
                                    rows={4}
                                    value={
                                      adminContentLang === 'en'
                                        ? step.items.join('\n')
                                        : (step.itemsDe || []).join('\n')
                                    }
                                    onChange={(e) =>
                                      handleUpdateStep(
                                        sIdx,
                                        adminContentLang === 'en'
                                          ? { items: e.target.value.split('\n') }
                                          : { itemsDe: e.target.value.split('\n') }
                                      )
                                    }
                                    placeholder={adminContentLang === 'en' ? 'White Rice\nRed Rice\nBulgar Wheat' : 'Weißer Reis\nRoter Reis\nBulgur Weizen'}
                                    className="w-full bg-white border rounded-xl px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#d85c27] resize-y"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── SECTION 4: DINING EXPERIENCE ── */}
            <div className="bg-[#fffdfa] rounded-[24px] border border-[#ebdcd0] shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('experience')}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-black/2 transition-colors border-b border-[#ebdcd0]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#d85c27] text-white font-black text-[13px] flex items-center justify-center">4</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[18px] font-black text-[#1e382f]">4. Dining Experience Section</h3>
                      <span className="text-[11px] font-black bg-[#1e382f]/10 text-[#1e382f] px-2 py-0.5 rounded-md uppercase">
                        Editing {adminContentLang.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#777]">Atmosphere description and 2 side-by-side interior photos</p>
                  </div>
                </div>
                {openSections.experience ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>

              {openSections.experience && (
                <div className="p-6 md:p-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-[#333] mb-1">
                        Eyebrow Badge ({adminContentLang === 'en' ? 'English' : 'German'})
                      </label>
                      <input
                        type="text"
                        value={adminContentLang === 'en' ? (homepageContent.experienceEyebrowEn || '') : (homepageContent.experienceEyebrowDe || '')}
                        onChange={(e) =>
                          setHomepageContent(
                            adminContentLang === 'en'
                              ? { ...homepageContent, experienceEyebrowEn: e.target.value }
                              : { ...homepageContent, experienceEyebrowDe: e.target.value }
                          )
                        }
                        placeholder={adminContentLang === 'en' ? 'EXPERIENCE' : 'ERLEBNIS'}
                        className="w-full border rounded-xl px-4 py-2.5 text-[14px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-[#333] mb-1">
                        Heading ({adminContentLang === 'en' ? 'English' : 'German'})
                      </label>
                      <input
                        type="text"
                        value={adminContentLang === 'en' ? (homepageContent.experienceTitleEn || '') : (homepageContent.experienceTitleDe || '')}
                        onChange={(e) =>
                          setHomepageContent(
                            adminContentLang === 'en'
                              ? { ...homepageContent, experienceTitleEn: e.target.value }
                              : { ...homepageContent, experienceTitleDe: e.target.value }
                          )
                        }
                        placeholder={adminContentLang === 'en' ? 'Breakfast, Lunch and Events at MAATI' : 'Frühstück, Mittagessen und Events'}
                        className="w-full border rounded-xl px-4 py-2.5 text-[14px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">
                      Description ({adminContentLang === 'en' ? 'English' : 'German'})
                    </label>
                    <textarea
                      rows={2}
                      value={adminContentLang === 'en' ? (homepageContent.experienceDescEn || '') : (homepageContent.experienceDescDe || '')}
                      onChange={(e) =>
                        setHomepageContent(
                          adminContentLang === 'en'
                            ? { ...homepageContent, experienceDescEn: e.target.value }
                            : { ...homepageContent, experienceDescDe: e.target.value }
                        )
                      }
                      placeholder="A warm, modern space designed for quick breakfast..."
                      className="w-full border rounded-xl px-4 py-2 text-[14px] resize-none"
                    />
                  </div>

                  {/* Left & Right Photos Upload */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Left Image */}
                    <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-2xl p-4 space-y-2">
                      <label className="text-[12px] font-black text-[#1e382f] block">Left Interior Photo (800 x 1000 px)</label>
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-white shrink-0 border">
                          <img src={homepageContent.experienceImg1 || "/assets/show5-BiQql1jr.jpeg"} alt="Left" className="w-full h-full object-cover" />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleGenericFileUpload((url) => setHomepageContent({ ...homepageContent, experienceImg1: url }))}
                          className="bg-[#1e382f] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <Upload className="w-3.5 h-3.5" /> Upload
                        </button>
                      </div>
                      <input
                        type="text"
                        value={homepageContent.experienceImg1 || ''}
                        onChange={(e) => setHomepageContent({ ...homepageContent, experienceImg1: e.target.value })}
                        className="w-full bg-white border rounded-xl px-3 py-1.5 text-[12px] focus:outline-none focus:border-[#d85c27]"
                      />
                    </div>

                    {/* Right Image */}
                    <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-2xl p-4 space-y-2">
                      <label className="text-[12px] font-black text-[#1e382f] block">Right Interior Photo (800 x 1000 px)</label>
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-white shrink-0 border">
                          <img src={homepageContent.experienceImg2 || "/assets/show2-CM6MShfY.jpeg"} alt="Right" className="w-full h-full object-cover" />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleGenericFileUpload((url) => setHomepageContent({ ...homepageContent, experienceImg2: url }))}
                          className="bg-[#1e382f] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <Upload className="w-3.5 h-3.5" /> Upload
                        </button>
                      </div>
                      <input
                        type="text"
                        value={homepageContent.experienceImg2 || ''}
                        onChange={(e) => setHomepageContent({ ...homepageContent, experienceImg2: e.target.value })}
                        className="w-full bg-white border rounded-xl px-3 py-1.5 text-[12px] focus:outline-none focus:border-[#d85c27]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── SECTION 5: MAATI CATERING ── */}
            <div className="bg-[#fffdfa] rounded-[24px] border border-[#ebdcd0] shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('catering')}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-black/2 transition-colors border-b border-[#ebdcd0]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#d85c27] text-white font-black text-[13px] flex items-center justify-center">5</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[18px] font-black text-[#1e382f]">5. MAATI Catering Section</h3>
                      <span className="text-[11px] font-black bg-[#1e382f]/10 text-[#1e382f] px-2 py-0.5 rounded-md uppercase">
                        Editing {adminContentLang.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#777]">Corporate catering copy, 4 bullet highlights, and photo</p>
                  </div>
                </div>
                {openSections.catering ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>

              {openSections.catering && (
                <div className="p-6 md:p-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-[#333] mb-1">
                        Catering Eyebrow Badge ({adminContentLang === 'en' ? 'English' : 'German'})
                      </label>
                      <input
                        type="text"
                        value={adminContentLang === 'en' ? (homepageContent.cateringBadgeEn || '') : (homepageContent.cateringBadgeDe || '')}
                        onChange={(e) =>
                          setHomepageContent(
                            adminContentLang === 'en'
                              ? { ...homepageContent, cateringBadgeEn: e.target.value }
                              : { ...homepageContent, cateringBadgeDe: e.target.value }
                          )
                        }
                        placeholder="MAATI CATERING"
                        className="w-full border rounded-xl px-4 py-2.5 text-[14px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-[#333] mb-1">
                        Catering Heading ({adminContentLang === 'en' ? 'English' : 'German'})
                      </label>
                      <input
                        type="text"
                        value={adminContentLang === 'en' ? (homepageContent.cateringTitleEn || '') : (homepageContent.cateringTitleDe || '')}
                        onChange={(e) =>
                          setHomepageContent(
                            adminContentLang === 'en'
                              ? { ...homepageContent, cateringTitleEn: e.target.value }
                              : { ...homepageContent, cateringTitleDe: e.target.value }
                          )
                        }
                        placeholder={adminContentLang === 'en' ? 'Bold Flavours That Fuel Your Team' : 'Kräftige Aromen, die Ihr Team begeistern'}
                        className="w-full border rounded-xl px-4 py-2.5 text-[14px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">
                      Description Paragraph 1 ({adminContentLang === 'en' ? 'English' : 'German'})
                    </label>
                    <textarea
                      rows={2}
                      value={adminContentLang === 'en' ? (homepageContent.cateringDescEn || '') : (homepageContent.cateringDescDe || '')}
                      onChange={(e) =>
                        setHomepageContent(
                          adminContentLang === 'en'
                            ? { ...homepageContent, cateringDescEn: e.target.value }
                            : { ...homepageContent, cateringDescDe: e.target.value }
                        )
                      }
                      placeholder="From team lunches to full corporate events..."
                      className="w-full border rounded-xl px-4 py-2 text-[14px] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">
                      Description Paragraph 2 ({adminContentLang === 'en' ? 'English' : 'German'})
                    </label>
                    <textarea
                      rows={2}
                      value={adminContentLang === 'en' ? (homepageContent.cateringP2En || '') : (homepageContent.cateringP2De || '')}
                      onChange={(e) =>
                        setHomepageContent(
                          adminContentLang === 'en'
                            ? { ...homepageContent, cateringP2En: e.target.value }
                            : { ...homepageContent, cateringP2De: e.target.value }
                        )
                      }
                      placeholder="Customized for your team, effortlessly delivered..."
                      className="w-full border rounded-xl px-4 py-2 text-[14px] resize-none"
                    />
                  </div>

                  {/* 4 Bullet Highlights */}
                  <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-2xl p-4 space-y-3">
                    <label className="text-[12px] font-black text-[#1e382f] uppercase tracking-wider block">
                      4 Key Highlights ({adminContentLang === 'en' ? 'English' : 'German'})
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 mb-1">Bullet 1</label>
                        <input
                          type="text"
                          value={adminContentLang === 'en' ? (homepageContent.cateringBullet1En || '') : (homepageContent.cateringBullet1De || '')}
                          onChange={(e) =>
                            setHomepageContent(
                              adminContentLang === 'en'
                                ? { ...homepageContent, cateringBullet1En: e.target.value }
                                : { ...homepageContent, cateringBullet1De: e.target.value }
                            )
                          }
                          placeholder={adminContentLang === 'en' ? 'Perfect for 10 to 200+ people' : 'Perfekt für 10 bis 200+ Personen'}
                          className="w-full bg-white border rounded-xl px-3 py-2 text-[13px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 mb-1">Bullet 2</label>
                        <input
                          type="text"
                          value={adminContentLang === 'en' ? (homepageContent.cateringBullet2En || '') : (homepageContent.cateringBullet2De || '')}
                          onChange={(e) =>
                            setHomepageContent(
                              adminContentLang === 'en'
                                ? { ...homepageContent, cateringBullet2En: e.target.value }
                                : { ...homepageContent, cateringBullet2De: e.target.value }
                            )
                          }
                          placeholder={adminContentLang === 'en' ? '100% Vegan & Veggie friendly' : '100% Vegan & Veggie-freundlich'}
                          className="w-full bg-white border rounded-xl px-3 py-2 text-[13px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 mb-1">Bullet 3</label>
                        <input
                          type="text"
                          value={adminContentLang === 'en' ? (homepageContent.cateringBullet3En || '') : (homepageContent.cateringBullet3De || '')}
                          onChange={(e) =>
                            setHomepageContent(
                              adminContentLang === 'en'
                                ? { ...homepageContent, cateringBullet3En: e.target.value }
                                : { ...homepageContent, cateringBullet3De: e.target.value }
                            )
                          }
                          placeholder={adminContentLang === 'en' ? 'On-time Berlin delivery' : 'Pünktliche Berliner Lieferung'}
                          className="w-full bg-white border rounded-xl px-3 py-2 text-[13px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 mb-1">Bullet 4</label>
                        <input
                          type="text"
                          value={adminContentLang === 'en' ? (homepageContent.cateringBullet4En || '') : (homepageContent.cateringBullet4De || '')}
                          onChange={(e) =>
                            setHomepageContent(
                              adminContentLang === 'en'
                                ? { ...homepageContent, cateringBullet4En: e.target.value }
                                : { ...homepageContent, cateringBullet4De: e.target.value }
                            )
                          }
                          placeholder={adminContentLang === 'en' ? 'Custom corporate invoicing' : 'Individuelle Firmenrechnung'}
                          className="w-full bg-white border rounded-xl px-3 py-2 text-[13px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quote CTA Button Text */}
                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">
                      Catering Quote Button Text ({adminContentLang === 'en' ? 'English' : 'German'})
                    </label>
                    <input
                      type="text"
                      value={adminContentLang === 'en' ? (homepageContent.cateringBtnEn || '') : (homepageContent.cateringBtnDe || '')}
                      onChange={(e) =>
                        setHomepageContent(
                          adminContentLang === 'en'
                            ? { ...homepageContent, cateringBtnEn: e.target.value }
                            : { ...homepageContent, cateringBtnDe: e.target.value }
                        )
                      }
                      placeholder={adminContentLang === 'en' ? 'Get a Quote' : 'Catering Anfragen'}
                      className="w-full border rounded-xl px-4 py-2.5 text-[14px]"
                    />
                  </div>

                  {/* Catering Photo Upload */}
                  <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-2xl p-4 space-y-2">
                    <label className="text-[12px] font-black text-[#1e382f] block">Catering Spread Photo (1000 x 1200 px)</label>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border">
                        <img src={homepageContent.cateringImage || "/assets/show3-D0blnzja.jpeg"} alt="Catering" className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleGenericFileUpload((url) => setHomepageContent({ ...homepageContent, cateringImage: url }))}
                        className="bg-[#1e382f] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload Catering Photo
                      </button>
                    </div>
                    <input
                      type="text"
                      value={homepageContent.cateringImage || ''}
                      onChange={(e) => setHomepageContent({ ...homepageContent, cateringImage: e.target.value })}
                      className="w-full bg-white border rounded-xl px-3 py-1.5 text-[12px] focus:outline-none focus:border-[#d85c27]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ── SECTION 6: VISIT US & FOOTER CTA ── */}
            <div className="bg-[#fffdfa] rounded-[24px] border border-[#ebdcd0] shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('footerCta')}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-black/2 transition-colors border-b border-[#ebdcd0]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#d85c27] text-white font-black text-[13px] flex items-center justify-center">6</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[18px] font-black text-[#1e382f]">6. Visit Us & Footer Call-to-Action</h3>
                      <span className="text-[11px] font-black bg-[#1e382f]/10 text-[#1e382f] px-2 py-0.5 rounded-md uppercase">
                        Editing {adminContentLang.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#777]">Bottom banner headline, description, and action buttons</p>
                  </div>
                </div>
                {openSections.footerCta ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>

              {openSections.footerCta && (
                <div className="p-6 md:p-8 space-y-4">
                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">
                      Banner Heading ({adminContentLang === 'en' ? 'English' : 'German'})
                    </label>
                    <input
                      type="text"
                      value={adminContentLang === 'en' ? (homepageContent.ctaTitleEn || '') : (homepageContent.ctaTitleDe || '')}
                      onChange={(e) =>
                        setHomepageContent(
                          adminContentLang === 'en'
                            ? { ...homepageContent, ctaTitleEn: e.target.value }
                            : { ...homepageContent, ctaTitleDe: e.target.value }
                        )
                      }
                      placeholder="Visit us at Zimmestr. 56..."
                      className="w-full border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">
                      Description ({adminContentLang === 'en' ? 'English' : 'German'})
                    </label>
                    <textarea
                      rows={2}
                      value={adminContentLang === 'en' ? (homepageContent.ctaDescEn || '') : (homepageContent.ctaDescDe || '')}
                      onChange={(e) =>
                        setHomepageContent(
                          adminContentLang === 'en'
                            ? { ...homepageContent, ctaDescEn: e.target.value }
                            : { ...homepageContent, ctaDescDe: e.target.value }
                        )
                      }
                      placeholder="Experience modern Indian soul food..."
                      className="w-full border rounded-xl px-4 py-2 text-[14px] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-[#333] mb-1">
                        Button 1 Menu Text ({adminContentLang === 'en' ? 'English' : 'German'})
                      </label>
                      <input
                        type="text"
                        value={adminContentLang === 'en' ? (homepageContent.ctaBtnMenuEn || '') : (homepageContent.ctaBtnMenuDe || '')}
                        onChange={(e) =>
                          setHomepageContent(
                            adminContentLang === 'en'
                              ? { ...homepageContent, ctaBtnMenuEn: e.target.value }
                              : { ...homepageContent, ctaBtnMenuDe: e.target.value }
                          )
                        }
                        placeholder={adminContentLang === 'en' ? 'View Menu' : 'Speisekarte'}
                        className="w-full border rounded-xl px-4 py-2.5 text-[14px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-[#333] mb-1">
                        Button 2 Locations Text ({adminContentLang === 'en' ? 'English' : 'German'})
                      </label>
                      <input
                        type="text"
                        value={adminContentLang === 'en' ? (homepageContent.ctaBtnLocationsEn || '') : (homepageContent.ctaBtnLocationsDe || '')}
                        onChange={(e) =>
                          setHomepageContent(
                            adminContentLang === 'en'
                              ? { ...homepageContent, ctaBtnLocationsEn: e.target.value }
                              : { ...homepageContent, ctaBtnLocationsDe: e.target.value }
                          )
                        }
                        placeholder={adminContentLang === 'en' ? 'Our Locations' : 'Unsere Standorte'}
                        className="w-full border rounded-xl px-4 py-2.5 text-[14px]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Save Button */}
            {/* Bottom Save Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-8 py-3.5 rounded-full text-[15px] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                <span>Save All Homepage Changes</span>
              </button>
            </div>

          </form>
        )}

        {/* ═══════════════════════════════════════════════
            TAB 3: CATEGORIES (WITH COLLAPSIBLE SECTIONS & DISH PICKER)
        ═══════════════════════════════════════════════ */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-[#fffdfa] rounded-[24px] p-6 md:p-8 border border-[#ebdcd0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-[22px] font-black text-[#1e382f]">Menu Categories & Dishes ({categories.length})</h2>
                <p className="text-[13px] text-[#666] mt-0.5">
                  Click any category to expand/collapse its dishes. Add existing dishes or create new ones.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleExpandAllCategories}
                  className="bg-white hover:bg-gray-50 text-[#1e382f] border border-[#ebdcd0] font-bold px-3.5 py-2 rounded-xl text-[13px] transition-all flex items-center gap-1.5"
                >
                  <FolderOpen className="w-4 h-4 text-[#d85c27]" />
                  <span>Expand All</span>
                </button>
                <button
                  type="button"
                  onClick={handleCollapseAllCategories}
                  className="bg-white hover:bg-gray-50 text-[#1e382f] border border-[#ebdcd0] font-bold px-3.5 py-2 rounded-xl text-[13px] transition-all flex items-center gap-1.5"
                >
                  <FolderClosed className="w-4 h-4 text-gray-500" />
                  <span>Collapse All</span>
                </button>
                <button
                  onClick={handleOpenNewCategory}
                  className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-5 py-2.5 rounded-full text-[14px] shadow-sm hover:shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Category</span>
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {categories.map((cat, idx) => {
                const isCollapsed = collapsedCategories[cat._id] || false;

                return (
                  <div
                    key={cat._id}
                    className="bg-[#fffdfa] rounded-[26px] border border-[#ebdcd0] shadow-sm overflow-hidden transition-all"
                  >
                    {/* Category Header */}
                    <div className="p-5 md:p-6 bg-[#fcf8f3] border-b border-[#ebdcd0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Clickable Category Info */}
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat._id)}
                        className="flex items-start gap-4 text-left flex-1 group"
                      >
                        <span className="w-10 h-10 rounded-2xl bg-[#d85c27] text-white font-black text-[15px] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="font-black text-[20px] text-[#1e382f] group-hover:text-[#d85c27] transition-colors">
                              {cat.name}
                            </h3>
                            <span className="text-[14px] font-bold text-[#888]">/ {cat.nameDe || cat.name}</span>
                            <span className="text-[12px] font-black bg-[#1e382f]/10 text-[#1e382f] px-3 py-0.5 rounded-full">
                              {cat.items.length} {cat.items.length === 1 ? 'dish' : 'dishes'}
                            </span>
                            <span className="text-[11px] font-bold text-[#d85c27] ml-1">
                              {isCollapsed ? '(Click to expand ▾)' : '(Click to collapse ▴)'}
                            </span>
                          </div>
                          {(cat.description || cat.descriptionDe) && (
                            <p className="text-[13px] text-[#666] mt-1 max-w-[700px] line-clamp-1">
                              {cat.description || cat.descriptionDe}
                            </p>
                          )}
                        </div>
                      </button>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                        {/* Move Up/Down Order */}
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#ebdcd0]">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveCategory(cat._id, 'up')}
                            title="Move Category Up"
                            className="p-1.5 text-gray-600 hover:text-black disabled:opacity-30 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={idx === categories.length - 1}
                            onClick={() => handleMoveCategory(cat._id, 'down')}
                            title="Move Category Down"
                            className="p-1.5 text-gray-600 hover:text-black disabled:opacity-30 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            ▼
                          </button>
                        </div>

                        {/* Edit Category */}
                        <button
                          onClick={() => handleOpenEditCategory(cat)}
                          className="p-2 rounded-xl text-blue-600 bg-white hover:bg-blue-50 transition-colors border border-[#ebdcd0]"
                          title="Edit Category Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete Category */}
                        <button
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="p-2 rounded-xl text-rose-600 bg-white hover:bg-rose-50 transition-colors border border-[#ebdcd0]"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Add Dish (Existing or New) */}
                        <button
                          onClick={() => handleOpenAddDishToCategory(cat._id)}
                          className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-4 py-2 rounded-xl text-[13px] transition-all flex items-center gap-1.5 shadow-xs"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Dish</span>
                        </button>

                        {/* Expand / Collapse Chevron */}
                        <button
                          type="button"
                          onClick={() => toggleCategory(cat._id)}
                          className="p-2 rounded-xl text-gray-500 bg-white hover:bg-gray-100 transition-colors border border-[#ebdcd0]"
                          title={isCollapsed ? 'Expand Category' : 'Collapse Category'}
                        >
                          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Dishes inside this Category (Collapsible) */}
                    {!isCollapsed && (
                      <div className="p-6 animate-fadeIn">
                        {cat.items.length === 0 ? (
                          <div className="border-2 border-dashed border-[#ebdcd0] rounded-2xl p-8 text-center bg-white/50 space-y-3">
                            <p className="text-[14px] text-gray-500 font-bold">
                              No dishes in "{cat.name}" yet.
                            </p>
                            <button
                              onClick={() => handleOpenAddDishToCategory(cat._id)}
                              className="bg-[#1e382f] text-white font-extrabold px-4 py-2 rounded-xl text-[12px] hover:bg-[#152721] transition-colors inline-flex items-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Existing or New Dish</span>
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {cat.items.map((item) => {
                              const isVeg = item.foodType === 'vegetarian';
                              const isVegan = item.foodType === 'vegan';

                              return (
                                <div
                                  key={item._id || item.id}
                                  className={`bg-white rounded-2xl p-4 border border-[#ebdcd0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                                    item.available === false ? 'opacity-50 grayscale' : ''
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-center gap-3 mb-3">
                                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#fae8d8] shrink-0 border border-[#ebdcd0]">
                                        {item.img ? (
                                          <img src={item.img} alt={item.titleEn} className="w-full h-full object-cover" />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-gray-400">
                                            No Img
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-extrabold text-[15px] text-[#1a1a1a] truncate">
                                          {item.titleEn}
                                        </h4>
                                        <p className="text-[12px] text-[#777] truncate">
                                          {item.titleDe}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                                      <span
                                        className={`text-[9px] font-black px-2 py-0.5 rounded-full text-white ${
                                          isVegan
                                            ? 'bg-[#2d6a4f]'
                                            : isVeg
                                            ? 'bg-[#1e382f]'
                                            : 'bg-[#d85c27]'
                                        }`}
                                      >
                                        {isVegan ? 'VEGAN' : isVeg ? 'VEGETARIAN' : 'NON-VEG'}
                                      </span>
                                      {item.isSpicy && (
                                         <span className="p-0.5 rounded bg-orange-50 text-orange-600 inline-flex items-center" title="Spicy">
                                           <Flame className="w-3 h-3 fill-orange-500 text-orange-600" />
                                         </span>
                                       )}
                                      {item.featured && (
                                        <span className="inline-flex items-center gap-0.5 text-[9px] font-black bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md">
                                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Featured
                                        </span>
                                      )}
                                      {item.available === false && (
                                        <span className="text-[9px] font-black bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded-md">
                                          Sold Out
                                        </span>
                                      )}
                                    </div>

                                    <p className="text-[12.5px] text-[#555] line-clamp-2 mb-3">
                                      {item.descEn || item.descDe || 'No description provided.'}
                                    </p>
                                  </div>

                                  <div className="pt-3 border-t border-[#ebdcd0] flex items-center justify-between">
                                    <span className="font-black text-[14px] text-[#d85c27]">
                                      {item.price}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => handleToggleAvailable(item._id || item.id || '', cat._id)}
                                        title={item.available === false ? 'Mark Available' : 'Mark Unavailable'}
                                        className={`p-1.5 rounded-lg transition-colors ${
                                          item.available === false ? 'text-gray-400 hover:bg-gray-100' : 'text-emerald-700 hover:bg-emerald-50'
                                        }`}
                                      >
                                        {item.available === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                      </button>
                                      <button
                                        onClick={() => handleToggleFeatured(item._id || item.id || '', cat._id)}
                                        title={item.featured ? 'Remove from Featured' : 'Feature on Homepage'}
                                        className={`p-1.5 rounded-lg transition-colors ${
                                          item.featured ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-400 hover:bg-gray-100'
                                        }`}
                                      >
                                        <Star className={`w-4 h-4 ${item.featured ? 'fill-amber-500' : ''}`} />
                                      </button>
                                      <button
                                        onClick={() => handleOpenEditItem(item, cat._id)}
                                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                        title="Edit Dish"
                                      >
                                        <Edit3 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteItem(item._id || item.id || '', cat._id)}
                                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                                        title="Delete Dish"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            TAB 4: SITE SETTINGS
        ═══════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-[#fffdfa] rounded-[24px] p-6 md:p-8 border border-[#ebdcd0] shadow-sm space-y-6">
            <h2 className="text-[20px] font-black text-[#1e382f]">Restaurant Information & Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[13px] font-bold text-[#333] mb-1">Restaurant Name</label>
                <input
                  type="text"
                  value={siteSettings.restaurantName || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, restaurantName: e.target.value })}
                  className="w-full border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#333] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={siteSettings.phone || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                  className="w-full border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[13px] font-bold text-[#333] mb-1">Email Address</label>
                <input
                  type="email"
                  value={siteSettings.email || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                  className="w-full border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#333] mb-1">Street Address</label>
                <input
                  type="text"
                  value={siteSettings.address || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                  className="w-full border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#d85c27] text-white font-extrabold px-8 py-3 rounded-full text-[14px] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </form>
        )}

        {/* ═══════════════════════════════════════════════
            MODAL: ADD / EDIT ITEM (DOUBLE PRICING & UPLOAD)
        ═══════════════════════════════════════════════ */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-[28px] w-full max-w-[760px] max-h-[92vh] overflow-y-auto shadow-2xl p-6 md:p-8">
              
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-[#d85c27]/10 text-[#d85c27]">
                    <Utensils className="w-5 h-5" />
                  </span>
                  <h3 className="text-[20px] font-black text-[#1e382f]">
                    {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-700 font-bold text-xl p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-5">
                
                {/* Language Switcher in Dish Modal */}
                <div className="flex items-center justify-between bg-[#fcf8f3] p-3 rounded-2xl border border-[#ebdcd0]">
                  <span className="text-[12px] font-black text-[#1e382f] uppercase tracking-wider">
                    Editing Language: {adminContentLang.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#ebdcd0]">
                    <button
                      type="button"
                      onClick={() => setAdminContentLang('en')}
                      className={`px-3 py-1.5 text-[12px] font-extrabold rounded-lg transition-all flex items-center gap-1.5 ${
                        adminContentLang === 'en'
                          ? 'bg-[#1e382f] text-white shadow-xs'
                          : 'text-[#1e382f] hover:bg-gray-100'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>English (EN)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminContentLang('de')}
                      className={`px-3 py-1.5 text-[12px] font-extrabold rounded-lg transition-all flex items-center gap-1.5 ${
                        adminContentLang === 'de'
                          ? 'bg-[#1e382f] text-white shadow-xs'
                          : 'text-[#1e382f] hover:bg-gray-100'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Deutsch (DE)</span>
                    </button>
                  </div>
                </div>

                {/* 1. Dish Title */}
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">
                    Dish Title ({adminContentLang === 'en' ? 'English' : 'German'}) *
                  </label>
                  <input
                    type="text"
                    value={adminContentLang === 'en' ? formTitleEn : formTitleDe}
                    onChange={(e) =>
                      adminContentLang === 'en' ? setFormTitleEn(e.target.value) : setFormTitleDe(e.target.value)
                    }
                    required={adminContentLang === 'en'}
                    placeholder={adminContentLang === 'en' ? 'e.g. Chettinad Spicy Chicken Bowl' : 'e.g. Chettinad "Spicy Chicken" Schale'}
                    className="w-full border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>

                {/* 2. Category & Food Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">Category *</label>
                    <select
                      value={formCatId}
                      onChange={(e) => setFormCatId(e.target.value)}
                      className="w-full border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">Dietary Classification *</label>
                    <select
                      value={formFoodType}
                      onChange={(e) => setFormFoodType(e.target.value as FoodType)}
                      className="w-full border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                    >
                      <option value="vegetarian">Vegetarian (VEG)</option>
                      <option value="nonVegetarian">Non-Vegetarian (NON-VEG)</option>
                      <option value="vegan">Vegan (VEGAN)</option>
                    </select>
                  </div>
                </div>

                {/* 3. Pricing Configuration (Single vs Double / Multi Pricing) */}
                <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-black text-[#1e382f] flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-[#d85c27]" />
                      Pricing Format
                    </label>
                    <div className="flex bg-white rounded-xl p-1 border border-[#ebdcd0]">
                      <button
                        type="button"
                        onClick={() => setPriceType('single')}
                        className={`px-3 py-1 text-[12px] font-bold rounded-lg transition-all ${
                          priceType === 'single' ? 'bg-[#d85c27] text-white shadow-sm' : 'text-gray-600'
                        }`}
                      >
                        Single Price
                      </button>
                      <button
                        type="button"
                        onClick={() => setPriceType('double')}
                        className={`px-3 py-1 text-[12px] font-bold rounded-lg transition-all ${
                          priceType === 'double' ? 'bg-[#d85c27] text-white shadow-sm' : 'text-gray-600'
                        }`}
                      >
                        Double / Multi-Price
                      </button>
                    </div>
                  </div>

                  {priceType === 'single' ? (
                    <div>
                      <label className="block text-[12px] font-bold text-[#555] mb-1">Price (e.g. €11,5)</label>
                      <input
                        type="text"
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        placeholder="€11,5"
                        required
                        className="w-full bg-white border rounded-xl px-4 py-2.5 text-[14px] font-bold focus:outline-none focus:border-[#d85c27]"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3 pt-1">
                      {/* Option 1 */}
                      <div className="grid grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-[#ebdcd0]">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 mb-1">Option 1 (EN)</label>
                          <input
                            type="text"
                            value={opt1LabelEn}
                            onChange={(e) => setOpt1LabelEn(e.target.value)}
                            placeholder="Chicken"
                            className="w-full border rounded-lg px-3 py-1.5 text-[13px] font-bold focus:outline-none focus:border-[#d85c27]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 mb-1">Option 1 (DE)</label>
                          <input
                            type="text"
                            value={opt1LabelDe}
                            onChange={(e) => setOpt1LabelDe(e.target.value)}
                            placeholder="Hähnchen"
                            className="w-full border rounded-lg px-3 py-1.5 text-[13px] font-bold focus:outline-none focus:border-[#d85c27]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 mb-1">Price 1</label>
                          <input
                            type="text"
                            value={opt1Price}
                            onChange={(e) => setOpt1Price(e.target.value)}
                            placeholder="€12,5"
                            className="w-full border rounded-lg px-3 py-1.5 text-[13px] font-bold text-[#d85c27] focus:outline-none focus:border-[#d85c27]"
                          />
                        </div>
                      </div>

                      {/* Option 2 */}
                      <div className="grid grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-[#ebdcd0]">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 mb-1">Option 2 (EN)</label>
                          <input
                            type="text"
                            value={opt2LabelEn}
                            onChange={(e) => setOpt2LabelEn(e.target.value)}
                            placeholder="Prawns"
                            className="w-full border rounded-lg px-3 py-1.5 text-[13px] font-bold focus:outline-none focus:border-[#d85c27]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 mb-1">Option 2 (DE)</label>
                          <input
                            type="text"
                            value={opt2LabelDe}
                            onChange={(e) => setOpt2LabelDe(e.target.value)}
                            placeholder="Garnelen"
                            className="w-full border rounded-lg px-3 py-1.5 text-[13px] font-bold focus:outline-none focus:border-[#d85c27]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 mb-1">Price 2</label>
                          <input
                            type="text"
                            value={opt2Price}
                            onChange={(e) => setOpt2Price(e.target.value)}
                            placeholder="€14,5"
                            className="w-full border rounded-lg px-3 py-1.5 text-[13px] font-bold text-[#d85c27] focus:outline-none focus:border-[#d85c27]"
                          />
                        </div>
                      </div>

                      {/* Preview Badge */}
                      <div className="text-[12px] text-gray-600 bg-white p-2.5 rounded-xl border border-dashed border-[#ebdcd0] flex items-center justify-between">
                        <span className="font-bold">Live Preview:</span>
                        <span className="bg-[#1e382f]/5 text-[#d85c27] font-black px-2.5 py-1 rounded-md">
                          {opt1LabelEn} {opt1Price} | {opt2LabelEn} {opt2Price}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Image Upload & Available Gallery Selector */}
                <div className="bg-[#fffdfa] border border-[#ebdcd0] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-[13px] font-black text-[#1e382f] flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#d85c27]" />
                        Dish Image
                      </label>
                      <p className="text-[11.5px] text-[#666] mt-0.5">
                        Recommended size: <strong className="text-[#1a1a1a]">600 x 450 px</strong> (4:3 ratio), under 2MB.
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setShowGallery(!showGallery)}
                      className="text-[12px] font-bold text-[#d85c27] hover:underline flex items-center gap-1"
                    >
                      <Grid className="w-3.5 h-3.5" />
                      {showGallery ? 'Hide Gallery' : 'Choose Existing Image'}
                    </button>
                  </div>

                  {/* Image Upload Row */}
                  <div className="flex items-center gap-4">
                    {/* Preview Thumbnail */}
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#fae8d8] shrink-0 border border-[#ebdcd0]">
                      {formImg ? (
                        <img src={formImg} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-bold">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-[#1e382f] hover:bg-[#152721] text-white text-[13px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          Upload New Photo
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') setFormImg(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }}
                          className="hidden"
                        />
                        {formImg && (
                          <button
                            type="button"
                            onClick={() => setFormImg('')}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-[12px] font-bold px-3 py-2 rounded-xl flex items-center gap-1 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        value={formImg}
                        onChange={(e) => setFormImg(e.target.value)}
                        placeholder="Upload a photo, choose from gallery, or paste image URL..."
                        className="w-full border rounded-xl px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#d85c27]"
                      />
                    </div>
                  </div>

                  {/* ── Interactive Image Gallery Grid ── */}
                  {showGallery && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 animate-fadeIn">
                      <p className="text-[12px] font-bold text-gray-700">Click any image to select:</p>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 max-h-[220px] overflow-y-auto p-1">
                        {AVAILABLE_ASSETS.map((asset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => { setFormImg(asset.path); setShowGallery(false); }}
                            className={`group relative rounded-xl overflow-hidden border-2 transition-all aspect-square ${
                              formImg === asset.path ? 'border-[#d85c27] ring-2 ring-[#d85c27]/30' : 'border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            <img src={asset.path} alt={asset.name} className="w-full h-full object-cover" />
                            <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] font-bold py-0.5 truncate px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {asset.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Description */}
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">
                    Description ({adminContentLang === 'en' ? 'English' : 'German'})
                  </label>
                  <textarea
                    rows={2}
                    value={adminContentLang === 'en' ? formDescEn : formDescDe}
                    onChange={(e) =>
                      adminContentLang === 'en' ? setFormDescEn(e.target.value) : setFormDescDe(e.target.value)
                    }
                    placeholder={adminContentLang === 'en' ? 'Fresh ingredients description...' : 'Deutsche Beschreibung...'}
                    className="w-full border rounded-xl px-4 py-2 text-[14px] focus:outline-none focus:border-[#d85c27] resize-none"
                  />
                </div>

                {/* 6. Toggles */}
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-[13px] font-bold text-[#333]">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-[#d85c27]"
                    />
                    <span>Feature on Homepage ("Treat Your Tastebuds")</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[13px] font-bold text-[#333]">
                    <input
                      type="checkbox"
                      checked={formAvailable}
                      onChange={(e) => setFormAvailable(e.target.checked)}
                      className="w-4 h-4 rounded text-[#d85c27]"
                    />
                    <span>Available / In Stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[13px] font-bold text-[#333]">
                    <input
                      type="checkbox"
                      checked={formSpicy}
                      onChange={(e) => setFormSpicy(e.target.checked)}
                      className="w-4 h-4 rounded text-[#d85c27]"
                    />
                    <span className="flex items-center gap-1">
                      <span>Spicy</span>
                      <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-600" />
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-full font-bold text-[14px] text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-6 py-2.5 rounded-full text-[14px] shadow-sm transition-all"
                  >
                    {editingItem ? 'Save Changes' : 'Create Menu Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            MODAL: ADD / EDIT CATEGORY
        ═══════════════════════════════════════════════ */}
        {isCatModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-[28px] w-full max-w-[560px] shadow-2xl p-6 md:p-8 animate-scaleIn">
              
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-[#d85c27]/10 text-[#d85c27]">
                    <FolderTree className="w-5 h-5" />
                  </span>
                  <h3 className="text-[20px] font-black text-[#1e382f]">
                    {editingCategory ? 'Edit Menu Category' : 'Create New Category'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsCatModalOpen(false)}
                  className="text-gray-400 hover:text-gray-700 font-bold text-xl p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-5">
                {/* Language Switcher in Category Modal */}
                <div className="flex items-center justify-between bg-[#fcf8f3] p-3 rounded-2xl border border-[#ebdcd0]">
                  <span className="text-[12px] font-black text-[#1e382f] uppercase tracking-wider">
                    Editing Language: {adminContentLang.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#ebdcd0]">
                    <button
                      type="button"
                      onClick={() => setAdminContentLang('en')}
                      className={`px-3 py-1.5 text-[12px] font-extrabold rounded-lg transition-all flex items-center gap-1.5 ${
                        adminContentLang === 'en'
                          ? 'bg-[#1e382f] text-white shadow-xs'
                          : 'text-[#1e382f] hover:bg-gray-100'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>English (EN)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminContentLang('de')}
                      className={`px-3 py-1.5 text-[12px] font-extrabold rounded-lg transition-all flex items-center gap-1.5 ${
                        adminContentLang === 'de'
                          ? 'bg-[#1e382f] text-white shadow-xs'
                          : 'text-[#1e382f] hover:bg-gray-100'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Deutsch (DE)</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">
                    Category Name ({adminContentLang === 'en' ? 'English' : 'German'}) *
                  </label>
                  <input
                    type="text"
                    value={adminContentLang === 'en' ? catNameEn : catNameDe}
                    onChange={(e) =>
                      adminContentLang === 'en' ? setCatNameEn(e.target.value) : setCatNameDe(e.target.value)
                    }
                    required={adminContentLang === 'en'}
                    placeholder={adminContentLang === 'en' ? 'e.g. Street Food Snacks, Signature Bowls...' : 'e.g. Straßenessen Snacks, Signatur Schalen...'}
                    className="w-full border-2 border-[#ebdcd0] focus:border-[#d85c27] rounded-xl px-4 py-2.5 text-[14px] font-bold focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">
                    Description ({adminContentLang === 'en' ? 'English' : 'German'})
                  </label>
                  <textarea
                    rows={2}
                    value={adminContentLang === 'en' ? catDescEn : catDescDe}
                    onChange={(e) =>
                      adminContentLang === 'en' ? setCatDescEn(e.target.value) : setCatDescDe(e.target.value)
                    }
                    placeholder={adminContentLang === 'en' ? 'Short description for this menu section...' : 'Kurze Beschreibung für diesen Bereich...'}
                    className="w-full border-2 border-[#ebdcd0] focus:border-[#d85c27] rounded-xl px-4 py-2 text-[14px] focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsCatModalOpen(false)}
                    className="px-5 py-2.5 rounded-full font-bold text-[14px] text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-6 py-2.5 rounded-full text-[14px] shadow-sm transition-all"
                  >
                    {editingCategory ? 'Save Category' : 'Create Category'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            MODAL: ADD DISH TO CATEGORY (EXISTING OR NEW)
        ═══════════════════════════════════════════════ */}
        {assignModalCatId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-[28px] w-full max-w-[840px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scaleIn">
              
              {/* Modal Header */}
              {(() => {
                const targetCat = categories.find((c) => c._id === assignModalCatId);
                const catName = targetCat ? targetCat.name : 'Category';
                const catItemsIds = new Set((targetCat?.items || []).map((it) => it._id || it.id));
                const allDishes = categories.flatMap((c) =>
                  c.items.map((it) => ({ ...it, sourceCatId: c._id, sourceCatName: c.name }))
                );
                const filteredDishes = allDishes.filter((it) => {
                  if (!assignSearchQuery.trim()) return true;
                  const q = assignSearchQuery.toLowerCase();
                  return (
                    (it.titleEn || '').toLowerCase().includes(q) ||
                    (it.titleDe || '').toLowerCase().includes(q) ||
                    (it.descEn || '').toLowerCase().includes(q) ||
                    (it.price || '').toLowerCase().includes(q) ||
                    (it.sourceCatName || '').toLowerCase().includes(q)
                  );
                });

                return (
                  <>
                    <div className="p-6 bg-[#fcf8f3] border-b border-[#ebdcd0] flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="p-2 rounded-xl bg-[#d85c27] text-white">
                            <Plus className="w-4 h-4" />
                          </span>
                          <h3 className="text-[20px] font-black text-[#1e382f]">
                            Add Dish to "{catName}"
                          </h3>
                        </div>
                        <p className="text-[12px] text-[#666] mt-1">
                          Pick from existing dishes in your menu, or create a brand new dish.
                        </p>
                      </div>
                      <button
                        onClick={() => setAssignModalCatId(null)}
                        className="text-gray-400 hover:text-gray-700 font-bold text-xl p-1"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Tab Options & Search Bar */}
                    <div className="p-6 border-b border-[#ebdcd0] space-y-4 bg-white">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-2 bg-[#f5f0e8] p-1 rounded-xl border border-[#ebdcd0]">
                          <button
                            type="button"
                            onClick={() => setAssignModalTab('existing')}
                            className={`px-4 py-2 rounded-lg text-[13px] font-extrabold transition-all flex items-center gap-1.5 ${
                              assignModalTab === 'existing'
                                ? 'bg-[#1e382f] text-white shadow-xs'
                                : 'text-[#1e382f] hover:bg-white/60'
                            }`}
                          >
                            <Layers className="w-4 h-4" />
                            <span>Choose from Existing Dishes ({allDishes.length})</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const targetId = assignModalCatId;
                              setAssignModalCatId(null);
                              handleOpenNewItem(targetId);
                            }}
                            className="px-4 py-2 rounded-lg text-[13px] font-extrabold text-[#d85c27] hover:bg-white/60 transition-all flex items-center gap-1.5"
                          >
                            <PlusCircle className="w-4 h-4" />
                            <span>Create Brand New Dish</span>
                          </button>
                        </div>
                      </div>

                      {/* Search Bar for Existing Dishes */}
                      {assignModalTab === 'existing' && (
                        <div className="relative">
                          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={assignSearchQuery}
                            onChange={(e) => setAssignSearchQuery(e.target.value)}
                            placeholder="Search dishes by name, ingredients, or category..."
                            className="w-full pl-10 pr-4 py-2.5 bg-[#fcf8f3] border border-[#ebdcd0] rounded-xl text-[14px] focus:outline-none focus:border-[#d85c27]"
                          />
                          {assignSearchQuery && (
                            <button
                              onClick={() => setAssignSearchQuery('')}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Dish Grid */}
                    <div className="p-6 overflow-y-auto max-h-[50vh] space-y-3 bg-[#faf7f2]">
                      {filteredDishes.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 font-bold">
                          No matching dishes found.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {filteredDishes.map((dish) => {
                            const isAlreadyInCat = catItemsIds.has(dish._id) || catItemsIds.has(dish.id);

                            return (
                              <div
                                key={dish._id || dish.id}
                                className={`bg-white rounded-2xl p-3.5 border border-[#ebdcd0] shadow-xs flex items-center justify-between gap-3 ${
                                  isAlreadyInCat ? 'bg-gray-50/80 opacity-70' : 'hover:border-[#d85c27]'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#fae8d8] shrink-0 border border-[#ebdcd0]">
                                    {dish.img ? (
                                      <img src={dish.img} alt={dish.titleEn} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-gray-400">
                                        No Img
                                      </div>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="font-extrabold text-[14px] text-[#1e382f] truncate">
                                      {dish.titleEn}
                                    </h4>
                                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                      <span className="font-bold text-[#d85c27]">{dish.price}</span>
                                      <span>•</span>
                                      <span className="truncate">In: {dish.sourceCatName}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="shrink-0 flex items-center gap-1.5">
                                  {isAlreadyInCat ? (
                                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                                      Already In
                                    </span>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => handleAddExistingDishToCategory(dish, assignModalCatId)}
                                        className="bg-[#1e382f] hover:bg-[#152721] text-white text-[12px] font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                                        title="Add a copy of this dish to this category"
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add</span>
                                      </button>
                                      {dish.sourceCatId !== assignModalCatId && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleMoveExistingDishToCategory(dish, dish.sourceCatId, assignModalCatId)
                                          }
                                          className="text-gray-700 hover:bg-gray-100 border border-gray-300 text-[12px] font-bold px-2.5 py-1.5 rounded-lg transition-all"
                                          title="Move from current category to this category"
                                        >
                                          Move
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-white border-t border-[#ebdcd0] flex items-center justify-between">
                      <span className="text-[12px] text-gray-500 font-medium">
                        Showing {filteredDishes.length} menu dishes
                      </span>
                      <button
                        type="button"
                        onClick={() => setAssignModalCatId(null)}
                        className="px-5 py-2 rounded-full font-bold text-[13px] text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </>
                );
              })()}

            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            BOTTOM-CENTER FLOATING TOAST & SAVE BAR
        ═══════════════════════════════════════════════ */}
        <div className="fixed bottom-6 inset-x-0 z-50 flex flex-col items-center pointer-events-none px-4 space-y-2">
          {/* Floating Save Action Banner */}
          {(hasUnsavedChanges || activeTab === 'homepage') && (
            <div className="pointer-events-auto bg-[#1e382f] text-white px-6 py-3 rounded-full shadow-2xl border-2 border-[#d85c27] flex items-center gap-4 animate-slideUp backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    hasUnsavedChanges ? 'bg-[#d85c27] animate-ping' : 'bg-emerald-400'
                  }`}
                />
                <span className="text-[13px] font-extrabold">
                  {hasUnsavedChanges ? 'You have unsaved changes' : 'Homepage Live Editor'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleSaveAllGlobal}
                className="bg-[#d85c27] hover:bg-[#c24f1c] text-white text-[13px] font-black px-5 py-2 rounded-full flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
              >
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </button>
            </div>
          )}

          {/* Persistent / Floating Toast Notification */}
          {toastMessage && (
            <div className="pointer-events-auto bg-[#1e382f] text-white px-6 py-3 rounded-full shadow-2xl border border-emerald-500/50 flex items-center gap-2.5 animate-fadeIn backdrop-blur-md">
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-[13px] font-bold">{toastMessage}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
