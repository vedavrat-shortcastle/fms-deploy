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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'; // Dialog for modal
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import Loader from '@/components/Loader';
import { Label } from '@/components/ui/label';

// All the imports

interface FormField {
  id: string;
  fieldName: string;
  displayName: string;
  fieldType: string;
  isHidden: boolean;
  isMandatory: boolean;
  isDisabled: boolean;
  defaultValue: string | null;
  placeholder: string | null;
  validations: any; // Changed from object | null to any
  order: number;
  isCustomField: boolean;
}

export default function ConfigForm() {
  // Define a union type for the form types
  type FormType = 'PLAYER' | 'PARENT' | 'EVENT' | 'CLUB' | 'SUBSCRIPTION';
  const [selectedForm, setSelectedForm] = useState<FormType>('PLAYER');

  // Update endpoint
  // const updateMutation = trpc.config.updateFormConfig.useMutation();

  //   Main list to show all the fields recieved by api for a form type.
  const [fields, setFields] = useState<FormField[]>([]);

  // State for the edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit field modal button
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false); // State for Add field modal button

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

  const updateFieldMutation = trpc.config.updateField.useMutation();

  // Trigger refetch when selectedForm changes
  useEffect(() => {
    refetch();
  }, [selectedForm, refetch]);

  // What this does?
  // Creates an array called mappedfields and passes all the field values recieved from api for a form type.
  // e.g - All the form fields for PLAYER gets passed into mappedfield array.
  // Then the main fields array is updated with mapped fields.
  useEffect(() => {
    if (formConfig?.fields) {
      const mappedFields: FormField[] = formConfig.fields.map((field) => ({
        id: field.id,
        fieldName: field.fieldName,
        displayName: field.displayName,
        fieldType: field.fieldType,
        isHidden: field.isHidden,
        isMandatory: field.isMandatory,
        isDisabled: field.isDisabled,
        defaultValue: field.defaultValue,
        placeholder: field.placeholder,
        validations: field.validations,
        order: field.order,
        isCustomField: field.isCustomField,
      }));
      setFields(mappedFields);
      // update the main arrays with mapped fields array.
    }
  }, [formConfig]);

  // Function to handle edit action
  const handleEdit = (id: string) => {
    const fieldToView = fields.find((field) => field.id === id);
    if (fieldToView) {
      setSelectedField(fieldToView);
      setIsEditModalOpen(true);
    }
  };

  // Function to update the array on switching the toggle for mandator and visible.
  //   const updateField = (id: string, key: keyof FormField, value: any) => {
  //     setFields(
  //       fields.map((field) =>
  //         field.id === id ? { ...field, [key]: value } : field
  //       )
  //     );
  //   };

  // save function - calls the update endpoint
  //   const handleSave = () => {
  //     const updatedFields = fields.map(({ id, visible, mandatory }) => ({
  //       id: id, // Required for identifying the field
  //       isHidden: !visible, // Convert 'visible' to 'isHidden'
  //       isMandatory: mandatory, // Keep isMandatory unchanged
  //     }));

  //     updateMutation.mutate(
  //       {
  //         formType: selectedForm,
  //         fields: updatedFields,
  //       },
  //       {
  //         onSuccess: () => {
  //           alert('Form updated successfully!');
  //           refetch(); // Refresh form configuration
  //         },
  //         onError: (error) => {
  //           alert(`Error: ${error.message}`);
  //         },
  //       }
  //     );
  //   };
  // Handle save for edit modal (updateField)
  const handleSave = async () => {
    if (selectedField) {
      try {
        await updateFieldMutation.mutateAsync({
          formType: selectedForm,
          fieldName: selectedField.fieldName, // Changed from fieldId to fieldName
          field: {
            displayName: selectedField.displayName,
            isHidden: selectedField.isHidden,
            isMandatory: selectedField.isMandatory,
            isDisabled: selectedField.isDisabled,
            defaultValue: selectedField.defaultValue,
            placeholder: selectedField.placeholder,
            isCustomField: selectedField.isCustomField,
          },
        });

        setIsEditModalOpen(false);
        setSelectedField(null);
      } catch (error: any) {
        alert(`Error updating field: ${error.message}`);
      }
    }
  };

  const selectOptions = [
    { value: 'PLAYER', label: 'Player Form' },
    { value: 'PARENT', label: 'Parent Form' },
    { value: 'EVENT', label: 'Event Form' },
    { value: 'CLUB', label: 'Club Form' },
    { value: 'SUBSCRIPTION', label: 'Subscription Form' },
  ];

  const tableHeaders = [
    { label: 'Field-Name' },
    { label: 'Field Type' },
    { label: 'Label' },
    { label: 'Visible' },
    { label: 'Mandatory' },
    { label: 'Edit' },
  ];

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
            {selectOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end pb-2 pr-2">
        <Button
          onClick={() => setIsAddFieldOpen(true)}
          className="text-md px-8 bg-secondary font-semibold"
        >
          Add field
        </Button>
      </div>

      {/* Table */}
      {isLoading && (
        <div className="flex justify-center items-center min-h-screen">
          <Loader />
        </div>
      )}
      {error && (
        <p className="flex justify-center items-center min-h-screen text-primary">
          Error fetching configuration: {error.message}
        </p>
      )}

      <div className="w-full border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {tableHeaders.map((header, index) => (
                <TableHead key={index} className="font-medium text-gray-700">
                  {header.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field) => (
              <TableRow key={field.id} className="border-t">
                <TableCell className="font-medium">{field.fieldName}</TableCell>
                <TableCell className="font-medium">{field.fieldType}</TableCell>
                <TableCell>{field.displayName}</TableCell>
                <TableCell className="font-medium">
                  {field.isHidden ? 'True' : 'False'}
                </TableCell>
                <TableCell className="font-medium">
                  {field.isMandatory ? 'True' : 'False'}
                </TableCell>

                {/* New Edit cell with icon */}
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(field.id)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit {field.fieldName}</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* View Field Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Field Details</DialogTitle>
          </DialogHeader>
          {selectedField && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fieldName" className="text-right">
                  Field-Name
                </Label>
                <Input
                  id="fieldName"
                  value={selectedField.fieldName}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="displayName" className="text-right">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  value={selectedField.displayName}
                  className="col-span-3"
                  onChange={(e) =>
                    setSelectedField((prev) => ({
                      ...prev!,
                      label: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fieldType" className="text-right">
                  Field Type
                </Label>
                <Input
                  id="fieldType"
                  value={selectedField.fieldType}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isHidden" className="text-right">
                  Hidden
                </Label>
                <select
                  id="isHidden"
                  value={selectedField.isHidden ? 'True' : 'False'}
                  className="col-span-3 border border-gray-300 rounded-lg p-2"
                  onChange={(e) =>
                    setSelectedField((prev) => ({
                      ...prev!,
                      isHidden: e.target.value === 'True',
                    }))
                  }
                >
                  <option value="True">True</option>
                  <option value="False">False</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isMandatory" className="text-right">
                  Mandatory
                </Label>
                <select
                  id="isMandatory"
                  value={selectedField.isMandatory ? 'True' : 'False'}
                  className="col-span-3 border border-gray-300 rounded-lg p-2"
                  onChange={(e) =>
                    setSelectedField((prev) => ({
                      ...prev!,
                      isMandatory: e.target.value === 'True',
                    }))
                  }
                >
                  <option value="True">Mandatory</option>
                  <option value="False">Optional</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isDisabled" className="text-right">
                  Disabled
                </Label>
                <select
                  id="isDisabled"
                  value={selectedField.isDisabled ? 'True' : 'False'}
                  className="col-span-3 border border-gray-300 rounded-lg p-2"
                  onChange={(e) =>
                    setSelectedField((prev) => ({
                      ...prev!,
                      isDisabled: e.target.value === 'True',
                    }))
                  }
                >
                  <option value="True">True</option>
                  <option value="False">False</option>
                </select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="defaultValue" className="text-right">
                  Default Value
                </Label>
                <Input
                  id="defaultValue"
                  value={selectedField.defaultValue ?? ''}
                  className="col-span-3"
                  onChange={(e) =>
                    setSelectedField((prev) => ({
                      ...prev!,
                      defaultValue: e.target.value || null,
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="placeholder" className="text-right">
                  Placeholder
                </Label>
                <Input
                  id="placeholder"
                  value={selectedField.placeholder ?? ''}
                  className="col-span-3"
                  onChange={(e) =>
                    setSelectedField((prev) => ({
                      ...prev!,
                      placeholder: e.target.value || null,
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="validations" className="text-right">
                  Validations
                </Label>
                <textarea
                  id="validations"
                  value={
                    selectedField.validations
                      ? JSON.stringify(selectedField.validations, null, 2)
                      : ''
                  }
                  className="col-span-3 border border-gray-300 rounded-lg p-2 h-24 resize-y"
                  placeholder='e.g., { "minLength": 3, "maxLength": 50 }'
                  onChange={(e) => {
                    try {
                      const value = e.target.value
                        ? JSON.parse(e.target.value)
                        : null;
                      setSelectedField((prev) => ({
                        ...prev!,
                        validations: value,
                      }));
                    } catch (err) {
                      console.error('Invalid JSON for validations:', err);
                    }
                  }}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="order" className="text-right">
                  Order
                </Label>
                <Input
                  id="order"
                  type="number"
                  value={selectedField.order}
                  className="col-span-3"
                  onChange={(e) =>
                    setSelectedField((prev) => ({
                      ...prev!,
                      order: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button>Delete Field</Button>
            <Button type="submit" onClick={handleSave} className="bg-secondary">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Field Dialog */}
      <Dialog open={isAddFieldOpen} onOpenChange={setIsAddFieldOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Field Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="placeholder1" className="text-right">
                Field Name
              </Label>
              <Input
                id="id1"
                placeholder="Enter Field Name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="placeholder2" className="text-right">
                Field Type
              </Label>
              <select
                id="id2"
                value="TEXT"
                className="col-span-3 border border-gray-300 rounded-lg p-2"
              >
                <option value="TEXT">Text</option>
                <option value="NUMBER">Number</option>
                <option value="EMAIL">Email</option>
                <option value="PHONE">Phone</option>
                <option value="DATE">Date</option>
                <option value="SELECT">Select</option>
                <option value="MULTISELECT">Multi-select</option>
                <option value="CHECKBOX">Checkbox</option>
                <option value="RADIO">Radio</option>
                <option value="TEXTAREA">Textarea</option>
                <option value="FILE">File</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="placeholder3" className="text-right">
                Label
              </Label>
              <Input
                id="id3"
                className="col-span-3"
                placeholder="Enter Label"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="placeholder4" className="text-right">
                Order
              </Label>
              <Input id="id4" value="1" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mandatory" className="text-right">
                Mandatory
              </Label>
              <select
                id="id5"
                value="Optional"
                className="col-span-3 border border-gray-300 rounded-lg p-2"
              >
                <option value="True">Mandatory</option>
                <option value="False">Optional</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="visible" className="text-right">
                Visible
              </Label>
              <select
                id="id6"
                value="True"
                className="col-span-3 border border-gray-300 rounded-lg p-2"
              >
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsAddFieldOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-secondary">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
