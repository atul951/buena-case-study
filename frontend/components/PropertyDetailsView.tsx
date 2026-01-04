'use client';

import { useState } from 'react';
import { Property, Building, Unit } from '@/types/property';
import UnitDetailsView from './UnitDetailsView';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import {
  Business as BusinessIcon,
  HomeMaxRounded as BuildingIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  RefreshRounded,
} from '@mui/icons-material';

interface PropertyDetailsViewProps {
  property: Property;
  buildings: Building[];
  unitsMap: Map<number, Unit[]>;
  onRefresh: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`property-tabpanel-${index}`}
      aria-labelledby={`property-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `property-tab-${index}`,
    'aria-controls': `property-tabpanel-${index}`,
  };
}

export default function PropertyDetailsView({
  property,
  buildings,
  unitsMap,
  onRefresh,
}: PropertyDetailsViewProps) {
  const [tabValue, setTabValue] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [unitDialogOpen, setUnitDialogOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleUnitClick = (unit: Unit) => {
    setSelectedUnit(unit);
    setUnitDialogOpen(true);
  };

  const typeColor = property.type === 'WEG' ? 'secondary' : 'success';
  const totalUnits = Array.from(unitsMap.values()).reduce(
    (sum, units) => sum + units.length,
    0
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* Property Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.light', color: 'primary.main' }}>
              <BusinessIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
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
            sx={{ fontWeight: 'bold', fontSize: '0.9rem', py: 2.5, px: 1 }}
          />
        </Box>

        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="text.secondary" gutterBottom>
                  Buildings
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {buildings.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="text.secondary" gutterBottom>
                  Total Units
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {totalUnits}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="text.secondary" gutterBottom>
                  Property Manager
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {property.property_manager?.name || 'Not assigned'}
                </Typography>
                {property.property_manager?.email && (
                  <Typography variant="caption" color="text.secondary">
                    {property.property_manager.email}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="text.secondary" gutterBottom>
                  Accountant
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {property.accountant?.name || 'Not assigned'}
                </Typography>
                {property.accountant?.email && (
                  <Typography variant="caption" color="text.secondary">
                    {property.accountant.email}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button
            size="small"
            startIcon={<RefreshRounded />}
            onClick={onRefresh}
          >
            Refresh
          </Button>
        </Box>
      </Paper>

      {/* Content Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="property details tabs"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Tab label={`Buildings (${buildings.length})`} {...a11yProps(0)} />
          <Tab label={`All Units (${totalUnits})`} {...a11yProps(1)} />
          <Tab label="Details" {...a11yProps(2)} />
        </Tabs>

        {/* Buildings Tab */}
        <TabPanel value={tabValue} index={0}>
          {buildings.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No buildings added yet.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2} sx={{ p: 2 }}>
              {buildings.map((building) => {
                const buildingUnits = unitsMap.get(building.id) || [];
                return (
                  <Grid item xs={12} md={6} key={building.id}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <BuildingIcon color="primary" />
                          <Typography variant="h6" fontWeight="bold">
                            {building.name}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                          <Typography variant="body2">
                            <strong>Address:</strong> {building.street} {building.house_number}, {building.postal_code} {building.city}, {building.country}
                          </Typography>
                          {building.additional_details && (
                            <Typography variant="body2">
                              <strong>Details:</strong> {building.additional_details}
                            </Typography>
                          )}
                          <Typography variant="body2" color="success.main">
                            <strong>Units:</strong> {buildingUnits.length}
                          </Typography>
                        </Box>

                        {buildingUnits.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" fontWeight="bold" sx={{ display: 'block', mb: 1 }}>
                              Units in this building:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {buildingUnits.slice(0, 5).map((unit) => (
                                <Chip
                                  key={unit.id}
                                  icon={<HomeIcon />}
                                  label={`${unit.type} ${unit.number}`}
                                  size="small"
                                  onClick={() => handleUnitClick(unit)}
                                  sx={{ cursor: 'pointer' }}
                                />
                              ))}
                              {buildingUnits.length > 5 && (
                                <Chip
                                  label={`+${buildingUnits.length - 5} more`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </TabPanel>

        {/* All Units Tab */}
        <TabPanel value={tabValue} index={1}>
          {totalUnits === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No units added yet.
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ p: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell>Building</TableCell>
                    <TableCell>Unit Number</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Size (m²)</TableCell>
                    <TableCell align="right">Floor</TableCell>
                    <TableCell align="right">Rooms</TableCell>
                    <TableCell align="right">Co-ownership Share (%)</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from(unitsMap.entries()).map(([buildingId, units]) => {
                    const building = buildings.find((b) => b.id === buildingId);
                    return units.map((unit, idx) => (
                      <TableRow
                        key={unit.id}
                        sx={{
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <TableCell>
                          {idx === 0 && building ? building.name : ''}
                        </TableCell>
                        <TableCell>{unit.number}</TableCell>
                        <TableCell>
                          <Chip label={unit.type} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell align="right">{unit.size || '-'}</TableCell>
                        <TableCell align="right">{unit.floor || '-'}</TableCell>
                        <TableCell align="right">{unit.rooms || '-'}</TableCell>
                        <TableCell align="right">{unit.co_ownership_share || '-'}</TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            onClick={() => handleUnitClick(unit)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ));
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        {/* Details Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Property Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Property Name
                        </Typography>
                        <Typography variant="body2">{property.name}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Type
                        </Typography>
                        <Typography variant="body2">{property.type}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Unique Number
                        </Typography>
                        <Typography variant="body2">{property.unique_number}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Created Date
                        </Typography>
                        <Typography variant="body2">
                          {new Date(property.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Last Updated
                        </Typography>
                        <Typography variant="body2">
                          {new Date(property.updated_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Personnel
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <PersonIcon fontSize="small" color="primary" />
                          <Typography variant="caption" fontWeight="bold">
                            Property Manager
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {property.property_manager ? (
                            <Box>
                              <div>{property.property_manager.name}</div>
                              <Typography variant="caption" color="text.secondary">
                                {property.property_manager.email}
                              </Typography>
                            </Box>
                          ) : (
                            'Not assigned'
                          )}
                        </Typography>
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <PersonIcon fontSize="small" color="success" />
                          <Typography variant="caption" fontWeight="bold">
                            Accountant
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {property.accountant ? (
                            <Box>
                              <div>{property.accountant.name}</div>
                              <Typography variant="caption" color="text.secondary">
                                {property.accountant.email}
                              </Typography>
                            </Box>
                          ) : (
                            'Not assigned'
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Paper>

      {/* Unit Details Dialog */}
      {unitDialogOpen && (
        <UnitDetailsView 
          unit={selectedUnit} 
          unitDialogOpen={unitDialogOpen} 
          setUnitDialogOpen={setUnitDialogOpen} 
        />
      )}
    </Box>
  );
}
