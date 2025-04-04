'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSession } from 'next-auth/react';
import { SupportedLanguages } from '@prisma/client';
import { trpc } from '@/utils/trpc';

const languages = Object.values(SupportedLanguages).map((lang) => ({
  code: lang,
  label: `language_labels.${lang}`, // Use translation keys
}));

const getDirection = (lang: string) => {
  return ['ar', 'he', 'fa', 'ur'].includes(lang) ? 'rtl' : 'ltr';
};

const LanguageSwitcher = () => {
  const { data: session, update } = useSession(); // Include `update`
  const { i18n, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(
    session?.user?.language || i18n.language || 'en'
  );
  const [direction, setDirection] = useState(getDirection(selectedLanguage));
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);

  const updateLanguage = trpc.user.updateLanguage.useMutation({
    onSuccess: async (data) => {
      // Ensure session updates with the new language and direction
      setSelectedLanguage(data.language);
      await update({
        user: { ...session?.user, language: data.language, isRtl: data.isRtl },
      });
      setDirection(data.isRtl ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('dir', data.isRtl ? 'rtl' : 'ltr');
    },
  });

  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);

  const handleLanguageChange = (value: string) => {
    setPendingLanguage(value);
    setConfirmDialogOpen(true);
  };

  const confirmLanguageChange = () => {
    if (!pendingLanguage) return;

    // Change language in i18n
    i18n.changeLanguage(pendingLanguage);

    // Save to DB & update session
    updateLanguage.mutate({ language: pendingLanguage });

    setConfirmDialogOpen(false);
  };

  return (
    <div className="flex">
      <div className="mt-4">
        <Label className="text-sm font-medium">
          {t('language_preference')}
        </Label>
        <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t('select_language')} />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {t(lang.label)} {/* Use translation key */}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('confirm_language_change')}</DialogTitle>
          </DialogHeader>
          <p>{t('language_change_confirmation')}</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              {t('cancel')}
            </Button>
            <Button onClick={confirmLanguageChange}>{t('confirm')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LanguageSwitcher;
