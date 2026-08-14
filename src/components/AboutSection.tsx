import React from 'react';
import { SEO } from './SEO';

interface AboutSectionProps {
  lang: 'de' | 'en';
}

export const AboutSection: React.FC<AboutSectionProps> = ({ lang }) => {
  const isDe = lang === 'de';

  return (
    <section id="about" className="bg-[#f5f0e8] min-h-screen pt-[96px] sm:pt-[120px] md:pt-[150px] pb-16 sm:pb-28 px-4 sm:px-8 md:px-16 lg:px-24">
      <SEO
        title={isDe ? 'Über Uns | MAATI Kitchen Berlin' : 'About Us | MAATI Kitchen Berlin'}
        description={
          isDe
            ? 'Erfahren Sie mehr über MAATI Kitchen – Traditionelle indische Rezepte, moderne Fast-Casual Bowls und unsere Philosophie in Berlin Mitte.'
            : 'Learn more about MAATI Kitchen – Traditional Indian recipes, modern fast-casual bowls, and wholesome food philosophy in Berlin.'
        }
        canonicalUrl="https://maatikitchen.com/about"
        lang={lang}
      />

      <div className="max-w-[1100px] mx-auto bg-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 md:p-16 lg:p-20 shadow-sm border border-gray-100 text-center space-y-8 sm:space-y-10">

        <div>
          <h1 className="text-[38px] md:text-[50px] font-black text-[#1a1a1a] mb-4">
            {isDe ? 'Über Maati' : 'About Maati'}
          </h1>
          <p className="text-[#666] text-[16px] max-w-[660px] mx-auto leading-relaxed">
            {isDe
              ? 'Ein modernes indisches Quick-Service-Restaurant mit individuell zusammengestellten, bekömmlichen Gerichten — in Tradition verwurzelt.'
              : 'A modern Indian quick-service restaurant offering customizable, wholesome meals — rooted in tradition, crafted for everyday life.'}
          </p>
          <div className="w-16 h-1.5 bg-[#d85c27] mx-auto mt-6 rounded-full" />
        </div>

        <div className="text-left text-[#555] text-[15px] leading-relaxed space-y-5 max-w-[800px] mx-auto">
          <p>
            {isDe
              ? 'Maati ist ein modernes indisches Quick-Service-Restaurant. Aufbauend auf traditionellen Rezepten und sorgfältig abgestimmten Zutaten nährt unser Essen den Körper mit alter Weisheit, bleibt dabei aber frisch, ausgewogen und lecker.'
              : 'Maati is a modern Indian quick-service restaurant offering customizable, wholesome meals. Rooted in traditional recipes and thoughtfully paired accompaniments, our food nourishes the body with age-old wisdom while staying bold, fun, and balanced.'}
          </p>

          <p className="font-bold text-[#1a1a1a] text-[16px]">
            {isDe ? 'Mittagessen, das Sie jeden Tag genießen können.' : 'Lunch you can enjoy every day.'}
          </p>

          <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-[24px] p-8 space-y-3 my-8 shadow-sm">
            <h4 className="font-black text-[#1a1a1a] text-[18px]">
              {isDe
                ? '“मिट्टी — Maati: Das Wort, das Indien verbindet”'
                : '“मिट्टी — Maati: The word that connects India”'}
            </h4>
            <p className="text-[#555] text-[14px] leading-relaxed">
              {isDe ? (
                <>
                  <strong>Maati (मिट्टी)</strong> ist das Hindi/Urdu-Wort für Erde oder Boden. Für uns ist Maati ein lebendiges Konzept — eines der emotionalsten Wörter unserer Kultur.
                </>
              ) : (
                <>
                  <strong>Maati (मिट्टी)</strong> is the Hindi/Urdu word for earth or soil. To us, Maati is a living concept — one of the most emotive words in our culture.
                </>
              )}
            </p>
            <p className="text-[#555] text-[14px] leading-relaxed">
              {isDe
                ? 'Es ist der Boden unter Ihren Füßen, der Ton unserer Schalen und die Erde, auf der Kurkuma im Garten unserer Großmutter wuchs.'
                : "It's the soil beneath your feet, the clay of our bowls, and the earth where turmeric grew in grandmother's garden."}
            </p>
          </div>

          <p>
            {isDe
              ? 'Wir laden Sie ein, eine moderne Interpretation indischer Esskultur zu erleben — schnell, nahrhaft und voller Seele.'
              : 'We invite you to experience a reimagined interpretation of Indian culinary tradition — vibrant, nourishing, and soulful.'}
          </p>
        </div>

      </div>
    </section>
  );
};
