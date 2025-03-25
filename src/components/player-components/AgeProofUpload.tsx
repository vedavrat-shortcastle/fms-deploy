'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileText, Upload, Eye } from 'lucide-react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { EditPlayerFormValues } from '@/schemas/Player.schema';

interface AgeProofUploadProps {
  register: UseFormRegister<EditPlayerFormValues>;
  errors: FieldErrors<EditPlayerFormValues>;
  isEditing: boolean;
  player: EditPlayerFormValues | null;
  onNextTab?: () => void;
}

export default function AgeProofUpload({
  register,
  isEditing,
  player,
}: AgeProofUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Handle file upload and preview
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Render file preview or file input field
  const renderAgeProofContent = () => {
    const ageProofUrl = previewUrl || player?.playerDetails?.ageProof;

    if (isEditing) {
      return (
        <div className="flex items-center">
          <label className="w-full p-1 border rounded cursor-pointer flex items-center gap-2">
            <Upload className="w-5 h-5 text-gray-500" />
            <span>{ageProofUrl ? 'Change file' : 'Click to upload'}</span>
            <input
              type="file"
              className="hidden"
              {...register('playerDetails.ageProof')}
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={handleFileUpload}
            />
          </label>
          {ageProofUrl && (
            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(true)}
              className="ml-2 flex items-center gap-1"
            >
              <Eye className="w-4 h-4" /> Preview
            </Button>
          )}
        </div>
      );
    } else {
      if (!ageProofUrl)
        return <p className="text-gray-700">No age proof document uploaded</p>;

      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(ageProofUrl);
      const isPdf = /\.pdf$/i.test(ageProofUrl);

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-1"
          >
            <Eye className="w-4 h-4" /> Preview
          </Button>
          <Button
            variant="default"
            onClick={() => window.open(ageProofUrl, '_blank')}
            className="flex items-center gap-1"
          >
            <FileText className="w-4 h-4" /> Download
          </Button>

          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Age Proof Document</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4">
                <div className="w-full h-[500px] overflow-auto border rounded-md">
                  {isImage ? (
                    <img
                      src={ageProofUrl}
                      alt="Age Proof Document"
                      className="w-full h-auto object-contain"
                    />
                  ) : isPdf ? (
                    <iframe
                      src={`${ageProofUrl}#toolbar=0`}
                      className="w-full h-full"
                      title="Age Proof Document"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p>Preview not available for this file type</p>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Ageproof</label>
      {renderAgeProofContent()}
    </div>
  );
}

export { AgeProofUpload };
