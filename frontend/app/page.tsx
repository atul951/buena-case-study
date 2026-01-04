'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { propertyApi } from '@/lib/api';
import { Property } from '@/types/property';
import PropertyCard from '@/components/PropertyCard';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export default function Dashboard() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyApi.getAll();
      setProperties(data);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.unique_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Property Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your WEG and MV properties
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/properties/create')}
            sx={{ px: 3, py: 1.5 }}
          >
            Create New Property
          </Button>
        </Box>

        <Box sx={{ mb: 4 }}>
          <TextField
            id="search-properties"
            fullWidth
            placeholder="Search properties by name, type, or unique number..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            sx={{ maxWidth: 500 }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography color="text.secondary">Loading properties...</Typography>
          </Box>
        ) : filteredProperties.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              {searchTerm ? 'No properties found matching your search.' : 'No properties yet. Create your first property!'}
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredProperties.map((property) => (
              <Grid item xs={12} sm={6} lg={4} key={property.id}>
                <PropertyCard property={property} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
