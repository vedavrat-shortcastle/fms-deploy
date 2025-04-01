'use client';

import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { trpc } from '@/utils/trpc';

// All the imports

interface FormField {
  id: string;
  name: string;
  visible: boolean;
  mandatory: boolean;
  label: string;
  fieldType: string; // NEW: To store the field type value
}

export default function ConfigForm() {
  // Define a union type for the form types
  type FormType = 'PLAYER' | 'PARENT' | 'EVENT' | 'CLUB' | 'SUBSCRIPTION';
  const [selectedForm, setSelectedForm] = useState<FormType>('PLAYER');

  // Update endpoint
  const updateMutation = trpc.config.updateFormConfig.useMutation();

  //   Main list to show all the fields recieved by api for a form type.
  const [fields, setFields] = useState<FormField[]>([]);

  // We disable the query initially so that it only runs when selectedForm changes.
  const {
    data: formConfig, // Main list for all the fields
    refetch,
    error,
    isLoading,
  } = trpc.config.getFormConfig.useQuery(
    { formType: selectedForm },
    { enabled: false } // initially disabled
  );

  // Trigger refetch when selectedForm changes
  useEffect(() => {
    refetch();
  }, [selectedForm, refetch]);

  useEffect(() => {
    console.log('Updated fields:', fields);
  }, [fields]);

  // What this does?
  // Creates an array called mappedfields and passes all the field values recieved from api for a form type.
  // e.g - All the form fields for PLAYER gets passed into mappedfield array.
  // Then the main fields array is updated with mapped fields.
  useEffect(() => {
    if (formConfig?.fields) {
      console.log('API Response:', formConfig); // Log the complete response
      const mappedFields: FormField[] = formConfig.fields.map((field) => ({
        id: field.id,
        name: field.fieldName, // mapping fieldName from API to name
        label: field.displayName, // mapping displayName to label
        visible: !field.isHidden, // assuming true means visible, so invert isHidden
        mandatory: field.isMandatory, // mapping directly
        fieldType: field.fieldType, // NEW: mapping fieldType from API
      }));
      setFields(mappedFields);
      // update the main arrays with mapped fields array.
    }
  }, [formConfig]);

  // Function to update the array on switching the toggle for mandator and visible.
  const updateField = (id: string, key: keyof FormField, value: any) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  // save function - calls the update endpoint
  const handleSave = () => {
    const updatedFields = fields.map(({ id, visible, mandatory }) => ({
      id: id, // Required for identifying the field
      isHidden: !visible, // Convert 'visible' to 'isHidden'
      isMandatory: mandatory, // Keep isMandatory unchanged
    }));

    updateMutation.mutate(
      {
        formType: selectedForm,
        fields: updatedFields,
      },
      {
        onSuccess: () => {
          alert('Form updated successfully!');
          refetch(); // Refresh form configuration
        },
        onError: (error) => {
          alert(`Error: ${error.message}`);
        },
      }
    );
  };

  return (
    <div>
      <h2 className="font-extrabold text-xl pb-7">Form Configuration</h2>
      <div className="w-full max-w-sm pb-4">
        {/* Select dropdown */}
        <div className="text-md pb-2">Select Form</div>
        <Select
          defaultValue={selectedForm}
          onValueChange={(value) => setSelectedForm(value as FormType)}
        >
          <SelectTrigger className="w-full bg-gray-50 border-gray-200">
            <SelectValue placeholder="Select Form" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PLAYER">Player Form</SelectItem>
            <SelectItem value="PARENT">Parent Form</SelectItem>
            <SelectItem value="EVENT">Event Form</SelectItem>
            <SelectItem value="CLUB">Club Form</SelectItem>
            <SelectItem value="SUBSCRIPTION">Subscription Form</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Table */}
      {isLoading && <p>Loading form configuration...</p>}
      {error && (
        <p className="text-primary">
          Error fetching configuration: {error.message}
        </p>
      )}

      <div className="w-full border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium text-gray-700">
                Field-Name
              </TableHead>
              <TableHead className="font-medium text-gray-700">
                Field Type
              </TableHead>
              {/* NEW Column */}
              <TableHead className="font-medium text-gray-700 text-center">
                Show/Hide
              </TableHead>
              <TableHead className="font-medium text-gray-700 text-center">
                Optional/Mandatory
              </TableHead>
              <TableHead className="font-medium text-gray-700">Label</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field) => (
              <TableRow key={field.id} className="border-t">
                <TableCell className="font-medium">{field.name}</TableCell>
                <TableCell className="font-medium">{field.fieldType}</TableCell>
                {/* NEW Cell */}
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Switch
                      checked={field.visible}
                      onCheckedChange={(checked) =>
                        updateField(field.id, 'visible', checked)
                      }
                    />
                    <span className="ml-2 text-sm text-gray-500">
                      {field.visible ? 'Show' : 'Hide'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Switch
                      checked={field.mandatory}
                      onCheckedChange={(checked) =>
                        updateField(field.id, 'mandatory', checked)
                      }
                    />
                    <span className="ml-2 text-sm text-gray-500">
                      {field.mandatory ? 'Mandatory' : 'Optional'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{field.label}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <button
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
