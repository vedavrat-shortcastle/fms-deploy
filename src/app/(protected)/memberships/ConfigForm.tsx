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
  name: string;
  visible: boolean;
  mandatory: boolean;
  label: string;
  fieldType: string;
  order: number;
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

  // New field state for the add field dialog.
  const [newField, setNewField] = useState<Partial<FormField>>({
    name: '',
    fieldType: 'TEXT',
    label: '',
    mandatory: false,
    visible: true,
    order: 0,
  });

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

  // What this does?
  // Creates an array called mappedfields and passes all the field values recieved from api for a form type.
  // e.g - All the form fields for PLAYER gets passed into mappedfield array.
  // Then the main fields array is updated with mapped fields.
  useEffect(() => {
    if (formConfig?.fields) {
      const mappedFields: FormField[] = formConfig.fields.map((field) => ({
        id: field.id,
        name: field.fieldName, // mapping fieldName from API to name
        label: field.displayName, // mapping displayName to label
        visible: !field.isHidden, // assuming true means visible, so invert isHidden
        mandatory: field.isMandatory, // mapping directly
        fieldType: field.fieldType, // NEW: mapping fieldType from API
        order: field.order,
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
  const handleEditSave = () => {
    if (selectedField) {
      setFields((prevFields) =>
        prevFields.map((field) =>
          field.id === selectedField.id ? { ...selectedField } : field
        )
      );
    }
    setIsEditModalOpen(false);
    setSelectedField(null);
  };

  // Function to handle adding a new field.
  const handleAddField = () => {
    // Generate a unique ID for the new field (simple example using Date.now())
    const newFieldWithId: FormField = {
      id: Date.now().toString(),
      name: newField.name || 'New Field',
      fieldType: newField.fieldType || 'TEXT',
      label: newField.label || 'New Label',
      mandatory: newField.mandatory ?? false,
      visible: newField.visible ?? true,
      order: newField.order ?? 0,
    };
    // Add the new field to the array.
    setFields((prev) => [...prev, newFieldWithId]);
    // Reset new field state.
    setNewField({
      name: '',
      fieldType: 'TEXT',
      label: '',
      mandatory: false,
      visible: true,
      order: 0,
    });
    // Close the add field dialog.
    setIsAddFieldOpen(false);
  };

  const handleNewFieldChange = (
    key: keyof FormField,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let value: any = event.target.value;
    if (key === 'order') {
      value = Number(value);
    } else if (key === 'visible' || key === 'mandatory') {
      value = value === 'True';
    }
    setNewField((prev) => ({ ...prev, [key]: value }));
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

  const editFieldChange = (
    key: keyof FormField,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let value: any = event.target.value;
    if (key === 'order') {
      value = Number(value);
    } else if (key === 'visible' || key === 'mandatory') {
      value = value === 'True';
    }
    setSelectedField((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleDeleteField = (id: string) => {
    // Remove the field with the given id.
    setFields((prevFields) => prevFields.filter((field) => field.id !== id));
    // Optionally, if the field being deleted is the currently selected field, close the modal.
    if (selectedField && selectedField.id === id) {
      setSelectedField(null);
      setIsEditModalOpen(false);
    }
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
                <TableCell className="font-medium">{field.name}</TableCell>
                <TableCell className="font-medium">{field.fieldType}</TableCell>
                <TableCell>{field.label}</TableCell>
                <TableCell className="font-medium">
                  {field.visible ? 'True' : 'False'}
                </TableCell>
                <TableCell className="font-medium">
                  {field.mandatory ? 'True' : 'False'}
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
                    <span className="sr-only">Edit {field.name}</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Field Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Field Details</DialogTitle>
          </DialogHeader>
          {selectedField && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Field-Name
                </Label>
                <Input
                  id="name"
                  value={selectedField.name}
                  className="col-span-3"
                  onChange={(e) => editFieldChange('name', e)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fieldType" className="text-right">
                  Field Type
                </Label>
                <select
                  id="fieldType"
                  value={selectedField.fieldType}
                  className="col-span-3 border border-gray-300 rounded-lg p-2"
                  onChange={(e) => editFieldChange('fieldType', e)}
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
                <Label htmlFor="label" className="text-right">
                  Label
                </Label>
                <Input
                  id="label"
                  value={selectedField.label}
                  className="col-span-3"
                  onChange={(e) => editFieldChange('label', e)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="order" className="text-right">
                  Order
                </Label>
                <Input
                  id="order"
                  value={selectedField.order}
                  type="number" // Added
                  className="col-span-3"
                  onChange={(e) => editFieldChange('order', e)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="visible" className="text-right">
                  Visible
                </Label>
                <select
                  id="visible"
                  value={selectedField.visible ? 'True' : 'False'}
                  className="col-span-3 border border-gray-300 rounded-lg p-2"
                  onChange={(e) => editFieldChange('visible', e)}
                >
                  <option value="True">True</option>
                  <option value="False">False</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="mandatory" className="text-right">
                  Mandatory
                </Label>
                <select
                  id="mandatory"
                  value={selectedField.mandatory ? 'True' : 'False'} // Match option values
                  className="col-span-3 border border-gray-300 rounded-lg p-2"
                  onChange={(e) => editFieldChange('mandatory', e)}
                >
                  <option value="True">Mandatory</option>
                  <option value="False">Optional</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => handleDeleteField(selectedField!.id)}>
              Delete Field
            </Button>
            <Button
              type="submit"
              onClick={handleEditSave}
              className="bg-secondary"
            >
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
                id="newName"
                placeholder="Enter Field Name"
                className="col-span-3"
                value={newField.name || ''}
                onChange={(e) => handleNewFieldChange('name', e)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="placeholder2" className="text-right">
                Field Type
              </Label>
              <select
                id="newFieldType"
                className="col-span-3 border border-gray-300 rounded-lg p-2"
                value={newField.fieldType || 'TEXT'}
                onChange={(e) => handleNewFieldChange('fieldType', e)}
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
                id="newLabel"
                placeholder="Enter Label"
                className="col-span-3"
                value={newField.label || ''}
                onChange={(e) => handleNewFieldChange('label', e)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mandatory" className="text-right">
                Mandatory
              </Label>
              <select
                id="newMandatory"
                className="col-span-3 border border-gray-300 rounded-lg p-2"
                value={newField.mandatory ? 'True' : 'False'}
                onChange={(e) => handleNewFieldChange('mandatory', e)}
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
                id="newVisible"
                className="col-span-3 border border-gray-300 rounded-lg p-2"
                value={newField.visible ? 'True' : 'False'}
                onChange={(e) => handleNewFieldChange('visible', e)}
              >
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsAddFieldOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              onClick={handleAddField}
              className="bg-secondary"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
