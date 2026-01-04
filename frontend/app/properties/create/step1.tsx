'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { propertyApi } from '@/lib/api';
import { CreatePropertyDto, PropertyType, PropertyManager, Accountant, PdfExtractionResult } from '@/types/property';
import FileUpload from '@/components/FileUpload';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowForward as ArrowRightIcon,
  ArrowBack as ArrowLeftIcon,
} from '@mui/icons-material';
import React from 'react';

const schema = z.object({
  name: z.string().min(1, 'Property name is required'),
  type: z.nativeEnum(PropertyType),
  unique_number: z.string().min(1, 'Unique number is required'),
  property_manager_id: z.string().optional(),
  accountant_id: z.string().optional(),
});

interface Step1Props {
  onComplete: (data: CreatePropertyDto, id: number) => void;
  onBack: () => void;
  pdfData: PdfExtractionResult | null;
  onPdfDataChange: (data: PdfExtractionResult | null) => void;
}

export default function Step1({ onComplete, onBack, pdfData, onPdfDataChange }: Step1Props) {
  const [managers, setManagers] = useState<PropertyManager[]>([]);
  const [accountants, setAccountants] = useState<Accountant[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: PropertyType.WEG,
    },
  });

  useEffect(() => {
    loadManagersAndAccountants();
  }, []);

  useEffect(() => {
    if (pdfData) {
      if (pdfData.property?.name) {
        setValue('name', pdfData.property?.name);
      }
    }
  }, [pdfData, setValue]);

  const loadManagersAndAccountants = async () => {
    try {
      const [managersData, accountantsData] = await Promise.all([
        propertyApi.getManagers(),
        propertyApi.getAccountants(),
      ]);
      setManagers(managersData);
      setAccountants(accountantsData);
    } catch (error) {
      console.error('Failed to load managers/accountants:', error);
    }
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsProcessingPdf(true);
    try {
      const extractedData = await propertyApi.parsePdf(file);
      onPdfDataChange(extractedData);
      
      // Pre-fill form with extracted data
      if (extractedData.property.name) {
        setValue('name', extractedData.property.name);
      }
    } catch (error) {
      console.error('Failed to parse PDF:', error);
      alert('Failed to extract data from PDF. Please continue manually.');
    } finally {
      setIsProcessingPdf(false);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    onPdfDataChange(null);
  };

  const onSubmit = async (formData: z.infer<typeof schema>) => {
    setIsSubmitting(true);
    try {
      // Convert string IDs to numbers (or undefined if empty)
      const data: CreatePropertyDto = {
        ...formData,
        property_manager_id: formData.property_manager_id ? Number(formData.property_manager_id) : undefined,
        accountant_id: formData.accountant_id ? Number(formData.accountant_id) : undefined,
      };
      const property = await propertyApi.create(data);
      onComplete(data, property.id);
    } catch (error) {
      console.error('Failed to create property:', error);
      alert('Failed to create property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" component="h2" gutterBottom fontWeight="semibold">
          General Information
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
          <FormControl fullWidth error={!!errors.type}>
            <InputLabel>Management Type *</InputLabel>
            <Select
              {...register('type')}
              label="Management Type *"
              defaultValue={PropertyType.WEG}
            >
              <MenuItem value={PropertyType.WEG}>WEG</MenuItem>
              <MenuItem value={PropertyType.MV}>MV</MenuItem>
            </Select>
            {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
          </FormControl>

          <TextField
            {...register('name')}
            label="Property Name *"
            placeholder="Enter property name"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            {...register('unique_number')}
            label="Unique Number *"
            placeholder="Enter unique property number"
            fullWidth
            error={!!errors.unique_number}
            helperText={errors.unique_number?.message}
          />

          <FormControl fullWidth>
            <InputLabel>Property Manager</InputLabel>
            <Select
              {...register('property_manager_id')}
              label="Property Manager"
            >
              <MenuItem value="">Select a property manager</MenuItem>
              {managers.map((manager) => (
                <MenuItem key={manager.id} value={String(manager.id)}>
                  {manager.name} ({manager.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Accountant</InputLabel>
            <Select
              {...register('accountant_id')}
              label="Accountant"
            >
              <MenuItem value="">Select an accountant</MenuItem>
              {accountants.map((accountant) => (
                <MenuItem key={accountant.id} value={String(accountant.id)}>
                  {accountant.name} ({accountant.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              Teilungserklärung (Declaration of Division)
            </Typography>
            <FileUpload
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              selectedFile={selectedFile}
              isLoading={isProcessingPdf}
            />
            {(isSubmitting || isProcessingPdf) && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
                <CircularProgress sx={{ mb: 2 }} />
              </Box>
            )}
            {pdfData && (
              <Alert severity="success" sx={{ mt: 2 }}>
                PDF processed successfully. Data will be pre-filled in the next steps.
              </Alert>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 3, borderTop: 1, borderColor: 'divider' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowLeftIcon />}
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          endIcon={<ArrowRightIcon />}
          disabled={isSubmitting || isProcessingPdf}
        >
          Next: Building Data
        </Button>
      </Box>
    </Box>
  );
}
