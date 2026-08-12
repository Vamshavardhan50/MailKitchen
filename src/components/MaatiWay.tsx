import React from 'react';
import { MAATI_WAY_STEPS, DICTIONARY } from '../data/content';

interface MaatiWayProps {
  lang: 'de' | 'en';
}

export const MaatiWay: React.FC<MaatiWayProps> = ({ lang }) => {
  const text = DICTIONARY[lang];

  return (
    <section className="bg-[#f5f0e8] py-20 px-6 md:px-10">
      <div className="max-w-[1280px] mx-auto text-center">

        {/* Label */}
        <p className="text-[#d85c27] font-black tracking-[0.2em] text-[13px] mb-4 uppercase">
          {text.maati_way_label}
        </p>

        {/* Title */}
        <h2 className="text-[40px] md:text-[56px] font-black text-[#1a1a1a] mb-14">
          {text.maati_way_title}
        </h2>

        {/* Steps Grid */}
        <div className="flex flex-wrap justify-center gap-5">
          {MAATI_WAY_STEPS.map((s) => (
            <div
              key={s.step}
              className="bg-[#d85c27] text-white rounded-[20px] p-8 w-full max-w-[340px] text-left"
            >
              {/* Step Number Circle */}
              <div className="w-10 h-10 rounded-full bg-white text-[#d85c27] flex items-center justify-center font-black text-[16px] mb-5">
                {s.step}
              </div>

              {/* Step Title */}
              <h3 className="font-black text-[18px] mb-4 leading-snug">{s.title}</h3>

              {/* Items */}
              <ul className="space-y-1.5">
                {s.items.map((item) => (
                  <li key={item} className="text-[13px] text-white/90 flex items-start gap-2">
                    <span className="text-white/50 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
