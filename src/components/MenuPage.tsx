import React from 'react';
import { June2026Menu } from './June2026Menu';

interface MenuPageProps {
  lang?: 'de' | 'en';
  onOpenReservation?: () => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ lang = 'en', onOpenReservation }) => {
  return <June2026Menu lang={lang} onOpenReservation={onOpenReservation} />;
};
