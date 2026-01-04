'use client';

import { Property } from '@/types/property';
import { Card, CardContent, Box, Typography, Chip, Avatar } from '@mui/material';
import { Business as BusinessIcon } from '@mui/icons-material';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const typeColor = property.type === 'WEG' ? 'secondary' : 'success';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.3s',
        '&:hover': {
          boxShadow: 6,
        },
        cursor: 'pointer',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
              <BusinessIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" fontWeight="semibold">
                {property.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                #{property.unique_number}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={property.type}
            color={typeColor}
            size="small"
            sx={{ fontWeight: 'medium' }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {property.property_manager && (
            <Typography variant="body2" color="text.secondary">
              <strong>Manager:</strong> {property.property_manager.name}
            </Typography>
          )}
          {property.accountant && (
            <Typography variant="body2" color="text.secondary">
              <strong>Accountant:</strong> {property.accountant.name}
            </Typography>
          )}
          <Typography variant="caption" color="text.disabled" sx={{ mt: 2 }}>
            Created: {new Date(property.created_at).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
