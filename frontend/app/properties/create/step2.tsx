'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { buildingApi } from '@/lib/api';
import { BuildingExt, Building, PdfExtractionResult } from '@/types/property';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton,
  Divider,
} from '@mui/material';
import {
  ArrowForward as ArrowRightIcon,
  ArrowBack as ArrowLeftIcon,
  Add as PlusIcon,
  Delete as TrashIcon,
} from '@mui/icons-material';

const buildingSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  house_number: z.string().min(1, 'House number is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().optional(),
  additional_details: z.string().optional(),
});

interface Step2Props {
  propertyId: number;
  onComplete: (buildings: BuildingExt[]) => void;
  onBack: () => void;
  pdfData: PdfExtractionResult | null;
}

export default function Step2({ propertyId, onComplete, onBack, pdfData }: Step2Props) {
  const [buildings, setBuildings] = useState<BuildingExt[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (pdfData && pdfData.buildings.length > 0) {
      setBuildings(pdfData.buildings);
    } else {
      // Start with one empty building
      setBuildings([
        {
          number: 0,
          name: '',
          street: '',
          house_number: '',
          postal_code: '',
          city: '',
          country: 'Germany',
          additional_details: '',
        },
      ]);
    }
  }, [pdfData]);

  const addBuilding = () => {
    setBuildings([
      ...buildings,
      {
        number: 0,
        name: '',
        street: '',
        house_number: '',
        postal_code: '',
        city: '',
        country: 'Germany',
        additional_details: '',
      },
    ]);
  };

  const removeBuilding = (index: number) => {
    if (buildings.length > 1) {
      setBuildings(buildings.filter((_, i) => i !== index));
    }
  };

  const updateBuilding = (index: number, field: keyof BuildingExt, value: string) => {
    const updated = [...buildings];
    updated[index] = { ...updated[index], [field]: value };
    setBuildings(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate all buildings
      for (const building of buildings) {
        buildingSchema.parse(building);
      }

      // Save buildings to backend
      await buildingApi.createMany(propertyId, buildings);
      onComplete(buildings);
    } catch (error) {
      console.error('Failed to save buildings:', error);
      if (error instanceof z.ZodError) {
        alert('Please fill in all required fields for all buildings.');
      } else {
        alert('Failed to save buildings. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" component="h2" gutterBottom fontWeight="semibold">
          Building Data
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Add one or more buildings for this property. {pdfData && pdfData.buildings.length > 0 && 'Data from PDF has been pre-filled.'}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {buildings.map((building, index) => (
            <Paper key={index} variant="outlined" sx={{ p: 3, bgcolor: 'grey.50' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h3">
                  Building {index + 1}
                </Typography>
                {buildings.length > 1 && (
                  <IconButton
                    color="error"
                    onClick={() => removeBuilding(index)}
                    size="small"
                  >
                    <TrashIcon />
                  </IconButton>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Street *"
                    value={building.street}
                    onChange={(e) => updateBuilding(index, 'street', e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="House Number *"
                    value={building.house_number}
                    onChange={(e) => updateBuilding(index, 'house_number', e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Postal Code *"
                    value={building.postal_code}
                    onChange={(e) => updateBuilding(index, 'postal_code', e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="City *"
                    value={building.city}
                    onChange={(e) => updateBuilding(index, 'city', e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Country"
                    value={building.country || 'Germany'}
                    onChange={(e) => updateBuilding(index, 'country', e.target.value)}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Additional Details"
                    value={building.additional_details || ''}
                    onChange={(e) => updateBuilding(index, 'additional_details', e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<PlusIcon />}
          onClick={addBuilding}
          sx={{ mt: 2 }}
        >
          Add Another Building
        </Button>
      </Box>

      <Divider />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
          disabled={isSubmitting}
        >
          Next: Units
        </Button>
      </Box>
    </Box>
  );
}
