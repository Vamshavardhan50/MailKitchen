import React from 'react';

interface AboutSectionProps {
  lang: 'de' | 'en';
}

export const AboutSection: React.FC<AboutSectionProps> = ({ lang }) => {
  const isDe = lang === 'de';

  return (
    <section id="about" className="bg-[#f5f0e8] pt-[120px] md:pt-[140px] pb-20 px-6 md:px-10">
      <div className="max-w-[1000px] mx-auto bg-white rounded-[32px] p-8 md:p-14 shadow-sm border border-gray-100 text-center space-y-8">

        <div>
          <h2 className="text-[36px] md:text-[46px] font-black text-[#1a1a1a] mb-3">
            {isDe ? 'Über Maati' : 'About Maati'}
          </h2>
          <p className="text-[#666] text-[15px] max-w-[620px] mx-auto leading-relaxed">
            {isDe
              ? 'Ein modernes indisches Quick-Service-Restaurant mit individuell zusammengestellten, bekömmlichen Gerichten — in Tradition verwurzelt.'
              : 'A modern Indian quick-service restaurant offering customizable, wholesome meals — rooted in tradition, crafted for everyday life.'}
          </p>
          <div className="w-16 h-1 bg-[#1e382f] mx-auto mt-6 rounded-full" />
        </div>

        <div className="text-left text-[#555] text-[14px] leading-relaxed space-y-4 max-w-[760px] mx-auto">
          <p>
            {isDe
              ? 'Maati ist ein modernes indisches Quick-Service-Restaurant. Aufbauend auf traditionellen Rezepten und sorgfältig abgestimmten Zutaten nährt unser Essen den Körper mit alter Weisheit, bleibt dabei aber frisch, ausgewogen und lecker.'
              : 'Maati is a modern Indian quick-service restaurant offering customizable, wholesome meals. Rooted in traditional recipes and thoughtfully paired accompaniments, our food nourishes the body with age-old wisdom while staying bold, fun, and balanced.'}
          </p>

          <p className="font-bold text-[#1a1a1a]">
            {isDe ? 'Mittagessen, das Sie jeden Tag genießen können.' : 'Lunch you can enjoy every day.'}
          </p>

          <div className="bg-[#fcf8f3] border border-[#ebdcd0] rounded-[20px] p-6 space-y-2 my-6">
            <h4 className="font-black text-[#1a1a1a] text-[16px]">
              {isDe
                ? '“मिट्टी — Maati: Das Wort, das Indien verbindet”'
                : '“मिट्टी — Maati: The word that connects India”'}
            </h4>
            <p className="text-[#555] text-[13px] leading-relaxed">
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
            <p className="text-[#555] text-[13px] leading-relaxed">
              {isDe
                ? 'Es ist der Boden unter Ihren Füßen, der Ton unserer Schalen und die Erde, auf der Kurkuma im Garten unserer Großmutter wuchs.'
                : "It's the soil beneath your feet, the clay of our bowls, and the earth where turmeric grew in grandmother's garden."}
            </p>
          </div>

          <p className="text-[13px] text-[#777]">
            {isDe
              ? 'Bei Maati feiern wir diese tiefgründige Verbindung. Egal wohin wir reisen, wir tragen alle ein Stück Maati in uns.'
              : 'At Maati, we celebrate this deep connection. Because no matter where we travel, we all carry a little bit of Maati with us.'}
          </p>
        </div>

      </div>
    </section>
  );
};
