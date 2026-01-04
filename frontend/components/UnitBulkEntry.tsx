'use client';

import { useState, useRef } from 'react';
import { UnitType, Building, UnitExt } from '@/types/property';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CloudDownload as DownloadIcon,
  Add as PlusIcon,
  Delete as TrashIcon,
} from '@mui/icons-material';

interface UnitBulkEntryProps {
  buildings: Building[];
  units: UnitExt[];
  onUnitsChange: (units: UnitExt[]) => void;
  pdfData?: { units: UnitExt[] } | null;
}

export default function UnitBulkEntry({
  buildings,
  units,
  onUnitsChange,
  pdfData,
}: UnitBulkEntryProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addUnit = () => {
    onUnitsChange([
      ...units,
      {
        number: '',
        type: UnitType.APARTMENT,
        building: '',
        floor: '',
        entrance: '',
        size: undefined,
        co_ownership_share: undefined,
        construction_year: undefined,
        rooms: undefined,
      },
    ]);
  };

  const removeUnit = (index: number) => {
    onUnitsChange(units.filter((_, i) => i !== index));
  };

  const updateUnit = (index: number, field: keyof UnitExt, value: any) => {
    const updated = [...units];
    updated[index] = { ...updated[index], [field]: value };
    onUnitsChange(updated);
  };

  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter((line) => line.trim());
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

      const importedUnits: UnitExt[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim());
        const unit: UnitExt = {
          number: values[headers.indexOf('number')] || '',
          type: (values[headers.indexOf('type')] as UnitType) || UnitType.APARTMENT,
          floor: values[headers.indexOf('floor')] || '',
          entrance: values[headers.indexOf('entrance')] || '',
          building: values[headers.indexOf('building')] || '',
          size: values[headers.indexOf('size')] ? parseFloat(values[headers.indexOf('size')]) : undefined,
          co_ownership_share: values[headers.indexOf('co_ownership_share')]
            ? parseFloat(values[headers.indexOf('co_ownership_share')])
            : undefined,
          construction_year: values[headers.indexOf('construction_year')]
            ? parseInt(values[headers.indexOf('construction_year')])
            : undefined,
          rooms: values[headers.indexOf('rooms')] ? parseInt(values[headers.indexOf('rooms')]) : undefined,
        };
        importedUnits.push(unit);
      }

      onUnitsChange([...units, ...importedUnits]);
    };
    reader.readAsText(file);
  };

  const getBuilding = (value: number) => {
    return buildings.find(it => it.id === value)?.name;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="h3">
          Units ({units.length})
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => fileInputRef.current?.click()}
            size="small"
          >
            Import CSV
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleCsvImport}
            style={{ display: 'none' }}
          />
          <Button
            variant="contained"
            startIcon={<PlusIcon />}
            onClick={addUnit}
            size="small"
          >
            Add Unit
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Number</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Building</TableCell>
              <TableCell>Floor</TableCell>
              <TableCell>Entrance</TableCell>
              <TableCell>Size (m²)</TableCell>
              <TableCell>Co-ownership</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Rooms</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {units.map((unit, index) => (
              <TableRow key={index} hover>
                <TableCell>
                  <TextField
                    size="small"
                    value={unit.number}
                    disabled={typeof unit.number !== 'undefined' && unit.number !== null}
                    onChange={(e) => updateUnit(index, 'number', e.target.value)}
                    placeholder={String(index+1)}
                    sx={{ width: '7ch' }}
                  />
                </TableCell>
                <TableCell>
                  <FormControl fullWidth size="small">
                    <Select
                      value={unit.type}
                      onChange={(e) => updateUnit(index, 'type', e.target.value as UnitType)}
                    >
                      {Object.values(UnitType).map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl fullWidth size="small" sx={{ width: '18ch' }}>
                    <Select
                      value={buildings.find(it => it.name.includes(unit.building))?.id || 1}
                      onChange={(e) => updateUnit(index, 'building', getBuilding(Number(e.target.value)))}
                    >
                      {buildings.map((building) => (
                        <MenuItem key={building.id} value={building.id}>
                          {building.street} {building.house_number}, {building.city}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={unit.floor || ''}
                    onChange={(e) => updateUnit(index, 'floor', e.target.value)}
                    placeholder="1"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={unit.entrance || ''}
                    onChange={(e) => updateUnit(index, 'entrance', e.target.value)}
                    placeholder="A"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={unit.size || ''}
                    onChange={(e) => updateUnit(index, 'size', e.target.value ? parseFloat(e.target.value) : undefined)}
                    // placeholder="50.5"
                    inputProps={{ step: '0.01' }}
                    sx={{ width: '15ch' }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={unit.co_ownership_share || ''}
                    onChange={(e) =>
                      updateUnit(index, 'co_ownership_share', e.target.value ? parseFloat(e.target.value) : undefined)
                    }
                    // placeholder="0.0125"
                    inputProps={{ step: '0.0001' }}
                    sx={{ width: '15ch' }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={unit.construction_year || ''}
                    onChange={(e) =>
                      updateUnit(index, 'construction_year', e.target.value ? parseInt(e.target.value) : undefined)
                    }
                    sx={{ width: '15ch' }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={unit.rooms || ''}
                    onChange={(e) => updateUnit(index, 'rooms', e.target.value ? parseInt(e.target.value) : undefined)}
                    sx={{ width: '10ch' }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removeUnit(index)}
                  >
                    <TrashIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {units.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            No units added yet. Click "Add Unit" or import from CSV to get started.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
