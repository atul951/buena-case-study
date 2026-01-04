'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '@/components/StepIndicator';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import { CreatePropertyDto, BuildingExt, UnitExt, PdfExtractionResult } from '@/types/property';
import { Container, Paper, Typography, Box } from '@mui/material';

export default function CreatePropertyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyData, setPropertyData] = useState<Partial<CreatePropertyDto>>({});
  const [buildings, setBuildings] = useState<BuildingExt[]>([]);
  const [units, setUnits] = useState<UnitExt[]>([]);
  const [propertyId, setPropertyId] = useState<number | null>(null);
  const [pdfData, setPdfData] = useState<PdfExtractionResult | null>(null);

  const stepLabels = ['General Info', 'Building Data', 'Units'];

  const handleStep1Complete = (data: CreatePropertyDto, id: number) => {
    setPropertyData(data);
    setPropertyId(id);
    setCurrentStep(2);
  };

  const handleStep2Complete = (buildingData: BuildingExt[]) => {
    setBuildings(buildingData);
    setCurrentStep(3);
  };

  const handleStep3Complete = () => {
    router.push('/');
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="xl">
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Create New Property
          </Typography>

          <StepIndicator
            currentStep={currentStep}
            totalSteps={3}
            stepLabels={stepLabels}
          />

          <Box sx={{ mt: 4 }}>
            {currentStep === 1 && (
              <Step1
                onComplete={handleStep1Complete}
                onBack={handleBack}
                pdfData={pdfData}
                onPdfDataChange={setPdfData}
              />
            )}
            {currentStep === 2 && (
              <Step2
                propertyId={propertyId!}
                onComplete={handleStep2Complete}
                onBack={handleBack}
                pdfData={pdfData}
              />
            )}
            {currentStep === 3 && (
              <Step3
                propertyId={propertyId!}
                onComplete={handleStep3Complete}
                onBack={handleBack}
                pdfData={pdfData}
              />
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
