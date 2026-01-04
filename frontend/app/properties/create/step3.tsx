'use client';

import { useState, useEffect } from 'react';
import { unitApi, buildingApi } from '@/lib/api';
import { UnitExt, Building, PdfExtractionResult, BuildingExt } from '@/types/property';
import UnitBulkEntry from '@/components/UnitBulkEntry';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowLeftIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

interface Step3Props {
  propertyId: number;
  onComplete: () => void;
  onBack: () => void;
  pdfData: PdfExtractionResult | null;
}

export default function Step3({
  propertyId,
  onComplete,
  onBack,
  pdfData,
}: Step3Props) {
  const [units, setUnits] = useState<UnitExt[]>([]);
  const [savedBuildings, setSavedBuildings] = useState<Building[]>([]);
  const [unitBuildingMap, setUnitBuildingMap] = useState<Map<number, number>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingBuildings, setIsLoadingBuildings] = useState(true);

  useEffect(() => {
    loadBuildings();
  }, [propertyId]);

  useEffect(() => {
    if (pdfData && pdfData.units.length > 0) {
      setUnits(pdfData.units);
    }
  }, [pdfData]);

  const loadBuildings = async () => {
    try {
      setIsLoadingBuildings(true);
      const buildings = await buildingApi.getByProperty(propertyId);
      setSavedBuildings(buildings);
    } catch (error) {
      console.error('Failed to load buildings:', error);
    } finally {
      setIsLoadingBuildings(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Group units by building
      const unitsByBuilding = new Map<number, UnitExt[]>();

      units.forEach((unit, index) => {
        const buildingId = savedBuildings.find(it => it.name.includes(unit.building))?.id || savedBuildings[0]?.id;
        if (!buildingId) {
          throw new Error('No building available. Please go back and add buildings first.');
        }

        if (!unitsByBuilding.has(buildingId)) {
          unitsByBuilding.set(buildingId, []);
        }

        // const { number, description, ...unitData } = unit;
        unitsByBuilding.get(buildingId)!.push(unit);
      });

      // Create units in bulk for each building
      const promises = Array.from(unitsByBuilding.entries()).map(([buildingId, buildingUnits]) =>
        unitApi.createMany(buildingId, buildingUnits.map((u) => {
          const { description, ...unitData } = u;
          return unitData;
        })),
      );

      await Promise.all(promises);
      onComplete();
    } catch (error) {
      console.error('Failed to save units:', error);
      alert(error instanceof Error ? error.message : 'Failed to save units. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingBuildings) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography color="text.secondary">Loading buildings...</Typography>
      </Box>
    );
  }

  if (savedBuildings.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          No buildings found. Please go back and add buildings first.
        </Typography>
        <Button variant="outlined" onClick={onBack}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Tip:</strong> For properties with 60+ units, use CSV import for faster data entry.
          You can also copy/paste from spreadsheets directly into the table.
        </Alert>

        <UnitBulkEntry
          buildings={savedBuildings}
          units={units}
          onUnitsChange={setUnits}
          pdfData={pdfData}
        />
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
          color="success"
          startIcon={<CheckIcon />}
          disabled={isSubmitting || units.length === 0}
        >
          Complete
        </Button>
      </Box>
    </Box>
  );
}
