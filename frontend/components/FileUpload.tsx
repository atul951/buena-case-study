'use client';

import { useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Description as FileIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  isLoading?: boolean;
}

export default function FileUpload({
  onFileSelect,
  onFileRemove,
  selectedFile,
  isLoading = false,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    } else {
      alert('Please drop a PDF file');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <Box sx={{ width: '100%' }}>
      {selectedFile ? (
        <Paper
          sx={{
            p: 2,
            bgcolor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FileIcon color="primary" />
            <Box>
              <Typography variant="body1" fontWeight="medium">
                {selectedFile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onFileRemove}
            disabled={isLoading}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Paper>
      ) : (
        <Paper
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            p: 4,
            border: '2px dashed',
            borderColor: 'grey.300',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'border-color 0.3s',
            '&:hover': {
              borderColor: 'primary.main',
            },
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            disabled={isLoading}
          />
          <UploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
          <Typography variant="body1" fontWeight="medium" gutterBottom>
            {isLoading ? 'Processing PDF...' : 'Upload Teilungserklärung (PDF)'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Drag and drop or click to select a PDF file
          </Typography>
          {isLoading && <LinearProgress sx={{ mt: 2 }} />}
        </Paper>
      )}
    </Box>
  );
}
