// src/components/languageSwitcher.tsx
'use client';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // Adjust to your UI library
import { SupportedLanguages } from '@prisma/client';

interface LanguageSwitcherProps {
  lng: string;
}

export default function LanguageSwitcher({ lng }: LanguageSwitcherProps) {
  const { i18n } = useTranslation('common');
  const router = useRouter();

  const handleChangeLanguage = async (value: string) => {
    i18n.changeLanguage(value);
    router.refresh(); // Refresh to reflect new session language
  };

  return (
    <Select onValueChange={handleChangeLanguage} value={i18n.language}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder={i18n.language || lng} />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(SupportedLanguages).map((locale) => (
          <SelectItem key={locale} value={locale}>
            {locale}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
