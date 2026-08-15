// Available gallery assets with clean human-readable names and categories
export interface GalleryAssetItem {
  id: string;
  name: string;
  path: string;
  category: string;
  isCustom?: boolean;
}

export const DEFAULT_GALLERY_ASSETS: GalleryAssetItem[] = [
  { id: 'asset-1', name: "Chettinad Bowl", path: "/assets/Chettinad-D21PABvG.png", category: "Bowls & Mains" },
  { id: 'asset-2', name: "Delhi Butter Chicken", path: "/assets/Delhi-BteN_mdh.png", category: "Bowls & Mains" },
  { id: 'asset-3', name: "Bihar Lentil Potato Bowl", path: "/assets/bihar-lentil-potato.png", category: "Bowls & Mains" },
  { id: 'asset-4', name: "Bengal Fish Curry", path: "/assets/Bengal-birKfnj1.png", category: "Bowls & Mains" },
  { id: 'asset-5', name: "Goa Prawn Curry", path: "/assets/Goa-DLdcEMCP.png", category: "Bowls & Mains" },
  { id: 'asset-6', name: "Kashmir Lamb Rogan", path: "/assets/Kashmir-Z2M0N-Rm.png", category: "Bowls & Mains" },
  { id: 'asset-7', name: "Rajasthan Laal Maas", path: "/assets/Rajasthan-DL_KoxiT.png", category: "Bowls & Mains" },
  { id: 'asset-8', name: "Pondicherry Caesar Salad", path: "/assets/Pondichery-Cesear-Salad.png", category: "Bowls & Mains" },
  { id: 'asset-9', name: "Fresh Mango Salad", path: "/assets/Mango Salad.png", category: "Bowls & Mains" },
  { id: 'asset-10', name: "Punjab Naan Pocket", path: "/assets/punjab-naan-pocket.jpg", category: "Naan Pockets" },
  { id: 'asset-11', name: "Butter Chicken Naan Pocket", path: "/assets/Naan-Pocket-Butter-Chicken.jpg", category: "Naan Pockets" },
  { id: 'asset-12', name: "Paneer Tikka Naan Pocket", path: "/assets/Naan-Pocket-Paneer-Tikka.jpg", category: "Naan Pockets" },
  { id: 'asset-13', name: "Green Chutney Croissant", path: "/assets/croissant-green-chutney.jpg", category: "Bakery & Desserts" },
  { id: 'asset-14', name: "Fresh Mango Lassi", path: "/assets/Mango Lassi.png", category: "Drinks & Lassis" },
  { id: 'asset-15', name: "Rose Milk Special", path: "/assets/Rosemilk.png", category: "Drinks & Lassis" },
  { id: 'asset-16', name: "Spiced Buttermilk (Chaas)", path: "/assets/Buttermilk.png", category: "Drinks & Lassis" },
  { id: 'asset-17', name: "Fresh Mint Lemonade", path: "/assets/Lemonade.png", category: "Drinks & Lassis" },
  { id: 'asset-18', name: "Pure Sugarcane Juice", path: "/assets/Sugarcane Juice.png", category: "Drinks & Lassis" },
  { id: 'asset-19', name: "Classic Cafe Latte", path: "/assets/Cafe Latte_Maati.png", category: "Coffee & Tea" },
  { id: 'asset-20', name: "Australian Flat White", path: "/assets/FlatWhite_Maati.png", category: "Coffee & Tea" },
  { id: 'asset-21', name: "Americano Coffee", path: "/assets/Americano_Maati.png", category: "Coffee & Tea" },
  { id: 'asset-22', name: "Kyoto Matcha Latte", path: "/assets/Matcha Latte_Maati.png", category: "Coffee & Tea" },
  { id: 'asset-23', name: "Sea Salt Chocolate Brownie", path: "/assets/Brownie mit Meersalzflocken_Maati.png", category: "Bakery & Desserts" },
  { id: 'asset-24', name: "Traditional Milk Cake", path: "/assets/MilkCake_Maati.png", category: "Bakery & Desserts" },
  { id: 'asset-25', name: "MAATI Signature Cocktail 1", path: "/assets/cocktail-1.jpg", category: "Cocktails" },
  { id: 'asset-26', name: "MAATI Signature Cocktail 2", path: "/assets/cocktail-2.jpg", category: "Cocktails" },
  { id: 'asset-27', name: "MAATI Signature Cocktail 3", path: "/assets/cocktail-3.jpg", category: "Cocktails" },
  { id: 'asset-28', name: "MAATI Signature Cocktail 4", path: "/assets/cocktail-4.jpg", category: "Cocktails" },
  { id: 'asset-29', name: "MAATI Signature Cocktail 5", path: "/assets/cocktail-5.jpg", category: "Cocktails" },
  { id: 'asset-30', name: "MAATI Signature Cocktail 6", path: "/assets/cocktail-6.jpg", category: "Cocktails" },
  { id: 'asset-31', name: "Hero Spread Flatlay", path: "/assets/hero-flatlay.jpg", category: "Showcase & Ambience" },
  { id: 'asset-32', name: "Restaurant Interior Ambience 1", path: "/assets/show5-BiQql1jr.jpeg", category: "Showcase & Ambience" },
  { id: 'asset-33', name: "Window Dining & Pendant Lights", path: "/assets/show2-CM6MShfY.jpeg", category: "Showcase & Ambience" },
  { id: 'asset-34', name: "MAATI Catering Spread", path: "/assets/show3-D0blnzja.jpeg", category: "Showcase & Ambience" },
  { id: 'asset-35', name: "Coca-Cola (Glass Bottle)", path: "/assets/cola.png", category: "Bottled Drinks" },
  { id: 'asset-36', name: "Fanta Orange", path: "/assets/fanta.png", category: "Bottled Drinks" },
  { id: 'asset-37', name: "Mezzo Mix", path: "/assets/Mezo-Mix.png", category: "Bottled Drinks" },
  { id: 'asset-38', name: "VIO Bio Schorle", path: "/assets/vio-schorle.png", category: "Bottled Drinks" },
  { id: 'asset-39', name: "Mineral Water", path: "/assets/water.png", category: "Bottled Drinks" }
];

// Fast client-side image compression & WebP optimizer
export const compressImageFile = (
  file: File,
  maxWidth = 1000,
  maxHeight = 800,
  quality = 0.82
): Promise<{ dataUrl: string; originalSize: number; compressedSize: number; cleanName: string }> => {
  return new Promise((resolve, reject) => {
    const originalSize = file.size;
    const rawName = file.name.replace(/\.[^/.]+$/, '');
    const cleanName = rawName
      .replace(/[-_]+/g, ' ')
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .trim()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ') || 'Uploaded Dish Photo';

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ dataUrl: e.target?.result as string, originalSize, compressedSize: originalSize, cleanName });
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        const compressedSize = Math.round(dataUrl.length * 0.75);
        resolve({ dataUrl, originalSize, compressedSize, cleanName });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
