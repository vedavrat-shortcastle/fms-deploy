'use client';

import type {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from 'react-hook-form';
import { type EditPlayerFormValues } from '@/schemas/Player.schema';
import PersonalInfoSection from '@/components/player-components/PersonalInfo';
import AddressSection from '@/components/player-components/AddressInfo';
import PlayerDetailsSection from '@/components/player-components/PlayerDetails';
import StudentDetailsSection from '@/components/player-components/StudentDetails';
import ClubInfoSection from '@/components/player-components/ClubInfo';

interface PlayerDetailsFormProps {
  player: EditPlayerFormValues;
  isEditing: boolean;
  register: UseFormRegister<EditPlayerFormValues>;
  errors: FieldErrors<EditPlayerFormValues>;
  control: any;
  setValue: any;
  handleSubmit: UseFormHandleSubmit<EditPlayerFormValues>;
  onSubmit: (data: EditPlayerFormValues) => void;
}

export default function PlayerDetailsForm({
  player,
  isEditing,
  register,
  errors,
  control,
  setValue,
  handleSubmit,
  onSubmit,
}: PlayerDetailsFormProps) {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6">
      <PersonalInfoSection
        register={register}
        errors={errors}
        isEditing={isEditing}
        player={player}
      />
      <AddressSection
        register={register}
        control={control} // Pass control
        setValue={setValue} // Pass setValue
        errors={errors}
        isEditing={isEditing}
        player={player}
      />
      <PlayerDetailsSection
        register={register}
        errors={errors}
        isEditing={isEditing}
        player={player}
      />
      <StudentDetailsSection
        register={register}
        errors={errors}
        isEditing={isEditing}
        player={player}
      />
      <ClubInfoSection
        register={register}
        errors={errors}
        isEditing={isEditing}
        player={player}
      />
    </form>
  );
}
