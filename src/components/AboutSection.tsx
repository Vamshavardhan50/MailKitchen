import React from 'react';
import { SEO } from './SEO';
import { useAboutContent } from '../lib/sanityService';
import { Heart, Sparkles, Leaf, MapPin, Award } from 'lucide-react';

interface AboutSectionProps {
  lang: 'de' | 'en';
}

export const AboutSection: React.FC<AboutSectionProps> = ({ lang }) => {
  const isDe = lang === 'de';
  const { content } = useAboutContent();

  const title = (isDe ? content.heroTitleDe : content.heroTitleEn) || (isDe ? 'Die Geschichte hinter MAATI' : 'The Story Behind MAATI');
  const subtitle = (isDe ? content.heroSubtitleDe : content.heroSubtitleEn) || (isDe
    ? 'Ein modernes indisches Restaurant mit individuell zusammengestellten, bekömmlichen Gerichten — in Tradition verwurzelt, für den Berliner Alltag geschaffen.'
    : 'A modern Indian quick-service restaurant offering customizable, wholesome meals — rooted in tradition, crafted for everyday life in Berlin.');

  const storyTitle = (isDe ? content.storyTitleDe : content.storyTitleEn) || (isDe ? 'Verwurzelt in indischer Tradition, gemacht für Berlin' : 'Rooted in Indian Heritage, Made for Berlin');
  const storyP1 = (isDe ? content.storyP1De : content.storyP1En) || (isDe
    ? 'Maati ist ein modernes indisches Soul-Food-Restaurant. Aufbauend auf traditionellen Familienrezepten und sorgfältig abgestimmten Gewürzen nährt unser Essen den Körper mit alter Weisheit, bleibt dabei aber frisch, bekömmlich und lecker.'
    : 'Maati is a modern Indian quick-service culinary haven. Rooted in authentic generational recipes and thoughtfully balanced spices, our food nourishes the body with age-old wisdom while staying bold, vibrant, and light.');
  const storyP2 = (isDe ? content.storyP2De : content.storyP2En) || (isDe
    ? 'Ob für eine warme Mittagspause, knusprig getoastete Naan-Pockets oder einen duftenden Masala Chai am Nachmittag: Wir laden Sie ein, eine neue Interpretation indischer Gastfreundschaft zu erleben.'
    : 'Whether you stop by for a quick lunch bowl, crispy toasted naan pockets, or an afternoon spiced chai, we invite you to experience real Indian dining reimagined for modern Berlin living.');

  const meaningTitle = (isDe ? content.maatiMeaningTitleDe : content.maatiMeaningTitleEn) || (isDe ? '“मिट्टी — Maati: Das Wort, das Indien verbindet”' : '“मिट्टी — Maati: The Word That Connects India”');
  const meaningP1 = (isDe ? content.maatiMeaningP1De : content.maatiMeaningP1En) || (isDe
    ? 'Maati (मिट्टी) ist das Hindi- und Urdu-Wort für Erde, Ton und Boden. Für uns ist Maati eine lebendige Philosophie — der nährende Ursprung von allem, was wir ernten, kochen und teilen.'
    : 'Maati (मिट्टी) is the Hindi and Urdu word for earth, clay, and soil. To us, Maati is a living philosophy — the grounding foundation of everything we harvest, prepare, and share.');
  const meaningP2 = (isDe ? content.maatiMeaningP2De : content.maatiMeaningP2En) || (isDe
    ? 'Es ist der Boden unter unseren Füßen, die handgefertigte Terracotta unserer Schalen und die fruchtbare Erde, auf der Kurkuma, Kreuzkümmel und Kardamom gedeihen.'
    : "It is the soil beneath our feet, the handcrafted terracotta of our serving vessels, and the fragrant earth where turmeric, cumin, and cardamoms flourish.");

  return (
    <section id="about" className="bg-[#f5f0e8] min-h-screen pt-[96px] sm:pt-[120px] md:pt-[140px] pb-16 sm:pb-28 px-4 sm:px-8 md:px-16 lg:px-24">
      <SEO
        title={isDe ? 'Über MAATI Kitchen | Modernes indisches Food für Berlin' : 'About MAATI Kitchen | Modern Indian Food, Made for Berlin'}
        description={
          isDe
            ? 'Erfahren Sie mehr über MAATI: Indische Tradition, ganzheitliche Bowls und moderne Aromen in Berlin Mitte.'
            : 'Discover the story behind MAATI: Indian culinary tradition, wholesome food and reimagined flavours, made for Berlin Mitte.'
        }
        canonicalUrl={isDe ? 'https://maatikitchen.com/de/about' : 'https://maatikitchen.com/about'}
        lang={lang}
        enPath="/about"
      />

      <div className="max-w-[1180px] mx-auto space-y-12">
        {/* Main Story Card */}
        <div className="bg-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 md:p-16 lg:p-20 shadow-sm border border-gray-100 text-center space-y-8 sm:space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#d85c27]/10 text-[#d85c27] px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-[0.18em] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isDe ? 'UNSERE GESCHICHTE' : 'OUR PHILOSOPHY'}</span>
            </div>
            <h1 className="text-[36px] md:text-[52px] font-black text-[#1e382f] mb-4 leading-tight">
              {title}
            </h1>
            <p className="text-[#666] text-[16px] sm:text-[18px] max-w-[700px] mx-auto leading-relaxed">
              {subtitle}
            </p>
            <div className="w-16 h-1.5 bg-[#d85c27] mx-auto mt-6 rounded-full" />
          </div>

          <div className="text-left text-[#555] text-[15.5px] leading-relaxed space-y-5 max-w-[850px] mx-auto">
            <h2 className="text-[24px] font-black text-[#1e382f]">
              {storyTitle}
            </h2>
            <p>{storyP1}</p>
            <p>{storyP2}</p>

            {/* Hindi / Urdu Word Box */}
            <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-[24px] p-8 space-y-3 my-8 shadow-sm">
              <h3 className="font-black text-[#d85c27] text-[20px] sm:text-[22px]">
                {meaningTitle}
              </h3>
              <p className="text-[#555] text-[15px] leading-relaxed">
                {meaningP1}
              </p>
              <p className="text-[#555] text-[15px] leading-relaxed">
                {meaningP2}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(content.values || []).map((value, index) => <div key={index} className="bg-white rounded-[28px] p-8 shadow-sm border border-gray-100 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#d85c27]/10 flex items-center justify-center text-[#d85c27]"><Leaf className="w-6 h-6" /></div>
            <h3 className="text-[20px] font-black text-[#1e382f]">{isDe ? value.titleDe : value.titleEn}</h3>
            <p className="text-[#666] text-[14.5px] leading-relaxed">{isDe ? value.descDe : value.descEn}</p>
          </div>)}
        </div>

        {/* Visual Impression Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-[28px] overflow-hidden shadow-lg h-[320px] bg-[#ebdcd0]/30">
            <img
              src={content.aboutImg1 || "/assets/show5-BiQql1jr.jpeg"}
              alt="MAATI warm ambiance"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="rounded-[28px] overflow-hidden shadow-lg h-[320px] bg-[#ebdcd0]/30">
            <img
              src={content.aboutImg2 || "/assets/show2-CM6MShfY.jpeg"}
              alt="MAATI seating area"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
