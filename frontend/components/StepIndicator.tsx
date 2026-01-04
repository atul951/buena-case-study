'use client';

import { Box, Stepper, Step, StepLabel, StepContent, Avatar } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export default function StepIndicator({ currentStep, totalSteps, stepLabels }: StepIndicatorProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Stepper activeStep={currentStep - 1} alternativeLabel>
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <Step key={stepNumber} completed={isCompleted}>
              <StepLabel
                StepIconComponent={() => (
                  <Avatar
                    sx={{
                      bgcolor: isActive ? 'primary.main' : isCompleted ? 'success.main' : 'grey.300',
                      color: isActive || isCompleted ? 'white' : 'grey.600',
                      width: 40,
                      height: 40,
                    }}
                  >
                    {isCompleted ? <CheckIcon /> : stepNumber}
                  </Avatar>
                )}
              >
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
