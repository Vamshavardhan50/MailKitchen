import { usePublishedEditor } from '../lib/usePublishedEditor';
import { recoverMissingCocktails } from '../lib/menuRecovery';
import React, { useState, useEffect, useRef } from 'react';
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
  FileText,
  Tag,
  CheckCircle2,
  AlertCircle,
  Compass,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Calendar,
  Phone,
  Inbox,
  Briefcase,
  User,
  Clock,
  MessageSquare,
  Mail,
  Layers,
  Award,
  ShieldCheck,
  HelpCircle,
  Eye,
  EyeOff,
  CheckCircle
} from 'lucide-react';
import {
  SanityMenuItem,
  SanityCategoryWithItems,
  FoodType,
  useSanityMenu,
  useHomepageContent,
  useSiteSettings,
  useEventsContent,
  useContactContent,
  usePrintMenuContent,
  useCateringContent,
  useJobsContent,
  useAboutContent,
  useLegalContent,
  useLandingPagesContent,
  useReservationContent,
  SiteSettings,
  HomepageContent,
  EventsContent,
  ContactContent,
  PrintMenuContent,
  CateringContent,
  CateringPackageItem,
  CateringFaqItem,
  JobsContent,
  JobOpeningItem,
  AboutContent,
  AboutValueItem,
  LegalContent,
  LegalSectionItem,
  DEFAULT_PRIVACY_SECTIONS,
  DEFAULT_TERMS_SECTIONS,
  LandingPagesContent,
  LandingCategoryConfig,
  LandingPageItem,
  DEFAULT_LANDING_PAGES,
  ReservationContent,
  DEFAULT_RESERVATION,
  MaatiWayStep,
  saveSettingsToSanity,
  saveHomepageToSanity,
  saveEventsToSanity,
  saveContactToSanity,
  savePrintMenuToSanity,
  saveMenuCategoriesToSanity,
  saveGalleryToSanity,
  saveCateringToSanity,
  saveJobsToSanity,
  saveAboutToSanity,
  saveLegalToSanity,
  saveLandingPagesToSanity,
  saveReservationToSanity,
  syncAllLocalToSanity
} from '../lib/sanityService';


import {
  GalleryAssetItem,
  DEFAULT_GALLERY_ASSETS,
  compressImageFile
} from '../data/galleryAssets';
import { apiUrl } from '../lib/api';
import { sanityClient, isSanityConfigured } from '../lib/sanity';

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

export type StudioTab =
  | 'overview'
  | 'homepage'
  | 'items'
  | 'categories'
  | 'landingPages'
  | 'catering'
  | 'events'
  | 'jobs'
  | 'about'
  | 'contact'
  | 'reservations'
  | 'printMenu'
  | 'legal'
  | 'privacy'
  | 'terms'
  | 'settings'
  | 'gallery'
  | 'inquiries'
  | 'applications';

export const TAB_TITLES: Record<StudioTab, { title: string; route?: string; icon?: string }> = {
  overview: { title: 'All Pages Directory' },
  homepage: { title: 'Homepage Content', route: '/' },
  items: { title: 'Menu Dishes & Pricing', route: '/menu' },
  categories: { title: 'Menu Categories', route: '/menu' },
  landingPages: { title: 'Category Showcase Landings', route: '/menu/naan-pockets' },
  catering: { title: 'Corporate & Event Catering', route: '/catering' },
  events: { title: 'Private Events & Venue Hire', route: '/events' },
  about: { title: 'Brand Story & About Us', route: '/about' },
  contact: { title: 'Location, Hours & Contact', route: '/contact' },
  reservations: { title: 'Table Reservations', route: '/contact' },
  jobs: { title: 'Careers & Job Openings', route: '/jobs' },
  printMenu: { title: 'Print Menu & Cards', route: '/print-menu' },
  legal: { title: 'Impressum (§ 5 TMG)', route: '/impressum' },
  privacy: { title: 'Privacy Policy (Datenschutz)', route: '/privacy' },
  terms: { title: 'Terms & Conditions (AGB)', route: '/terms' },
  gallery: { title: 'Photo Library & Media' },
  settings: { title: 'Global SEO & Schema Info' },
  inquiries: { title: 'Catering Inquiries Inbox' },
  applications: { title: 'Job Candidate Applications' },
};

interface TourStep {
  selector: string;
  title: string;
  description: string;
  tip?: string;
  tab?: StudioTab;
}

const SPOTLIGHT_STEPS: TourStep[] = [
  {
    selector: '[data-tour="studio-header"]',
    title: 'MAATI Studio Command Center',
    description: 'Welcome! This is your central hub for managing dishes, prices, catering quotes, job applicants, and all website pages in English and German.',
    tip: 'Changes sync directly to your Sanity database and live VPS.',
    tab: 'overview',
  },
  {
    selector: '[data-tour="page-cards"]',
    title: 'Website Pages Directory',
    description: 'Every single page of your website is listed as an interactive card right here. Click on any card (e.g. Menu & Dishes, Catering, or Homepage) to jump into its dedicated editor.',
    tip: 'Inside any page editor, click the top "← Back to All Pages" button to return to this directory.',
    tab: 'overview',
  },
  {
    selector: '[data-tour="cloud-sync"]',
    title: 'Cloud Sync',
    description: 'Whenever you make edits, click "Sync to Cloud" to push your changes live so visitors on phone or desktop immediately see your updates.',
    tip: 'Use this button whenever you want your edits published live.',
    tab: 'overview',
  },
  {
    selector: '[data-tour="view-site"]',
    title: 'Live Preview',
    description: 'Click "View Website" anytime to open your live restaurant site in a new browser tab and inspect your changes live in English and German.',
    tip: 'You can test deep pages like /menu, /menu/naan-pockets, and /de/menu.',
    tab: 'overview',
  },
];

