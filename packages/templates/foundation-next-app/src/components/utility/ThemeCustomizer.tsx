'use client';
import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Slider from '@mui/material/Slider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import { alpha, useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';

import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import {
    setTheme, toggleTheme, toggleDirection, setTypography, setBorderRadius,
    setFontSize, resetTheme, setColors,
} from '~/features/theme/themeSlice';
import type { RootState } from '~/store';

const FONTS = ['Inter', 'Roboto', 'Poppins', 'DM Sans'];

const COLOR_PRESETS = [
    { label: 'Blue',    primary: '#1976d2', secondary: '#9c27b0' },
    { label: 'Teal',    primary: '#00796b', secondary: '#e91e63' },
    { label: 'Indigo',  primary: '#3f51b5', secondary: '#ff5722' },
    { label: 'Green',   primary: '#2e7d32', secondary: '#ff9800' },
    { label: 'Red',     primary: '#c62828', secondary: '#1976d2' },
    { label: 'Purple',  primary: '#6a1b9a', secondary: '#00acc1' },
    { label: 'Amber',   primary: '#e65100', secondary: '#0288d1' },
    { label: 'Slate',   primary: '#37474f', secondary: '#7c4dff' },
];

export default function ThemeCustomizer() {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const theme = useTheme();
    const themeState = useSelector((s: RootState) => s.theme);
    const direction = themeState.direction;

    // In RTL the FAB sits on the LEFT; the drawer opens from the LEFT.
    // In LTR the FAB sits on the RIGHT; the drawer opens from the RIGHT.
    const fabSide  = direction === 'rtl' ? { left: 16, right: 'auto' } : { right: 16, left: 'auto' };
    const drawerAnchor = direction === 'rtl' ? 'left' : 'right';
    const tooltipPlacement = direction === 'rtl' ? 'right' : 'left';

    return (
        <>
            {/* Floating action button */}
            <Tooltip title="Theme Customizer" placement={tooltipPlacement as any}>
                <Fab
                    size="small"
                    color="primary"
                    onClick={() => setOpen(true)}
                    sx={{
                        position: 'fixed',
                        bottom: 80,
                        zIndex: 1300,
                        boxShadow: 4,
                        ...fabSide,
                    }}
                >
                    <PaletteOutlinedIcon fontSize="small" />
                </Fab>
            </Tooltip>

            {/* Slide-out drawer */}
            <Drawer
                anchor={drawerAnchor as any}
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: {
                        width: 300,
                        borderRight: direction === 'rtl' ? `1px solid ${theme.palette.divider}` : 'none',
                        borderLeft:  direction === 'ltr' ? `1px solid ${theme.palette.divider}` : 'none',
                    },
                }}
            >
                {/* Header */}
                <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Stack spacing={0.25}>
                        <Typography variant="subtitle1" fontWeight={700}>Theme Customizer</Typography>
                        <Typography variant="caption" color="text.secondary">Live preview changes</Typography>
                    </Stack>
                    <IconButton size="small" onClick={() => setOpen(false)}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Divider />

                <Box sx={{ p: 2.5, overflowY: 'auto', flex: 1 }}>
                    <Stack spacing={3}>
                        {/* Mode */}
                        <Box>
                            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                Mode
                            </Typography>
                            <Stack direction="row" spacing={1} mt={1}>
                                {(['light', 'dark'] as const).map((m) => (
                                    <Button
                                        key={m}
                                        size="small"
                                        variant={themeState.mode === m ? 'contained' : 'outlined'}
                                        onClick={() => dispatch(setTheme(m))}
                                        sx={{ flex: 1, textTransform: 'capitalize' }}
                                    >
                                        {m}
                                    </Button>
                                ))}
                            </Stack>
                        </Box>

                        {/* Color presets */}
                        <Box>
                            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                Color Preset
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                {COLOR_PRESETS.map((preset) => (
                                    <Tooltip key={preset.label} title={preset.label}>
                                        <Box
                                            onClick={() => dispatch(setColors({ primary: preset.primary, secondary: preset.secondary }))}
                                            sx={{
                                                width: 28, height: 28, borderRadius: '50%',
                                                bgcolor: preset.primary, cursor: 'pointer',
                                                border: themeState.colors.primary === preset.primary
                                                    ? `3px solid ${theme.palette.text.primary}`
                                                    : `3px solid transparent`,
                                                transition: 'transform 0.15s',
                                                '&:hover': { transform: 'scale(1.15)' },
                                            }}
                                        />
                                    </Tooltip>
                                ))}
                            </Box>
                        </Box>

                        {/* Direction */}
                        <FormControlLabel
                            control={
                                <Switch
                                    size="small"
                                    checked={themeState.direction === 'rtl'}
                                    onChange={() => dispatch(toggleDirection())}
                                />
                            }
                            label={<Typography variant="body2">RTL Direction</Typography>}
                        />

                        {/* Font */}
                        <FormControl size="small" fullWidth>
                            <InputLabel>Font Family</InputLabel>
                            <Select
                                value={themeState.typography}
                                label="Font Family"
                                onChange={(e) => dispatch(setTypography(e.target.value))}
                            >
                                {FONTS.map(f => <MenuItem key={f} value={f} sx={{ fontFamily: f }}>{f}</MenuItem>)}
                            </Select>
                        </FormControl>

                        {/* Border radius */}
                        <Box>
                            <Typography variant="body2" gutterBottom>
                                Border Radius: <strong>{themeState.borderRadius}px</strong>
                            </Typography>
                            <Slider
                                value={themeState.borderRadius}
                                min={0} max={24} step={2}
                                onChange={(_, v) => dispatch(setBorderRadius(v as number))}
                                marks={[{ value: 0, label: '0' }, { value: 8, label: '8' }, { value: 24, label: '24' }]}
                                size="small"
                            />
                        </Box>

                        {/* Font size */}
                        <Box>
                            <Typography variant="body2" gutterBottom>
                                Font Size: <strong>{themeState.fontSize}px</strong>
                            </Typography>
                            <Slider
                                value={themeState.fontSize}
                                min={12} max={18} step={1}
                                onChange={(_, v) => dispatch(setFontSize(v as number))}
                                marks={[{ value: 12, label: '12' }, { value: 14, label: '14' }, { value: 18, label: '18' }]}
                                size="small"
                            />
                        </Box>

                        <Divider />

                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<RestartAltIcon />}
                            fullWidth
                            size="small"
                            onClick={() => dispatch(resetTheme())}
                        >
                            Reset to Defaults
                        </Button>
                    </Stack>
                </Box>
            </Drawer>
        </>
    );
}
