'use client';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { toast } from '@/hooks/use-toast';
import {
  planFormValues,
  createPlanSchema as originalCreatePlanSchema,
  planFormDefaults,
} from '@/schemas/Membership.schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { toast } from '@/hooks/useToast';
import { trpc } from '@/utils/trpc';
import * as z from 'zod';

// Modify the schema to accept benefits as a string
const createPlanSchema = originalCreatePlanSchema.extend({
  benefits: z.string(),
});

type CustomPlanFormValues = Omit<planFormValues, 'benefits'> & {
  benefits: string;
};

export default function PlanForm({ onClose }: { onClose: () => void }) {
  const createPlan = trpc.membership.createPlan.useMutation();

  const form = useForm<CustomPlanFormValues>({
    resolver: zodResolver(createPlanSchema),
    mode: 'onTouched',
    defaultValues: {
      ...planFormDefaults,
      benefits: '',
    },
  });

  const onSubmit = async (data: CustomPlanFormValues) => {
    try {
      // Split the benefits string by comma and update the field value as an array
      const formattedData = {
        ...data,
        benefits: data.benefits
          .split(', ')
          .map((item) => item.trim())
          .filter(Boolean),
      };
      // Call the mutation and wait for the result
      await createPlan.mutateAsync(formattedData);
      toast({
        title: 'Plan created successfully',
        description: 'Your membership plan has been created',
        variant: 'default',
      });
      form.reset();
      onClose(); // Close the modal after successful submission
    } catch (error: any) {
      toast({
        title: 'Error creating plan',
        description: error.message,
        variant: 'destructive',
      });
      console.error('Error creating plan:', error);
    }
  };

  return (
    <div className=" max-w-3xl mx-auto">
      {/* Header */}

      <div className="flex flex-col items-center">
        <div className="w-full max-w-3xl p-0 border rounded-lg shadow-md">
          <div className="p-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <FormField
                    // control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Plan name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Plan name" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <label className="block mb-1 text-sm">
                      duration(months) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="months"
                                type="number"
                                {...field}
                                className="w-16"
                                {...field}
                                value={isNaN(field.value) ? '' : field.value}
                                onChange={(e) => {
                                  const newValue = Math.max(
                                    0,
                                    e.target.valueAsNumber
                                  );
                                  field.onChange(
                                    isNaN(newValue) ? '' : newValue
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* it might usefull  */}
                      {/* <FormField
                        control={form.control}
                        name=""
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Select onValueChange={field.onChange}>
                                <SelectTrigger className="w-40">
                                  <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="month">month</SelectItem>
                                  <SelectItem value="year">year</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-medium">
                            Currency <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a currency" />
                              </SelectTrigger>

                              <SelectContent>
                                <SelectItem value="usd">USD</SelectItem>
                                <SelectItem value="eur">EUR</SelectItem>
                                <SelectItem value="nzd">NZ$</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Price <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Price"
                              type="number"
                              className="w-16"
                              {...field}
                              value={isNaN(field.value) ? '' : field.value}
                              onChange={(e) => {
                                const newValue = Math.max(
                                  0,
                                  e.target.valueAsNumber
                                );
                                field.onChange(isNaN(newValue) ? '' : newValue);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="benefits"
                    render={({ field }) => {
                      // Convert the array to a comma-separated string for display
                      const displayValue = field.value || '';

                      return (
                        <FormItem>
                          <FormLabel>
                            Benefits <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              value={displayValue}
                              onChange={field.onChange}
                              placeholder="Enter each benefit separated by a comma"
                              required
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Description"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="autoRenewal"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel
                          className="text-sm font-normal"
                          style={{ marginTop: 0 }}
                        >
                          Auto-Renewal
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Buttons */}
                  <div className="flex justify-end mt-4 gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-red-600 hover:bg-red-700">
                      Save
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