export const StudioPage: React.FC = () => {
  // ── Authentication State ──
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('maati_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const { categories: initialCategories, revision: initialMenuRevision, loading: menuLoading, isFromSanity: menuFromSanity } = useSanityMenu();
  const menuRevision = useRef<string | undefined>(undefined);
  const menuVersion = useRef(0);
  const menuDirty = useRef(false);
  const menuSaveQueue = useRef<Promise<void>>(Promise.resolve());
  const [legacyMenuDraft] = useState<unknown>(() => {
    try {
      const oldDraft = JSON.parse(localStorage.getItem('maati_admin_menu') || 'null');
      const recovery = JSON.parse(localStorage.getItem('maati_admin_menu_recovery') || 'null');
      return [...(Array.isArray(recovery) ? recovery : []), ...(Array.isArray(oldDraft) ? oldDraft : [])];
    }
    catch { return null; }
  });
  const [isRecoveringCocktails, setIsRecoveringCocktails] = useState(false);
  const { content: initialHomepage } = useHomepageContent();
  const { settings: initialSettings } = useSiteSettings();
  const { content: initialEvents } = useEventsContent();
  const { content: initialContact } = useContactContent();
  const { content: initialPrintMenu } = usePrintMenuContent();
  const { content: initialCatering } = useCateringContent();
  const { content: initialJobs } = useJobsContent();
  const { content: initialAbout } = useAboutContent();
  const { content: initialLegal } = useLegalContent();
  const { content: initialLandingPages } = useLandingPagesContent();
  const { content: initialReservation } = useReservationContent();

  const [activeTab, setActiveTab] = useState<StudioTab>('overview');
  const [categories, setCategories] = useState<SanityCategoryWithItems[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string>('all');
  
  // Site settings state
  const [siteSettings, setSiteSettings] = usePublishedEditor(initialSettings);
  // Homepage state
  const [homepageContent, _setHomepageContent] = usePublishedEditor<HomepageContent>(initialHomepage);
  // Events page state
  const [eventsContent, _setEventsContent] = usePublishedEditor<EventsContent>(initialEvents);
  // Contact page state
  const [contactContent, _setContactContent] = usePublishedEditor<ContactContent>(initialContact);
  // Catering page state
  const [cateringContent, _setCateringContent] = usePublishedEditor<CateringContent>(initialCatering);
  // Jobs page state
  const [jobsContent, _setJobsContent] = usePublishedEditor<JobsContent>(initialJobs);
  // About Us page state
  const [aboutContent, _setAboutContent] = usePublishedEditor<AboutContent>(initialAbout);
  // Legal & Impressum state
  const [legalContent, _setLegalContent] = usePublishedEditor<LegalContent>(initialLegal);
  // Category Landing Pages state
  const [landingPagesContent, _setLandingPagesContent] = usePublishedEditor<LandingPagesContent>(initialLandingPages);
  const [selectedLandingKey, setSelectedLandingKey] = useState<'naan-pockets' | 'bowls' | 'breakfast' | 'coffee-chai'>('naan-pockets');
  // Table Reservations state
  const [reservationContent, _setReservationContent] = usePublishedEditor<ReservationContent>(initialReservation);

  // Print / Visual Menu state
  const [printMenuContent, _setPrintMenuContent] = usePublishedEditor<PrintMenuContent>(initialPrintMenu);

  // Inquiries & Applications State
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [inquiriesFilter, setInquiriesFilter] = useState<'all' | 'new' | 'contacted' | 'confirmed' | 'archived'>('all');
  const [applicationsFilter, setApplicationsFilter] = useState<'all' | 'new' | 'reviewing' | 'interview' | 'hired' | 'rejected'>('all');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  const fetchInquiries = async () => {
    let combined: any[] = [];
    try {
      const local = JSON.parse(localStorage.getItem('maati_stored_enquiries') || '[]');
      if (Array.isArray(local)) combined = [...local];
    } catch (e) {
      // ignore
    }

    try {
      const res = await fetch(apiUrl('/api/inquiries'));
      const data = await res.json().catch(() => ({}));
      if (data.success && Array.isArray(data.inquiries)) {
        const ids = new Set(combined.map((x) => x._id || x.id));
        data.inquiries.forEach((item: any) => {
          if (!ids.has(item._id || item.id)) {
            combined.push(item);
          }
        });
      }
    } catch (e) {
      // ignore
    }

    // Direct Sanity Cloud fallback for 100% data reliability
    try {
      if (isSanityConfigured) {
        const sanityInquiries = await sanityClient.fetch<any[]>(
          `*[_type == "enquirySubmission"] | order(_createdAt desc)`
        );
        if (Array.isArray(sanityInquiries) && sanityInquiries.length > 0) {
          const ids = new Set(combined.map((x) => x._id || x.id));
          sanityInquiries.forEach((item: any) => {
            if (!ids.has(item._id || item.id)) {
              combined.push(item);
            }
          });
        }
      }
    } catch (e) {
      // ignore
    }

    setInquiries(combined);
  };

  const fetchApplications = async () => {
    let combined: any[] = [];
    try {
      const local = JSON.parse(localStorage.getItem('maati_stored_applications') || '[]');
      if (Array.isArray(local)) combined = [...local];
    } catch (e) {
      // ignore
    }

    try {
      const res = await fetch(apiUrl('/api/applications'));
      const data = await res.json().catch(() => ({}));
      if (data.success && Array.isArray(data.applications)) {
        const ids = new Set(combined.map((x) => x._id || x.id));
        data.applications.forEach((item: any) => {
          if (!ids.has(item._id || item.id)) {
            combined.push(item);
          }
        });
      }
    } catch (e) {
      // ignore
    }

    // Direct Sanity Cloud fallback for 100% data reliability
    try {
      if (isSanityConfigured) {
        const sanityApps = await sanityClient.fetch<any[]>(
          `*[_type == "jobApplication"] | order(_createdAt desc)`
        );
        if (Array.isArray(sanityApps) && sanityApps.length > 0) {
          const ids = new Set(combined.map((x) => x._id || x.id));
          sanityApps.forEach((item: any) => {
            if (!ids.has(item._id || item.id)) {
              combined.push(item);
            }
          });
        }
      }
    } catch (e) {
      // ignore
    }

    setApplications(combined);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchInquiries();
      fetchApplications();

      const handleNewApp = () => fetchApplications();
      const handleNewEnquiry = () => fetchInquiries();

      window.addEventListener('maati_application_received', handleNewApp);
      window.addEventListener('maati_enquiry_received', handleNewEnquiry);

      return () => {
        window.removeEventListener('maati_application_received', handleNewApp);
        window.removeEventListener('maati_enquiry_received', handleNewEnquiry);
      };
    }
  }, [isAuthenticated, activeTab]);

  const handleUpdateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(apiUrl('/api/inquiries/status'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      setInquiries((prev) =>
        prev.map((item) => (item._id === id || item.id === id ? { ...item, status: newStatus } : item))
      );
      showToast('Inquiry status updated! 📥');
    } catch (e) {
      showToast('Failed to update status');
    }
  };

  const handleSaveInquiryNote = async (id: string) => {
    try {
      await fetch(apiUrl('/api/inquiries/status'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, managerNotes: noteDraft }),
      });
      setInquiries((prev) =>
        prev.map((item) => (item._id === id || item.id === id ? { ...item, managerNotes: noteDraft } : item))
      );
      setEditingNoteId(null);
      setNoteDraft('');
      showToast('Manager note saved! 📝');
    } catch (e) {
      showToast('Failed to save note');
    }
  };

  const handleUpdateApplicationStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(apiUrl('/api/applications/status'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      setApplications((prev) =>
        prev.map((item) => (item._id === id || item.id === id ? { ...item, status: newStatus } : item))
      );
      showToast('Application status updated! 💼');
    } catch (e) {
      showToast('Failed to update status');
    }
  };

  const handleSaveApplicationNote = async (id: string) => {
    try {
      await fetch(apiUrl('/api/applications/status'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, hrNotes: noteDraft }),
      });
      setApplications((prev) =>
        prev.map((item) => (item._id === id || item.id === id ? { ...item, hrNotes: noteDraft } : item))
      );
      setEditingNoteId(null);
      setNoteDraft('');
      showToast('HR note saved! 📝');
    } catch (e) {
      showToast('Failed to save note');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this customer inquiry?')) return;
    try {
      setInquiries((prev) => prev.filter((item) => item._id !== id && item.id !== id));
      try {
        const local = JSON.parse(localStorage.getItem('maati_stored_enquiries') || '[]');
        const updated = local.filter((item: any) => item._id !== id && item.id !== id);
        localStorage.setItem('maati_stored_enquiries', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      await fetch(apiUrl('/api/inquiries/delete'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      }).catch(() => null);
      showToast('Inquiry deleted successfully! 🗑️');
    } catch (e) {
      showToast('Failed to delete inquiry');
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job application?')) return;
    try {
      setApplications((prev) => prev.filter((item) => item._id !== id && item.id !== id));
      try {
        const local = JSON.parse(localStorage.getItem('maati_stored_applications') || '[]');
        const updated = local.filter((item: any) => item._id !== id && item.id !== id);
        localStorage.setItem('maati_stored_applications', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      await fetch(apiUrl('/api/applications/delete'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      }).catch(() => null);
      showToast('Job application deleted! 🗑️');
    } catch (e) {
      showToast('Failed to delete application');
    }
  };

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

    const measureRect = (el: Element) => {
      const rect = el.getBoundingClientRect();
      setSpotlightRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    };

    const updatePosition = () => {
      const el = document.querySelector(currentStep.selector);
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
        requestAnimationFrame(() => measureRect(el));
      } else {
        attempts++;
        if (attempts < 10) {
          timerId = setTimeout(updatePosition, 100);
        }
      }
    };

    const handleScrollOrResize = () => {
      const el = document.querySelector(currentStep.selector);
      if (el) {
        measureRect(el);
      }
    };

    timerId = setTimeout(updatePosition, 50);
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });

    return () => {
      if (timerId) clearTimeout(timerId);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize);
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
    lunch: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Edit / New Modal State
  const [editingItem, setEditingItem] = useState<SanityMenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  // Dynamic Gallery Assets with Delete & Custom Upload Management
  const [galleryAssets, setGalleryAssets] = useState<GalleryAssetItem[]>(DEFAULT_GALLERY_ASSETS);
  const galleryRevision = useRef<string | undefined>(undefined);
  useEffect(() => {
    sanityClient.fetch<any>('*[_id == "galleryData"][0]').then(doc => {
      if (doc && Array.isArray(doc.items)) { setGalleryAssets(doc.items); galleryRevision.current = doc._rev; }
    }).catch(() => undefined);
  }, []);
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
    saveGalleryToSanity(updated, galleryRevision.current).then(result => {
      if (result.success) galleryRevision.current = result.revision;
      else showToast('Photo library not published: ' + result.message);
    }).catch(err => showToast('Photo library not published: ' + err.message));
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

  // Sanity is authoritative. Browser backups are only for manual recovery.
  useEffect(() => {
    if (!menuLoading && !menuDirty.current) {
      setCategories(initialCategories);
      menuRevision.current = initialMenuRevision;
    }
  }, [initialCategories, initialMenuRevision, menuLoading]);

  useEffect(() => {
    fetch(apiUrl('/api/admin/session'), { credentials: 'include' })
      .then(r => { if (!r.ok) { setIsAuthenticated(false); sessionStorage.removeItem('maati_admin_auth'); } })
      .catch(() => setIsAuthenticated(false));
  }, []);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(apiUrl('/api/admin/login'), {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) { setAuthError(true); showToast(result.error || 'Sign-in failed.'); return; }
      setIsAuthenticated(true);
      sessionStorage.setItem('maati_admin_auth', 'true');
      setAuthError(false);
      setPasswordInput('');
    } catch { setAuthError(true); showToast('Cannot reach the admin server.'); }
  };

  const handleLogout = () => {
    fetch(apiUrl('/api/admin/logout'), { method: 'POST', credentials: 'include' }).catch(() => undefined);
    setIsAuthenticated(false);
    sessionStorage.removeItem('maati_admin_auth');
  };

  const saveAllToLocal = (newCats: SanityCategoryWithItems[]) => {
    if (menuLoading || !menuFromSanity) { showToast('Wait for the published menu to load from Sanity before editing.'); return; }
    menuDirty.current = true;
    const version = ++menuVersion.current;
    setCategories(newCats);
    try { localStorage.setItem('maati_admin_menu_recovery', JSON.stringify(newCats)); } catch { /* Cloud saves still work when storage is full. */ }
    showToast('Publishing menu to Sanity...');
    menuSaveQueue.current = menuSaveQueue.current.then(async () => {
      const result = await saveMenuCategoriesToSanity(newCats, menuRevision.current);
      if (!result.success) { showToast('Menu not published: ' + result.message); return; }
      menuRevision.current = result.revision;
      if (version === menuVersion.current) menuDirty.current = false;
      showToast('Menu published to Sanity.');
    }).catch(error => showToast('Menu not published: ' + error.message));
  };

  const showSuccessToast = () => {
    setHasUnsavedChanges(false);
    window.dispatchEvent(new CustomEvent('maati_homepage_updated', { detail: { forceLocal: true } }));
    window.dispatchEvent(new StorageEvent('storage', { key: 'maati_admin_homepage' }));
    showToast('Homepage changes saved live & synced! ✅');
  };

  const cocktailRecovery = recoverMissingCocktails(categories, legacyMenuDraft);
  const handleRecoverCocktails = async () => {
    if (!menuFromSanity || menuLoading || menuDirty.current || !cocktailRecovery.added.length) return;
    setIsRecoveringCocktails(true);
    try {
      const result = await saveMenuCategoriesToSanity(cocktailRecovery.categories, menuRevision.current);
      if (!result.success) { showToast('Cocktails not published: ' + result.message); return; }
      menuRevision.current = result.revision;
      setCategories(cocktailRecovery.categories);
      showToast(`Published ${cocktailRecovery.added.length} recovered cocktails to Sanity.`);
    } finally { setIsRecoveringCocktails(false); }
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
      ...editingItem,
      _id: editingItem ? editingItem._id : `item-${Date.now()}`,
      id: editingItem ? editingItem.id || editingItem._id : `item-${Date.now()}`,
      titleEn: formTitleEn.trim(),
      titleDe: formTitleDe.trim() || formTitleEn.trim(),
      descEn: formDescEn.trim(),
      descDe: formDescDe.trim() || formDescEn.trim(),
      price: computedPrice,
      options: computedOptions,
      priceEn: editingItem?.price === computedPrice ? editingItem.priceEn : undefined,
      priceDe: editingItem?.price === computedPrice ? editingItem.priceDe : undefined,
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
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('maati_admin_settings', JSON.stringify(siteSettings));
    window.dispatchEvent(new CustomEvent('maati_settings_updated', { detail: { forceLocal: true } }));
    window.dispatchEvent(new StorageEvent('storage', { key: 'maati_admin_settings' }));
    const syncRes = await saveSettingsToSanity(siteSettings);
    if (syncRes.success) {
      showToast('Restaurant information saved & published to Sanity Cloud! 🚀');
    } else {
      showToast(`Saved locally, but Cloud Sync failed: ${syncRes.message} ⚠️`);
    }
  };

  // Save Homepage
  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('maati_admin_homepage', JSON.stringify(homepageContent));
    const syncRes = await saveHomepageToSanity(homepageContent);
    if (syncRes.success) {
      setHasUnsavedChanges(false);
      showToast('Homepage content saved & published to Sanity Cloud! 🚀');
    } else {
      showToast(`Saved locally, but Cloud Sync failed: ${syncRes.message} ⚠️`);
    }
  };

  // Save Events Page Content
  const handleSaveEvents = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('maati_admin_events', JSON.stringify(eventsContent));
    window.dispatchEvent(new CustomEvent('maati_events_updated', { detail: { forceLocal: true } }));
    window.dispatchEvent(new StorageEvent('storage', { key: 'maati_admin_events' }));
    const syncRes = await saveEventsToSanity(eventsContent);
    if (syncRes.success) {
      showToast('Events page saved & published to Sanity Cloud! 🚀');
    } else {
      showToast(`Saved locally, but Cloud Sync failed: ${syncRes.message} ⚠️`);
    }
  };

  // Save Contact Us Page Content
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('maati_admin_contact', JSON.stringify(contactContent));
    window.dispatchEvent(new CustomEvent('maati_contact_updated', { detail: { forceLocal: true } }));
    window.dispatchEvent(new StorageEvent('storage', { key: 'maati_admin_contact' }));
    const syncRes = await saveContactToSanity(contactContent);
    if (syncRes.success) {
      showToast('Contact information saved & published to Sanity Cloud! 🚀');
    } else {
      showToast(`Saved locally, but Cloud Sync failed: ${syncRes.message} ⚠️`);
    }
  };

  // Save Print / Visual Menu Content
  const handleSavePrintMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('maati_admin_print_menu', JSON.stringify(printMenuContent));
    window.dispatchEvent(new CustomEvent('maati_print_menu_updated', { detail: { forceLocal: true } }));
    window.dispatchEvent(new StorageEvent('storage', { key: 'maati_admin_print_menu' }));
    const syncRes = await savePrintMenuToSanity(printMenuContent);
    if (syncRes.success) {
      showToast('Visual Menu preview saved & published to Sanity Cloud! 🚀');
    } else {
      showToast(`Saved locally, but Cloud Sync failed: ${syncRes.message} ⚠️`);
    }
  };

  // Save Catering Page Content
  const handleSaveCatering = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('maati_admin_catering', JSON.stringify(cateringContent));
    window.dispatchEvent(new CustomEvent('maati_catering_updated', { detail: { catering: cateringContent, forceLocal: true } }));
    window.dispatchEvent(new StorageEvent('storage', { key: 'maati_admin_catering' }));
    const syncRes = await saveCateringToSanity(cateringContent);
    if (syncRes.success) {
      showToast('Catering packages & pricing saved & published to Sanity Cloud! 🚀');
    } else {
      showToast(`Saved locally, but Cloud Sync failed: ${syncRes.message} ⚠️`);
    }
  };

  // Save Jobs & Careers Page Content
  const handleSaveJobs = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('maati_admin_jobs', JSON.stringify(jobsContent));
    window.dispatchEvent(new CustomEvent('maati_jobs_updated', { detail: { jobs: jobsContent, forceLocal: true } }));
    window.dispatchEvent(new StorageEvent('storage', { key: 'maati_admin_jobs' }));
    const syncRes = await saveJobsToSanity(jobsContent);
    if (syncRes.success) {
      showToast('Jobs & Careers page saved & published to Sanity Cloud! 🚀');
    } else {
      showToast(`Saved locally, but Cloud Sync failed: ${syncRes.message} ⚠️`);
    }
  };

  // Save About Us Page Content
  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('maati_admin_about', JSON.stringify(aboutContent));
    window.dispatchEvent(new CustomEvent('maati_about_updated', { detail: { about: aboutContent, forceLocal: true } }));
    window.dispatchEvent(new StorageEvent('storage', { key: 'maati_admin_about' }));
    const syncRes = await saveAboutToSanity(aboutContent);
    if (syncRes.success) {
      showToast('About Us brand story saved & published to Sanity Cloud! 🚀');
    } else {
      showToast(`Saved locally, but Cloud Sync failed: ${syncRes.message} ⚠️`);
    }
  };

  // Save Legal & Impressum Content
  const handleSaveLegal = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('maati_admin_legal', JSON.stringify(legalContent));
    window.dispatchEvent(new CustomEvent('maati_legal_updated', { detail: { legal: legalContent, forceLocal: true } }));
    window.dispatchEvent(new StorageEvent('storage', { key: 'maati_admin_legal' }));
    const syncRes = await saveLegalToSanity(legalContent);
    if (syncRes.success) {
      showToast('Legal & Impressum company details saved & published to Sanity Cloud! 🚀');
    } else {
      showToast(`Saved locally, but Cloud Sync failed: ${syncRes.message} ⚠️`);
    }
  };

  // Save Category Landing Pages Content
  const handleSaveLandingPages = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    localStorage.setItem('maati_admin_landing_pages', JSON.stringify(landingPagesContent));
    window.dispatchEvent(new CustomEvent('maati_landing_pages_updated', { detail: { landingPages: landingPagesContent, forceLocal: true } }));
    window.dispatchEvent(new StorageEvent('storage', { key: 'maati_admin_landing_pages' }));
    const syncRes = await saveLandingPagesToSanity(landingPagesContent);
    if (syncRes.success) {
      showToast('Category Landing Pages saved & published to Sanity Cloud! 🚀');
    } else {
      showToast(`Saved locally, but Cloud Sync failed: ${syncRes.message} ⚠️`);
    }
  };

  // Save Reservation Settings Content
  const handleSaveReservation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    localStorage.setItem('maati_admin_reservation', JSON.stringify(reservationContent));
    window.dispatchEvent(new CustomEvent('maati_reservation_updated', { detail: { reservation: reservationContent, forceLocal: true } }));
    window.dispatchEvent(new StorageEvent('storage', { key: 'maati_admin_reservation' }));
    const syncRes = await saveReservationToSanity(reservationContent);
    if (syncRes.success) {
      showToast('Table Reservation settings saved & published to Sanity Cloud! 🚀');
    } else {
      showToast(`Saved locally, but Cloud Sync failed: ${syncRes.message} ⚠️`);
    }
  };

  // 1-Click Sync All Local Data to Sanity Cloud
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const handleSyncAllToCloud = async () => {
    setIsCloudSyncing(true);
    showToast('Refreshing published Sanity content...');
    try {
      const res = await syncAllLocalToSanity();
      if (res.success) {
        showToast(res.message);
      } else {
        showToast(`Sync warning: ${res.message}`);
      }
    } catch (e: any) {
      showToast(`Sync error: ${e?.message || 'Failed'}`);
    } finally {
      setIsCloudSyncing(false);
    }
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

          {toastMessage && <p role="alert" className="text-red-700 mb-3">{toastMessage}</p>}
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
    <div className="min-h-screen bg-[#f5f0e8] pt-4 sm:pt-6 pb-24 px-3 sm:px-6 md:px-10 lg:px-16 relative">
      <div className="max-w-[1360px] mx-auto space-y-5">

        {(!menuFromSanity || menuLoading) && (
          <p role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm">
            {menuLoading ? 'Loading the published menu from Sanity...' : 'The published menu could not be loaded. Showing an offline reference; publishing is paused. Check the Sanity connection and refresh.'}
          </p>
        )}

        {menuFromSanity && !menuLoading && cocktailRecovery.added.length > 0 && (
          <section role="status" className="rounded-2xl border border-amber-300 bg-amber-50 p-5 space-y-3">
            <h2 className="font-bold text-[#1e382f]">Recover {cocktailRecovery.added.length} unpublished cocktail cards</h2>
            <p className="text-sm">These cocktails are saved in this browser but are missing from the published website. Publishing them preserves the current photos and prices of existing menu items.</p>
            <p className="text-sm">{cocktailRecovery.added.map(item => item.titleEn).join(', ')}</p>
            <button type="button" disabled={isRecoveringCocktails || menuDirty.current} onClick={handleRecoverCocktails} className="bg-[#1e382f] text-white rounded-xl px-4 py-2 font-bold disabled:opacity-50">
              {isRecoveringCocktails ? 'Publishing recovered cocktails...' : 'Publish missing cocktails to website'}
            </button>
          </section>
        )}

        {/* ── Top Header Bar with Tour Guide Button ── */}
        <header
          data-tour="studio-header"
          className="bg-gradient-to-r from-[#142820] via-[#1e382f] to-[#172e25] rounded-[28px] p-5 sm:p-6 text-white shadow-xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-80 h-32 bg-[#d85c27]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d85c27] to-[#b34415] text-white flex items-center justify-center shadow-md shrink-0 border border-amber-300/20">
              <Sparkles className="w-6 h-6 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-[22px] sm:text-[26px] font-black text-white leading-tight tracking-tight">
                  MAATI Studio
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Production
                </span>
              </div>
              <p className="text-white/70 text-[12.5px] mt-0.5 font-medium">
                Unified Content &amp; Operations Command Center · Berlin Mitte
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end relative z-10">
            {/* Quick Inquiries Inbox Shortcut */}
            <button
              type="button"
              onClick={() => setActiveTab('inquiries')}
              title="Open Catering Inquiries Inbox"
              className={`font-bold px-3.5 py-2.5 rounded-xl text-[12.5px] shadow-xs hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer border ${
                activeTab === 'inquiries'
                  ? 'bg-amber-500 text-white border-amber-400'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/15 backdrop-blur-xs'
              }`}
            >
              <Inbox className="w-4 h-4 text-amber-300" />
              <span>Inquiries</span>
              {inquiries.length > 0 && (
                <span className="bg-[#d85c27] text-white text-[11px] font-black px-2 py-0.2 rounded-full">
                  {inquiries.length}
                </span>
              )}
            </button>

            {/* Quick Job Applications Inbox Shortcut */}
            <button
              type="button"
              onClick={() => setActiveTab('applications')}
              title="Open Job Applications Inbox"
              className={`font-bold px-3.5 py-2.5 rounded-xl text-[12.5px] shadow-xs hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer border ${
                activeTab === 'applications'
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/15 backdrop-blur-xs'
              }`}
            >
              <Briefcase className="w-4 h-4 text-emerald-300" />
              <span>Applications</span>
              {applications.length > 0 && (
                <span className="bg-emerald-500 text-white text-[11px] font-black px-2 py-0.2 rounded-full">
                  {applications.length}
                </span>
              )}
            </button>

            <button
              type="button"
              data-tour="tour-btn"
              onClick={startSpotlightTour}
              className="bg-white/10 hover:bg-white/20 text-amber-200 border border-white/15 font-bold px-3.5 py-2.5 rounded-xl text-[12.5px] shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>Tour Guide</span>
            </button>

            <button
              type="button"
              data-tour="cloud-sync"
              onClick={handleSyncAllToCloud}
              disabled={isCloudSyncing}
              title="Refresh published Sanity content. Use each editor’s Save button to publish edits."
              className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-4 py-2.5 rounded-xl text-[13px] shadow-sm hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span className="text-[14px]">{isCloudSyncing ? '⏳' : '☁️'}</span>
              <span>{isCloudSyncing ? 'Refreshing...' : 'Refresh from Sanity'}</span>
            </button>

            <Link
              to="/"
              target="_blank"
              data-tour="view-site"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/15 font-bold px-3.5 py-2.5 rounded-xl text-[12.5px] shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 backdrop-blur-xs"
            >
              <ExternalLink className="w-4 h-4 text-amber-300" />
              <span>View Website</span>
            </Link>

            {activeTab === 'items' && (
              <button
                data-tour="add-dish"
                onClick={() => handleOpenNewItem()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-[13px] shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Dish</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              title="Logout from Studio"
              className="p-2.5 rounded-xl bg-white/10 hover:bg-rose-500/80 text-white/90 hover:text-white border border-white/15 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ── Sub-Header Bar when inside any Page Editor: Back to All Pages Button ── */}
        {activeTab !== 'overview' && (
          <div className="bg-[#fffdfa] rounded-[24px] p-4 sm:p-5 border border-[#ebdcd0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="bg-[#1e382f] hover:bg-[#d85c27] text-white font-extrabold px-5 py-2.5 rounded-xl text-[13.5px] flex items-center gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 text-[#d85c27] group-hover:text-white transition-colors" />
                <span>Back to All Pages</span>
              </button>

              <div className="h-6 w-px bg-[#ebdcd0] hidden sm:block" />

              <div>
                <span className="text-[10.5px] font-black text-[#888] uppercase tracking-wider block">
                  Current Editor
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[16px] font-black text-[#1e382f]">
                    {TAB_TITLES[activeTab]?.title}
                  </span>
                  {TAB_TITLES[activeTab]?.route && (
                    <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      {TAB_TITLES[activeTab]?.route}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {TAB_TITLES[activeTab]?.route && (
                <Link
                  to={TAB_TITLES[activeTab].route!}
                  target="_blank"
                  className="bg-white hover:bg-gray-50 text-[#1e382f] border border-[#ebdcd0] font-bold px-3 py-2 rounded-xl text-[12px] flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#d85c27]" />
                  <span>View Live Page</span>
                </Link>
              )}

              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as StudioTab)}
                className="border border-[#ebdcd0] rounded-xl px-3 py-2 text-[12.5px] font-bold text-[#1e382f] bg-white focus:outline-none focus:border-[#d85c27] shadow-xs cursor-pointer"
              >
                <option value="overview">All Pages Directory</option>

                <optgroup label="── Main Pages ──">
                  <option value="homepage">Homepage</option>
                  <option value="about">Brand Story &amp; About</option>
                  <option value="contact">Contact &amp; Location</option>
                  <option value="reservations">Table Reservations</option>
                </optgroup>

                <optgroup label="── Food &amp; Menu ──">
                  <option value="items">Menu Dishes &amp; Pricing</option>
                  <option value="categories">Menu Categories</option>
                  <option value="landingPages">Category SEO Landings (Naan Pockets, Bowls...)</option>
                  <option value="printMenu">Printable Menu Cards</option>
                </optgroup>

                <optgroup label="── Services &amp; Hiring ──">
                  <option value="catering">Corporate &amp; Event Catering</option>
                  <option value="events">Private Events &amp; Venue Hire</option>
                  <option value="jobs">Careers &amp; Job Openings</option>
                </optgroup>

                <optgroup label="── Inboxes ──">
                  <option value="inquiries">Catering Inquiries Inbox</option>
                  <option value="applications">Job Applications Inbox</option>
                </optgroup>

                <optgroup label="── Legal &amp; System ──">
                  <option value="legal">Impressum (§ 5 TMG)</option>
                  <option value="privacy">Privacy Policy (DSGVO)</option>
                  <option value="terms">Terms &amp; Conditions (AGB)</option>
                  <option value="settings">Global SEO &amp; Restaurant Info</option>
                  <option value="gallery">Photo Library &amp; Media</option>
                </optgroup>
              </select>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            TAB 0: ALL WEBSITE PAGES DIRECTORY
        ═══════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Mission Control Hub Banner */}
            <div className="bg-[#fffdfa] rounded-[28px] p-6 sm:p-8 border border-[#ebdcd0] shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-[780px] space-y-3 relative z-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#1e382f] text-white text-[10.5px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block">
                    Architecture &amp; Pages Hub
                  </span>
                  <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                    18 Management Modules
                  </span>
                </div>
                <h2 className="text-[24px] sm:text-[30px] font-black leading-tight text-[#1e382f]">
                  Website Pages &amp; Content Directory
                </h2>
                <p className="text-[#666] text-[13.5px] leading-relaxed">
                  Click any card below to open its dedicated editor. Update headlines, pricing, and ingredients in English &amp; German, upload photos, and keep your Google search results fresh.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11.5px]">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg border border-gray-200 flex items-center gap-1.5 font-bold">
                    <span>🌐</span> 24 Multilingual URLs Active
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5 font-bold">
                    <span>🍲</span> {allItemsWithCat.length} Dishes Live
                  </span>
                  <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-lg border border-blue-200 flex items-center gap-1.5 font-bold">
                    <span>📁</span> {categories.length} Categories
                  </span>
                  <span className="bg-purple-50 text-purple-800 px-3 py-1 rounded-lg border border-purple-200 flex items-center gap-1.5 font-bold">
                    <span>⚖️</span> Impressum &amp; GDPR Validated
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 relative z-10 shrink-0 w-full md:w-auto">
                <button
                  type="button"
                  onClick={handleSyncAllToCloud}
                  disabled={isCloudSyncing}
                  className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-5 py-3 rounded-xl text-[13px] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>{isCloudSyncing ? 'Refreshing...' : 'Refresh published pages'}</span>
                </button>
              </div>
              <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#d85c27]/5 blur-3xl pointer-events-none" />
            </div>

            {/* Pages Grid */}
            <div data-tour="page-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

              {/* 1. Homepage */}
              <div
                onClick={() => setActiveTab('homepage')}
                className="bg-[#fffdfa] rounded-[24px] p-6 border border-[#ebdcd0] shadow-sm hover:shadow-md hover:border-[#d85c27] transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#d85c27] flex items-center justify-center font-black">
                      <Home className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">/ and /de</span>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-black text-[#1e382f]">1. Homepage</h3>
                    <p className="text-[12.5px] text-[#666] leading-relaxed mt-1">
                      Hero headlines, "Treat Your Tastebuds" signature dishes, "The Maati Way" 5-step bowl builder, and catering callout.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActiveTab('homepage'); }}
                    className="bg-[#1e382f] group-hover:bg-[#d85c27] text-white text-[12.5px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#d85c27] group-hover:text-white" />
                    <span>Edit Homepage</span>
                  </button>
                  <Link
                    to="/"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-[#d85c27] transition-colors rounded-lg hover:bg-gray-50"
                    title="View Live Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* 2. Menu Dishes */}
              <div
                onClick={() => setActiveTab('items')}
                className="bg-[#fffdfa] rounded-[24px] p-6 border border-[#ebdcd0] shadow-sm hover:shadow-md hover:border-[#d85c27] transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">/menu and /de/menu</span>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-black text-[#1e382f]">2. Menu &amp; Dishes ({allItemsWithCat.length})</h3>
                    <p className="text-[12.5px] text-[#666] leading-relaxed mt-1">
                      Dishes list with single or variant pricing, ingredients, spicy/vegan badges, daily 1-click availability toggle, and category groupings.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActiveTab('items'); }}
                    className="bg-[#1e382f] group-hover:bg-[#d85c27] text-white text-[12.5px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#d85c27] group-hover:text-white" />
                    <span>Manage Dishes</span>
                  </button>
                  <Link
                    to="/menu"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-[#d85c27] transition-colors rounded-lg hover:bg-gray-50"
                    title="View Live Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* 3. Category Landing Pages */}
              <div
                onClick={() => setActiveTab('landingPages')}
                className="bg-[#fffdfa] rounded-[24px] p-6 border border-[#ebdcd0] shadow-sm hover:shadow-md hover:border-[#d85c27] transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                      <Tag className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">4 SEO Pages</span>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-black text-[#1e382f]">3. Category Landing Pages</h3>
                    <p className="text-[12.5px] text-[#666] leading-relaxed mt-1">
                      Dedicated pages for Naan Pockets, Bowls, Breakfast, and Coffee/Chai with custom H1 headers, SEO descriptions, and highlighted food cards.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActiveTab('landingPages'); }}
                    className="bg-[#1e382f] group-hover:bg-[#d85c27] text-white text-[12.5px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#d85c27] group-hover:text-white" />
                    <span>Edit Landings</span>
                  </button>
                  <Link
                    to="/menu/naan-pockets"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-[#d85c27] transition-colors rounded-lg hover:bg-gray-50"
                    title="View Naan Pockets Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* 4. Catering Page */}
              <div
                onClick={() => setActiveTab('catering')}
                className="bg-[#fffdfa] rounded-[24px] p-6 border border-[#ebdcd0] shadow-sm hover:shadow-md hover:border-[#d85c27] transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-black">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">/catering</span>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-black text-[#1e382f]">4. Catering Page</h3>
                    <p className="text-[12.5px] text-[#666] leading-relaxed mt-1">
                      Corporate office packages (€11.90, €15.90, €19.90), min guests, feature bullet points in EN &amp; DE, lead time notice, and catering FAQs.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActiveTab('catering'); }}
                    className="bg-[#1e382f] group-hover:bg-[#d85c27] text-white text-[12.5px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#d85c27] group-hover:text-white" />
                    <span>Edit Catering</span>
                  </button>
                  <Link
                    to="/catering"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-[#d85c27] transition-colors rounded-lg hover:bg-gray-50"
                    title="View Live Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* 5. Events Page */}
              <div
                onClick={() => setActiveTab('events')}
                className="bg-[#fffdfa] rounded-[24px] p-6 border border-[#ebdcd0] shadow-sm hover:shadow-md hover:border-[#d85c27] transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">/events</span>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-black text-[#1e382f]">5. Events &amp; Venue Hire</h3>
                    <p className="text-[12.5px] text-[#666] leading-relaxed mt-1">
                      Private venue buyout specs, standing capacity (60 guests), seating arrangements, AV/sound equipment perks, and enquiry form.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActiveTab('events'); }}
                    className="bg-[#1e382f] group-hover:bg-[#d85c27] text-white text-[12.5px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#d85c27] group-hover:text-white" />
                    <span>Edit Events</span>
                  </button>
                  <Link
                    to="/events"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-[#d85c27] transition-colors rounded-lg hover:bg-gray-50"
                    title="View Live Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* 6. About Us */}
              <div
                onClick={() => setActiveTab('about')}
                className="bg-[#fffdfa] rounded-[24px] p-6 border border-[#ebdcd0] shadow-sm hover:shadow-md hover:border-[#d85c27] transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">/about</span>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-black text-[#1e382f]">6. About Us &amp; Story</h3>
                    <p className="text-[12.5px] text-[#666] leading-relaxed mt-1">
                      Brand heritage, traditional family recipes, philosophy of मिट्टी (clay &amp; soil), 3 core values, and restaurant photos.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActiveTab('about'); }}
                    className="bg-[#1e382f] group-hover:bg-[#d85c27] text-white text-[12.5px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#d85c27] group-hover:text-white" />
                    <span>Edit About Us</span>
                  </button>
                  <Link
                    to="/about"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-[#d85c27] transition-colors rounded-lg hover:bg-gray-50"
                    title="View Live Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* 7. Locations & Contact */}
              <div
                onClick={() => setActiveTab('contact')}
                className="bg-[#fffdfa] rounded-[24px] p-6 border border-[#ebdcd0] shadow-sm hover:shadow-md hover:border-[#d85c27] transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black">
                      <Phone className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">/locations &amp; /contact</span>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-black text-[#1e382f]">7. Locations &amp; Contact</h3>
                    <p className="text-[12.5px] text-[#666] leading-relaxed mt-1">
                      Restaurant address (Zimmerstraße 56), weekly opening hours, direct phone number, email address, and Google Maps embed.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActiveTab('contact'); }}
                    className="bg-[#1e382f] group-hover:bg-[#d85c27] text-white text-[12.5px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#d85c27] group-hover:text-white" />
                    <span>Edit Contact</span>
                  </button>
                  <Link
                    to="/locations"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-[#d85c27] transition-colors rounded-lg hover:bg-gray-50"
                    title="View Live Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* 8. Table Reservations */}
              <div
                onClick={() => setActiveTab('reservations')}
                className="bg-[#fffdfa] rounded-[24px] p-6 border border-[#ebdcd0] shadow-sm hover:shadow-md hover:border-[#d85c27] transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">Reservation Modal</span>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-black text-[#1e382f]">8. Table Reservations</h3>
                    <p className="text-[12.5px] text-[#666] leading-relaxed mt-1">
                      TheFork booking widget integration, modal title &amp; notice, max group size, and walk-in guidance for table bookings.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActiveTab('reservations'); }}
                    className="bg-[#1e382f] group-hover:bg-[#d85c27] text-white text-[12.5px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#d85c27] group-hover:text-white" />
                    <span>Edit Reservations</span>
                  </button>
                  <span className="text-[11.5px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
                    TheFork Active
                  </span>
                </div>
              </div>

              {/* 9. Careers / Jobs */}
              <div
                onClick={() => setActiveTab('jobs')}
                className="bg-[#fffdfa] rounded-[24px] p-6 border border-[#ebdcd0] shadow-sm hover:shadow-md hover:border-[#d85c27] transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-black">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">/jobs &amp; /careers</span>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-black text-[#1e382f]">9. Careers &amp; Jobs ({jobsContent.jobs?.length || 0})</h3>
                    <p className="text-[12.5px] text-[#666] leading-relaxed mt-1">
                      Post restaurant openings (Managers, Baristas, Line Cooks), edit job descriptions, perks, and review submitted candidate CVs.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActiveTab('jobs'); }}
                    className="bg-[#1e382f] group-hover:bg-[#d85c27] text-white text-[12.5px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#d85c27] group-hover:text-white" />
                    <span>Edit Careers</span>
                  </button>
                  <Link
                    to="/jobs"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-[#d85c27] transition-colors rounded-lg hover:bg-gray-50"
                    title="View Live Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* 10. Visual Menu Cards */}
              <div
                onClick={() => setActiveTab('printMenu')}
                className="bg-[#fffdfa] rounded-[24px] p-6 border border-[#ebdcd0] shadow-sm hover:shadow-md hover:border-[#d85c27] transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-black">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">Menu Page Preview</span>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-black text-[#1e382f]">10. Visual Menu Cards</h3>
                    <p className="text-[12.5px] text-[#666] leading-relaxed mt-1">
                      Page 1 (Bowls &amp; Naan) and Page 2 (Lassis &amp; Drinks) high-resolution print menu graphic cards and inspect modal.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActiveTab('printMenu'); }}
                    className="bg-[#1e382f] group-hover:bg-[#d85c27] text-white text-[12.5px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#d85c27] group-hover:text-white" />
                    <span>Edit Menu Cards</span>
                  </button>
                  <Link
                    to="/menu"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-[#d85c27] transition-colors rounded-lg hover:bg-gray-50"
                    title="View Live Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* 11. Impressum */}
              <div
                onClick={() => setActiveTab('legal')}
                className="bg-[#fffdfa] rounded-[24px] p-6 border border-[#ebdcd0] shadow-sm hover:shadow-md hover:border-[#d85c27] transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center font-black">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">/impressum</span>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-black text-[#1e382f]">11. Impressum (§ 5 TMG)</h3>
                    <p className="text-[12.5px] text-[#666] leading-relaxed mt-1">
                      Official German legal imprint: Unicorn Table UG, managing director (Naveen Prasad), Charlottenburg commercial register, and VAT ID.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActiveTab('legal'); }}
                    className="bg-[#1e382f] group-hover:bg-[#d85c27] text-white text-[12.5px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#d85c27] group-hover:text-white" />
                    <span>Edit Impressum</span>
                  </button>
                  <Link
                    to="/impressum"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-[#d85c27] transition-colors rounded-lg hover:bg-gray-50"
                    title="View Live Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* 12. Privacy Policy */}
              <div
                onClick={() => setActiveTab('privacy')}
                className="bg-[#fffdfa] rounded-[24px] p-6 border border-[#ebdcd0] shadow-sm hover:shadow-md hover:border-[#d85c27] transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-black">
                      <Lock className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">/privacy &amp; /de/datenschutz</span>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-black text-[#1e382f]">12. Privacy Policy (Datenschutz)</h3>
                    <p className="text-[12.5px] text-[#666] leading-relaxed mt-1">
                      GDPR and DSGVO data protection statements, data processor disclosures, cookie policies, and visitor rights.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActiveTab('privacy'); }}
                    className="bg-[#1e382f] group-hover:bg-[#d85c27] text-white text-[12.5px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#d85c27] group-hover:text-white" />
                    <span>Edit Privacy</span>
                  </button>
                  <Link
                    to="/privacy"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-[#d85c27] transition-colors rounded-lg hover:bg-gray-50"
                    title="View Live Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* 13. Terms & Conditions */}
              <div
                onClick={() => setActiveTab('terms')}
                className="bg-[#fffdfa] rounded-[24px] p-6 border border-[#ebdcd0] shadow-sm hover:shadow-md hover:border-[#d85c27] transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">/terms &amp; /de/agb</span>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-black text-[#1e382f]">13. Terms &amp; Conditions (AGB)</h3>
                    <p className="text-[12.5px] text-[#666] leading-relaxed mt-1">
                      General terms of service, ordering policies, catering commitments, cancellation rules, and legal jurisdiction in Berlin.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActiveTab('terms'); }}
                    className="bg-[#1e382f] group-hover:bg-[#d85c27] text-white text-[12.5px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#d85c27] group-hover:text-white" />
                    <span>Edit Terms</span>
                  </button>
                  <Link
                    to="/terms"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-[#d85c27] transition-colors rounded-lg hover:bg-gray-50"
                    title="View Live Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* 14. Restaurant Info & Global SEO */}
              <div
                onClick={() => setActiveTab('settings')}
                className="bg-[#fffdfa] rounded-[24px] p-6 border border-[#ebdcd0] shadow-sm hover:shadow-md hover:border-[#d85c27] transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-black">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">Global Schema &amp; SEO</span>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-black text-[#1e382f]">14. Restaurant Info &amp; SEO</h3>
                    <p className="text-[12.5px] text-[#666] leading-relaxed mt-1">
                      JSON-LD structured data (Restaurant, Catering, EventVenue), telephone numbers, coordinates, and social media URLs.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActiveTab('settings'); }}
                    className="bg-[#1e382f] group-hover:bg-[#d85c27] text-white text-[12.5px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#d85c27] group-hover:text-white" />
                    <span>Edit SEO &amp; Info</span>
                  </button>
                  <span className="text-[11.5px] text-gray-500 font-semibold">
                    100% Schema Validated
                  </span>
                </div>
              </div>

              {/* 15. Menu Categories */}
              <div
                onClick={() => setActiveTab('categories')}
                className="bg-[#fffdfa] rounded-[24px] p-6 border border-[#ebdcd0] shadow-sm hover:shadow-md hover:border-[#d85c27] transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center font-black">
                      <FolderTree className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">Category Management</span>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-black text-[#1e382f]">15. Menu Categories</h3>
                    <p className="text-[12.5px] text-[#666] leading-relaxed mt-1">
                      Organize dishes into Signature Bowls, Punjab Naan Pockets, Chai &amp; Drinks, rearrange sorting order, and edit German category names.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActiveTab('categories'); }}
                    className="bg-[#1e382f] group-hover:bg-[#d85c27] text-white text-[12.5px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#d85c27] group-hover:text-white" />
                    <span>Edit Categories</span>
                  </button>
                  <span className="text-[11.5px] text-gray-500 font-semibold">
                    {categories.length} Categories Live
                  </span>
                </div>
              </div>

              {/* 16. Photo Library & Fast Uploads */}
              <div
                onClick={() => setActiveTab('gallery')}
                className="bg-[#fffdfa] rounded-[24px] p-6 border border-[#ebdcd0] shadow-sm hover:shadow-md hover:border-[#d85c27] transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-800 flex items-center justify-center font-black">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">Media &amp; CDN</span>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-black text-[#1e382f]">16. Photo Library ({galleryAssets.length})</h3>
                    <p className="text-[12.5px] text-[#666] leading-relaxed mt-1">
                      Upload food photos from mobile or desktop. Automatically compressed to lightweight WebP, tagged by category, and easily deleted.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActiveTab('gallery'); }}
                    className="bg-[#1e382f] group-hover:bg-[#d85c27] text-white text-[12.5px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#d85c27] group-hover:text-white" />
                    <span>Open Library</span>
                  </button>
                  <span className="text-[11.5px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg">
                    Auto-WebP
                  </span>
                </div>
              </div>

              {/* 17. Customer Inquiries Inbox */}
              <div
                onClick={() => setActiveTab('inquiries')}
                className="bg-[#fffdfa] rounded-[24px] p-6 border border-[#ebdcd0] shadow-sm hover:shadow-md hover:border-[#d85c27] transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                      <Inbox className="w-5 h-5" />
                    </div>
                    {inquiries.filter((i) => i.status === 'new').length > 0 ? (
                      <span className="text-[11px] font-black bg-[#d85c27] text-white px-2.5 py-1 rounded-lg animate-pulse">
                        {inquiries.filter((i) => i.status === 'new').length} New Enquiries
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">Inbox</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-[17px] font-black text-[#1e382f]">17. Catering Inquiries ({inquiries.length})</h3>
                    <p className="text-[12.5px] text-[#666] leading-relaxed mt-1">
                      Review customer quotes for office lunches and weddings. Update workflow status (New, Contacted, Confirmed) and internal notes.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActiveTab('inquiries'); }}
                    className="bg-[#1e382f] group-hover:bg-[#d85c27] text-white text-[12.5px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#d85c27] group-hover:text-white" />
                    <span>View Inquiries</span>
                  </button>
                  <span className="text-[11.5px] text-gray-500 font-semibold">
                    {inquiries.length} Total
                  </span>
                </div>
              </div>

              {/* 18. Job Applications Inbox */}
              <div
                onClick={() => setActiveTab('applications')}
                className="bg-[#fffdfa] rounded-[24px] p-6 border border-[#ebdcd0] shadow-sm hover:shadow-md hover:border-[#d85c27] transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-800 flex items-center justify-center font-black">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    {applications.filter((a) => a.status === 'new').length > 0 ? (
                      <span className="text-[11px] font-black bg-emerald-600 text-white px-2.5 py-1 rounded-lg">
                        {applications.filter((a) => a.status === 'new').length} New Applicants
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">HR Inbox</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-[17px] font-black text-[#1e382f]">18. Job Applications ({applications.length})</h3>
                    <p className="text-[12.5px] text-[#666] leading-relaxed mt-1">
                      Candidate CVs submitted for Service, Kitchen, and Barista roles. Filter by status (Reviewing, Interview, Hired) with HR notes.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActiveTab('applications'); }}
                    className="bg-[#1e382f] group-hover:bg-[#d85c27] text-white text-[12.5px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#d85c27] group-hover:text-white" />
                    <span>View Applications</span>
                  </button>
                  <span className="text-[11.5px] text-gray-500 font-semibold">
                    {applications.length} Candidates
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

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

                <div className="flex items-center gap-2.5 flex-wrap">
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

                  <button
                    type="button"
                    data-tour="add-dish"
                    onClick={() => handleOpenNewItem()}
                    className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-4 py-2 rounded-xl text-[13px] shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Dish</span>
                  </button>
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
                  {/* Hero Orange Pill Badge */}
                  <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-xl p-3.5">
                    <label className="block text-[12px] font-black text-[#d85c27] mb-1 flex items-center gap-2">
                      <span className="bg-[#d85c27] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Badge</span>
                      Top Orange Badge ({adminContentLang.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={adminContentLang === 'en' ? (homepageContent.heroBadgeEn || '') : (homepageContent.heroBadgeDe || '')}
                      onChange={(e) => setHomepageContent(adminContentLang === 'en' ? { ...homepageContent, heroBadgeEn: e.target.value } : { ...homepageContent, heroBadgeDe: e.target.value })}
                      placeholder={adminContentLang === 'en' ? 'FAST CASUAL • INDIAN SOUL' : 'FAST CASUAL • INDISCHE KÜCHE'}
                      className="w-full border rounded-xl px-3.5 py-2 text-[13.5px] font-bold focus:outline-none focus:border-[#d85c27]"
                    />
                  </div>

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

            {/* ── 2. House Favorites (Lunch Section) ── */}
            <div className="bg-[#fffdfa] rounded-[22px] border border-[#ebdcd0] shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('lunch')}
                className="w-full p-5 flex items-center justify-between text-left bg-white/70 border-b border-[#ebdcd0]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#d85c27] text-white font-black text-[12px] flex items-center justify-center">2</span>
                  <div>
                    <h3 className="text-[16px] font-black text-[#1e382f]">Treat Your Tastebuds (House Favorites)</h3>
                    <p className="text-[12px] text-gray-500">Headline & description above the featured dishes on Homepage</p>
                  </div>
                </div>
                {openSections.lunch ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>

              {openSections.lunch && (
                <div className="p-5 sm:p-6 space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">Section Headline</label>
                    <input
                      type="text"
                      value={adminContentLang === 'en' ? (homepageContent.lunchTitleEn || '') : (homepageContent.lunchTitleDe || '')}
                      onChange={(e) => setHomepageContent(adminContentLang === 'en' ? { ...homepageContent, lunchTitleEn: e.target.value } : { ...homepageContent, lunchTitleDe: e.target.value })}
                      className="w-full border rounded-xl px-3.5 py-2 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                      placeholder={adminContentLang === 'en' ? 'e.g. Treat Your Tastebuds' : 'e.g. Verwöhnen Sie Ihren Gaumen'}
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">Section Description</label>
                    <textarea
                      rows={2}
                      value={adminContentLang === 'en' ? (homepageContent.lunchDescEn || '') : (homepageContent.lunchDescDe || '')}
                      onChange={(e) => setHomepageContent(adminContentLang === 'en' ? { ...homepageContent, lunchDescEn: e.target.value } : { ...homepageContent, lunchDescDe: e.target.value })}
                      className="w-full border rounded-xl px-3.5 py-2 text-[13.5px] focus:outline-none focus:border-[#d85c27] resize-none"
                      placeholder={adminContentLang === 'en' ? 'e.g. Discover our most-loved signature combinations...' : 'e.g. Entdecken Sie unsere beliebtesten Signatur-Kombinationen...'}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ── 3. The MAATI Way Steps ── */}
            <div className="bg-[#fffdfa] rounded-[22px] border border-[#ebdcd0] shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('maatiWay')}
                className="w-full p-5 flex items-center justify-between text-left bg-white/70 border-b border-[#ebdcd0]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#d85c27] text-white font-black text-[12px] flex items-center justify-center">3</span>
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

            {/* ── 4. Dining Experience ── */}
            <div className="bg-[#fffdfa] rounded-[22px] border border-[#ebdcd0] shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('experience')}
                className="w-full p-5 flex items-center justify-between text-left bg-white/70 border-b border-[#ebdcd0]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#d85c27] text-white font-black text-[12px] flex items-center justify-center">4</span>
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

            {/* ── 5. Catering Section ── */}
            <div className="bg-[#fffdfa] rounded-[22px] border border-[#ebdcd0] shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('catering')}
                className="w-full p-5 flex items-center justify-between text-left bg-white/70 border-b border-[#ebdcd0]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#d85c27] text-white font-black text-[12px] flex items-center justify-center">5</span>
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

            {/* ── 6. Footer CTA Banner ── */}
            <div className="bg-[#fffdfa] rounded-[22px] border border-[#ebdcd0] shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('footerCta')}
                className="w-full p-5 flex items-center justify-between text-left bg-white/70 border-b border-[#ebdcd0]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#d85c27] text-white font-black text-[12px] flex items-center justify-center">6</span>
                  <div>
                    <h3 className="text-[16px] font-black text-[#1e382f]">Footer CTA Banner</h3>
                    <p className="text-[12px] text-gray-500">"Visit us" banner at the bottom of the homepage — headline, tagline & button labels</p>
                  </div>
                </div>
                {openSections.footerCta ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>

              {openSections.footerCta && (
                <div className="p-5 sm:p-6 space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">Headline / CTA Title</label>
                    <input
                      type="text"
                      value={adminContentLang === 'en' ? (homepageContent.ctaTitleEn || '') : (homepageContent.ctaTitleDe || '')}
                      onChange={(e) => setHomepageContent(adminContentLang === 'en' ? { ...homepageContent, ctaTitleEn: e.target.value } : { ...homepageContent, ctaTitleDe: e.target.value })}
                      className="w-full border rounded-xl px-3.5 py-2 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                      placeholder={adminContentLang === 'en' ? 'e.g. Visit us at Zimmerstr. 56, 10117 Berlin' : 'e.g. Besuchen Sie uns in der Zimmerstr. 56, 10117 Berlin'}
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">Subheadline / Description</label>
                    <textarea
                      rows={2}
                      value={adminContentLang === 'en' ? (homepageContent.ctaDescEn || '') : (homepageContent.ctaDescDe || '')}
                      onChange={(e) => setHomepageContent(adminContentLang === 'en' ? { ...homepageContent, ctaDescEn: e.target.value } : { ...homepageContent, ctaDescDe: e.target.value })}
                      className="w-full border rounded-xl px-3.5 py-2 text-[13.5px] focus:outline-none focus:border-[#d85c27] resize-none"
                      placeholder={adminContentLang === 'en' ? 'e.g. Experience modern Indian soul food in a cozy atmosphere.' : 'e.g. Erleben Sie modernes indisches Soul Food in gemütlicher Atmosphäre.'}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-[#333] mb-1">Button 1 Label (View Menu)</label>
                      <input
                        type="text"
                        value={adminContentLang === 'en' ? (homepageContent.ctaBtnMenuEn || '') : (homepageContent.ctaBtnMenuDe || '')}
                        onChange={(e) => setHomepageContent(adminContentLang === 'en' ? { ...homepageContent, ctaBtnMenuEn: e.target.value } : { ...homepageContent, ctaBtnMenuDe: e.target.value })}
                        className="w-full border rounded-xl px-3.5 py-2 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                        placeholder={adminContentLang === 'en' ? 'View Menu' : 'Speisekarte'}
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-[#333] mb-1">Button 2 Label (Locations)</label>
                      <input
                        type="text"
                        value={adminContentLang === 'en' ? (homepageContent.ctaBtnLocationsEn || '') : (homepageContent.ctaBtnLocationsDe || '')}
                        onChange={(e) => setHomepageContent(adminContentLang === 'en' ? { ...homepageContent, ctaBtnLocationsEn: e.target.value } : { ...homepageContent, ctaBtnLocationsDe: e.target.value })}
                        className="w-full border rounded-xl px-3.5 py-2 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                        placeholder={adminContentLang === 'en' ? 'Our Locations' : 'Unsere Standorte'}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>


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
              <div className="md:col-span-2">
                <label className="block text-[12px] font-bold text-[#333] mb-1">Street Address</label>
                <input
                  type="text"
                  value={siteSettings.address || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                />
              </div>
            </div>


            {/* Social Media URLs */}
            <div className="pt-2 border-t border-gray-100">
              <h3 className="text-[15px] font-black text-[#1e382f] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#d85c27] text-white text-[11px] font-black flex items-center justify-center">@</span>
                Social Media Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px]"
                      style={{ background: 'linear-gradient(135deg, #f09433, #dc2743, #bc1888)' }}>IG</span>
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={siteSettings.instagram || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, instagram: e.target.value })}
                    placeholder="https://instagram.com/maatikitchen"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-[#1877F2] flex items-center justify-center text-white text-[9px]">FB</span>
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={siteSettings.facebook || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, facebook: e.target.value })}
                    placeholder="https://facebook.com/maatikitchen"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-[#010101] flex items-center justify-center text-white text-[9px]">TK</span>
                    TikTok URL
                  </label>
                  <input
                    type="url"
                    value={siteSettings.tiktok || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, tiktok: e.target.value })}
                    placeholder="https://tiktok.com/@maatikitchen"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-[#d85c27] flex items-center justify-center text-white text-[9px]">✉</span>
                    Business Email
                  </label>
                  <input
                    type="email"
                    value={siteSettings.email || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                    placeholder="hello@maatikitchen.com"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
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
            TAB 6: EVENTS PAGE CONTENT
        ═══════════════════════════════════════════════ */}
        {activeTab === 'events' && (
          <form onSubmit={handleSaveEvents} className="bg-[#fffdfa] rounded-[24px] p-6 sm:p-8 border border-[#ebdcd0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-[20px] font-black text-[#1e382f] flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-[#d85c27]" />
                  <span>Events & Private Dining Content</span>
                </h2>
                <p className="text-[13px] text-[#666] mt-0.5">
                  Edit headline, description, bullet points, CTA button, and hero photo for the Events page.
                </p>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1.5 bg-[#fcf8f3] p-1.5 rounded-xl border border-[#ebdcd0] shrink-0">
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

            {/* Headline */}
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">Page Headline ({adminContentLang.toUpperCase()})</label>
              <input
                type="text"
                value={adminContentLang === 'en' ? (eventsContent.headlineEn || '') : (eventsContent.headlineDe || '')}
                onChange={(e) => _setEventsContent(adminContentLang === 'en' ? { ...eventsContent, headlineEn: e.target.value } : { ...eventsContent, headlineDe: e.target.value })}
                placeholder={adminContentLang === 'en' ? 'Host Your Own Event' : 'Veranstalten Sie Ihr Event bei uns'}
                className="w-full border rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">Description Tagline ({adminContentLang.toUpperCase()})</label>
              <textarea
                rows={3}
                value={adminContentLang === 'en' ? (eventsContent.descEn || '') : (eventsContent.descDe || '')}
                onChange={(e) => _setEventsContent(adminContentLang === 'en' ? { ...eventsContent, descEn: e.target.value } : { ...eventsContent, descDe: e.target.value })}
                placeholder={adminContentLang === 'en' ? 'Looking for a unique venue? MAATI offers private dining...' : 'Suchen Sie nach einer einzigartigen Location?...'}
                className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27] resize-none"
              />
            </div>

            {/* 3 Checkpoint Bullets */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <h3 className="text-[14px] font-bold text-[#1e382f]">Checklist Points</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Bullet Point 1</label>
                  <input
                    type="text"
                    value={adminContentLang === 'en' ? (eventsContent.bullet1En || '') : (eventsContent.bullet1De || '')}
                    onChange={(e) => _setEventsContent(adminContentLang === 'en' ? { ...eventsContent, bullet1En: e.target.value } : { ...eventsContent, bullet1De: e.target.value })}
                    placeholder={adminContentLang === 'en' ? 'Customizable Menus' : 'Individuelle Menüs'}
                    className="w-full border rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Bullet Point 2</label>
                  <input
                    type="text"
                    value={adminContentLang === 'en' ? (eventsContent.bullet2En || '') : (eventsContent.bullet2De || '')}
                    onChange={(e) => _setEventsContent(adminContentLang === 'en' ? { ...eventsContent, bullet2En: e.target.value } : { ...eventsContent, bullet2De: e.target.value })}
                    placeholder={adminContentLang === 'en' ? 'Private or Semi-Private Spaces' : 'Private & Halbprivate Bereiche'}
                    className="w-full border rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Bullet Point 3</label>
                  <input
                    type="text"
                    value={adminContentLang === 'en' ? (eventsContent.bullet3En || '') : (eventsContent.bullet3De || '')}
                    onChange={(e) => _setEventsContent(adminContentLang === 'en' ? { ...eventsContent, bullet3En: e.target.value } : { ...eventsContent, bullet3De: e.target.value })}
                    placeholder={adminContentLang === 'en' ? 'Full Catering Service Available' : 'Kompletter Catering-Service'}
                    className="w-full border rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
              </div>
            </div>

            {/* Button Label & Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">CTA Button Label</label>
                <input
                  type="text"
                  value={adminContentLang === 'en' ? (eventsContent.ctaBtnEn || '') : (eventsContent.ctaBtnDe || '')}
                  onChange={(e) => _setEventsContent(adminContentLang === 'en' ? { ...eventsContent, ctaBtnEn: e.target.value } : { ...eventsContent, ctaBtnDe: e.target.value })}
                  placeholder={adminContentLang === 'en' ? 'Inquire for Private Events' : 'Event Anfragen'}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                />
              </div>

              {/* Event Image Picker */}
              <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-black text-[#1e382f] flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#d85c27]" />
                    <span>Event Feature Photo</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveGallerySection(activeGallerySection === 'events' ? null : 'events')}
                    className="text-[11px] font-bold text-[#d85c27] bg-white px-2.5 py-1 rounded-lg border border-[#ebdcd0]"
                  >
                    {activeGallerySection === 'events' ? 'Hide' : 'Browse Photos'}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-[#ebdcd0]">
                    {eventsContent.eventImage ? (
                      <img src={eventsContent.eventImage} alt="Event" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400 font-bold">No Img</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOptimizedImageUpload((url) => _setEventsContent({ ...eventsContent, eventImage: url }))}
                    className="bg-[#1e382f] text-white text-[12px] font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#d85c27]" /> Upload Photo
                  </button>
                </div>
                {activeGallerySection === 'events' && (
                  <div className="pt-2">
                    {renderGalleryPicker(
                      eventsContent.eventImage || '',
                      (url) => _setEventsContent({ ...eventsContent, eventImage: url }),
                      () => setActiveGallerySection(null)
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <button
                type="submit"
                className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-7 py-3 rounded-full text-[14px] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Events Page Content
              </button>
            </div>
          </form>
        )}

        {/* ═══════════════════════════════════════════════
            TAB 7: CONTACT US CONTENT
        ═══════════════════════════════════════════════ */}
        {activeTab === 'contact' && (
          <form onSubmit={handleSaveContact} className="bg-[#fffdfa] rounded-[24px] p-6 sm:p-8 border border-[#ebdcd0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-[20px] font-black text-[#1e382f] flex items-center gap-2.5">
                  <Phone className="w-5 h-5 text-[#d85c27]" />
                  <span>Contact Us & Table Reservation</span>
                </h2>
                <p className="text-[13px] text-[#666] mt-0.5">
                  Configure contact details, address, opening hours, and TheFork reservation widget.
                </p>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1.5 bg-[#fcf8f3] p-1.5 rounded-xl border border-[#ebdcd0] shrink-0">
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

            {/* Location Page Headline (MAATI Berlin) */}
            <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-2xl p-4 space-y-3">
              <div>
                <h3 className="text-[14px] font-black text-[#1e382f] mb-0.5 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-lg bg-[#1e382f] text-white text-[10px] font-black flex items-center justify-center">H</span>
                  Location Page Headline <span className="text-[11px] font-normal text-gray-500 ml-1">(currently: "MAATI Berlin")</span>
                </h3>
                <p className="text-[11.5px] text-gray-500 mb-2">
                  This is the big heading shown at the top of the Contact Us / Location page.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11.5px] font-bold text-[#333] mb-1">Headline (English)</label>
                  <input
                    type="text"
                    value={contactContent.locationHeadlineEn || ''}
                    onChange={(e) => _setContactContent({ ...contactContent, locationHeadlineEn: e.target.value })}
                    placeholder="MAATI Berlin"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[14px] font-black focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-bold text-[#333] mb-1">Headline (German)</label>
                  <input
                    type="text"
                    value={contactContent.locationHeadlineDe || ''}
                    onChange={(e) => _setContactContent({ ...contactContent, locationHeadlineDe: e.target.value })}
                    placeholder="MAATI Berlin"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[14px] font-black focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
              </div>
            </div>

            {/* Headline & Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Page Sub-Headline ({adminContentLang.toUpperCase()})</label>
                <input
                  type="text"
                  value={adminContentLang === 'en' ? (contactContent.headlineEn || '') : (contactContent.headlineDe || '')}
                  onChange={(e) => _setContactContent(adminContentLang === 'en' ? { ...contactContent, headlineEn: e.target.value } : { ...contactContent, headlineDe: e.target.value })}
                  placeholder={adminContentLang === 'en' ? 'Get in Touch' : 'Kontaktieren Sie uns'}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">
                  Opening Hours ({adminContentLang.toUpperCase()}) <span className="text-gray-400 font-normal">— one line per day</span>
                </label>
                <textarea
                  rows={3}
                  value={adminContentLang === 'en' ? (contactContent.openingHoursEn || '') : (contactContent.openingHoursDe || '')}
                  onChange={(e) => _setContactContent(adminContentLang === 'en' ? { ...contactContent, openingHoursEn: e.target.value } : { ...contactContent, openingHoursDe: e.target.value })}
                  placeholder={adminContentLang === 'en' ? 'Mon – Fri: 11:30 – 21:30\nSat: 12:00 – 21:00\nSun: Closed' : 'Mo – Fr: 11:30 – 21:30\nSa: 12:00 – 21:00\nSo: Geschlossen'}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27] resize-none font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[12px] font-bold text-[#333] mb-1">Description Text ({adminContentLang.toUpperCase()})</label>
                <textarea
                  rows={2}
                  value={adminContentLang === 'en' ? (contactContent.descEn || '') : (contactContent.descDe || '')}
                  onChange={(e) => _setContactContent(adminContentLang === 'en' ? { ...contactContent, descEn: e.target.value } : { ...contactContent, descDe: e.target.value })}
                  placeholder={adminContentLang === 'en' ? 'Have a question? We would love to hear from you.' : 'Haben Sie eine Frage? Wir freuen uns auf Sie.'}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27] resize-none"
                />
              </div>
            </div>

            {/* Direct Contact Info */}
            <div className="pt-2 border-t border-gray-100">
              <h3 className="text-[14px] font-bold text-[#1e382f] mb-3">Direct Contact Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={contactContent.phone || ''}
                    onChange={(e) => _setContactContent({ ...contactContent, phone: e.target.value })}
                    placeholder="+49 030 51891367"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={contactContent.email || ''}
                    onChange={(e) => _setContactContent({ ...contactContent, email: e.target.value })}
                    placeholder="hello@maatikitchen.com"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Full Street Address</label>
                  <input
                    type="text"
                    value={contactContent.address || ''}
                    onChange={(e) => _setContactContent({ ...contactContent, address: e.target.value })}
                    placeholder="Zimmerstraße 56, 10117 Berlin"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
              </div>
            </div>

            {/* TheFork Integration */}
            <div className="pt-2 border-t border-gray-100">
              <h3 className="text-[14px] font-bold text-[#1e382f] mb-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#00A680] text-white text-[10px] font-black flex items-center justify-center">TF</span>
                <span>TheFork Widget ID</span>
              </h3>
              <p className="text-[12px] text-gray-500 mb-2">
                TheFork restaurant UUID embedded in the online reservation popup.
              </p>
              <input
                type="text"
                value={contactContent.theforkWidgetId || ''}
                onChange={(e) => _setContactContent({ ...contactContent, theforkWidgetId: e.target.value })}
                placeholder="7beffe40-786f-496c-b196-48b939750c77"
                className="w-full font-mono text-[13px] border rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#d85c27]"
              />
            </div>

            <div className="pt-3 border-t border-gray-100">
              <button
                type="submit"
                className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-7 py-3 rounded-full text-[14px] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Contact Information
              </button>
            </div>
          </form>
        )}


        {/* ═══════════════════════════════════════════════
            TAB 8: PRINT / VISUAL MENU CARDS
        ═══════════════════════════════════════════════ */}
        {activeTab === 'printMenu' && (
          <form onSubmit={handleSavePrintMenu} className="bg-[#fffdfa] rounded-[24px] p-6 sm:p-8 border border-[#ebdcd0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-[20px] font-black text-[#1e382f] flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-[#d85c27]" />
                  <span>Visual Print Menu Preview Cards</span>
                </h2>
                <p className="text-[13px] text-[#666] mt-0.5">
                  Update the high-resolution menu card graphics, titles, descriptions, and download links shown at the bottom of the Menu page.
                </p>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1.5 bg-[#fcf8f3] p-1.5 rounded-xl border border-[#ebdcd0] shrink-0">
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

            {/* Section Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Badge Title ({adminContentLang.toUpperCase()})</label>
                <input
                  type="text"
                  value={adminContentLang === 'en' ? (printMenuContent.badgeEn || '') : (printMenuContent.badgeDe || '')}
                  onChange={(e) => _setPrintMenuContent(adminContentLang === 'en' ? { ...printMenuContent, badgeEn: e.target.value } : { ...printMenuContent, badgeDe: e.target.value })}
                  placeholder={adminContentLang === 'en' ? 'OFFICIAL PRINT MENU' : 'OFFIZIELLE SPEISEKARTE'}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Section Title ({adminContentLang.toUpperCase()})</label>
                <input
                  type="text"
                  value={adminContentLang === 'en' ? (printMenuContent.titleEn || '') : (printMenuContent.titleDe || '')}
                  onChange={(e) => _setPrintMenuContent(adminContentLang === 'en' ? { ...printMenuContent, titleEn: e.target.value } : { ...printMenuContent, titleDe: e.target.value })}
                  placeholder={adminContentLang === 'en' ? 'View Full Visual Menu' : 'Vollständige Speisekarte ansehen'}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#d85c27]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[12px] font-bold text-[#333] mb-1">Section Description ({adminContentLang.toUpperCase()})</label>
                <textarea
                  rows={2}
                  value={adminContentLang === 'en' ? (printMenuContent.descEn || '') : (printMenuContent.descDe || '')}
                  onChange={(e) => _setPrintMenuContent(adminContentLang === 'en' ? { ...printMenuContent, descEn: e.target.value } : { ...printMenuContent, descDe: e.target.value })}
                  placeholder={adminContentLang === 'en' ? 'Click on any page below to inspect or open...' : 'Klicken Sie auf eine der Seiten, um sie zu vergrößern...'}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27] resize-none"
                />
              </div>
            </div>

            {/* Menu Cards Editor (Page 1 & Page 2) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 border-t border-gray-100">
              
              {/* ── Page 1: Bowls & Naan ── */}
              <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-[15px] text-[#1e382f] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#1e382f] text-white text-[11px] flex items-center justify-center font-black">1</span>
                    <span>Menu Page 1 (Food / Bowls)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveGallerySection(activeGallerySection === 'print1' ? null : 'print1')}
                    className="text-[11px] font-bold text-[#d85c27] bg-white px-2.5 py-1 rounded-lg border border-[#ebdcd0]"
                  >
                    {activeGallerySection === 'print1' ? 'Hide Photos' : 'Browse Photos'}
                  </button>
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-gray-700 mb-1">Card Title ({adminContentLang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={adminContentLang === 'en' ? (printMenuContent.page1TitleEn || '') : (printMenuContent.page1TitleDe || '')}
                    onChange={(e) => _setPrintMenuContent(adminContentLang === 'en' ? { ...printMenuContent, page1TitleEn: e.target.value } : { ...printMenuContent, page1TitleDe: e.target.value })}
                    placeholder={adminContentLang === 'en' ? 'Page 1: Signature Bowls & Naan' : 'Seite 1: Bowls, Naan & Favoriten'}
                    className="w-full bg-white border rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-gray-700 mb-1">Card Description ({adminContentLang.toUpperCase()})</label>
                  <textarea
                    rows={2}
                    value={adminContentLang === 'en' ? (printMenuContent.page1DescEn || '') : (printMenuContent.page1DescDe || '')}
                    onChange={(e) => _setPrintMenuContent(adminContentLang === 'en' ? { ...printMenuContent, page1DescEn: e.target.value } : { ...printMenuContent, page1DescDe: e.target.value })}
                    placeholder={adminContentLang === 'en' ? 'All signature bowls, warm naan pockets...' : 'Alle Bowls, Naan-Taschen, Toppings...'}
                    className="w-full bg-white border rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#d85c27] resize-none"
                  />
                </div>

                {/* Page 1 Image & Upload */}
                <div className="space-y-2 pt-1">
                  <label className="block text-[11.5px] font-bold text-gray-700">Menu Page 1 Image</label>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-[#ebdcd0] shadow-xs">
                      {printMenuContent.page1Image ? (
                        <img src={printMenuContent.page1Image} alt="Page 1" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400 font-bold">No Img</div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <button
                        type="button"
                        onClick={() => handleOptimizedImageUpload((url) => _setPrintMenuContent({ ...printMenuContent, page1Image: url }))}
                        className="bg-[#1e382f] text-white text-[12px] font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-[#142620] transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#d85c27]" />
                        <span>Upload New Graphic</span>
                      </button>
                      <p className="text-[10.5px] text-gray-500">Auto-compressed PNG, JPEG, or WebP</p>
                    </div>
                  </div>

                  {activeGallerySection === 'print1' && (
                    <div className="pt-2">
                      {renderGalleryPicker(
                        printMenuContent.page1Image || '',
                        (url) => _setPrintMenuContent({ ...printMenuContent, page1Image: url }),
                        () => setActiveGallerySection(null)
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Page 2: Drinks & Desserts ── */}
              <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-[15px] text-[#1e382f] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#1e382f] text-white text-[11px] flex items-center justify-center font-black">2</span>
                    <span>Menu Page 2 (Drinks & Desserts)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveGallerySection(activeGallerySection === 'print2' ? null : 'print2')}
                    className="text-[11px] font-bold text-[#d85c27] bg-white px-2.5 py-1 rounded-lg border border-[#ebdcd0]"
                  >
                    {activeGallerySection === 'print2' ? 'Hide Photos' : 'Browse Photos'}
                  </button>
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-gray-700 mb-1">Card Title ({adminContentLang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={adminContentLang === 'en' ? (printMenuContent.page2TitleEn || '') : (printMenuContent.page2TitleDe || '')}
                    onChange={(e) => _setPrintMenuContent(adminContentLang === 'en' ? { ...printMenuContent, page2TitleEn: e.target.value } : { ...printMenuContent, page2TitleDe: e.target.value })}
                    placeholder={adminContentLang === 'en' ? 'Page 2: Lassis, Coffee & Craft Drinks' : 'Seite 2: Lassis, Kaffee & Drinks'}
                    className="w-full bg-white border rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-gray-700 mb-1">Card Description ({adminContentLang.toUpperCase()})</label>
                  <textarea
                    rows={2}
                    value={adminContentLang === 'en' ? (printMenuContent.page2DescEn || '') : (printMenuContent.page2DescDe || '')}
                    onChange={(e) => _setPrintMenuContent(adminContentLang === 'en' ? { ...printMenuContent, page2DescEn: e.target.value } : { ...printMenuContent, page2DescDe: e.target.value })}
                    placeholder={adminContentLang === 'en' ? 'Specialty Indian coffee, masala chai...' : 'Kaffeespezialitäten, Chai, hausgemachte Lassis...'}
                    className="w-full bg-white border rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>

                {/* Page 2 Image & Upload */}
                <div className="space-y-2 pt-1">
                  <label className="block text-[11.5px] font-bold text-gray-700">Menu Page 2 Image</label>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-[#ebdcd0] shadow-xs">
                      {printMenuContent.page2Image ? (
                        <img src={printMenuContent.page2Image} alt="Page 2" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400 font-bold">No Img</div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <button
                        type="button"
                        onClick={() => handleOptimizedImageUpload((url) => _setPrintMenuContent({ ...printMenuContent, page2Image: url }))}
                        className="bg-[#1e382f] text-white text-[12px] font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-[#142620] transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#d85c27]" />
                        <span>Upload New Graphic</span>
                      </button>
                      <p className="text-[10.5px] text-gray-500">Auto-compressed PNG, JPEG, or WebP</p>
                    </div>
                  </div>

                  {activeGallerySection === 'print2' && (
                    <div className="pt-2">
                      {renderGalleryPicker(
                        printMenuContent.page2Image || '',
                        (url) => _setPrintMenuContent({ ...printMenuContent, page2Image: url }),
                        () => setActiveGallerySection(null)
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="pt-3 border-t border-gray-100">
              <button
                type="submit"
                className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-7 py-3 rounded-full text-[14px] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Visual Menu Cards
              </button>
            </div>
          </form>
        )}

        {/* ═══════════════════════════════════════════════
            TAB 9: RECEIVED INQUIRIES & BOOKINGS
        ═══════════════════════════════════════════════ */}
        {activeTab === 'inquiries' && (
          <div className="bg-[#fffdfa] rounded-[24px] p-6 sm:p-8 border border-[#ebdcd0] shadow-sm space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-[20px] font-black text-[#1e382f] flex items-center gap-2.5">
                  <Inbox className="w-5 h-5 text-[#d85c27]" />
                  <span>Received Inquiries & Bookings</span>
                </h2>
                <p className="text-[13px] text-[#666] mt-0.5">
                  Review all catering requests, private event bookings, and general messages submitted via website forms.
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-[#fcf8f3] p-1.5 rounded-xl border border-[#ebdcd0] overflow-x-auto">
                {(['all', 'new', 'contacted', 'confirmed', 'archived'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setInquiriesFilter(filter)}
                    className={`px-3 py-1 text-[12px] font-extrabold rounded-lg capitalize transition-all ${
                      inquiriesFilter === filter ? 'bg-[#1e382f] text-white shadow-xs' : 'text-[#1e382f] hover:bg-gray-200/60'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {(() => {
              const filtered = inquiries.filter((it) => {
                if (inquiriesFilter === 'all') return true;
                return it.status === inquiriesFilter;
              });

              if (filtered.length === 0) {
                return (
                  <div className="py-16 text-center space-y-2">
                    <Inbox className="w-10 h-10 text-gray-300 mx-auto" />
                    <h3 className="font-bold text-[#1e382f] text-[16px]">No Inquiries Found</h3>
                    <p className="text-[13px] text-gray-500">
                      {inquiriesFilter === 'all'
                        ? 'New catering and event inquiries submitted by website visitors will appear here automatically.'
                        : `No inquiries with status "${inquiriesFilter}".`}
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {filtered.map((item) => {
                    const statusColors: Record<string, string> = {
                      new: 'bg-amber-100 text-amber-800 border-amber-300',
                      contacted: 'bg-blue-100 text-blue-800 border-blue-300',
                      confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                      archived: 'bg-gray-100 text-gray-600 border-gray-300',
                    };

                    return (
                      <div
                        key={item._id || item.id}
                        className="bg-white rounded-2xl p-6 border border-[#ebdcd0] shadow-xs space-y-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-[18px] font-black text-[#1e382f]">{item.name}</h3>
                              <span className="bg-[#d85c27]/10 text-[#d85c27] font-bold text-[11px] uppercase px-2.5 py-0.5 rounded-full">
                                {item.enquiryType || 'General'}
                              </span>
                              <span className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${statusColors[item.status || 'new'] || statusColors.new}`}>
                                {item.status || 'new'}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-[13px] text-gray-600">
                              <span>📅 Date: <strong>{item.date || 'TBD'}</strong></span>
                              <span>•</span>
                              <span>👥 Guests: <strong>{item.guests || '-'}</strong></span>
                              {item.company && (
                                <>
                                  <span>•</span>
                                  <span>🏢 {item.company}</span>
                                </>
                              )}
                              <span>•</span>
                              <span className="text-gray-400 text-[11.5px]">
                                {item.receivedAt ? new Date(item.receivedAt).toLocaleDateString() : 'Recent'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${item.phone}`}
                              className="px-3 py-1.5 rounded-xl border border-gray-200 text-[12px] font-bold text-[#1e382f] hover:bg-gray-50 flex items-center gap-1.5"
                            >
                              <Phone className="w-3.5 h-3.5 text-[#d85c27]" />
                              <span>{item.phone}</span>
                            </a>
                            <a
                              href={`mailto:${item.email}?subject=Regarding your MAATI Kitchen inquiry (${item.date || ''})`}
                              className="px-3 py-1.5 rounded-xl bg-[#1e382f] text-white text-[12px] font-bold hover:bg-[#142620] flex items-center gap-1.5 shadow-xs"
                            >
                              <Mail className="w-3.5 h-3.5 text-[#d85c27]" />
                              <span>Email Customer</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteInquiry(item._id || item.id)}
                              title="Delete Inquiry"
                              className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Customer Message */}
                        {item.message && (
                          <div className="bg-[#fcf8f3] p-3.5 rounded-xl border border-[#ebdcd0] text-[13.5px] text-[#333] leading-relaxed">
                            <span className="text-[11px] font-bold text-[#d85c27] block mb-0.5">CUSTOMER NOTE:</span>
                            {item.message}
                          </div>
                        )}

                        {/* Manager Controls: Status & Notes */}
                        <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-bold text-gray-600">Update Status:</span>
                            <select
                              value={item.status || 'new'}
                              onChange={(e) => handleUpdateInquiryStatus(item._id || item.id, e.target.value)}
                              className="border border-gray-200 rounded-lg px-2.5 py-1 text-[12px] font-bold text-[#1e382f] bg-white focus:outline-none focus:border-[#d85c27]"
                            >
                              <option value="new">🟡 New / Unread</option>
                              <option value="contacted">🔵 Contacted</option>
                              <option value="confirmed">🟢 Confirmed / Booked</option>
                              <option value="archived">⚪ Archived</option>
                            </select>
                          </div>

                          <div className="flex-1 md:max-w-[420px]">
                            {editingNoteId === (item._id || item.id) ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={noteDraft}
                                  onChange={(e) => setNoteDraft(e.target.value)}
                                  placeholder="Add manager internal note (e.g. sent quote €45/head)..."
                                  className="w-full text-[12px] border rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#d85c27]"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveInquiryNote(item._id || item.id)}
                                  className="bg-[#1e382f] text-white text-[11px] font-bold px-3 py-1 rounded-lg shrink-0"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingNoteId(null)}
                                  className="text-gray-400 hover:text-gray-600 text-[11px] shrink-0"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between gap-2 text-[12px] text-gray-600">
                                <span className="truncate italic">
                                  {item.managerNotes ? `Note: "${item.managerNotes}"` : 'No internal note yet.'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingNoteId(item._id || item.id);
                                    setNoteDraft(item.managerNotes || '');
                                  }}
                                  className="text-[#d85c27] hover:underline font-bold text-[11px] shrink-0"
                                >
                                  {item.managerNotes ? 'Edit Note' : '+ Add Note'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            TAB 10: RECEIVED JOB APPLICATIONS
        ═══════════════════════════════════════════════ */}
        {activeTab === 'applications' && (
          <div className="bg-[#fffdfa] rounded-[24px] p-6 sm:p-8 border border-[#ebdcd0] shadow-sm space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-[20px] font-black text-[#1e382f] flex items-center gap-2.5">
                  <Briefcase className="w-5 h-5 text-[#d85c27]" />
                  <span>Job Applications (Careers)</span>
                </h2>
                <p className="text-[13px] text-[#666] mt-0.5">
                  Review incoming applications submitted for Service, Kitchen, and general vacancies.
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-[#fcf8f3] p-1.5 rounded-xl border border-[#ebdcd0] overflow-x-auto">
                {(['all', 'new', 'reviewing', 'interview', 'hired', 'rejected'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setApplicationsFilter(filter)}
                    className={`px-3 py-1 text-[12px] font-extrabold rounded-lg capitalize transition-all ${
                      applicationsFilter === filter ? 'bg-[#1e382f] text-white shadow-xs' : 'text-[#1e382f] hover:bg-gray-200/60'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {(() => {
              const filtered = applications.filter((it) => {
                if (applicationsFilter === 'all') return true;
                return it.status === applicationsFilter;
              });

              if (filtered.length === 0) {
                return (
                  <div className="py-16 text-center space-y-2">
                    <Briefcase className="w-10 h-10 text-gray-300 mx-auto" />
                    <h3 className="font-bold text-[#1e382f] text-[16px]">No Applications Found</h3>
                    <p className="text-[13px] text-gray-500">
                      {applicationsFilter === 'all'
                        ? 'Job applicants submitting through the careers page will appear here.'
                        : `No candidate applications with status "${applicationsFilter}".`}
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {filtered.map((item) => {
                    const statusColors: Record<string, string> = {
                      new: 'bg-amber-100 text-amber-800 border-amber-300',
                      reviewing: 'bg-blue-100 text-blue-800 border-blue-300',
                      interview: 'bg-purple-100 text-purple-800 border-purple-300',
                      hired: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                      rejected: 'bg-rose-100 text-rose-800 border-rose-300',
                    };

                    return (
                      <div
                        key={item._id || item.id}
                        className="bg-white rounded-2xl p-6 border border-[#ebdcd0] shadow-xs space-y-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-[18px] font-black text-[#1e382f]">{item.fullName}</h3>
                              <span className="bg-[#1e382f]/10 text-[#1e382f] font-bold text-[11px] px-2.5 py-0.5 rounded-full">
                                {item.position}
                              </span>
                              <span className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${statusColors[item.status || 'new'] || statusColors.new}`}>
                                {item.status || 'new'}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-[13px] text-gray-600">
                              {item.availability && <span>⏱ Available: <strong>{item.availability}</strong></span>}
                              {item.experienceYears && (
                                <>
                                  <span>•</span>
                                  <span>💼 Experience: <strong>{item.experienceYears}</strong></span>
                                </>
                              )}
                              <span>•</span>
                              <span className="text-gray-400 text-[11.5px]">
                                {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'Recent'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${item.phone}`}
                              className="px-3 py-1.5 rounded-xl border border-gray-200 text-[12px] font-bold text-[#1e382f] hover:bg-gray-50 flex items-center gap-1.5"
                            >
                              <Phone className="w-3.5 h-3.5 text-[#d85c27]" />
                              <span>{item.phone}</span>
                            </a>
                            <a
                              href={`mailto:${item.email}?subject=Bewerbung bei MAATI Kitchen: ${item.position}`}
                              className="px-3 py-1.5 rounded-xl bg-[#1e382f] text-white text-[12px] font-bold hover:bg-[#142620] flex items-center gap-1.5 shadow-xs"
                            >
                              <Mail className="w-3.5 h-3.5 text-[#d85c27]" />
                              <span>Email Candidate</span>
                            </a>
                            {item.resumeLink && (
                              <a
                                href={item.resumeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-[#d85c27] text-white text-[12px] font-bold hover:bg-[#c24f1c] flex items-center gap-1.5 shadow-xs"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>View Resume</span>
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteApplication(item._id || item.id)}
                              title="Delete Application"
                              className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Candidate Intro */}
                        {item.message && (
                          <div className="bg-[#fcf8f3] p-3.5 rounded-xl border border-[#ebdcd0] text-[13.5px] text-[#333] leading-relaxed">
                            <span className="text-[11px] font-bold text-[#d85c27] block mb-0.5">COVER NOTE:</span>
                            {item.message}
                          </div>
                        )}

                        {/* HR Controls: Status & Notes */}
                        <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-bold text-gray-600">Update Status:</span>
                            <select
                              value={item.status || 'new'}
                              onChange={(e) => handleUpdateApplicationStatus(item._id || item.id, e.target.value)}
                              className="border border-gray-200 rounded-lg px-2.5 py-1 text-[12px] font-bold text-[#1e382f] bg-white focus:outline-none focus:border-[#d85c27]"
                            >
                              <option value="new">🟡 New / Unreviewed</option>
                              <option value="reviewing">🔵 Under Review</option>
                              <option value="interview">🟣 Interview Scheduled</option>
                              <option value="hired">🟢 Hired</option>
                              <option value="rejected">🔴 Not Selected</option>
                            </select>
                          </div>

                          <div className="flex-1 md:max-w-[420px]">
                            {editingNoteId === (item._id || item.id) ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={noteDraft}
                                  onChange={(e) => setNoteDraft(e.target.value)}
                                  placeholder="Add HR / interview feedback note..."
                                  className="w-full text-[12px] border rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#d85c27]"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveApplicationNote(item._id || item.id)}
                                  className="bg-[#1e382f] text-white text-[11px] font-bold px-3 py-1 rounded-lg shrink-0"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingNoteId(null)}
                                  className="text-gray-400 hover:text-gray-600 text-[11px] shrink-0"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between gap-2 text-[12px] text-gray-600">
                                <span className="truncate italic">
                                  {item.hrNotes ? `HR Note: "${item.hrNotes}"` : 'No HR interview note yet.'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingNoteId(item._id || item.id);
                                    setNoteDraft(item.hrNotes || '');
                                  }}
                                  className="text-[#d85c27] hover:underline font-bold text-[11px] shrink-0"
                                >
                                  {item.hrNotes ? 'Edit HR Note' : '+ Add HR Note'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            TAB 11: CATERING PAGE CONTENT & PACKAGES
        ═══════════════════════════════════════════════ */}
        {activeTab === 'catering' && (
          <form onSubmit={handleSaveCatering} className="bg-[#fffdfa] rounded-[24px] p-6 sm:p-8 border border-[#ebdcd0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-[20px] font-black text-[#1e382f] flex items-center gap-2.5">
                  <Layers className="w-5 h-5 text-[#d85c27]" />
                  <span>Catering Page Content, Packages & Pricing</span>
                </h2>
                <p className="text-[13px] text-[#666] mt-0.5">
                  Update your corporate packages, guest calculator rates, FAQs, and delivery lead times.
                </p>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1.5 bg-[#fcf8f3] p-1.5 rounded-xl border border-[#ebdcd0] shrink-0">
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

            {/* Hero Section */}
            <div className="space-y-4">
              <h3 className="text-[14px] font-extrabold text-[#1e382f] uppercase tracking-wider">1. Hero Section</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Badge / Tagline ({adminContentLang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={adminContentLang === 'en' ? (cateringContent.badgeEn || '') : (cateringContent.badgeDe || '')}
                    onChange={(e) => _setCateringContent(adminContentLang === 'en' ? { ...cateringContent, badgeEn: e.target.value } : { ...cateringContent, badgeDe: e.target.value })}
                    placeholder="e.g. MAATI CATERING BERLIN MITTE"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Lead Time Notice ({adminContentLang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={adminContentLang === 'en' ? (cateringContent.leadTimeEn || '') : (cateringContent.leadTimeDe || '')}
                    onChange={(e) => _setCateringContent(adminContentLang === 'en' ? { ...cateringContent, leadTimeEn: e.target.value } : { ...cateringContent, leadTimeDe: e.target.value })}
                    placeholder="e.g. 24 to 48 hours recommended..."
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Hero Title ({adminContentLang.toUpperCase()})</label>
                <input
                  type="text"
                  value={adminContentLang === 'en' ? (cateringContent.heroTitleEn || '') : (cateringContent.heroTitleDe || '')}
                  onChange={(e) => _setCateringContent(adminContentLang === 'en' ? { ...cateringContent, heroTitleEn: e.target.value } : { ...cateringContent, heroTitleDe: e.target.value })}
                  placeholder="e.g. Corporate Catering That Brings Teams Together"
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[14px] font-bold focus:outline-none focus:border-[#d85c27]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Hero Description ({adminContentLang.toUpperCase()})</label>
                <textarea
                  rows={2}
                  value={adminContentLang === 'en' ? (cateringContent.heroDescEn || '') : (cateringContent.heroDescDe || '')}
                  onChange={(e) => _setCateringContent(adminContentLang === 'en' ? { ...cateringContent, heroDescEn: e.target.value } : { ...cateringContent, heroDescDe: e.target.value })}
                  placeholder="e.g. Vibrant Indian bowls, toasted naan pockets..."
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27] resize-none"
                />
              </div>
            </div>

            {/* Packages Section */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-extrabold text-[#1e382f] uppercase tracking-wider">2. Catering Packages ({cateringContent.packages?.length || 0})</h3>
                  <p className="text-[12px] text-gray-500">Tiered packages displayed in the packages grid & used for automatic budget calculation.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newPkg: CateringPackageItem = {
                      id: 'pkg_' + Date.now(),
                      name: 'New Package',
                      nameDe: 'Neues Paket',
                      price: '€12.90',
                      priceDetailEn: 'per person',
                      priceDetailDe: 'pro Person',
                      pricePerPerson: 12.90,
                      minGuests: 10,
                      suitableForEn: 'Casual meetings & team gatherings',
                      suitableForDe: 'Meetings & Team-Events',
                      featuresEn: ['Signature bowls', 'Fresh chutneys', 'Eco cutlery'],
                      featuresDe: ['Signature Bowls', 'Hausgemachte Chutneys', 'Bio-Besteck']
                    };
                    _setCateringContent({
                      ...cateringContent,
                      packages: [...(cateringContent.packages || []), newPkg]
                    });
                  }}
                  className="bg-[#1e382f] hover:bg-[#2a4d41] text-white text-[12px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Package</span>
                </button>
              </div>

              <div className="space-y-4">
                {(cateringContent.packages || []).map((pkg, idx) => (
                  <div key={pkg.id || idx} className="bg-[#fcf8f3] rounded-2xl p-5 border border-[#ebdcd0] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#d85c27] text-white text-[11px] font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={adminContentLang === 'en' ? pkg.name : (pkg.nameDe || pkg.name)}
                          onChange={(e) => {
                            const updated = [...(cateringContent.packages || [])];
                            updated[idx] = adminContentLang === 'en'
                              ? { ...updated[idx], name: e.target.value }
                              : { ...updated[idx], nameDe: e.target.value };
                            _setCateringContent({ ...cateringContent, packages: updated });
                          }}
                          className="font-black text-[15px] text-[#1e382f] border-b border-dashed border-[#d85c27] bg-transparent focus:outline-none"
                          placeholder="Package Name"
                        />
                        {pkg.popular && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                            Most Popular
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-[11px] font-bold text-gray-600 flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!pkg.popular}
                            onChange={(e) => {
                              const updated = [...(cateringContent.packages || [])];
                              updated[idx] = { ...updated[idx], popular: e.target.checked };
                              _setCateringContent({ ...cateringContent, packages: updated });
                            }}
                            className="rounded text-[#d85c27]"
                          />
                          Popular Badge
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            if (!window.confirm(`Delete package "${pkg.name}"?`)) return;
                            const updated = (cateringContent.packages || []).filter((_, i) => i !== idx);
                            _setCateringContent({ ...cateringContent, packages: updated });
                          }}
                          className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-white"
                          title="Delete package"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Price Per Person (€)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={pkg.pricePerPerson}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            const updated = [...(cateringContent.packages || [])];
                            updated[idx] = {
                              ...updated[idx],
                              pricePerPerson: val,
                              price: `€${val.toFixed(2).replace('.', ',')}`
                            };
                            _setCateringContent({ ...cateringContent, packages: updated });
                          }}
                          className="w-full border rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:border-[#d85c27]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Min Guests</label>
                        <input
                          type="number"
                          value={pkg.minGuests || 10}
                          onChange={(e) => {
                            const updated = [...(cateringContent.packages || [])];
                            updated[idx] = { ...updated[idx], minGuests: parseInt(e.target.value) || 1 };
                            _setCateringContent({ ...cateringContent, packages: updated });
                          }}
                          className="w-full border rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:border-[#d85c27]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Suitable For Tag ({adminContentLang.toUpperCase()})</label>
                        <input
                          type="text"
                          value={adminContentLang === 'en' ? (pkg.suitableForEn || '') : (pkg.suitableForDe || '')}
                          onChange={(e) => {
                            const updated = [...(cateringContent.packages || [])];
                            updated[idx] = adminContentLang === 'en'
                              ? { ...updated[idx], suitableForEn: e.target.value }
                              : { ...updated[idx], suitableForDe: e.target.value };
                            _setCateringContent({ ...cateringContent, packages: updated });
                          }}
                          placeholder="e.g. Team lunches & workshops"
                          className="w-full border rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:border-[#d85c27]"
                        />
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-gray-600">Features / Bullet Points ({adminContentLang.toUpperCase()}):</label>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(cateringContent.packages || [])];
                            const currentFeatures = adminContentLang === 'en' ? (updated[idx].featuresEn || []) : (updated[idx].featuresDe || []);
                            if (adminContentLang === 'en') {
                              updated[idx] = { ...updated[idx], featuresEn: [...currentFeatures, 'New feature item'] };
                            } else {
                              updated[idx] = { ...updated[idx], featuresDe: [...currentFeatures, 'Neuer Punkt'] };
                            }
                            _setCateringContent({ ...cateringContent, packages: updated });
                          }}
                          className="text-[#d85c27] text-[11px] font-bold hover:underline"
                        >
                          + Add Feature
                        </button>
                      </div>
                      {(adminContentLang === 'en' ? (pkg.featuresEn || []) : (pkg.featuresDe || [])).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={feat}
                            onChange={(e) => {
                              const updated = [...(cateringContent.packages || [])];
                              if (adminContentLang === 'en') {
                                const list = [...(updated[idx].featuresEn || [])];
                                list[fIdx] = e.target.value;
                                updated[idx] = { ...updated[idx], featuresEn: list };
                              } else {
                                const list = [...(updated[idx].featuresDe || [])];
                                list[fIdx] = e.target.value;
                                updated[idx] = { ...updated[idx], featuresDe: list };
                              }
                              _setCateringContent({ ...cateringContent, packages: updated });
                            }}
                            className="w-full border rounded-lg px-3 py-1.5 text-[12.5px] bg-white focus:outline-none focus:border-[#d85c27]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(cateringContent.packages || [])];
                              if (adminContentLang === 'en') {
                                updated[idx] = { ...updated[idx], featuresEn: (updated[idx].featuresEn || []).filter((_, i) => i !== fIdx) };
                              } else {
                                updated[idx] = { ...updated[idx], featuresDe: (updated[idx].featuresDe || []).filter((_, i) => i !== fIdx) };
                              }
                              _setCateringContent({ ...cateringContent, packages: updated });
                            }}
                            className="text-gray-400 hover:text-rose-600 p-1"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs Section */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-extrabold text-[#1e382f] uppercase tracking-wider">3. Frequently Asked Questions ({cateringContent.faqs?.length || 0})</h3>
                  <p className="text-[12px] text-gray-500">Accordion questions answered directly on the Catering page.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newFaq: CateringFaqItem = {
                      qEn: 'New Question?',
                      qDe: 'Neue Frage?',
                      aEn: 'Answer details here...',
                      aDe: 'Antwortdetails hier...'
                    };
                    _setCateringContent({
                      ...cateringContent,
                      faqs: [...(cateringContent.faqs || []), newFaq]
                    });
                  }}
                  className="bg-[#1e382f] hover:bg-[#2a4d41] text-white text-[12px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-3">
                {(cateringContent.faqs || []).map((faq, fIdx) => (
                  <div key={fIdx} className="bg-white rounded-xl p-4 border border-[#ebdcd0] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={adminContentLang === 'en' ? faq.qEn : faq.qDe}
                        onChange={(e) => {
                          const updated = [...(cateringContent.faqs || [])];
                          updated[fIdx] = adminContentLang === 'en'
                            ? { ...updated[fIdx], qEn: e.target.value }
                            : { ...updated[fIdx], qDe: e.target.value };
                          _setCateringContent({ ...cateringContent, faqs: updated });
                        }}
                        placeholder="Question"
                        className="font-bold text-[13.5px] text-[#1e382f] w-full border-b border-gray-200 pb-1 focus:outline-none focus:border-[#d85c27]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (cateringContent.faqs || []).filter((_, i) => i !== fIdx);
                          _setCateringContent({ ...cateringContent, faqs: updated });
                        }}
                        className="text-gray-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={adminContentLang === 'en' ? faq.aEn : faq.aDe}
                      onChange={(e) => {
                        const updated = [...(cateringContent.faqs || [])];
                        updated[fIdx] = adminContentLang === 'en'
                          ? { ...updated[fIdx], aEn: e.target.value }
                          : { ...updated[fIdx], aDe: e.target.value };
                        _setCateringContent({ ...cateringContent, faqs: updated });
                      }}
                      placeholder="Answer"
                      className="w-full text-[12.5px] text-gray-700 border rounded-lg p-2 focus:outline-none focus:border-[#d85c27] resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <button
                type="submit"
                className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-7 py-3 rounded-full text-[14px] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Catering Content & Pricing
              </button>
            </div>
          </form>
        )}

        {/* ═══════════════════════════════════════════════
            TAB 12: CAREERS / JOBS PAGE CONTENT
        ═══════════════════════════════════════════════ */}
        {activeTab === 'jobs' && (
          <form onSubmit={handleSaveJobs} className="bg-[#fffdfa] rounded-[24px] p-6 sm:p-8 border border-[#ebdcd0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-[20px] font-black text-[#1e382f] flex items-center gap-2.5">
                  <Briefcase className="w-5 h-5 text-[#d85c27]" />
                  <span>Careers & Job Openings Management</span>
                </h2>
                <p className="text-[13px] text-[#666] mt-0.5">
                  Add, edit, or toggle job vacancies live on the website. Candidates can apply online directly.
                </p>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1.5 bg-[#fcf8f3] p-1.5 rounded-xl border border-[#ebdcd0] shrink-0">
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

            {/* Hero Section */}
            <div className="space-y-4">
              <h3 className="text-[14px] font-extrabold text-[#1e382f] uppercase tracking-wider">1. Careers Hero Header</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Badge ({adminContentLang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={adminContentLang === 'en' ? (jobsContent.badgeEn || '') : (jobsContent.badgeDe || '')}
                    onChange={(e) => _setJobsContent(adminContentLang === 'en' ? { ...jobsContent, badgeEn: e.target.value } : { ...jobsContent, badgeDe: e.target.value })}
                    placeholder="e.g. CAREERS AT MAATI"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Culture Section Title ({adminContentLang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={adminContentLang === 'en' ? (jobsContent.cultureTitleEn || '') : (jobsContent.cultureTitleDe || '')}
                    onChange={(e) => _setJobsContent(adminContentLang === 'en' ? { ...jobsContent, cultureTitleEn: e.target.value } : { ...jobsContent, cultureTitleDe: e.target.value })}
                    placeholder="e.g. More Than Just A Restaurant Job"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Hero Title ({adminContentLang.toUpperCase()})</label>
                <input
                  type="text"
                  value={adminContentLang === 'en' ? (jobsContent.heroTitleEn || '') : (jobsContent.heroTitleDe || '')}
                  onChange={(e) => _setJobsContent(adminContentLang === 'en' ? { ...jobsContent, heroTitleEn: e.target.value } : { ...jobsContent, heroTitleDe: e.target.value })}
                  placeholder="e.g. Put Down Roots With Us. Shape Berlin Dining."
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[14px] font-bold focus:outline-none focus:border-[#d85c27]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Hero Tagline ({adminContentLang.toUpperCase()})</label>
                <textarea
                  rows={2}
                  value={adminContentLang === 'en' ? (jobsContent.heroDescEn || '') : (jobsContent.heroDescDe || '')}
                  onChange={(e) => _setJobsContent(adminContentLang === 'en' ? { ...jobsContent, heroDescEn: e.target.value } : { ...jobsContent, heroDescDe: e.target.value })}
                  placeholder="e.g. We are looking for dedicated individuals who care about honest Indian soul food..."
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27] resize-none"
                />
              </div>
            </div>

            {/* Job Openings Manager */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-extrabold text-[#1e382f] uppercase tracking-wider">
                    2. Active Job Postings ({jobsContent.jobs?.length || 0})
                  </h3>
                  <p className="text-[12px] text-gray-500">
                    Easily turn positions on/off with 1-click. Applicants submit their CV and info directly to your Studio.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newJob: JobOpeningItem = {
                      id: 'job_' + Date.now(),
                      department: 'service',
                      deptLabelEn: 'Service & Hospitality',
                      deptLabelDe: 'Service & Gastronomie',
                      titleEn: 'Service Crew / Barista (f/m/d)',
                      titleDe: 'Servicekraft / Barista (w/m/d)',
                      typeEn: 'Part-Time / Full-Time',
                      typeDe: 'Teilzeit / Vollzeit',
                      location: 'Berlin Mitte (Zimmerstraße 56)',
                      summaryEn: 'Be the welcoming face of MAATI, serving hot bowls, chai, and smiles.',
                      summaryDe: 'Begrüße unsere Gäste mit einem Lächeln und serviere Chai und frische Bowls.',
                      responsibilitiesEn: [
                        'Welcoming guests and taking orders with warmth',
                        'Preparing specialty coffees, chais, and fresh lassis',
                        'Maintaining pristine dining room cleanliness'
                      ],
                      responsibilitiesDe: [
                        'Herzliche Gästebetreuung und Aufnahme von Bestellungen',
                        'Zubereitung von Kaffeespezialitäten, Chai & Lassis',
                        'Sicherstellung von Sauberkeit und Ordnung im Gastraum'
                      ],
                      offerEn: 'Fair wages, free staff meal per shift, warm team culture',
                      offerDe: 'Faires Gehalt, kostenlose Schichtverpflegung, herzliches Team',
                      active: true
                    };
                    _setJobsContent({
                      ...jobsContent,
                      jobs: [...(jobsContent.jobs || []), newJob]
                    });
                  }}
                  className="bg-[#1e382f] hover:bg-[#2a4d41] text-white text-[12px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Job Posting</span>
                </button>
              </div>

              <div className="space-y-4">
                {(jobsContent.jobs || []).map((job, jIdx) => (
                  <div key={job.id || jIdx} className="bg-[#fcf8f3] rounded-2xl p-5 border border-[#ebdcd0] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(jobsContent.jobs || [])];
                            updated[jIdx] = { ...updated[jIdx], active: !updated[jIdx].active };
                            _setJobsContent({ ...jobsContent, jobs: updated });
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black transition-all ${
                            job.active
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {job.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{job.active ? 'Active (Live)' : 'Draft (Hidden)'}</span>
                        </button>
                        <input
                          type="text"
                          value={adminContentLang === 'en' ? job.titleEn : job.titleDe}
                          onChange={(e) => {
                            const updated = [...(jobsContent.jobs || [])];
                            updated[jIdx] = adminContentLang === 'en'
                              ? { ...updated[jIdx], titleEn: e.target.value }
                              : { ...updated[jIdx], titleDe: e.target.value };
                            _setJobsContent({ ...jobsContent, jobs: updated });
                          }}
                          placeholder="Job Title"
                          className="font-black text-[16px] text-[#1e382f] bg-transparent border-b border-dashed border-[#d85c27] focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!window.confirm(`Delete job opening "${job.titleEn}"?`)) return;
                            const updated = (jobsContent.jobs || []).filter((_, i) => i !== jIdx);
                            _setJobsContent({ ...jobsContent, jobs: updated });
                          }}
                          className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-white"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Department</label>
                        <select
                          value={job.department}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            const labels: Record<string, { en: string; de: string }> = {
                              management: { en: 'Management & Leadership', de: 'Management & Leitung' },
                              service: { en: 'Service & Hospitality', de: 'Service & Gastronomie' },
                              kitchen: { en: 'Kitchen & Prep', de: 'Küche & Zubereitung' },
                              general: { en: 'General / All Departments', de: 'Allgemein' }
                            };
                            const updated = [...(jobsContent.jobs || [])];
                            updated[jIdx] = {
                              ...updated[jIdx],
                              department: val,
                              deptLabelEn: labels[val]?.en || 'Department',
                              deptLabelDe: labels[val]?.de || 'Abteilung'
                            };
                            _setJobsContent({ ...jobsContent, jobs: updated });
                          }}
                          className="w-full border rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:border-[#d85c27]"
                        >
                          <option value="management">Management & Leadership</option>
                          <option value="service">Service & Hospitality</option>
                          <option value="kitchen">Kitchen & Prep</option>
                          <option value="general">General / All Departments</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Type ({adminContentLang.toUpperCase()})</label>
                        <input
                          type="text"
                          value={adminContentLang === 'en' ? job.typeEn : job.typeDe}
                          onChange={(e) => {
                            const updated = [...(jobsContent.jobs || [])];
                            updated[jIdx] = adminContentLang === 'en'
                              ? { ...updated[jIdx], typeEn: e.target.value }
                              : { ...updated[jIdx], typeDe: e.target.value };
                            _setJobsContent({ ...jobsContent, jobs: updated });
                          }}
                          placeholder="e.g. Full-Time / Teilzeit"
                          className="w-full border rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:border-[#d85c27]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Location</label>
                        <input
                          type="text"
                          value={job.location || 'Berlin Mitte (Zimmerstraße 56)'}
                          onChange={(e) => {
                            const updated = [...(jobsContent.jobs || [])];
                            updated[jIdx] = { ...updated[jIdx], location: e.target.value };
                            _setJobsContent({ ...jobsContent, jobs: updated });
                          }}
                          className="w-full border rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:border-[#d85c27]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">Short Summary ({adminContentLang.toUpperCase()})</label>
                      <input
                        type="text"
                        value={adminContentLang === 'en' ? (job.summaryEn || '') : (job.summaryDe || '')}
                        onChange={(e) => {
                          const updated = [...(jobsContent.jobs || [])];
                          updated[jIdx] = adminContentLang === 'en'
                            ? { ...updated[jIdx], summaryEn: e.target.value }
                            : { ...updated[jIdx], summaryDe: e.target.value };
                          _setJobsContent({ ...jobsContent, jobs: updated });
                        }}
                        className="w-full border rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:border-[#d85c27]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">What We Offer / Perks ({adminContentLang.toUpperCase()})</label>
                      <input
                        type="text"
                        value={adminContentLang === 'en' ? (job.offerEn || '') : (job.offerDe || '')}
                        onChange={(e) => {
                          const updated = [...(jobsContent.jobs || [])];
                          updated[jIdx] = adminContentLang === 'en'
                            ? { ...updated[jIdx], offerEn: e.target.value }
                            : { ...updated[jIdx], offerDe: e.target.value };
                          _setJobsContent({ ...jobsContent, jobs: updated });
                        }}
                        placeholder="e.g. Fair wages, free meals, career growth"
                        className="w-full border rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:border-[#d85c27]"
                      />
                    </div>

                    {/* Responsibilities list */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-gray-600">Key Tasks / Requirements ({adminContentLang.toUpperCase()}):</label>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(jobsContent.jobs || [])];
                            if (adminContentLang === 'en') {
                              updated[jIdx] = { ...updated[jIdx], responsibilitiesEn: [...(updated[jIdx].responsibilitiesEn || []), 'New responsibility'] };
                            } else {
                              updated[jIdx] = { ...updated[jIdx], responsibilitiesDe: [...(updated[jIdx].responsibilitiesDe || []), 'Neue Aufgabe'] };
                            }
                            _setJobsContent({ ...jobsContent, jobs: updated });
                          }}
                          className="text-[#d85c27] text-[11px] font-bold hover:underline"
                        >
                          + Add Task
                        </button>
                      </div>
                      {(adminContentLang === 'en' ? (job.responsibilitiesEn || []) : (job.responsibilitiesDe || [])).map((resp, rIdx) => (
                        <div key={rIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={resp}
                            onChange={(e) => {
                              const updated = [...(jobsContent.jobs || [])];
                              if (adminContentLang === 'en') {
                                const list = [...(updated[jIdx].responsibilitiesEn || [])];
                                list[rIdx] = e.target.value;
                                updated[jIdx] = { ...updated[jIdx], responsibilitiesEn: list };
                              } else {
                                const list = [...(updated[jIdx].responsibilitiesDe || [])];
                                list[rIdx] = e.target.value;
                                updated[jIdx] = { ...updated[jIdx], responsibilitiesDe: list };
                              }
                              _setJobsContent({ ...jobsContent, jobs: updated });
                            }}
                            className="w-full border rounded-lg px-3 py-1.5 text-[12.5px] bg-white focus:outline-none focus:border-[#d85c27]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(jobsContent.jobs || [])];
                              if (adminContentLang === 'en') {
                                updated[jIdx] = { ...updated[jIdx], responsibilitiesEn: (updated[jIdx].responsibilitiesEn || []).filter((_, i) => i !== rIdx) };
                              } else {
                                updated[jIdx] = { ...updated[jIdx], responsibilitiesDe: (updated[jIdx].responsibilitiesDe || []).filter((_, i) => i !== rIdx) };
                              }
                              _setJobsContent({ ...jobsContent, jobs: updated });
                            }}
                            className="text-gray-400 hover:text-rose-600 p-1"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <button
                type="submit"
                className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-7 py-3 rounded-full text-[14px] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Careers Page & Job Postings
              </button>
            </div>
          </form>
        )}

        {/* ═══════════════════════════════════════════════
            TAB 13: ABOUT US & BRAND STORY CONTENT
        ═══════════════════════════════════════════════ */}
        {activeTab === 'about' && (
          <form onSubmit={handleSaveAbout} className="bg-[#fffdfa] rounded-[24px] p-6 sm:p-8 border border-[#ebdcd0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-[20px] font-black text-[#1e382f] flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-[#d85c27]" />
                  <span>About Us & Brand Story Content</span>
                </h2>
                <p className="text-[13px] text-[#666] mt-0.5">
                  Edit the philosophy of MAATI, your story, core values, and the meaning of soil & clay.
                </p>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1.5 bg-[#fcf8f3] p-1.5 rounded-xl border border-[#ebdcd0] shrink-0">
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

            {/* Header / Hero */}
            <div className="space-y-4">
              <h3 className="text-[14px] font-extrabold text-[#1e382f] uppercase tracking-wider">1. Hero Section</h3>
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Headline ({adminContentLang.toUpperCase()})</label>
                <input
                  type="text"
                  value={adminContentLang === 'en' ? (aboutContent.heroTitleEn || '') : (aboutContent.heroTitleDe || '')}
                  onChange={(e) => _setAboutContent(adminContentLang === 'en' ? { ...aboutContent, heroTitleEn: e.target.value } : { ...aboutContent, heroTitleDe: e.target.value })}
                  placeholder="The Story Behind MAATI"
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[14px] font-bold focus:outline-none focus:border-[#d85c27]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Hero Subtitle ({adminContentLang.toUpperCase()})</label>
                <textarea
                  rows={2}
                  value={adminContentLang === 'en' ? (aboutContent.heroSubtitleEn || '') : (aboutContent.heroSubtitleDe || '')}
                  onChange={(e) => _setAboutContent(adminContentLang === 'en' ? { ...aboutContent, heroSubtitleEn: e.target.value } : { ...aboutContent, heroSubtitleDe: e.target.value })}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27] resize-none"
                />
              </div>
            </div>

            {/* Main Brand Story */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-[14px] font-extrabold text-[#1e382f] uppercase tracking-wider">2. Our Story Section</h3>
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Section Title ({adminContentLang.toUpperCase()})</label>
                <input
                  type="text"
                  value={adminContentLang === 'en' ? (aboutContent.storyTitleEn || '') : (aboutContent.storyTitleDe || '')}
                  onChange={(e) => _setAboutContent(adminContentLang === 'en' ? { ...aboutContent, storyTitleEn: e.target.value } : { ...aboutContent, storyTitleDe: e.target.value })}
                  placeholder="Rooted in Indian Heritage, Made for Berlin"
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[14px] font-bold focus:outline-none focus:border-[#d85c27]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Story Paragraph 1 ({adminContentLang.toUpperCase()})</label>
                  <textarea
                    rows={4}
                    value={adminContentLang === 'en' ? (aboutContent.storyP1En || '') : (aboutContent.storyP1De || '')}
                    onChange={(e) => _setAboutContent(adminContentLang === 'en' ? { ...aboutContent, storyP1En: e.target.value } : { ...aboutContent, storyP1De: e.target.value })}
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#d85c27] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Story Paragraph 2 ({adminContentLang.toUpperCase()})</label>
                  <textarea
                    rows={4}
                    value={adminContentLang === 'en' ? (aboutContent.storyP2En || '') : (aboutContent.storyP2De || '')}
                    onChange={(e) => _setAboutContent(adminContentLang === 'en' ? { ...aboutContent, storyP2En: e.target.value } : { ...aboutContent, storyP2De: e.target.value })}
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#d85c27] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* The Meaning of Maati */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-[14px] font-extrabold text-[#1e382f] uppercase tracking-wider">3. The Meaning of "Maati" (मिट्टी)</h3>
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Box Title ({adminContentLang.toUpperCase()})</label>
                <input
                  type="text"
                  value={adminContentLang === 'en' ? (aboutContent.maatiMeaningTitleEn || '') : (aboutContent.maatiMeaningTitleDe || '')}
                  onChange={(e) => _setAboutContent(adminContentLang === 'en' ? { ...aboutContent, maatiMeaningTitleEn: e.target.value } : { ...aboutContent, maatiMeaningTitleDe: e.target.value })}
                  placeholder="“मिट्टी — Maati: The Word That Connects India”"
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[14px] font-bold focus:outline-none focus:border-[#d85c27]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Explanation Part 1 ({adminContentLang.toUpperCase()})</label>
                  <textarea
                    rows={3}
                    value={adminContentLang === 'en' ? (aboutContent.maatiMeaningP1En || '') : (aboutContent.maatiMeaningP1De || '')}
                    onChange={(e) => _setAboutContent(adminContentLang === 'en' ? { ...aboutContent, maatiMeaningP1En: e.target.value } : { ...aboutContent, maatiMeaningP1De: e.target.value })}
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#d85c27] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Explanation Part 2 ({adminContentLang.toUpperCase()})</label>
                  <textarea
                    rows={3}
                    value={adminContentLang === 'en' ? (aboutContent.maatiMeaningP2En || '') : (aboutContent.maatiMeaningP2De || '')}
                    onChange={(e) => _setAboutContent(adminContentLang === 'en' ? { ...aboutContent, maatiMeaningP2En: e.target.value } : { ...aboutContent, maatiMeaningP2De: e.target.value })}
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#d85c27] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Core Values */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-[14px] font-extrabold text-[#1e382f] uppercase tracking-wider">4. Three Core Brand Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(aboutContent.values || []).map((val, vIdx) => (
                  <div key={vIdx} className="bg-[#fcf8f3] rounded-2xl p-4 border border-[#ebdcd0] space-y-2">
                    <span className="text-[11px] font-black text-[#d85c27] uppercase">Value #{vIdx + 1}</span>
                    <input
                      type="text"
                      value={adminContentLang === 'en' ? val.titleEn : val.titleDe}
                      onChange={(e) => {
                        const updated = [...(aboutContent.values || [])];
                        updated[vIdx] = adminContentLang === 'en'
                          ? { ...updated[vIdx], titleEn: e.target.value }
                          : { ...updated[vIdx], titleDe: e.target.value };
                        _setAboutContent({ ...aboutContent, values: updated });
                      }}
                      className="font-bold text-[13.5px] text-[#1e382f] w-full border rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-[#d85c27]"
                    />
                    <textarea
                      rows={3}
                      value={adminContentLang === 'en' ? val.descEn : val.descDe}
                      onChange={(e) => {
                        const updated = [...(aboutContent.values || [])];
                        updated[vIdx] = adminContentLang === 'en'
                          ? { ...updated[vIdx], descEn: e.target.value }
                          : { ...updated[vIdx], descDe: e.target.value };
                        _setAboutContent({ ...aboutContent, values: updated });
                      }}
                      className="w-full text-[12px] border rounded-lg p-2 bg-white focus:outline-none focus:border-[#d85c27] resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-[14px] font-extrabold text-[#1e382f] uppercase tracking-wider">5. About Section Images</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[12px] font-black text-[#1e382f]">Main Kitchen Image</label>
                    <button
                      type="button"
                      onClick={() => setActiveGallerySection(activeGallerySection === 'about1' ? null : 'about1')}
                      className="text-[11px] font-bold text-[#d85c27] bg-white px-2.5 py-1 rounded-lg border border-[#ebdcd0]"
                    >
                      {activeGallerySection === 'about1' ? 'Hide' : 'Browse Photos'}
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-[#ebdcd0]">
                      <img src={aboutContent.aboutImg1 || '/assets/show5-BiQql1jr.jpeg'} alt="About 1" className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOptimizedImageUpload((url) => _setAboutContent({ ...aboutContent, aboutImg1: url }))}
                      className="bg-[#1e382f] text-white text-[12px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#d85c27]" /> Upload Photo
                    </button>
                  </div>
                  {activeGallerySection === 'about1' && (
                    <div className="pt-2">
                      {renderGalleryPicker(
                        aboutContent.aboutImg1 || '',
                        (url) => _setAboutContent({ ...aboutContent, aboutImg1: url }),
                        () => setActiveGallerySection(null)
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[12px] font-black text-[#1e382f]">Secondary Ambience Image</label>
                    <button
                      type="button"
                      onClick={() => setActiveGallerySection(activeGallerySection === 'about2' ? null : 'about2')}
                      className="text-[11px] font-bold text-[#d85c27] bg-white px-2.5 py-1 rounded-lg border border-[#ebdcd0]"
                    >
                      {activeGallerySection === 'about2' ? 'Hide' : 'Browse Photos'}
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-[#ebdcd0]">
                      <img src={aboutContent.aboutImg2 || '/assets/show2-CM6MShfY.jpeg'} alt="About 2" className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOptimizedImageUpload((url) => _setAboutContent({ ...aboutContent, aboutImg2: url }))}
                      className="bg-[#1e382f] text-white text-[12px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#d85c27]" /> Upload Photo
                    </button>
                  </div>
                  {activeGallerySection === 'about2' && (
                    <div className="pt-2">
                      {renderGalleryPicker(
                        aboutContent.aboutImg2 || '',
                        (url) => _setAboutContent({ ...aboutContent, aboutImg2: url }),
                        () => setActiveGallerySection(null)
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <button
                type="submit"
                className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-7 py-3 rounded-full text-[14px] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save About Us Content
              </button>
            </div>
          </form>
        )}

        {/* ═══════════════════════════════════════════════
            TAB 14: LEGAL, IMPRESSUM & PRIVACY
        ═══════════════════════════════════════════════ */}
        {activeTab === 'legal' && (
          <form onSubmit={handleSaveLegal} className="bg-[#fffdfa] rounded-[24px] p-6 sm:p-8 border border-[#ebdcd0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-[20px] font-black text-[#1e382f] flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#d85c27]" />
                  <span>Legal Information, Impressum & Policies</span>
                </h2>
                <p className="text-[13px] text-[#666] mt-0.5">
                  Update official German legal notices (§ 5 TMG), commercial registration, and GDPR policies.
                </p>
              </div>
            </div>

            {/* Impressum Section */}
            <div className="space-y-4">
              <h3 className="text-[14px] font-extrabold text-[#1e382f] uppercase tracking-wider">
                1. Impressum (§ 5 TMG Angaben)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Company Legal Name *</label>
                  <input
                    type="text"
                    value={legalContent.impressumCompanyName || ''}
                    onChange={(e) => _setLegalContent({ ...legalContent, impressumCompanyName: e.target.value })}
                    placeholder="Unicorn Table UG (MAATI Kitchen)"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Managing Director / Vertreten durch *</label>
                  <input
                    type="text"
                    value={legalContent.impressumManagingDirector || ''}
                    onChange={(e) => _setLegalContent({ ...legalContent, impressumManagingDirector: e.target.value })}
                    placeholder="Naveen Prasad"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Registered Address *</label>
                <input
                  type="text"
                  value={legalContent.impressumAddress || ''}
                  onChange={(e) => _setLegalContent({ ...legalContent, impressumAddress: e.target.value })}
                  placeholder="Lindenstraße 74, 10969 Berlin"
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Register Court & Number *</label>
                  <input
                    type="text"
                    value={legalContent.impressumRegisterCourt || ''}
                    onChange={(e) => _setLegalContent({ ...legalContent, impressumRegisterCourt: e.target.value })}
                    placeholder="Amtsgericht Charlottenburg, HRB 207902 B"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">VAT ID / USt-IdNr.</label>
                  <input
                    type="text"
                    value={legalContent.impressumVatId || ''}
                    onChange={(e) => _setLegalContent({ ...legalContent, impressumVatId: e.target.value })}
                    placeholder="DE 324 159 872"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Official Legal Email</label>
                  <input
                    type="email"
                    value={legalContent.impressumEmail || ''}
                    onChange={(e) => _setLegalContent({ ...legalContent, impressumEmail: e.target.value })}
                    placeholder="hello@maatikitchen.com"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Official Legal Phone</label>
                  <input
                    type="text"
                    value={legalContent.impressumPhone || ''}
                    onChange={(e) => _setLegalContent({ ...legalContent, impressumPhone: e.target.value })}
                    placeholder="+49 1729498262"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
              </div>
            </div>

            {/* Privacy Policy & Terms */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-[14px] font-extrabold text-[#1e382f] uppercase tracking-wider">
                2. Privacy Policy & Terms Statements
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Privacy Policy Intro (English)</label>
                  <textarea
                    rows={3}
                    value={legalContent.privacyPolicyEn || ''}
                    onChange={(e) => _setLegalContent({ ...legalContent, privacyPolicyEn: e.target.value })}
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#d85c27] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Privacy Policy Intro (Deutsch)</label>
                  <textarea
                    rows={3}
                    value={legalContent.privacyPolicyDe || ''}
                    onChange={(e) => _setLegalContent({ ...legalContent, privacyPolicyDe: e.target.value })}
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#d85c27] resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Terms & Conditions (English)</label>
                  <textarea
                    rows={3}
                    value={legalContent.termsEn || ''}
                    onChange={(e) => _setLegalContent({ ...legalContent, termsEn: e.target.value })}
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#d85c27] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Terms & Conditions (Deutsch)</label>
                  <textarea
                    rows={3}
                    value={legalContent.termsDe || ''}
                    onChange={(e) => _setLegalContent({ ...legalContent, termsDe: e.target.value })}
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#d85c27] resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <button
                type="submit"
                className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-7 py-3 rounded-full text-[14px] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Legal & Impressum Details
              </button>
            </div>
          </form>
        )}

        {/* ═══════════════════════════════════════════════
            TAB 15: CATEGORY LANDING PAGES (SEO)
        ═══════════════════════════════════════════════ */}
        {activeTab === 'landingPages' && (() => {
          const currentLanding = landingPagesContent[selectedLandingKey] || DEFAULT_LANDING_PAGES[selectedLandingKey];
          
          const updateLandingField = (field: keyof LandingCategoryConfig, value: any) => {
            _setLandingPagesContent((prev) => ({
              ...prev,
              [selectedLandingKey]: {
                ...(prev[selectedLandingKey] || DEFAULT_LANDING_PAGES[selectedLandingKey]),
                [field]: value
              }
            }));
          };

          const updateLandingItem = (index: number, updatedItem: LandingPageItem) => {
            const currentList = [...(currentLanding.items || [])];
            currentList[index] = updatedItem;
            updateLandingField('items', currentList);
          };

          const deleteLandingItem = (index: number) => {
            const currentList = (currentLanding.items || []).filter((_, i) => i !== index);
            updateLandingField('items', currentList);
          };

          const addLandingItem = () => {
            const currentList = [...(currentLanding.items || [])];
            currentList.push({
              nameEn: 'New Signature Dish',
              nameDe: 'Neues Signature Gericht',
              descEn: 'Fresh authentic spices and vibrant flavors.',
              descDe: 'Frische authentische Gewürze und lebendige Aromen.',
              dietary: 'Vegetarian'
            });
            updateLandingField('items', currentList);
          };

          const landingOptions: { key: 'naan-pockets' | 'bowls' | 'breakfast' | 'coffee-chai'; label: string; route: string }[] = [
            { key: 'naan-pockets', label: 'Punjab Naan Pockets', route: '/menu/naan-pockets' },
            { key: 'bowls', label: 'Signature Bowls', route: '/menu/bowls' },
            { key: 'breakfast', label: 'Berlin Breakfast', route: '/menu/breakfast' },
            { key: 'coffee-chai', label: 'Specialty Coffee & Chai', route: '/menu/coffee-chai' },
          ];

          return (
            <form onSubmit={handleSaveLandingPages} className="bg-[#fffdfa] rounded-[24px] p-6 sm:p-8 border border-[#ebdcd0] shadow-sm space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <div>
                  <h2 className="text-[20px] font-black text-[#1e382f] flex items-center gap-2.5">
                    <Layers className="w-5 h-5 text-[#d85c27]" />
                    <span>Category Landing Pages (SEO Landings)</span>
                  </h2>
                  <p className="text-[13px] text-[#666] mt-0.5">
                    Manage individual category showcase landing pages with dedicated search titles, hero badges, starting prices, and highlight dishes.
                  </p>
                </div>

                {/* Language Switcher */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#ebdcd0] self-start sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setAdminContentLang('en')}
                    className={`px-3 py-1.5 text-[12px] font-extrabold rounded-lg transition-all ${
                      adminContentLang === 'en' ? 'bg-[#1e382f] text-white shadow-xs' : 'text-[#1e382f] hover:bg-gray-100'
                    }`}
                  >
                    English (EN)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminContentLang('de')}
                    className={`px-3 py-1.5 text-[12px] font-extrabold rounded-lg transition-all ${
                      adminContentLang === 'de' ? 'bg-[#1e382f] text-white shadow-xs' : 'text-[#1e382f] hover:bg-gray-100'
                    }`}
                  >
                    Deutsch (DE)
                  </button>
                </div>
              </div>

              {/* Sub-navigation for the 4 landing pages */}
              <div className="flex flex-wrap items-center gap-2 bg-[#fcf8f3] p-2 rounded-2xl border border-[#ebdcd0]">
                {landingOptions.map((opt) => {
                  const isSelected = selectedLandingKey === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setSelectedLandingKey(opt.key)}
                      className={`px-4 py-2 rounded-xl text-[13px] font-black transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'bg-[#1e382f] text-white shadow-sm'
                          : 'bg-white text-[#1e382f] border border-[#ebdcd0] hover:bg-amber-50/50'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${isSelected ? 'bg-[#2a4d41] text-amber-200' : 'bg-gray-100 text-gray-500'}`}>
                        {opt.route}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Live Route Link Notice */}
              <div className="flex items-center justify-between bg-amber-50/60 border border-amber-200 rounded-xl px-4 py-2.5 text-[12.5px] text-amber-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d85c27]" />
                  <span>Currently editing live page at: <strong className="font-mono">/menu/{selectedLandingKey}</strong></span>
                </div>
                <Link
                  to={`/menu/${selectedLandingKey}`}
                  target="_blank"
                  className="font-bold text-[#d85c27] hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>Open Live Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 1. SEO Metadata */}
              <div className="space-y-4">
                <h3 className="text-[14px] font-extrabold text-[#1e382f] uppercase tracking-wider">
                  1. Search Engine (SEO) Meta Tags
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">
                      Browser Tab Title ({adminContentLang.toUpperCase()}) *
                    </label>
                    <input
                      type="text"
                      value={adminContentLang === 'en' ? (currentLanding.titleEn || '') : (currentLanding.titleDe || '')}
                      onChange={(e) => updateLandingField(adminContentLang === 'en' ? 'titleEn' : 'titleDe', e.target.value)}
                      className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">
                      Meta Description ({adminContentLang.toUpperCase()}) *
                    </label>
                    <input
                      type="text"
                      value={adminContentLang === 'en' ? (currentLanding.descEn || '') : (currentLanding.descDe || '')}
                      onChange={(e) => updateLandingField(adminContentLang === 'en' ? 'descEn' : 'descDe', e.target.value)}
                      className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Hero Headline, Badge & Price */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-[14px] font-extrabold text-[#1e382f] uppercase tracking-wider">
                  2. Hero Header & Pricing
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[12px] font-bold text-[#333] mb-1">
                      Main H1 Headline ({adminContentLang.toUpperCase()}) *
                    </label>
                    <input
                      type="text"
                      value={adminContentLang === 'en' ? (currentLanding.h1En || '') : (currentLanding.h1De || '')}
                      onChange={(e) => updateLandingField(adminContentLang === 'en' ? 'h1En' : 'h1De', e.target.value)}
                      className="w-full border rounded-xl px-3.5 py-2.5 text-[14px] font-bold focus:outline-none focus:border-[#d85c27]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">
                      Category Badge Text ({adminContentLang.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={adminContentLang === 'en' ? (currentLanding.badgeEn || '') : (currentLanding.badgeDe || '')}
                      onChange={(e) => updateLandingField(adminContentLang === 'en' ? 'badgeEn' : 'badgeDe', e.target.value)}
                      placeholder="e.g. SIGNATURE CREATION"
                      className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[12px] font-bold text-[#333] mb-1">
                      Intro Paragraph ({adminContentLang.toUpperCase()})
                    </label>
                    <textarea
                      rows={2}
                      value={adminContentLang === 'en' ? (currentLanding.introEn || '') : (currentLanding.introDe || '')}
                      onChange={(e) => updateLandingField(adminContentLang === 'en' ? 'introEn' : 'introDe', e.target.value)}
                      className="w-full border rounded-xl px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#d85c27] resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#333] mb-1">
                      Starting Price Tag ({adminContentLang.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={adminContentLang === 'en' ? (currentLanding.priceEn || '') : (currentLanding.priceDe || '')}
                      onChange={(e) => updateLandingField(adminContentLang === 'en' ? 'priceEn' : 'priceDe', e.target.value)}
                      placeholder="e.g. from €10.50"
                      className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] font-bold text-[#d85c27] focus:outline-none focus:border-[#d85c27]"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Highlighted Dishes */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[14px] font-extrabold text-[#1e382f] uppercase tracking-wider">
                      3. Featured Category Highlights ({currentLanding.items?.length || 0})
                    </h3>
                    <p className="text-[12px] text-gray-500">Showcase cards displayed directly under the hero banner on this landing page.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addLandingItem}
                    className="bg-[#1e382f] hover:bg-[#2a4d41] text-white text-[12px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Highlight Dish</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(currentLanding.items || []).map((dish, dIdx) => (
                    <div key={dIdx} className="bg-[#fcf8f3] rounded-2xl p-4 border border-[#ebdcd0] space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] font-black text-[#d85c27] uppercase tracking-wider">
                          Highlight #{dIdx + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={dish.dietary || ''}
                            onChange={(e) => updateLandingItem(dIdx, { ...dish, dietary: e.target.value })}
                            placeholder="Dietary tag (e.g. Vegan)"
                            className="text-[11px] font-bold border rounded-lg px-2.5 py-1 bg-white focus:outline-none focus:border-[#d85c27]"
                          />
                          <button
                            type="button"
                            onClick={() => deleteLandingItem(dIdx)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-white"
                            title="Delete highlight"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 mb-1">Dish Name ({adminContentLang.toUpperCase()})</label>
                          <input
                            type="text"
                            value={adminContentLang === 'en' ? (dish.nameEn || '') : (dish.nameDe || '')}
                            onChange={(e) => updateLandingItem(dIdx, adminContentLang === 'en' ? { ...dish, nameEn: e.target.value } : { ...dish, nameDe: e.target.value })}
                            className="w-full border rounded-xl px-3 py-1.5 text-[13px] bg-white font-bold focus:outline-none focus:border-[#d85c27]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 mb-1">Ingredients & Description ({adminContentLang.toUpperCase()})</label>
                          <input
                            type="text"
                            value={adminContentLang === 'en' ? (dish.descEn || '') : (dish.descDe || '')}
                            onChange={(e) => updateLandingItem(dIdx, adminContentLang === 'en' ? { ...dish, descEn: e.target.value } : { ...dish, descDe: e.target.value })}
                            className="w-full border rounded-xl px-3 py-1.5 text-[12.5px] bg-white focus:outline-none focus:border-[#d85c27]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-7 py-3 rounded-full text-[14px] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Category Landing Pages
                </button>
                <Link
                  to={`/menu/${selectedLandingKey}`}
                  target="_blank"
                  className="text-[12.5px] font-bold text-[#1e382f] hover:text-[#d85c27] flex items-center gap-1"
                >
                  <span>Preview /menu/{selectedLandingKey}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </form>
          );
        })()}

        {/* ═══════════════════════════════════════════════
            TAB 16: TABLE RESERVATION SETTINGS
        ═══════════════════════════════════════════════ */}
        {activeTab === 'reservations' && (
          <form onSubmit={handleSaveReservation} className="bg-[#fffdfa] rounded-[24px] p-6 sm:p-8 border border-[#ebdcd0] shadow-sm space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-[20px] font-black text-[#1e382f] flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-[#d85c27]" />
                  <span>Table Reservations & TheFork Widget Integration</span>
                </h2>
                <p className="text-[13px] text-[#666] mt-0.5">
                  Manage the online table booking modal, TheFork restaurant identifier, contact phone, and group size limits.
                </p>
              </div>

              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#ebdcd0] self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setAdminContentLang('en')}
                  className={`px-3 py-1.5 text-[12px] font-extrabold rounded-lg transition-all ${
                    adminContentLang === 'en' ? 'bg-[#1e382f] text-white shadow-xs' : 'text-[#1e382f] hover:bg-gray-100'
                  }`}
                >
                  English (EN)
                </button>
                <button
                  type="button"
                  onClick={() => setAdminContentLang('de')}
                  className={`px-3 py-1.5 text-[12px] font-extrabold rounded-lg transition-all ${
                    adminContentLang === 'de' ? 'bg-[#1e382f] text-white shadow-xs' : 'text-[#1e382f] hover:bg-gray-100'
                  }`}
                >
                  Deutsch (DE)
                </button>
              </div>
            </div>

            {/* Modal Titles & Messages */}
            <div className="space-y-4">
              <h3 className="text-[14px] font-extrabold text-[#1e382f] uppercase tracking-wider">
                1. Modal Headline & Instructions
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">
                    Modal Title ({adminContentLang.toUpperCase()}) *
                  </label>
                  <input
                    type="text"
                    value={adminContentLang === 'en' ? (reservationContent.titleEn || '') : (reservationContent.titleDe || '')}
                    onChange={(e) => _setReservationContent(adminContentLang === 'en' ? { ...reservationContent, titleEn: e.target.value } : { ...reservationContent, titleDe: e.target.value })}
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] font-bold focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">
                    Group Notice & Large Parties ({adminContentLang.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={adminContentLang === 'en' ? (reservationContent.subtitleEn || '') : (reservationContent.subtitleDe || '')}
                    onChange={(e) => _setReservationContent(adminContentLang === 'en' ? { ...reservationContent, subtitleEn: e.target.value } : { ...reservationContent, subtitleDe: e.target.value })}
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">
                  Walk-In & Counter Order Footnote ({adminContentLang.toUpperCase()})
                </label>
                <textarea
                  rows={2}
                  value={adminContentLang === 'en' ? (reservationContent.noticeEn || '') : (reservationContent.noticeDe || '')}
                  onChange={(e) => _setReservationContent(adminContentLang === 'en' ? { ...reservationContent, noticeEn: e.target.value } : { ...reservationContent, noticeDe: e.target.value })}
                  className="w-full border rounded-xl px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#d85c27] resize-none"
                />
              </div>
            </div>

            {/* TheFork Widget Settings */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-[14px] font-extrabold text-[#1e382f] uppercase tracking-wider">
                2. TheFork Integration Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">
                    TheFork Widget UUID (restaurantId) *
                  </label>
                  <input
                    type="text"
                    value={reservationContent.theforkWidgetId || ''}
                    onChange={(e) => _setReservationContent({ ...reservationContent, theforkWidgetId: e.target.value })}
                    placeholder="7beffe40-786f-496c-b196-48b939750c77"
                    className="w-full font-mono border rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#d85c27]"
                  />
                  <span className="text-[11px] text-gray-500 mt-1 block">Used to render the official embeddable booking iframe.</span>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">
                    Direct TheFork Booking URL
                  </label>
                  <input
                    type="text"
                    value={reservationContent.theforkUrl || ''}
                    onChange={(e) => _setReservationContent({ ...reservationContent, theforkUrl: e.target.value })}
                    placeholder="https://www.thefork.com/restaurant/maati-kitchen-r938475"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#d85c27]"
                  />
                  <span className="text-[11px] text-gray-500 mt-1 block">Fallback link if a visitor's browser blocks third-party iframes.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Max Online Party Size</label>
                  <input
                    type="number"
                    value={reservationContent.maxPartySize || 8}
                    onChange={(e) => _setReservationContent({ ...reservationContent, maxPartySize: parseInt(e.target.value) || 8 })}
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Direct Phone Contact</label>
                  <input
                    type="text"
                    value={reservationContent.phone || ''}
                    onChange={(e) => _setReservationContent({ ...reservationContent, phone: e.target.value })}
                    placeholder="+49 30 51891367"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#333] mb-1">Direct Email Contact</label>
                  <input
                    type="email"
                    value={reservationContent.email || ''}
                    onChange={(e) => _setReservationContent({ ...reservationContent, email: e.target.value })}
                    placeholder="hello@maatikitchen.com"
                    className="w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-[#d85c27]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <button
                type="submit"
                className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-7 py-3 rounded-full text-[14px] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Reservation Settings
              </button>
            </div>
          </form>
        )}

        {/* ═══════════════════════════════════════════════
            TAB 17: PRIVACY POLICY (DATENSCHUTZ)
        ═══════════════════════════════════════════════ */}
        {activeTab === 'privacy' && (() => {
          const currentSections = legalContent.privacySections && legalContent.privacySections.length > 0
            ? legalContent.privacySections
            : DEFAULT_PRIVACY_SECTIONS;

          const updateSection = (idx: number, updated: Partial<LegalSectionItem>) => {
            const list = [...currentSections];
            list[idx] = { ...list[idx], ...updated };
            _setLegalContent({ ...legalContent, privacySections: list });
          };

          const deleteSection = (idx: number) => {
            const list = currentSections.filter((_: LegalSectionItem, i: number) => i !== idx);
            _setLegalContent({ ...legalContent, privacySections: list });
          };

          const addSection = () => {
            const list = [
              ...currentSections,
              {
                id: `sec-${Date.now()}`,
                titleEn: `${currentSections.length + 1}. New Policy Clause`,
                titleDe: `${currentSections.length + 1}. Neue Klausel`,
                bodyEn: 'Insert detailed privacy declaration in English here...',
                bodyDe: 'Fügen Sie hier die Datenschutzerklärung auf Deutsch ein...'
              }
            ];
            _setLegalContent({ ...legalContent, privacySections: list });
          };

          return (
            <form onSubmit={handleSaveLegal} className="bg-[#fffdfa] rounded-[24px] p-6 sm:p-8 border border-[#ebdcd0] shadow-sm space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <div>
                  <h2 className="text-[20px] font-black text-[#1e382f] flex items-center gap-2.5">
                    <Lock className="w-5 h-5 text-[#d85c27]" />
                    <span>Privacy Policy &amp; DSGVO Data Protection</span>
                  </h2>
                  <p className="text-[13px] text-[#666] mt-0.5">
                    Edit the GDPR privacy declaration sections displayed on <strong className="font-mono">/privacy</strong> and <strong className="font-mono">/de/datenschutz</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#ebdcd0]">
                    <button
                      type="button"
                      onClick={() => setAdminContentLang('en')}
                      className={`px-3 py-1.5 text-[12px] font-extrabold rounded-lg transition-all ${
                        adminContentLang === 'en' ? 'bg-[#1e382f] text-white shadow-xs' : 'text-[#1e382f] hover:bg-gray-100'
                      }`}
                    >
                      English (EN)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminContentLang('de')}
                      className={`px-3 py-1.5 text-[12px] font-extrabold rounded-lg transition-all ${
                        adminContentLang === 'de' ? 'bg-[#1e382f] text-white shadow-xs' : 'text-[#1e382f] hover:bg-gray-100'
                      }`}
                    >
                      Deutsch (DE)
                    </button>
                  </div>
                  <Link
                    to="/privacy"
                    target="_blank"
                    className="p-2 text-gray-500 hover:text-[#d85c27] rounded-xl hover:bg-amber-50"
                    title="View live privacy page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* General Intro Paragraph */}
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">
                  General Privacy Statement ({adminContentLang.toUpperCase()})
                </label>
                <textarea
                  rows={3}
                  value={adminContentLang === 'en' ? (legalContent.privacyPolicyEn || '') : (legalContent.privacyPolicyDe || '')}
                  onChange={(e) => _setLegalContent(adminContentLang === 'en' ? { ...legalContent, privacyPolicyEn: e.target.value } : { ...legalContent, privacyPolicyDe: e.target.value })}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#d85c27] resize-none"
                />
              </div>

              {/* Sections List */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-extrabold text-[#1e382f] uppercase tracking-wider">
                    Privacy Policy Sections ({currentSections.length})
                  </h3>
                  <button
                    type="button"
                    onClick={addSection}
                    className="bg-[#1e382f] hover:bg-[#2a4d41] text-white text-[12px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Policy Section</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {currentSections.map((sec: LegalSectionItem, idx: number) => (
                    <div key={sec.id || idx} className="bg-[#fcf8f3] rounded-2xl p-4 border border-[#ebdcd0] space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] font-black text-[#d85c27] uppercase tracking-wider">
                          Section #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteSection(idx)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-white"
                          title="Delete section"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Section Title ({adminContentLang.toUpperCase()})</label>
                        <input
                          type="text"
                          value={adminContentLang === 'en' ? sec.titleEn : sec.titleDe}
                          onChange={(e) => updateSection(idx, adminContentLang === 'en' ? { titleEn: e.target.value } : { titleDe: e.target.value })}
                          className="w-full border rounded-xl px-3 py-1.5 text-[13px] bg-white font-bold focus:outline-none focus:border-[#d85c27]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Section Body Text ({adminContentLang.toUpperCase()})</label>
                        <textarea
                          rows={3}
                          value={adminContentLang === 'en' ? sec.bodyEn : sec.bodyDe}
                          onChange={(e) => updateSection(idx, adminContentLang === 'en' ? { bodyEn: e.target.value } : { bodyDe: e.target.value })}
                          className="w-full border rounded-xl px-3 py-2 text-[12.5px] bg-white focus:outline-none focus:border-[#d85c27] resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <button
                  type="submit"
                  className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-7 py-3 rounded-full text-[14px] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Privacy Policy
                </button>
              </div>
            </form>
          );
        })()}

        {/* ═══════════════════════════════════════════════
            TAB 18: TERMS & CONDITIONS (AGB)
        ═══════════════════════════════════════════════ */}
        {activeTab === 'terms' && (() => {
          const currentSections = legalContent.termsSections && legalContent.termsSections.length > 0
            ? legalContent.termsSections
            : DEFAULT_TERMS_SECTIONS;

          const updateSection = (idx: number, updated: Partial<LegalSectionItem>) => {
            const list = [...currentSections];
            list[idx] = { ...list[idx], ...updated };
            _setLegalContent({ ...legalContent, termsSections: list });
          };

          const deleteSection = (idx: number) => {
            const list = currentSections.filter((_: LegalSectionItem, i: number) => i !== idx);
            _setLegalContent({ ...legalContent, termsSections: list });
          };

          const addSection = () => {
            const list = [
              ...currentSections,
              {
                id: `terms-${Date.now()}`,
                titleEn: `${currentSections.length + 1}. New Condition Clause`,
                titleDe: `${currentSections.length + 1}. Neue Klausel`,
                bodyEn: 'Insert detailed terms condition in English here...',
                bodyDe: 'Fügen Sie hier die Allgemeinen Geschäftsbedingungen auf Deutsch ein...'
              }
            ];
            _setLegalContent({ ...legalContent, termsSections: list });
          };

          return (
            <form onSubmit={handleSaveLegal} className="bg-[#fffdfa] rounded-[24px] p-6 sm:p-8 border border-[#ebdcd0] shadow-sm space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <div>
                  <h2 className="text-[20px] font-black text-[#1e382f] flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-[#d85c27]" />
                    <span>Terms &amp; Conditions (Allgemeine Geschäftsbedingungen - AGB)</span>
                  </h2>
                  <p className="text-[13px] text-[#666] mt-0.5">
                    Edit service conditions, catering contracts, cancellation rules, and legal jurisdiction on <strong className="font-mono">/terms</strong> and <strong className="font-mono">/de/agb</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#ebdcd0]">
                    <button
                      type="button"
                      onClick={() => setAdminContentLang('en')}
                      className={`px-3 py-1.5 text-[12px] font-extrabold rounded-lg transition-all ${
                        adminContentLang === 'en' ? 'bg-[#1e382f] text-white shadow-xs' : 'text-[#1e382f] hover:bg-gray-100'
                      }`}
                    >
                      English (EN)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminContentLang('de')}
                      className={`px-3 py-1.5 text-[12px] font-extrabold rounded-lg transition-all ${
                        adminContentLang === 'de' ? 'bg-[#1e382f] text-white shadow-xs' : 'text-[#1e382f] hover:bg-gray-100'
                      }`}
                    >
                      Deutsch (DE)
                    </button>
                  </div>
                  <Link
                    to="/terms"
                    target="_blank"
                    className="p-2 text-gray-500 hover:text-[#d85c27] rounded-xl hover:bg-amber-50"
                    title="View live terms page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* General Intro Paragraph */}
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">
                  General Terms Intro ({adminContentLang.toUpperCase()})
                </label>
                <textarea
                  rows={3}
                  value={adminContentLang === 'en' ? (legalContent.termsEn || '') : (legalContent.termsDe || '')}
                  onChange={(e) => _setLegalContent(adminContentLang === 'en' ? { ...legalContent, termsEn: e.target.value } : { ...legalContent, termsDe: e.target.value })}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#d85c27] resize-none"
                />
              </div>

              {/* Sections List */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-extrabold text-[#1e382f] uppercase tracking-wider">
                    Terms &amp; Conditions Clauses ({currentSections.length})
                  </h3>
                  <button
                    type="button"
                    onClick={addSection}
                    className="bg-[#1e382f] hover:bg-[#2a4d41] text-white text-[12px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Terms Clause</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {currentSections.map((sec: LegalSectionItem, idx: number) => (
                    <div key={sec.id || idx} className="bg-[#fcf8f3] rounded-2xl p-4 border border-[#ebdcd0] space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] font-black text-[#d85c27] uppercase tracking-wider">
                          Clause #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteSection(idx)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-white"
                          title="Delete clause"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Clause Title ({adminContentLang.toUpperCase()})</label>
                        <input
                          type="text"
                          value={adminContentLang === 'en' ? sec.titleEn : sec.titleDe}
                          onChange={(e) => updateSection(idx, adminContentLang === 'en' ? { titleEn: e.target.value } : { titleDe: e.target.value })}
                          className="w-full border rounded-xl px-3 py-1.5 text-[13px] bg-white font-bold focus:outline-none focus:border-[#d85c27]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Clause Body Text ({adminContentLang.toUpperCase()})</label>
                        <textarea
                          rows={3}
                          value={adminContentLang === 'en' ? sec.bodyEn : sec.bodyDe}
                          onChange={(e) => updateSection(idx, adminContentLang === 'en' ? { bodyEn: e.target.value } : { bodyDe: e.target.value })}
                          className="w-full border rounded-xl px-3 py-2 text-[12.5px] bg-white focus:outline-none focus:border-[#d85c27] resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <button
                  type="submit"
                  className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-7 py-3 rounded-full text-[14px] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Terms &amp; Conditions
                </button>
              </div>
            </form>
          );
        })()}


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
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#fae8d8] shrink-0 border border-[#ebdcd0] flex-none">
                      {formImg ? (
                        <img src={formImg} alt="Preview" className="w-full h-full object-cover" style={{ maxHeight: '80px', maxWidth: '80px' }} />
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
                      x={spotlightRect.left - 8}
                      y={spotlightRect.top - 8}
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

            {/* Floating Popover Tooltip Card: Positioned safely next to the highlighted element */}
            {(() => {
              const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
              const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
              const cardWidth = Math.min(360, windowWidth - 32);
              const cardHeight = 220;

              let cardTop: number;
              let cardLeft: number;

              if (spotlightRect) {
                // If there is enough room below element, place below; otherwise place above
                if (spotlightRect.top + spotlightRect.height + cardHeight + 20 < windowHeight) {
                  cardTop = spotlightRect.top + spotlightRect.height + 16;
                } else if (spotlightRect.top - cardHeight - 16 > 10) {
                  cardTop = spotlightRect.top - cardHeight - 16;
                } else {
                  cardTop = (windowHeight / 2) - (cardHeight / 2);
                }
                cardLeft = spotlightRect.left + (spotlightRect.width / 2) - (cardWidth / 2);
              } else {
                cardTop = (windowHeight / 2) - (cardHeight / 2);
                cardLeft = (windowWidth / 2) - (cardWidth / 2);
              }

              // Keep within screen viewport bounds
              if (cardTop < 16) cardTop = 16;
              if (cardTop + cardHeight > windowHeight - 16) {
                cardTop = windowHeight - cardHeight - 16;
              }

              if (cardLeft < 16) cardLeft = 16;
              if (cardLeft + cardWidth > windowWidth - 16) {
                cardLeft = windowWidth - cardWidth - 16;
              }

              return (
                <div
                  className="absolute pointer-events-auto bg-white rounded-3xl p-5 shadow-2xl border-2 border-[#ebdcd0] space-y-3 z-50 animate-fadeInUp max-w-[calc(100vw-32px)]"
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
