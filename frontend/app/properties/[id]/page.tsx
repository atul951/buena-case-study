'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { propertyApi, buildingApi, unitApi } from '@/lib/api';
import { Property, Building, Unit } from '@/types/property';
import PropertyDetailsView from '@/components/PropertyDetailsView';
import {
  Container,
  Box,
  CircularProgress,
  Typography,
  Button,
  Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = Number(params.id);

  const [property, setProperty] = useState<Property | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [unitsMap, setUnitsMap] = useState<Map<number, Unit[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPropertyDetails();
  }, [propertyId]);

  const loadPropertyDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch property details
      const propertyData = await propertyApi.getById(propertyId);
      setProperty(propertyData);

      // Fetch buildings for this property
      const buildingsData = await buildingApi.getByProperty(propertyId);
      setBuildings(buildingsData);

      // Fetch units for each building
      const units = new Map<number, Unit[]>();
      for (const building of buildingsData) {
        const buildingUnits = await unitApi.getByBuilding(building.id);
        units.set(building.id, buildingUnits);
      }

      const sortedUnits = new Map(
        // [...units.entries()].sort((a, b) => a[0] - b[0])
        Array.from(units.entries()).sort((a, b) => a[0] - b[0])
      )

      setUnitsMap(sortedUnits);
    } catch (error) {
      console.error('Failed to load property details:', error);
      setError('Failed to load property details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography color="text.secondary">Loading property details...</Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  if (error || !property) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="xl">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/')}
            sx={{ mb: 2 }}
          >
            Back to Dashboard
          </Button>
          <Alert severity="error">
            {error || 'Property not found'}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="xl">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/')}
          sx={{ mb: 3 }}
        >
          Back to Dashboard
        </Button>

        <PropertyDetailsView
          property={property}
          buildings={buildings}
          unitsMap={unitsMap}
          onRefresh={loadPropertyDetails}
        />
      </Container>
    </Box>
  );
}
