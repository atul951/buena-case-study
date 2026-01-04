'use client';

import { Dispatch, SetStateAction, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { Unit as U, Unit } from "@/types/property";

interface UnitDetailsViewProps {
    unit: Unit | null;
    unitDialogOpen: boolean;
    setUnitDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const UnitDetailsView = ({unit, unitDialogOpen, setUnitDialogOpen}: UnitDetailsViewProps) => {

    return (
        <Box>
            <Dialog open={unitDialogOpen} onClose={() => setUnitDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    Unit Details: {unit?.type} {unit?.number}
                </DialogTitle>
                <DialogContent dividers>
                    {unit && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Unit Number
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                    {unit.number}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Type
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                    {unit.type}
                                </Typography>
                            </Box>
                            {unit.floor && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Floor
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                        {unit.floor}
                                    </Typography>
                                </Box>
                            )}
                            {unit.entrance && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Entrance
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                        {unit.entrance}
                                    </Typography>
                                </Box>
                            )}
                            {unit.size && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Size
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                        {unit.size} m²
                                    </Typography>
                                </Box>
                            )}
                            {unit.rooms && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Rooms
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                        {unit.rooms}
                                    </Typography>
                                </Box>
                            )}
                            {unit.co_ownership_share && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Co-ownership Share
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                        {unit.co_ownership_share}%
                                    </Typography>
                                </Box>
                            )}
                            {unit.construction_year && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Construction Year
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                        {unit.construction_year}
                                    </Typography>
                                </Box>
                            )}
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Created Date
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                    {new Date(unit.created_at).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUnitDialogOpen(false)} variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default UnitDetailsView;