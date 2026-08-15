import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
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
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Upload,
  Lock,
  LogOut,
  Sparkles,
  Search,
  X,
  Flame,
  PlusCircle,
  Tag,
  CheckCircle2,
  AlertCircle,
  Compass,
  ArrowRight,
  ArrowLeft,
  Lightbulb
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
import {
  GalleryAssetItem,
  DEFAULT_GALLERY_ASSETS,
  compressImageFile
} from '../data/galleryAssets';

const AVAILABLE_TAGS = [
  'Bowls & Mains',
  'Naan Pockets',
  'Drinks & Lassis',
  'Coffee & Tea',
  'Bakery & Desserts',
  'Cocktails',
  'Showcase & Ambience',
  'Bottled Drinks',
  'My Uploads',
];

interface TourStep {
  selector: string;
  title: string;
  description: string;
  tip?: string;
  tab?: 'items' | 'categories' | 'homepage' | 'gallery' | 'settings';
}

const SPOTLIGHT_STEPS: TourStep[] = [
  {
    selector: '[data-tour="add-dish"]',
    title: '+ Add New Dish',
    description: 'Click here anytime to add a new dish with title, prices, ingredients, and photos.',
    tip: 'You can set single pricing or multiple options like Chicken / Prawns.',
    tab: 'items',
  },
  {
    selector: '[data-tour="nav-tabs"]',
    title: 'Main Navigation Bar',
    description: 'Easily switch between your Dishes list, Categories, Homepage texts, and the Photo Library.',
    tip: 'The numbers show how many items you currently have.',
    tab: 'items',
  },
  {
    selector: '[data-tour="metrics"]',
    title: 'Live Menu Overview',
    description: 'See at a glance how many dishes are available, sold out, or featured on your homepage.',
    tab: 'items',
  },
  {
    selector: '[data-tour="dish-available"]',
    title: '1-Click Availability Toggle',
    description: 'Click this button to instantly mark any dish as Available or Sold Out for the day.',
    tip: 'Sold-out items will be greyed out automatically.',
    tab: 'items',
  },
  {
    selector: '[data-tour="dish-star"]',
    title: 'Feature on Homepage',
    description: 'Click the Star on your signature dishes to showcase them on the homepage "Treat Your Tastebuds" section.',
    tip: 'You can arrange their order using the arrows above.',
    tab: 'items',
  },
  {
    selector: '[data-tour="dish-edit"]',
    title: 'Edit Dish Details',
    description: 'Click the blue pencil to change prices, descriptions in English & German, or dish photos.',
    tab: 'items',
  },
  {
    selector: '[data-tour="tab-gallery"]',
    title: 'Photo Library & Fast Uploads',
    description: 'Upload food photos directly from your phone. Photos are auto-compressed in milliseconds and organized by tags.',
    tab: 'gallery',
  },
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

  const [activeTab, setActiveTab] = useState<'items' | 'categories' | 'homepage' | 'gallery' | 'settings'>('items');
  const [categories, setCategories] = useState<SanityCategoryWithItems[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string>('all');
  
  // Site settings state
  const [siteSettings, setSiteSettings] = useState(initialSettings);
  // Homepage state
  const [homepageContent, _setHomepageContent] = useState<HomepageContent>(initialHomepage);

  // Auto-track changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const setHomepageContent = (val: HomepageContent | ((prev: HomepageContent) => HomepageContent)) => {
    _setHomepageContent(val);
    setHasUnsavedChanges(true);
  };

  // ── Interactive Spotlight Tour State ──
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentTourIndex, setCurrentTourIndex] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const startSpotlightTour = () => {
    setSelectedCatId('all');
    setAdminSearchQuery('');
    setCurrentTourIndex(0);
    setActiveTab(SPOTLIGHT_STEPS[0].tab || 'items');
    setIsTourActive(true);
  };

  const stopSpotlightTour = () => {
    setIsTourActive(false);
    setSpotlightRect(null);
    localStorage.setItem('maati_studio_tour_dismissed', 'true');
    showToast('Tour completed! Enjoy using MAATI Studio 🎉');
  };

  // Position Spotlight Box with Retry Loop so elements are never missed
  useEffect(() => {
    if (!isTourActive) {
      setSpotlightRect(null);
      return;
    }

    const currentStep = SPOTLIGHT_STEPS[currentTourIndex];
    if (currentStep.tab && activeTab !== currentStep.tab) {
      setActiveTab(currentStep.tab);
    }

    let attempts = 0;
    let timerId: any = null;

    const updatePosition = () => {
      const el = document.querySelector(currentStep.selector);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        const rect = el.getBoundingClientRect();
        setSpotlightRect({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      } else {
        attempts++;
        if (attempts < 10) {
          timerId = setTimeout(updatePosition, 100);
        }
      }
    };

    timerId = setTimeout(updatePosition, 60);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      if (timerId) clearTimeout(timerId);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isTourActive, currentTourIndex, activeTab]);

  const handleNextTourStep = () => {
    if (currentTourIndex < SPOTLIGHT_STEPS.length - 1) {
      const nextIndex = currentTourIndex + 1;
      setCurrentTourIndex(nextIndex);
      if (SPOTLIGHT_STEPS[nextIndex].tab) {
        setActiveTab(SPOTLIGHT_STEPS[nextIndex].tab!);
      }
    } else {
      stopSpotlightTour();
    }
  };

  const handlePrevTourStep = () => {
    if (currentTourIndex > 0) {
      const prevIndex = currentTourIndex - 1;
      setCurrentTourIndex(prevIndex);
      if (SPOTLIGHT_STEPS[prevIndex].tab) {
        setActiveTab(SPOTLIGHT_STEPS[prevIndex].tab!);
      }
    }
  };

  // Gallery state for homepage sections
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
  const [showGallery, setShowGallery] = useState(false);

  // Dynamic Gallery Assets with Delete & Custom Upload Management
  const [galleryAssets, setGalleryAssets] = useState<GalleryAssetItem[]>(() => {
    const saved = localStorage.getItem('maati_admin_gallery_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return DEFAULT_GALLERY_ASSETS;
  });
  const [galleryFilterCat, setGalleryFilterCat] = useState<string>('All');
  const [gallerySearch, setGallerySearch] = useState<string>('');

  // ── Tagging & Photo Modal State ──
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoModalData, setPhotoModalData] = useState<{
    id?: string;
    name: string;
    category: string;
    path: string;
    originalSize?: number;
    compressedSize?: number;
    callback?: (url: string) => void;
    isNew?: boolean;
  }>({
    name: '',
    category: 'Bowls & Mains',
    path: '',
  });

  const saveGalleryAssets = (updated: GalleryAssetItem[]) => {
    setGalleryAssets(updated);
    localStorage.setItem('maati_admin_gallery_v2', JSON.stringify(updated));
  };

  const handleDeleteGalleryImage = (e: React.MouseEvent, assetIdOrPath: string, assetName: string) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${assetName}" from the photo library?`)) return;
    const updated = galleryAssets.filter(
      (a) => a.id !== assetIdOrPath && a.path !== assetIdOrPath
    );
    saveGalleryAssets(updated);
    showToast(`Deleted "${assetName}" from photos`);
  };

  const handleOpenEditPhoto = (asset: GalleryAssetItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPhotoModalData({
      id: asset.id,
      name: asset.name,
      category: asset.category,
      path: asset.path,
      isNew: false,
    });
    setIsPhotoModalOpen(true);
  };

  const handleSavePhotoModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoModalData.path) return;

    const assetId = photoModalData.id || ('custom_' + Date.now());
    const assetName = photoModalData.name.trim() || 'Uploaded Photo';
    const assetCategory = photoModalData.category.trim() || 'Bowls & Mains';

    const updatedAsset: GalleryAssetItem = {
      id: assetId,
      name: assetName,
      path: photoModalData.path,
      category: assetCategory,
      isCustom: true,
    };

    const exists = galleryAssets.some((a) => a.id === assetId || a.path === photoModalData.path);
    let updatedList: GalleryAssetItem[];
    if (exists) {
      updatedList = galleryAssets.map((a) =>
        a.id === assetId || a.path === photoModalData.path ? updatedAsset : a
      );
    } else {
      updatedList = [updatedAsset, ...galleryAssets];
    }

    saveGalleryAssets(updatedList);

    if (photoModalData.callback) {
      photoModalData.callback(photoModalData.path);
    }

    setIsPhotoModalOpen(false);
    showToast(`Photo "${assetName}" saved in "${assetCategory}"`);
  };

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

  // Add dish to category modal
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [targetCategoryForAdd, setTargetCategoryForAdd] = useState<string>('');

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

  // Admin Search Query
  const [adminSearchQuery, setAdminSearchQuery] = useState('');

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  // Load from local storage or initial
  useEffect(() => {
    const savedMenu = localStorage.getItem('maati_admin_menu');
    if (savedMenu) {
      try {
        const parsed = JSON.parse(savedMenu);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed);
        } else {
          setCategories(initialCategories);
        }
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
    showToast('Menu updated live!');
  };

  const showSuccessToast = () => {
    setHasUnsavedChanges(false);
    window.dispatchEvent(new Event('maati_homepage_updated'));
    showToast('Homepage changes saved live!');
  };

  // Fast Client-Side Image Compression & Auto-Optimizer
  const handleOptimizedImageUpload = async (callback: (dataUrl: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      try {
        showToast('Compressing photo...');
        const { dataUrl, originalSize, compressedSize, cleanName } = await compressImageFile(file);

        // Open Tagging dialog so user can name & select category tag
        setPhotoModalData({
          id: 'custom_' + Date.now(),
          name: cleanName,
          category: 'Bowls & Mains',
          path: dataUrl,
          originalSize,
          compressedSize,
          callback,
          isNew: true,
        });
        setIsPhotoModalOpen(true);
      } catch (err) {
        showToast('Error loading photo');
      }
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

    if (item.options && item.options.length >= 2) {
      setPriceType('double');
      setOpt1LabelEn(item.options[0].nameEn || 'Chicken');
      setOpt1LabelDe(item.options[0].nameDe || 'Hähnchen');
      setOpt1Price(item.options[0].price || '€12,5');
      setOpt2LabelEn(item.options[1].nameEn || 'Prawns');
      setOpt2LabelDe(item.options[1].nameDe || 'Garnelen');
      setOpt2Price(item.options[1].price || '€14,5');
      setFormPrice('');
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
    setFormFeatured(!!item.featured);
    setFormAvailable(item.available !== false);
    setFormSpicy(!!item.isSpicy);
    setShowGallery(false);
    setIsModalOpen(true);
  };

  // Save Item (Create or Update)
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitleEn.trim()) return;

    let computedPrice = formPrice;
    let computedOptions: { nameEn: string; nameDe?: string; price: string }[] | undefined = undefined;

    if (priceType === 'double') {
      computedPrice = `${opt1LabelEn} ${opt1Price} | ${opt2LabelEn} ${opt2Price}`;
      computedOptions = [
        { nameEn: opt1LabelEn, nameDe: opt1LabelDe || opt1LabelEn, price: opt1Price },
        { nameEn: opt2LabelEn, nameDe: opt2LabelDe || opt2LabelEn, price: opt2Price }
      ];
    }

    const itemData: SanityMenuItem = {
      _id: editingItem ? editingItem._id : `item-${Date.now()}`,
      id: editingItem ? editingItem.id || editingItem._id : `item-${Date.now()}`,
      titleEn: formTitleEn.trim(),
      titleDe: formTitleDe.trim() || formTitleEn.trim(),
      descEn: formDescEn.trim(),
      descDe: formDescDe.trim() || formDescEn.trim(),
      price: computedPrice,
      options: computedOptions,
      foodType: formFoodType,
      img: formImg.trim() || undefined,
      featured: formFeatured,
      available: formAvailable,
      isSpicy: formSpicy,
    };

    let updated = categories.map((cat) => ({
      ...cat,
      items: cat.items.filter((it) => it._id !== itemData._id && it.id !== itemData._id),
    }));

    updated = updated.map((cat) => {
      if (cat._id === formCatId) {
        return {
          ...cat,
          items: editingItem
            ? [...cat.items, itemData]
            : [itemData, ...cat.items],
        };
      }
      return cat;
    });

    saveAllToLocal(updated);
    setIsModalOpen(false);
  };

  // Delete Item
  const handleDeleteItem = (itemId: string, catId: string) => {
    if (!window.confirm('Are you sure you want to delete this menu dish?')) return;
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
              const currentAvailable = it.available !== false;
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
        ? `"${foundTitle}" is now AVAILABLE`
        : `"${foundTitle}" marked as SOLD OUT`
    );
  };

  // Toggle Item Featured
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

  // Category Management Handlers
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
      ? `Delete category "${cat.name}" and its ${cat.items.length} dishes?`
      : `Delete category "${cat.name}"?`;
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

  const handleOpenAddDishToCategory = (catId: string) => {
    setTargetCategoryForAdd(catId);
    setIsAddDishModalOpen(true);
  };

  const handleAddExistingDishToCategory = (item: SanityMenuItem, targetCatId: string) => {
    let updated = categories.map((cat) => ({
      ...cat,
      items: cat.items.filter((it) => it._id !== item._id && it.id !== item.id),
    }));

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

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('maati_admin_settings', JSON.stringify(siteSettings));
    showToast('Restaurant information saved!');
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

  const availableCount = allItemsWithCat.filter(it => it.available !== false).length;
  const soldOutCount = allItemsWithCat.filter(it => it.available === false).length;
  const featuredCount = allItemsWithCat.filter(it => it.featured).length;

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

  const handleDeleteStepCard = (idOrIdx: string | number) => {
    const currentSteps = (homepageContent.maatiWaySteps || []).filter(
      (s, idx) => s.id !== idOrIdx && idx !== idOrIdx
    );
    setHomepageContent({
      ...homepageContent,
      maatiWaySteps: currentSteps
    });
  };

  // Reusable Gallery Drawer with Search, Category Filter, Fast Upload, Tagging, and 1-Click Delete
  const renderGalleryPicker = (
    selectedPath: string,
    onSelect: (path: string) => void,
    onClose?: () => void
  ) => {
    const categoriesList = ['All', ...AVAILABLE_TAGS];

    const q = gallerySearch.toLowerCase().trim();
    const filtered = galleryAssets.filter((asset) => {
      const matchesCat = galleryFilterCat === 'All' || asset.category === galleryFilterCat;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        asset.name.toLowerCase().includes(q) ||
        asset.category.toLowerCase().includes(q) ||
        asset.path.toLowerCase().includes(q)
      );
    });

    return (
      <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-2xl p-4 sm:p-5 space-y-4 animate-fadeIn shadow-sm">
        {/* Top Controls: Search + Upload */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={gallerySearch}
              onChange={(e) => setGallerySearch(e.target.value)}
              placeholder="Search photos (e.g. Bowl, Naan, Mango, Chai)..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-[12.5px] focus:outline-none focus:border-[#d85c27]"
            />
            {gallerySearch && (
              <button
                type="button"
                onClick={() => setGallerySearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleOptimizedImageUpload(onSelect)}
              className="bg-[#1e382f] hover:bg-[#152721] text-white text-[12px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Upload className="w-3.5 h-3.5 text-[#d85c27]" />
              <span>+ Upload Photo</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-xl text-gray-500 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11.5px]">
          {categoriesList.map((cat) => {
            const count = cat === 'All'
              ? galleryAssets.length
              : galleryAssets.filter((a) => a.category === cat).length;
            if (count === 0 && cat !== 'All') return null;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setGalleryFilterCat(cat)}
                className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all ${
                  galleryFilterCat === cat
                    ? 'bg-[#d85c27] text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Image Grid with Click to Select, Edit Tag, & Delete */}
        {filtered.length === 0 ? (
          <div className="py-8 text-center bg-white rounded-xl border border-dashed border-gray-200">
            <p className="text-[13px] text-gray-500 font-medium">No photos found matching "{gallerySearch}"</p>
            <button
              type="button"
              onClick={() => { setGallerySearch(''); setGalleryFilterCat('All'); }}
              className="text-[#d85c27] text-[12px] font-bold mt-2 hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 max-h-[320px] overflow-y-auto p-1 bg-white rounded-xl border border-gray-200">
            {filtered.map((asset) => {
              const isSelected = selectedPath === asset.path;
              return (
                <div
                  key={asset.id || asset.path}
                  onClick={() => {
                    onSelect(asset.path);
                    if (onClose) onClose();
                  }}
                  className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-[4/3] bg-gray-50 flex flex-col justify-end ${
                    isSelected
                      ? 'border-[#d85c27] ring-2 ring-[#d85c27]/30 shadow-md'
                      : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'
                  }`}
                >
                  <img
                    src={asset.path}
                    alt={asset.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Selected Checkmark Badge */}
                  {isSelected && (
                    <div className="absolute top-1.5 left-1.5 z-10 w-5 h-5 rounded-full bg-[#d85c27] text-white flex items-center justify-center shadow">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  {/* Actions (Edit Tag & Delete) */}
                  <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditPhoto(asset, e)}
                      title={`Edit name or tag for "${asset.name}"`}
                      className="w-6 h-6 rounded-full bg-black/65 hover:bg-blue-600 text-white flex items-center justify-center shadow transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteGalleryImage(e, asset.id, asset.name)}
                      title={`Delete "${asset.name}"`}
                      className="w-6 h-6 rounded-full bg-black/65 hover:bg-rose-600 text-white flex items-center justify-center shadow transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Image Name Banner */}
                  <div className="relative z-10 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-1.5 pt-4 text-white">
                    <p className="text-[10px] font-black truncate leading-tight">{asset.name}</p>
                    <span className="text-[8.5px] text-white/75 font-medium block truncate">{asset.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════════
  // 1. LOGIN SCREEN
  // ═══════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-[420px] bg-white rounded-[32px] p-8 md:p-10 shadow-2xl border border-[#ebdcd0] text-center animate-fadeInUp">
          
          <div className="w-16 h-16 rounded-2xl bg-[#d85c27] text-white flex items-center justify-center mx-auto mb-5 shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <h1 className="text-[26px] font-black text-[#1e382f] mb-1.5">
            MAATI Studio
          </h1>
          <p className="text-[13.5px] text-[#666] mb-7">
            Staff access to update menu dishes, prices, photos, and homepage content.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#444] mb-1.5">
                Passcode
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
              className="w-full bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold py-3.5 rounded-2xl text-[15px] shadow-md hover:shadow-lg transition-all transform hover:scale-[1.01]"
            >
              Open Studio
            </button>
          </form>

          <div className="mt-8 pt-5 border-t border-gray-100 text-[11.5px] text-gray-500 font-medium">
            MAATI Kitchen Berlin Mitte
          </div>

        </div>
      </div>
    );
  }

  const currentSpotlight = SPOTLIGHT_STEPS[currentTourIndex];

  // ═══════════════════════════════════════════════
  // 2. MAIN ADMIN DASHBOARD
  // ═══════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#f5f0e8] pt-24 sm:pt-28 pb-28 px-4 sm:px-8 md:px-12 lg:px-20 relative">
      <div className="max-w-[1360px] mx-auto space-y-6">

        {/* ── Top Header Bar with Tour Guide Button ── */}
        <header className="bg-[#fffdfa] rounded-[28px] p-5 sm:p-7 border border-[#ebdcd0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1e382f] text-white flex items-center justify-center shadow-sm shrink-0">
              <Sparkles className="w-6 h-6 text-[#d85c27]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[24px] sm:text-[28px] font-black text-[#1e382f] leading-tight">
                  MAATI Studio
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                  Live
                </span>
              </div>
              <p className="text-[#666] text-[13px] mt-0.5">
                Simple control over your dishes, categories, photos, and homepage.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
            <button
              type="button"
              onClick={startSpotlightTour}
              className="bg-[#fae8d8] hover:bg-[#f3d9c2] text-[#d85c27] border border-[#ebdcd0] font-black px-4 py-2.5 rounded-xl text-[13px] shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              <span>Interactive Tour</span>
            </button>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-gray-50 text-[#1e382f] border border-[#ebdcd0] font-bold px-4 py-2.5 rounded-xl text-[13px] shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5"
            >
              <ExternalLink className="w-4 h-4 text-[#d85c27]" />
              <span>View Website</span>
            </Link>

            <button
              data-tour="add-dish"
              onClick={() => handleOpenNewItem()}
              className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-5 py-2.5 rounded-xl text-[13px] shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Dish</span>
            </button>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ── Segmented Navigation Tabs ── */}
        <nav
          data-tour="nav-tabs"
          className="flex items-center gap-2 overflow-x-auto no-scrollbar bg-[#fffdfa] p-2 rounded-2xl border border-[#ebdcd0] shadow-sm"
        >
          <button
            onClick={() => setActiveTab('items')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-[13.5px] whitespace-nowrap transition-all ${
              activeTab === 'items'
                ? 'bg-[#1e382f] text-white shadow-sm'
                : 'text-[#1e382f] hover:bg-[#1e382f]/5'
            }`}
          >
            <Utensils className="w-4 h-4 text-[#d85c27]" />
            <span>Dishes ({allItemsWithCat.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-[13.5px] whitespace-nowrap transition-all ${
              activeTab === 'categories'
                ? 'bg-[#1e382f] text-white shadow-sm'
                : 'text-[#1e382f] hover:bg-[#1e382f]/5'
            }`}
          >
            <FolderTree className="w-4 h-4 text-[#d85c27]" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('homepage')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-[13.5px] whitespace-nowrap transition-all ${
              activeTab === 'homepage'
                ? 'bg-[#1e382f] text-white shadow-sm'
                : 'text-[#1e382f] hover:bg-[#1e382f]/5'
            }`}
          >
            <Home className="w-4 h-4 text-[#d85c27]" />
            <span>Homepage Sections</span>
          </button>

          <button
            data-tour="tab-gallery"
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-[13.5px] whitespace-nowrap transition-all ${
              activeTab === 'gallery'
                ? 'bg-[#1e382f] text-white shadow-sm'
                : 'text-[#1e382f] hover:bg-[#1e382f]/5'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-[#d85c27]" />
            <span>Photo Library ({galleryAssets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-[13.5px] whitespace-nowrap transition-all ${
              activeTab === 'settings'
                ? 'bg-[#1e382f] text-white shadow-sm'
                : 'text-[#1e382f] hover:bg-[#1e382f]/5'
            }`}
          >
            <Sliders className="w-4 h-4 text-[#d85c27]" />
            <span>Restaurant Info</span>
          </button>
        </nav>

        {/* ═══════════════════════════════════════════════
            TAB 1: MENU DISHES
        ═══════════════════════════════════════════════ */}
        {activeTab === 'items' && (
          <div className="space-y-6">

            {/* Quick Metrics Cards */}
            <div data-tour="metrics" className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-[#fffdfa] rounded-2xl p-4 border border-[#ebdcd0] shadow-xs">
                <span className="text-[11px] font-extrabold text-[#777] uppercase tracking-wider block">Total Dishes</span>
                <span className="text-[24px] font-black text-[#1e382f]">{allItemsWithCat.length}</span>
              </div>
              <div className="bg-[#fffdfa] rounded-2xl p-4 border border-[#ebdcd0] shadow-xs">
                <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider block">Available</span>
                <span className="text-[24px] font-black text-emerald-700">{availableCount}</span>
              </div>
              <div className="bg-[#fffdfa] rounded-2xl p-4 border border-[#ebdcd0] shadow-xs">
                <span className="text-[11px] font-extrabold text-rose-600 uppercase tracking-wider block">Sold Out</span>
                <span className="text-[24px] font-black text-rose-600">{soldOutCount}</span>
              </div>
              <div className="bg-[#fffdfa] rounded-2xl p-4 border border-[#ebdcd0] shadow-xs">
                <span className="text-[11px] font-extrabold text-amber-600 uppercase tracking-wider block">Featured on Home</span>
                <span className="text-[24px] font-black text-amber-600">{featuredCount}</span>
              </div>
            </div>

            {/* Featured Items Live Order Bar */}
            {(() => {
              const featuredList = allItemsWithCat
                .filter((it) => it.featured)
                .sort((a, b) => (a.featuredOrder || 999) - (b.featuredOrder || 999));

              if (featuredList.length === 0) return null;

              return (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-[22px] p-4 sm:p-5 border border-amber-200 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <h3 className="text-[14px] font-black text-amber-900">
                        Featured on Homepage ({featuredList.length} Dishes)
                      </h3>
                    </div>
                    <span className="text-[11.5px] text-amber-800 font-semibold">
                      Use ◀ ▶ arrows to change the order on the homepage
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {featuredList.map((item, idx) => (
                      <div
                        key={item._id || item.id}
                        className="bg-white border border-amber-300 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-xs"
                      >
                        <span className="bg-amber-500 text-white font-black text-[10.5px] w-5 h-5 rounded-full flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-[12.5px] font-bold text-[#1a1a1a] max-w-[130px] truncate">
                          {item.titleEn}
                        </span>
                        
                        <div className="flex items-center gap-0.5 ml-1 border-l border-amber-200 pl-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveFeatured(item._id || item.id || '', 'prev')}
                            title="Move Earlier"
                            className="p-1 text-gray-500 hover:text-black disabled:opacity-20 rounded"
                          >
                            ◀
                          </button>
                          <button
                            type="button"
                            disabled={idx === featuredList.length - 1}
                            onClick={() => handleMoveFeatured(item._id || item.id || '', 'next')}
                            title="Move Later"
                            className="p-1 text-gray-500 hover:text-black disabled:opacity-20 rounded"
                          >
                            ▶
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(item._id || item.id || '', item.catId)}
                            title="Remove from Homepage"
                            className="p-1 text-rose-500 hover:text-rose-700 rounded"
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

            {/* Search & Category Filter Toolbar */}
            <div className="bg-[#fffdfa] rounded-[22px] p-4 border border-[#ebdcd0] shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={adminSearchQuery}
                    onChange={(e) => setAdminSearchQuery(e.target.value)}
                    placeholder="Search dishes (e.g. Butter Chicken, Bowl, Lassi, Coffee)..."
                    className="w-full bg-white border border-[#ebdcd0] focus:border-[#d85c27] rounded-xl pl-10 pr-10 py-2 text-[13.5px] font-medium text-[#1a1a1a] focus:outline-none transition-colors"
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

                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-[#666] shrink-0">Category:</span>
                  <select
                    value={selectedCatId}
                    onChange={(e) => setSelectedCatId(e.target.value)}
                    className="bg-white border border-[#ebdcd0] text-[#1e382f] font-bold rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#d85c27]"
                  >
                    <option value="all">All Categories ({allItemsWithCat.length})</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.items?.length || 0})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Dishes Grid */}
            {displayedItems.length === 0 ? (
              <div className="bg-[#fffdfa] border-2 border-dashed border-[#ebdcd0] rounded-[24px] p-12 text-center space-y-3">
                <Utensils className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-[14px] text-gray-500 font-bold">No dishes found matching your search</p>
                <button
                  onClick={() => { setAdminSearchQuery(''); setSelectedCatId('all'); }}
                  className="text-[#d85c27] font-bold text-[13px] hover:underline"
                >
                  Clear search filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {displayedItems.map((item, idx) => {
                  const isVeg = item.foodType === 'vegetarian';
                  const isVegan = item.foodType === 'vegan';
                  const isAvailable = item.available !== false;

                  return (
                    <div
                      key={item._id || item.id}
                      data-tour={idx === 0 ? "first-dish-card" : undefined}
                      className={`bg-[#fffdfa] rounded-2xl p-4 border border-[#ebdcd0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                        !isAvailable ? 'opacity-60 bg-gray-50/50' : ''
                      }`}
                    >
                      <div>
                        {/* Header: Photo + Title + Diet badge */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#fae8d8] shrink-0 border border-[#ebdcd0]">
                            {item.img ? (
                              <img src={item.img} alt={item.titleEn} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400">
                                No Photo
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span
                                className={`text-[9.5px] font-black px-2 py-0.5 rounded-md text-white ${
                                  isVegan ? 'bg-[#2d6a4f]' : isVeg ? 'bg-[#1e382f]' : 'bg-[#d85c27]'
                                }`}
                              >
                                {isVegan ? 'VEGAN' : isVeg ? 'VEG' : 'NON-VEG'}
                              </span>
                              {item.isSpicy && (
                                <span className="bg-rose-100 text-rose-700 text-[9.5px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                                  <Flame className="w-3 h-3 text-rose-600" /> Spicy
                                </span>
                              )}
                              <span className="text-[10px] text-gray-500 font-medium truncate">
                                {item.catName}
                              </span>
                            </div>

                            <h4 className="font-extrabold text-[15px] text-[#1a1a1a] truncate leading-tight">
                              {item.titleEn}
                            </h4>
                            <p className="text-[12px] text-[#777] truncate mt-0.5">
                              {item.titleDe}
                            </p>
                          </div>
                        </div>

                        {/* Description */}
                        {(item.descEn || item.descDe) && (
                          <p className="text-[12px] text-[#666] line-clamp-2 mb-3 leading-relaxed">
                            {adminContentLang === 'en' ? (item.descEn || item.descDe) : (item.descDe || item.descEn)}
                          </p>
                        )}
                      </div>

                      {/* Footer: Price + Quick Actions */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                        <span className="font-black text-[#d85c27] text-[14px]">
                          {item.price}
                        </span>

                        <div className="flex items-center gap-1">
                          {/* Available Toggle */}
                          <button
                            data-tour={idx === 0 ? "dish-available" : undefined}
                            type="button"
                            onClick={() => handleToggleAvailable(item._id || item.id || '', item.catId)}
                            title={isAvailable ? 'Click to mark as Sold Out' : 'Click to mark as Available'}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all flex items-center gap-1 ${
                              isAvailable
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-gray-100 text-gray-500 border border-gray-200'
                            }`}
                          >
                            {isAvailable ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                            <span>{isAvailable ? 'Available' : 'Sold Out'}</span>
                          </button>

                          {/* Featured Star */}
                          <button
                            data-tour={idx === 0 ? "dish-star" : undefined}
                            type="button"
                            onClick={() => handleToggleFeatured(item._id || item.id || '', item.catId)}
                            title={item.featured ? 'Featured on Home' : 'Feature on Homepage'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              item.featured ? 'text-amber-500 bg-amber-50' : 'text-gray-400 hover:bg-gray-100'
                            }`}
                          >
                            <Star className={`w-4 h-4 ${item.featured ? 'fill-amber-500' : ''}`} />
                          </button>

                          {/* Edit Dish */}
                          <button
                            data-tour={idx === 0 ? "dish-edit" : undefined}
                            type="button"
                            onClick={() => handleOpenEditItem(item, item.catId)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit Dish"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete Dish */}
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item._id || item.id || '', item.catId)}
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

        {/* ═══════════════════════════════════════════════
            TAB 2: MENU CATEGORIES
        ═══════════════════════════════════════════════ */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-[#fffdfa] rounded-[24px] p-5 sm:p-6 border border-[#ebdcd0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-[20px] font-black text-[#1e382f]">Menu Categories</h2>
                <p className="text-[13px] text-[#666] mt-0.5">
                  Organize your menu sections. Use ▲ ▼ to reorder.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCollapseAllCategories}
                  className="bg-white border border-[#ebdcd0] text-gray-700 text-[12px] font-bold px-3 py-2 rounded-xl hover:bg-gray-50"
                >
                  Collapse All
                </button>
                <button
                  type="button"
                  onClick={handleExpandAllCategories}
                  className="bg-white border border-[#ebdcd0] text-gray-700 text-[12px] font-bold px-3 py-2 rounded-xl hover:bg-gray-50"
                >
                  Expand All
                </button>
                <button
                  type="button"
                  onClick={handleOpenNewCategory}
                  className="bg-[#d85c27] text-white font-extrabold px-4 py-2 rounded-xl text-[13px] hover:bg-[#c24f1c] transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Category</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {categories.map((cat, idx) => {
                const isCollapsed = !!collapsedCategories[cat._id];

                return (
                  <div
                    key={cat._id}
                    className="bg-[#fffdfa] rounded-[22px] border border-[#ebdcd0] shadow-xs overflow-hidden transition-all"
                  >
                    {/* Category Header Bar (Responsive & Overflow-Safe) */}
                    <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 bg-white/70 border-b border-[#ebdcd0]">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => toggleCategory(cat._id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 shrink-0 transition-colors"
                        >
                          {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                        </button>
                        <span className="w-7 h-7 rounded-lg bg-[#1e382f] text-white font-black text-[12px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-black text-[16px] text-[#1e382f] truncate">
                              {cat.name || cat.nameDe || 'Category'}
                            </h3>
                            {cat.name && cat.nameDe && cat.name !== cat.nameDe && (
                              <span className="text-[11px] font-bold text-gray-400 truncate">
                                / {cat.nameDe}
                              </span>
                            )}
                            <span className="bg-[#fae8d8] text-[#d85c27] text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
                              {cat.items?.length || 0} dishes
                            </span>
                          </div>
                          {cat.description && (
                            <p className="text-[12px] text-gray-500 truncate mt-0.5">
                              {cat.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center pl-10 md:pl-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveCategory(cat._id, 'up')}
                          title="Move Category Up"
                          className="p-1.5 text-gray-500 hover:text-black disabled:opacity-20 rounded-lg hover:bg-gray-100"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          disabled={idx === categories.length - 1}
                          onClick={() => handleMoveCategory(cat._id, 'down')}
                          title="Move Category Down"
                          className="p-1.5 text-gray-500 hover:text-black disabled:opacity-20 rounded-lg hover:bg-gray-100"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenAddDishToCategory(cat._id)}
                          className="bg-[#1e382f] text-white font-bold px-3 py-1.5 rounded-xl text-[12px] hover:bg-[#142620] transition-colors flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Dish
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditCategory(cat)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Category Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Category Dishes List */}
                    {!isCollapsed && (
                      <div className="p-4 sm:p-5 animate-fadeIn">
                        {cat.items.length === 0 ? (
                          <div className="border-2 border-dashed border-[#ebdcd0] rounded-2xl p-6 text-center bg-white/50 space-y-2">
                            <p className="text-[13px] text-gray-500 font-medium">No dishes in this category yet.</p>
                            <button
                              type="button"
                              onClick={() => handleOpenAddDishToCategory(cat._id)}
                              className="text-[#d85c27] text-[12.5px] font-bold hover:underline inline-flex items-center gap-1"
                            >
                              <PlusCircle className="w-4 h-4" /> Add a dish here
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                            {cat.items.map((item) => (
                              <div
                                key={item._id || item.id}
                                className="bg-white rounded-xl p-3 border border-[#ebdcd0] shadow-xs flex items-center justify-between gap-3"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#fae8d8] shrink-0 border border-[#ebdcd0]">
                                    {item.img ? (
                                      <img src={item.img} alt={item.titleEn} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400 font-bold">
                                        No Img
                                      </div>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <h5 className="font-bold text-[13.5px] text-[#1e382f] truncate">
                                      {item.titleEn}
                                    </h5>
                                    <span className="text-[#d85c27] font-black text-[12px]">
                                      {item.price}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditItem(item, cat._id)}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                    title="Edit"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteItem(item._id || item.id || '', cat._id)}
                                    className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
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
            TAB 3: HOMEPAGE CONTENT
        ═══════════════════════════════════════════════ */}
        {activeTab === 'homepage' && (
          <form onSubmit={handleSaveHomepage} className="space-y-6">
            
            {/* Language Banner */}
            <div className="bg-[#fffdfa] rounded-[24px] p-5 sm:p-6 border border-[#ebdcd0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-[20px] font-black text-[#1e382f]">Homepage Content Sections</h2>
                <p className="text-[13px] text-[#666] mt-0.5">
                  Update headlines, descriptions, step cards, and photos across your landing page.
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-[#fcf8f3] p-1.5 rounded-xl border border-[#ebdcd0]">
                <span className="text-[11px] font-bold text-gray-500 uppercase px-2">Language:</span>
                <button
                  type="button"
                  onClick={() => setAdminContentLang('en')}
                  className={`px-3 py-1 text-[12px] font-extrabold rounded-lg transition-all ${
                    adminContentLang === 'en' ? 'bg-[#1e382f] text-white shadow-xs' : 'text-[#1e382f] hover:bg-gray-200/60'
                  }`}
                >
                  English (EN)
                </button>
                <button
                  type="button"
                  onClick={() => setAdminContentLang('de')}
                  className={`px-3 py-1 text-[12px] font-extrabold rounded-lg transition-all ${
                    adminContentLang === 'de' ? 'bg-[#1e382f] text-white shadow-xs' : 'text-[#1e382f] hover:bg-gray-200/60'
                  }`}
                >
                  Deutsch (DE)
                </button>
              </div>
            </div>

            {/* ── 1. Hero Section ── */}
            <div className="bg-[#fffdfa] rounded-[22px] border border-[#ebdcd0] shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('hero')}
                className="w-full p-5 flex items-center justify-between text-left bg-white/70 border-b border-[#ebdcd0]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#d85c27] text-white font-black text-[12px] flex items-center justify-center">1</span>
                  <div>
                    <h3 className="text-[16px] font-black text-[#1e382f]">Hero Banner Section</h3>
                    <p className="text-[12px] text-gray-500">Main headline, intro tagline, action buttons & food image</p>
                  </div>
                </div>
                {openSections.hero ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>

              {openSections.hero && (
                <div className="p-5 sm:p-6 space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-[#333] mb-1">Headline Line 1</label>
                      <input
                        type="text"
                        value={adminContentLang === 'en' ? (homepageContent.heroTitle1En || '') : (homepageContent.heroTitle1De || '')}
                        onChange={(e) => setHomepageContent(adminContentLang === 'en' ? { ...homepageContent, heroTitle1En: e.target.value } : { ...homepageContent, heroTitle1De: e.target.value })}
                        className="w-full border rounded-xl px-3.5 py-2 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-[#333] mb-1">Headline Line 2 (Highlighted)</label>
                      <input
                        type="text"
                        value={adminContentLang === 'en' ? (homepageContent.heroTitle2En || '') : (homepageContent.heroTitle2De || '')}
                        onChange={(e) => setHomepageContent(adminContentLang === 'en' ? { ...homepageContent, heroTitle2En: e.target.value } : { ...homepageContent, heroTitle2De: e.target.value })}
                        className="w-full border rounded-xl px-3.5 py-2 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">Description Tagline</label>
                    <textarea
                      rows={2}
                      value={adminContentLang === 'en' ? (homepageContent.heroDescEn || '') : (homepageContent.heroDescDe || '')}
                      onChange={(e) => setHomepageContent(adminContentLang === 'en' ? { ...homepageContent, heroDescEn: e.target.value } : { ...homepageContent, heroDescDe: e.target.value })}
                      className="w-full border rounded-xl px-3.5 py-2 text-[13.5px] focus:outline-none focus:border-[#d85c27] resize-none"
                    />
                  </div>

                  {/* Hero Photo Picker */}
                  <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[12.5px] font-black text-[#1e382f] flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#d85c27]" />
                        Hero Food Photo
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveGallerySection(activeGallerySection === 'hero' ? null : 'hero')}
                        className="text-[11.5px] font-bold text-[#d85c27] hover:underline bg-white px-2.5 py-1 rounded-lg border border-[#ebdcd0]"
                      >
                        {activeGallerySection === 'hero' ? 'Hide' : 'Browse Photos'}
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-[#ebdcd0]">
                        {homepageContent.heroImage ? (
                          <img src={homepageContent.heroImage} alt="Hero" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400 font-bold">No Img</div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOptimizedImageUpload((url) => setHomepageContent({ ...homepageContent, heroImage: url }))}
                        className="bg-[#1e382f] text-white text-[12px] font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#d85c27]" /> Upload Photo
                      </button>
                    </div>

                    {activeGallerySection === 'hero' && (
                      <div className="pt-2">
                        {renderGalleryPicker(
                          homepageContent.heroImage || '',
                          (url) => setHomepageContent({ ...homepageContent, heroImage: url }),
                          () => setActiveGallerySection(null)
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── 2. The MAATI Way Steps ── */}
            <div className="bg-[#fffdfa] rounded-[22px] border border-[#ebdcd0] shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('maatiWay')}
                className="w-full p-5 flex items-center justify-between text-left bg-white/70 border-b border-[#ebdcd0]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#d85c27] text-white font-black text-[12px] flex items-center justify-center">2</span>
                  <div>
                    <h3 className="text-[16px] font-black text-[#1e382f]">The MAATI Way (Build Your Bowl Steps)</h3>
                    <p className="text-[12px] text-gray-500">Step cards showing Base, Proteins & Curries, Chutneys</p>
                  </div>
                </div>
                {openSections.maatiWay ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>

              {openSections.maatiWay && (
                <div className="p-5 sm:p-6 space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-[#333] mb-1">Section Title</label>
                      <input
                        type="text"
                        value={adminContentLang === 'en' ? (homepageContent.maatiWayTitleEn || '') : (homepageContent.maatiWayTitleDe || '')}
                        onChange={(e) => setHomepageContent(adminContentLang === 'en' ? { ...homepageContent, maatiWayTitleEn: e.target.value } : { ...homepageContent, maatiWayTitleDe: e.target.value })}
                        className="w-full border rounded-xl px-3.5 py-2 text-[13.5px]"
                      />
                    </div>
                  </div>

                  {/* Step Cards List */}
                  <div className="space-y-3 pt-2">
                    {(homepageContent.maatiWaySteps || []).map((st, idx) => {
                      const isStepOpen = openSteps[st.id || idx] !== false;
                      const titleVal = adminContentLang === 'en' ? st.title : (st.titleDe || st.title);
                      const itemsVal = (adminContentLang === 'en' ? st.items : (st.itemsDe || st.items)) || [];

                      return (
                        <div key={st.id || idx} className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-2xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => toggleStep(st.id || idx)}
                              className="flex items-center gap-2 font-bold text-[14px] text-[#1e382f]"
                            >
                              <span className="w-6 h-6 rounded-full bg-[#1e382f] text-white text-[11px] flex items-center justify-center font-black">
                                {idx + 1}
                              </span>
                              <span>{titleVal || `Step ${idx + 1}`}</span>
                              {isStepOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteStepCard(st.id || idx)}
                              className="text-rose-600 hover:text-rose-800 text-[11.5px] font-bold"
                            >
                              Delete Step
                            </button>
                          </div>

                          {isStepOpen && (
                            <div className="space-y-3 pt-2">
                              <div>
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Step Card Title</label>
                                <input
                                  type="text"
                                  value={titleVal}
                                  onChange={(e) => {
                                    const nextSteps = [...(homepageContent.maatiWaySteps || [])];
                                    if (adminContentLang === 'en') {
                                      nextSteps[idx] = { ...nextSteps[idx], title: e.target.value };
                                    } else {
                                      nextSteps[idx] = { ...nextSteps[idx], titleDe: e.target.value };
                                    }
                                    setHomepageContent({ ...homepageContent, maatiWaySteps: nextSteps });
                                  }}
                                  className="w-full bg-white border rounded-xl px-3 py-1.5 text-[13px]"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                  Bullet Options (comma separated)
                                </label>
                                <input
                                  type="text"
                                  value={itemsVal.join(', ')}
                                  onChange={(e) => {
                                    const nextItems = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                    const nextSteps = [...(homepageContent.maatiWaySteps || [])];
                                    if (adminContentLang === 'en') {
                                      nextSteps[idx] = { ...nextSteps[idx], items: nextItems };
                                    } else {
                                      nextSteps[idx] = { ...nextSteps[idx], itemsDe: nextItems };
                                    }
                                    setHomepageContent({ ...homepageContent, maatiWaySteps: nextSteps });
                                  }}
                                  className="w-full bg-white border rounded-xl px-3 py-1.5 text-[13px]"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={handleAddStepCard}
                      className="w-full py-2.5 bg-white border-2 border-dashed border-[#ebdcd0] hover:border-[#d85c27] text-[#1e382f] font-bold text-[13px] rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-[#d85c27]" />
                      <span>Add Another Step Card</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── 3. Dining Experience ── */}
            <div className="bg-[#fffdfa] rounded-[22px] border border-[#ebdcd0] shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('experience')}
                className="w-full p-5 flex items-center justify-between text-left bg-white/70 border-b border-[#ebdcd0]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#d85c27] text-white font-black text-[12px] flex items-center justify-center">3</span>
                  <div>
                    <h3 className="text-[16px] font-black text-[#1e382f]">Dining Experience & Ambience</h3>
                    <p className="text-[12px] text-gray-500">Atmosphere story and 2 restaurant interior photos</p>
                  </div>
                </div>
                {openSections.experience ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>

              {openSections.experience && (
                <div className="p-5 sm:p-6 space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">Headline</label>
                    <input
                      type="text"
                      value={adminContentLang === 'en' ? (homepageContent.experienceTitleEn || '') : (homepageContent.experienceTitleDe || '')}
                      onChange={(e) => setHomepageContent(adminContentLang === 'en' ? { ...homepageContent, experienceTitleEn: e.target.value } : { ...homepageContent, experienceTitleDe: e.target.value })}
                      className="w-full border rounded-xl px-3.5 py-2 text-[13.5px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={adminContentLang === 'en' ? (homepageContent.experienceDescEn || '') : (homepageContent.experienceDescDe || '')}
                      onChange={(e) => setHomepageContent(adminContentLang === 'en' ? { ...homepageContent, experienceDescEn: e.target.value } : { ...homepageContent, experienceDescDe: e.target.value })}
                      className="w-full border rounded-xl px-3.5 py-2 text-[13.5px] resize-none"
                    />
                  </div>

                  {/* 2 Photos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[12px] font-black text-[#1e382f]">Photo 1 (Left)</label>
                        <button
                          type="button"
                          onClick={() => setActiveGallerySection(activeGallerySection === 'exp1' ? null : 'exp1')}
                          className="text-[11px] font-bold text-[#d85c27] bg-white px-2 py-0.5 rounded border border-[#ebdcd0]"
                        >
                          {activeGallerySection === 'exp1' ? 'Hide' : 'Browse'}
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-white shrink-0 border border-[#ebdcd0]">
                          <img src={homepageContent.experienceImg1 || "/assets/show5-BiQql1jr.jpeg"} alt="Left" className="w-full h-full object-cover" />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOptimizedImageUpload((url) => setHomepageContent({ ...homepageContent, experienceImg1: url }))}
                          className="bg-[#1e382f] text-white text-[11.5px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3 text-[#d85c27]" /> Upload
                        </button>
                      </div>
                      {activeGallerySection === 'exp1' && (
                        <div className="pt-2">
                          {renderGalleryPicker(homepageContent.experienceImg1 || '', (url) => setHomepageContent({ ...homepageContent, experienceImg1: url }), () => setActiveGallerySection(null))}
                        </div>
                      )}
                    </div>

                    <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[12px] font-black text-[#1e382f]">Photo 2 (Right)</label>
                        <button
                          type="button"
                          onClick={() => setActiveGallerySection(activeGallerySection === 'exp2' ? null : 'exp2')}
                          className="text-[11px] font-bold text-[#d85c27] bg-white px-2 py-0.5 rounded border border-[#ebdcd0]"
                        >
                          {activeGallerySection === 'exp2' ? 'Hide' : 'Browse'}
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-white shrink-0 border border-[#ebdcd0]">
                          <img src={homepageContent.experienceImg2 || "/assets/show2-CM6MShfY.jpeg"} alt="Right" className="w-full h-full object-cover" />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOptimizedImageUpload((url) => setHomepageContent({ ...homepageContent, experienceImg2: url }))}
                          className="bg-[#1e382f] text-white text-[11.5px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3 text-[#d85c27]" /> Upload
                        </button>
                      </div>
                      {activeGallerySection === 'exp2' && (
                        <div className="pt-2">
                          {renderGalleryPicker(homepageContent.experienceImg2 || '', (url) => setHomepageContent({ ...homepageContent, experienceImg2: url }), () => setActiveGallerySection(null))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── 4. Catering Section ── */}
            <div className="bg-[#fffdfa] rounded-[22px] border border-[#ebdcd0] shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('catering')}
                className="w-full p-5 flex items-center justify-between text-left bg-white/70 border-b border-[#ebdcd0]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#d85c27] text-white font-black text-[12px] flex items-center justify-center">4</span>
                  <div>
                    <h3 className="text-[16px] font-black text-[#1e382f]">MAATI Catering Section</h3>
                    <p className="text-[12px] text-gray-500">Corporate catering information, 4 key highlights & photo</p>
                  </div>
                </div>
                {openSections.catering ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>

              {openSections.catering && (
                <div className="p-5 sm:p-6 space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">Headline</label>
                    <input
                      type="text"
                      value={adminContentLang === 'en' ? (homepageContent.cateringTitleEn || '') : (homepageContent.cateringTitleDe || '')}
                      onChange={(e) => setHomepageContent(adminContentLang === 'en' ? { ...homepageContent, cateringTitleEn: e.target.value } : { ...homepageContent, cateringTitleDe: e.target.value })}
                      className="w-full border rounded-xl px-3.5 py-2 text-[13.5px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={adminContentLang === 'en' ? (homepageContent.cateringDescEn || '') : (homepageContent.cateringDescDe || '')}
                      onChange={(e) => setHomepageContent(adminContentLang === 'en' ? { ...homepageContent, cateringDescEn: e.target.value } : { ...homepageContent, cateringDescDe: e.target.value })}
                      className="w-full border rounded-xl px-3.5 py-2 text-[13.5px] resize-none"
                    />
                  </div>

                  {/* Catering Photo */}
                  <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[12px] font-black text-[#1e382f]">Catering Spread Photo</label>
                      <button
                        type="button"
                        onClick={() => setActiveGallerySection(activeGallerySection === 'catering' ? null : 'catering')}
                        className="text-[11px] font-bold text-[#d85c27] bg-white px-2 py-0.5 rounded border border-[#ebdcd0]"
                      >
                        {activeGallerySection === 'catering' ? 'Hide' : 'Browse Photos'}
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-[#ebdcd0]">
                        <img src={homepageContent.cateringImage || "/assets/show3-D0blnzja.jpeg"} alt="Catering" className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOptimizedImageUpload((url) => setHomepageContent({ ...homepageContent, cateringImage: url }))}
                        className="bg-[#1e382f] text-white text-[12px] font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#d85c27]" /> Upload Photo
                      </button>
                    </div>
                    {activeGallerySection === 'catering' && (
                      <div className="pt-2">
                        {renderGalleryPicker(homepageContent.cateringImage || '', (url) => setHomepageContent({ ...homepageContent, cateringImage: url }), () => setActiveGallerySection(null))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Floating Save Button */}
            {hasUnsavedChanges && (
              <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 animate-bounce">
                <div className="bg-[#1e382f] text-white rounded-full shadow-2xl px-6 py-3.5 flex items-center gap-4 border border-white/20">
                  <span className="text-[13.5px] font-bold">You have unsaved changes</span>
                  <button
                    type="submit"
                    className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-black px-5 py-2 rounded-full text-[13px] shadow-sm transition-all"
                  >
                    Save All Changes
                  </button>
                </div>
              </div>
            )}

          </form>
        )}

        {/* ═══════════════════════════════════════════════
            TAB 4: PHOTO LIBRARY
        ═══════════════════════════════════════════════ */}
        {activeTab === 'gallery' && (
          <div className="bg-[#fffdfa] rounded-[24px] p-5 sm:p-7 border border-[#ebdcd0] shadow-sm space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#ebdcd0]">
              <div>
                <h2 className="text-[20px] font-black text-[#1e382f] flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#d85c27]" />
                  <span>Restaurant Photo Library</span>
                </h2>
                <p className="text-[13px] text-[#666] mt-0.5">
                  All photos used across dishes, banners, and catering are stored here. Photos are auto-compressed for fast performance.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOptimizedImageUpload(() => {})}
                  className="bg-[#1e382f] hover:bg-[#142620] text-white text-[13px] font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all"
                >
                  <Upload className="w-4 h-4 text-[#d85c27]" />
                  <span>+ Add Photo</span>
                </button>
              </div>
            </div>

            {/* Filter Bar & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-[420px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={gallerySearch}
                  onChange={(e) => setGallerySearch(e.target.value)}
                  placeholder="Search photos by name (e.g. Bowl, Naan, Mango, Chai)..."
                  className="w-full pl-10 pr-3 py-2 bg-white border border-[#ebdcd0] rounded-xl text-[13px] focus:outline-none focus:border-[#d85c27]"
                />
                {gallerySearch && (
                  <button
                    type="button"
                    onClick={() => setGallerySearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11.5px]">
                {['All', ...AVAILABLE_TAGS].map((cat) => {
                  const count = cat === 'All'
                    ? galleryAssets.length
                    : galleryAssets.filter((a) => a.category === cat).length;
                  if (count === 0 && cat !== 'All') return null;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setGalleryFilterCat(cat)}
                      className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                        galleryFilterCat === cat
                          ? 'bg-[#d85c27] text-white shadow-sm'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gallery Grid */}
            {(() => {
              const q = gallerySearch.toLowerCase().trim();
              const filtered = galleryAssets.filter((asset) => {
                const matchesCat = galleryFilterCat === 'All' || asset.category === galleryFilterCat;
                if (!matchesCat) return false;
                if (!q) return true;
                return (
                  asset.name.toLowerCase().includes(q) ||
                  asset.category.toLowerCase().includes(q) ||
                  asset.path.toLowerCase().includes(q)
                );
              });

              if (filtered.length === 0) {
                return (
                  <div className="border-2 border-dashed border-[#ebdcd0] rounded-2xl p-12 text-center bg-white/50 space-y-3">
                    <p className="text-[14px] text-gray-500 font-bold">No photos found matching "{gallerySearch}"</p>
                    <button
                      type="button"
                      onClick={() => { setGallerySearch(''); setGalleryFilterCat('All'); }}
                      className="text-[#d85c27] text-[13px] font-bold hover:underline"
                    >
                      Clear search
                    </button>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4">
                  {filtered.map((asset) => (
                    <div
                      key={asset.id || asset.path}
                      className="group bg-white rounded-2xl border border-[#ebdcd0] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                        <img
                          src={asset.path}
                          alt={asset.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Action buttons on card */}
                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => handleOpenEditPhoto(asset, e)}
                            title={`Edit name or tag for "${asset.name}"`}
                            className="w-7 h-7 rounded-full bg-black/65 hover:bg-blue-600 text-white flex items-center justify-center shadow transition-all transform hover:scale-110"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteGalleryImage(e, asset.id, asset.name)}
                            title={`Delete "${asset.name}"`}
                            className="w-7 h-7 rounded-full bg-black/65 hover:bg-rose-600 text-white flex items-center justify-center shadow transition-all transform hover:scale-110"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                          {asset.category}
                        </span>
                      </div>

                      <div className="p-3 flex items-center justify-between gap-2 border-t border-gray-100">
                        <h4 className="font-extrabold text-[13px] text-[#1e382f] truncate leading-tight" title={asset.name}>
                          {asset.name}
                        </h4>
                        <button
                          type="button"
                          onClick={(e) => handleOpenEditPhoto(asset, e)}
                          title="Edit photo name and category tag"
                          className="text-gray-400 hover:text-blue-600 p-1 hover:bg-blue-50 rounded-lg transition-colors shrink-0"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            TAB 5: RESTAURANT INFO
        ═══════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-[#fffdfa] rounded-[24px] p-6 sm:p-8 border border-[#ebdcd0] shadow-sm space-y-6">
            <div>
              <h2 className="text-[20px] font-black text-[#1e382f]">Restaurant Information</h2>
              <p className="text-[13px] text-[#666] mt-0.5">
                Contact information and address displayed on the website.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Restaurant Name</label>
                <input
                  type="text"
                  value={siteSettings.restaurantName || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, restaurantName: e.target.value })}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={siteSettings.phone || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Email Address</label>
                <input
                  type="email"
                  value={siteSettings.email || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Street Address</label>
                <input
                  type="text"
                  value={siteSettings.address || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-6 py-3 rounded-full text-[14px] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Information
              </button>
            </div>
          </form>
        )}

        {/* ═══════════════════════════════════════════════
            MODAL: ADD / EDIT DISH
        ═══════════════════════════════════════════════ */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-[28px] w-full max-w-[720px] max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-5">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#d85c27]/10 text-[#d85c27] flex items-center justify-center">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[19px] font-black text-[#1e382f]">
                      {editingItem ? 'Edit Dish' : 'Add New Dish'}
                    </h3>
                    <p className="text-[12px] text-gray-500">Fill in dish details and photo</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-5">
                
                {/* Language Switcher */}
                <div className="flex items-center justify-between bg-[#fcf8f3] p-2.5 rounded-xl border border-[#ebdcd0]">
                  <span className="text-[11.5px] font-extrabold text-[#1e382f] uppercase tracking-wider">
                    Editing: {adminContentLang === 'en' ? 'English Content' : 'German Content'}
                  </span>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#ebdcd0]">
                    <button
                      type="button"
                      onClick={() => setAdminContentLang('en')}
                      className={`px-3 py-1 text-[11.5px] font-extrabold rounded-md transition-all ${
                        adminContentLang === 'en' ? 'bg-[#1e382f] text-white shadow-xs' : 'text-[#1e382f] hover:bg-gray-100'
                      }`}
                    >
                      English (EN)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminContentLang('de')}
                      className={`px-3 py-1 text-[11.5px] font-extrabold rounded-md transition-all ${
                        adminContentLang === 'de' ? 'bg-[#1e382f] text-white shadow-xs' : 'text-[#1e382f] hover:bg-gray-100'
                      }`}
                    >
                      Deutsch (DE)
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
                    onChange={(e) => adminContentLang === 'en' ? setFormTitleEn(e.target.value) : setFormTitleDe(e.target.value)}
                    required={adminContentLang === 'en'}
                    placeholder={adminContentLang === 'en' ? 'e.g. Chettinad Spicy Chicken Bowl' : 'e.g. Chettinad "Spicy Chicken" Schale'}
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>

                {/* 2. Category & Food Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">Category *</label>
                    <select
                      value={formCatId}
                      onChange={(e) => setFormCatId(e.target.value)}
                      className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27] bg-white font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">Dietary Tag *</label>
                    <select
                      value={formFoodType}
                      onChange={(e) => setFormFoodType(e.target.value as FoodType)}
                      className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27] bg-white font-medium"
                    >
                      <option value="vegetarian">Vegetarian (VEG)</option>
                      <option value="nonVegetarian">Non-Vegetarian (NON-VEG)</option>
                      <option value="vegan">Vegan (VEGAN)</option>
                    </select>
                  </div>
                </div>

                {/* 3. Pricing */}
                <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[12px] font-black text-[#1e382f] uppercase tracking-wider">
                      Pricing Option
                    </label>
                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#ebdcd0]">
                      <button
                        type="button"
                        onClick={() => setPriceType('single')}
                        className={`px-3 py-1 text-[11.5px] font-bold rounded-md transition-all ${
                          priceType === 'single' ? 'bg-[#1e382f] text-white shadow-xs' : 'text-[#1e382f]'
                        }`}
                      >
                        Single Price
                      </button>
                      <button
                        type="button"
                        onClick={() => setPriceType('double')}
                        className={`px-3 py-1 text-[11.5px] font-bold rounded-md transition-all ${
                          priceType === 'double' ? 'bg-[#1e382f] text-white shadow-xs' : 'text-[#1e382f]'
                        }`}
                      >
                        Two Options (e.g. Chicken / Prawns)
                      </button>
                    </div>
                  </div>

                  {priceType === 'single' ? (
                    <div>
                      <input
                        type="text"
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        placeholder="e.g. €11,5"
                        required
                        className="w-full bg-white border rounded-xl px-3.5 py-2 text-[14px] font-bold text-[#d85c27] focus:outline-none focus:border-[#d85c27]"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3 pt-1">
                      <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-[#ebdcd0]">
                        <div>
                          <label className="block text-[10.5px] font-bold text-gray-500 mb-1">Option 1 (EN)</label>
                          <input
                            type="text"
                            value={opt1LabelEn}
                            onChange={(e) => setOpt1LabelEn(e.target.value)}
                            placeholder="Chicken"
                            className="w-full border rounded-lg px-2.5 py-1.5 text-[12.5px] font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10.5px] font-bold text-gray-500 mb-1">Option 1 (DE)</label>
                          <input
                            type="text"
                            value={opt1LabelDe}
                            onChange={(e) => setOpt1LabelDe(e.target.value)}
                            placeholder="Hähnchen"
                            className="w-full border rounded-lg px-2.5 py-1.5 text-[12.5px] font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10.5px] font-bold text-gray-500 mb-1">Price 1</label>
                          <input
                            type="text"
                            value={opt1Price}
                            onChange={(e) => setOpt1Price(e.target.value)}
                            placeholder="€12,5"
                            className="w-full border rounded-lg px-2.5 py-1.5 text-[12.5px] font-bold text-[#d85c27]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-[#ebdcd0]">
                        <div>
                          <label className="block text-[10.5px] font-bold text-gray-500 mb-1">Option 2 (EN)</label>
                          <input
                            type="text"
                            value={opt2LabelEn}
                            onChange={(e) => setOpt2LabelEn(e.target.value)}
                            placeholder="Prawns"
                            className="w-full border rounded-lg px-2.5 py-1.5 text-[12.5px] font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10.5px] font-bold text-gray-500 mb-1">Option 2 (DE)</label>
                          <input
                            type="text"
                            value={opt2LabelDe}
                            onChange={(e) => setOpt2LabelDe(e.target.value)}
                            placeholder="Garnelen"
                            className="w-full border rounded-lg px-2.5 py-1.5 text-[12.5px] font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10.5px] font-bold text-gray-500 mb-1">Price 2</label>
                          <input
                            type="text"
                            value={opt2Price}
                            onChange={(e) => setOpt2Price(e.target.value)}
                            placeholder="€14,5"
                            className="w-full border rounded-lg px-2.5 py-1.5 text-[12.5px] font-bold text-[#d85c27]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Dish Photo Block */}
                <div className="bg-[#fffdfa] border border-[#ebdcd0] rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-[12.5px] font-black text-[#1e382f] flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#d85c27]" />
                        Dish Photo
                      </label>
                      <p className="text-[11px] text-[#666]">Choose an existing photo or upload a new one.</p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setShowGallery(!showGallery)}
                      className="text-[11.5px] font-bold text-[#d85c27] hover:underline bg-[#fae8d8] px-3 py-1.5 rounded-xl border border-[#ebdcd0]"
                    >
                      {showGallery ? 'Hide Photos' : 'Browse Photos'}
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-18 h-18 rounded-2xl overflow-hidden bg-[#fae8d8] shrink-0 border border-[#ebdcd0]">
                      {formImg ? (
                        <img src={formImg} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-bold p-2 text-center">
                          No Photo
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOptimizedImageUpload((url) => setFormImg(url))}
                          className="bg-[#1e382f] hover:bg-[#152721] text-white text-[12.5px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#d85c27]" />
                          <span>+ Upload Photo</span>
                        </button>
                        {formImg && (
                          <button
                            type="button"
                            onClick={() => setFormImg('')}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11.5px] font-bold px-3 py-2 rounded-xl transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {showGallery && (
                    <div className="mt-3 pt-3 border-t border-[#ebdcd0]">
                      {renderGalleryPicker(formImg, (url) => setFormImg(url), () => setShowGallery(false))}
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
                    onChange={(e) => adminContentLang === 'en' ? setFormDescEn(e.target.value) : setFormDescDe(e.target.value)}
                    placeholder={adminContentLang === 'en' ? 'Fresh ingredients description...' : 'Deutsche Beschreibung...'}
                    className="w-full border rounded-xl px-3.5 py-2 text-[13.5px] focus:outline-none focus:border-[#d85c27] resize-none"
                  />
                </div>

                {/* 6. Switches */}
                <div className="flex flex-wrap items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-[13px] font-bold text-[#333]">
                    <input
                      type="checkbox"
                      checked={formAvailable}
                      onChange={(e) => setFormAvailable(e.target.checked)}
                      className="w-4 h-4 rounded text-[#d85c27]"
                    />
                    <span>Available for Ordering</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-[13px] font-bold text-[#333]">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-[#d85c27]"
                    />
                    <span>Feature on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-[13px] font-bold text-[#333]">
                    <input
                      type="checkbox"
                      checked={formSpicy}
                      onChange={(e) => setFormSpicy(e.target.checked)}
                      className="w-4 h-4 rounded text-[#d85c27]"
                    />
                    <span>Spicy Dish</span>
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-bold text-[13.5px] text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-6 py-2.5 rounded-xl text-[13.5px] shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingItem ? 'Save Changes' : 'Add Dish'}</span>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-[28px] w-full max-w-[500px] shadow-2xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-[18px] font-black text-[#1e382f]">
                  {editingCategory ? 'Edit Category' : 'New Menu Category'}
                </h3>
                <button
                  onClick={() => setIsCatModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Category Name (English) *</label>
                  <input
                    type="text"
                    value={catNameEn}
                    onChange={(e) => setCatNameEn(e.target.value)}
                    required
                    placeholder="e.g. Signature Bowls"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Category Name (German)</label>
                  <input
                    type="text"
                    value={catNameDe}
                    onChange={(e) => setCatNameDe(e.target.value)}
                    placeholder="e.g. Spezial-Schalen"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Description (English)</label>
                  <textarea
                    rows={2}
                    value={catDescEn}
                    onChange={(e) => setCatDescEn(e.target.value)}
                    placeholder="Brief description..."
                    className="w-full border rounded-xl px-3.5 py-2 text-[13px] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Description (German)</label>
                  <textarea
                    rows={2}
                    value={catDescDe}
                    onChange={(e) => setCatDescDe(e.target.value)}
                    placeholder="Deutsche Beschreibung..."
                    className="w-full border rounded-xl px-3.5 py-2 text-[13px] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsCatModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-[13px] font-bold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#d85c27] text-white font-extrabold px-5 py-2 rounded-xl text-[13px] hover:bg-[#c24f1c]"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            MODAL: ADD DISH TO CATEGORY
        ═══════════════════════════════════════════════ */}
        {isAddDishModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-[28px] w-full max-w-[620px] max-h-[85vh] overflow-y-auto shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-[18px] font-black text-[#1e382f]">Add Dish to Category</h3>
                  <p className="text-[12px] text-gray-500">
                    Category: <strong>{categories.find(c => c._id === targetCategoryForAdd)?.name}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setIsAddDishModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-[12.5px] text-gray-600 font-medium">
                  Create a fresh dish or move an existing dish into this category:
                </p>
                <button
                  onClick={() => {
                    setIsAddDishModalOpen(false);
                    handleOpenNewItem(targetCategoryForAdd);
                  }}
                  className="bg-[#d85c27] text-white font-bold px-3.5 py-1.5 rounded-xl text-[12px] hover:bg-[#c24f1c] shrink-0"
                >
                  + Create New Dish
                </button>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {allItemsWithCat
                  .filter(it => it.catId !== targetCategoryForAdd)
                  .map((item) => (
                    <div
                      key={item._id || item.id}
                      className="bg-gray-50 hover:bg-[#fae8d8] rounded-xl p-3 border border-gray-200 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0 border border-gray-200">
                          {item.img ? (
                            <img src={item.img} alt={item.titleEn} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-gray-400">
                              No Img
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-bold text-[13px] text-[#1e382f] truncate">{item.titleEn}</h5>
                          <span className="text-[11px] text-gray-500 truncate block">Currently in: {item.catName}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          handleAddExistingDishToCategory(item, targetCategoryForAdd);
                          setIsAddDishModalOpen(false);
                        }}
                        className="bg-[#1e382f] text-white font-bold px-3 py-1.5 rounded-lg text-[11.5px] hover:bg-[#142620] shrink-0"
                      >
                        Move Here
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            MODAL: PHOTO DETAILS & TAGGING
        ═══════════════════════════════════════════════ */}
        {isPhotoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-[28px] w-full max-w-[520px] shadow-2xl p-6 sm:p-7 space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#d85c27]/10 text-[#d85c27] flex items-center justify-center">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-black text-[#1e382f]">
                      {photoModalData.isNew ? 'Name & Tag Photo' : 'Edit Photo Tag & Name'}
                    </h3>
                    <p className="text-[11.5px] text-gray-500">
                      Organize where this photo appears in your library
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSavePhotoModal} className="space-y-4">
                
                {/* Photo Preview & Size Banner */}
                <div className="flex items-center gap-3.5 bg-[#fcf8f3] p-3 rounded-2xl border border-[#ebdcd0]">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-[#ebdcd0]">
                    <img
                      src={photoModalData.path}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md inline-block mb-1">
                      ⚡ Ready & Optimized
                    </span>
                    {photoModalData.originalSize && photoModalData.compressedSize ? (
                      <p className="text-[11.5px] text-gray-600">
                        {Math.round(photoModalData.originalSize / 1024)} KB → {Math.round(photoModalData.compressedSize / 1024)} KB (WebP)
                      </p>
                    ) : (
                      <p className="text-[11.5px] text-gray-600">High-res WebP image</p>
                    )}
                  </div>
                </div>

                {/* Photo Title */}
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">
                    Photo Name *
                  </label>
                  <input
                    type="text"
                    value={photoModalData.name}
                    onChange={(e) => setPhotoModalData({ ...photoModalData, name: e.target.value })}
                    required
                    placeholder="e.g. Chettinad Spicy Chicken Bowl"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium focus:outline-none focus:border-[#d85c27]"
                  />
                </div>

                {/* Category Tag Selector */}
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1.5">
                    Category Tag *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {AVAILABLE_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setPhotoModalData({ ...photoModalData, category: tag })}
                        className={`px-3 py-2 rounded-xl text-[12px] font-bold border transition-all text-left truncate ${
                          photoModalData.category === tag
                            ? 'bg-[#1e382f] text-white border-[#1e382f] shadow-xs'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsPhotoModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-[13px] font-bold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#d85c27] text-white font-extrabold px-5 py-2 rounded-xl text-[13px] hover:bg-[#c24f1c] shadow-sm flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Photo</span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            SPOTLIGHT INTERACTIVE TOUR OVERLAY & CARD
        ═══════════════════════════════════════════════ */}
        {isTourActive && (
          <div className="fixed inset-0 z-50 pointer-events-none animate-fadeIn">
            
            {/* SVG Dark Backdrop with Cutout Spotlight Mask */}
            <svg className="absolute inset-0 w-full h-full pointer-events-auto">
              <defs>
                <mask id="tour-mask">
                  <rect x="0" y="0" width="100%" height="100%" fill="white" />
                  {spotlightRect && (
                    <rect
                      x={spotlightRect.left - window.scrollX - 8}
                      y={spotlightRect.top - window.scrollY - 8}
                      width={spotlightRect.width + 16}
                      height={spotlightRect.height + 16}
                      rx="18"
                      fill="black"
                    />
                  )}
                </mask>
              </defs>
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="rgba(0, 0, 0, 0.65)"
                mask="url(#tour-mask)"
                onClick={stopSpotlightTour}
              />
            </svg>

            {/* Glowing Pulse Ring around Spotlighted Item */}
            {spotlightRect && (
              <div
                className="absolute pointer-events-none rounded-2xl ring-4 ring-[#d85c27] ring-offset-2 ring-offset-transparent animate-pulse"
                style={{
                  top: `${spotlightRect.top - 8}px`,
                  left: `${spotlightRect.left - 8}px`,
                  width: `${spotlightRect.width + 16}px`,
                  height: `${spotlightRect.height + 16}px`,
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            )}

            {/* Floating Popover Tooltip Card: Always Elevated Above or Higher & Fully Mobile Responsive */}
            {(() => {
              const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
              const cardWidth = Math.min(350, windowWidth - 32);
              const cardHeight = 210;

              let cardTop: number;
              let cardLeft: number;

              if (spotlightRect) {
                // Check space above
                const spaceAbove = spotlightRect.top - window.scrollY;
                if (spaceAbove > cardHeight + 25) {
                  // Position above the element
                  cardTop = spotlightRect.top - cardHeight - 16;
                } else {
                  // Position below, but kept high
                  cardTop = spotlightRect.top + spotlightRect.height + 12;
                }
                cardLeft = spotlightRect.left + (spotlightRect.width / 2) - (cardWidth / 2);
              } else {
                // Fallback: elevated center
                cardTop = window.scrollY + 95;
                cardLeft = (windowWidth / 2) - (cardWidth / 2);
              }

              // Keep within screen bounds
              if (cardTop < window.scrollY + 75) {
                cardTop = window.scrollY + 75;
              }

              if (cardLeft < 16) cardLeft = 16;
              if (cardLeft + cardWidth > windowWidth - 16) {
                cardLeft = windowWidth - cardWidth - 16;
              }

              return (
                <div
                  className="absolute pointer-events-auto bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border-2 border-[#ebdcd0] space-y-2.5 sm:space-y-3 z-50 animate-fadeInUp max-w-[calc(100vw-32px)]"
                  style={{
                    top: `${cardTop}px`,
                    left: `${cardLeft}px`,
                    width: `${cardWidth}px`,
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {/* Step Header */}
                  <div className="flex items-center justify-between text-[11.5px] font-black text-[#1e382f]">
                    <span className="flex items-center gap-1.5 text-[#d85c27]">
                      <Compass className="w-3.5 h-3.5" />
                      Step {currentTourIndex + 1} of {SPOTLIGHT_STEPS.length}
                    </span>
                    <button
                      type="button"
                      onClick={stopSpotlightTour}
                      className="text-gray-400 hover:text-gray-700 font-bold p-1"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 className="font-black text-[15.5px] text-[#1e382f] leading-snug">
                      {currentSpotlight.title}
                    </h4>
                    <p className="text-[12.5px] text-[#555] mt-1 leading-relaxed">
                      {currentSpotlight.description}
                    </p>
                  </div>

                  {/* Tip */}
                  {currentSpotlight.tip && (
                    <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-xl p-2.5 text-[11.5px] font-semibold text-[#1e382f] flex items-start gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{currentSpotlight.tip}</span>
                    </div>
                  )}

                  {/* Footer Buttons */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={stopSpotlightTour}
                      className="text-[12px] font-bold text-gray-500 hover:text-gray-800"
                    >
                      Skip
                    </button>

                    <div className="flex items-center gap-1.5">
                      {currentTourIndex > 0 && (
                        <button
                          type="button"
                          onClick={handlePrevTourStep}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 py-1.5 rounded-xl text-[12px] flex items-center gap-1 transition-colors"
                        >
                          <ArrowLeft className="w-3 h-3" /> Back
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleNextTourStep}
                        className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-4 py-1.5 rounded-xl text-[12px] shadow-xs flex items-center gap-1 transition-all"
                      >
                        <span>{currentTourIndex === SPOTLIGHT_STEPS.length - 1 ? 'Finish' : 'Next'}</span>
                        {currentTourIndex < SPOTLIGHT_STEPS.length - 1 && <ArrowRight className="w-3 h-3 text-white" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>
        )}

        {/* ── Toast Notification ── */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-fadeInUp">
            <div className="bg-[#1e382f] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-2.5 text-[13.5px] font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#d85c27]" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
