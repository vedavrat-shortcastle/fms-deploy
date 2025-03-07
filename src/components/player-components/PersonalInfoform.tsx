'use client';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Calendar } from 'lucide-react';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddPlayerFormData } from '@/schemas/addplayer.schema';

export function PersonalInformationForm() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<AddPlayerFormData>();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Personal & Contact Information
      </h3>

      {/* First Name */}
      <FormField
        control={control}
        name="personal.firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter First Name" {...field} />
            </FormControl>
            <FormMessage>{errors.personal?.firstName?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Last Name */}
      <FormField
        control={control}
        name="personal.lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter Last Name" {...field} />
            </FormControl>
            <FormMessage>{errors.personal?.lastName?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Birth Date */}
      <FormField
        control={control}
        name="personal.birthDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Birth Date</FormLabel>
            <div className="relative">
              <FormControl>
                <Input type="date" {...field} className="pr-10" />
              </FormControl>
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <FormMessage>{errors.personal?.birthDate?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Gender */}
      <FormField
        control={control}
        name="personal.gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage>{errors.personal?.gender?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Email */}
      <FormField
        control={control}
        name="personal.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="Enter Email" type="email" {...field} />
            </FormControl>
            <FormMessage>{errors.personal?.email?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Photo Upload */}
      <div className="space-y-1">
        <FormLabel>Photo Upload</FormLabel>
        <FormControl>
          <Input
            type="file"
            accept=".jpg,.jpeg,.png"
            {...register('personal.photo')}
          />
        </FormControl>
      </div>

      {/* Age Proof Upload */}
      <div className="space-y-1">
        <FormLabel>Age Proof Upload</FormLabel>
        <FormControl>
          <Input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            {...register('personal.ageProof')}
          />
        </FormControl>
      </div>
    </div>
  );
}
