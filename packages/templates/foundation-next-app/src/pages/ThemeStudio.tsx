'use client';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slider from '@mui/material/Slider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import { alpha, useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import RoundedCornerIcon from '@mui/icons-material/RoundedCorner';

import {
    setTheme, toggleDirection, setTypography, setBorderRadius,
    setFontSize, resetTheme, setColors,
} from '~/features/theme/themeSlice';
import type { RootState } from '~/store';

const FONTS = ['Inter', 'Roboto', 'Poppins', 'DM Sans'];

const COLOR_PRESETS = [
    { label: 'Blue',   primary: '#1976d2', secondary: '#9c27b0' },
    { label: 'Teal',   primary: '#00796b', secondary: '#e91e63' },
    { label: 'Indigo', primary: '#3f51b5', secondary: '#ff5722' },
    { label: 'Green',  primary: '#2e7d32', secondary: '#ff9800' },
    { label: 'Red',    primary: '#c62828', secondary: '#1976d2' },
    { label: 'Purple', primary: '#6a1b9a', secondary: '#00acc1' },
    { label: 'Amber',  primary: '#e65100', secondary: '#0288d1' },
    { label: 'Slate',  primary: '#37474f', secondary: '#7c4dff' },
];

export default function ThemeStudio() {
    const dispatch   = useDispatch();
    const theme      = useTheme();
    const themeState = useSelector((s: RootState) => s.theme);

    return (
        <Stack spacing={3}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack spacing={0.5}>
                    <Typography variant="h4" fontWeight={700}>Theme Studio</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Customise colors, typography, layout and direction — changes apply live.
                    </Typography>
                </Stack>
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<RestartAltIcon />}
                    onClick={() => dispatch(resetTheme())}
                >
                    Reset Defaults
                </Button>
            </Stack>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                {/* ── Mode ── */}
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                            <PaletteOutlinedIcon color="primary" fontSize="small" />
                            <Typography variant="h6" fontWeight={600}>Mode & Direction</Typography>
                        </Stack>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={2}>
                            <FormControlLabel
                                control={<Switch checked={themeState.mode === 'dark'} onChange={(e) => dispatch(setTheme(e.target.checked ? 'dark' : 'light'))} />}
                                label={<Typography variant="body2">Dark Mode {themeState.mode === 'dark' ? '(on)' : '(off)'}</Typography>}
                            />
                            <FormControlLabel
                                control={<Switch checked={themeState.direction === 'rtl'} onChange={() => dispatch(toggleDirection())} />}
                                label={<Typography variant="body2">RTL Direction {themeState.direction === 'rtl' ? '(on)' : '(off)'}</Typography>}
                            />
                        </Stack>
                    </CardContent>
                </Card>

                {/* ── Color Presets ── */}
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                            <PaletteOutlinedIcon color="secondary" fontSize="small" />
                            <Typography variant="h6" fontWeight={600}>Color Palette</Typography>
                        </Stack>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                            {COLOR_PRESETS.map((preset) => (
                                <Tooltip key={preset.label} title={preset.label} arrow>
                                    <Box
                                        onClick={() => dispatch(setColors({ primary: preset.primary, secondary: preset.secondary }))}
                                        sx={{
                                            width: 36, height: 36,
                                            borderRadius: '50%',
                                            background: `linear-gradient(135deg, ${preset.primary} 50%, ${preset.secondary} 50%)`,
                                            cursor: 'pointer',
                                            border: themeState.colors.primary === preset.primary
                                                ? `3px solid ${theme.palette.text.primary}`
                                                : `3px solid transparent`,
                                            transition: 'transform 0.15s, border 0.15s',
                                            '&:hover': { transform: 'scale(1.2)' },
                                        }}
                                    />
                                </Tooltip>
                            ))}
                        </Box>
                        <Stack direction="row" spacing={1} mt={2}>
                            <Chip
                                size="small"
                                label={`Primary: ${themeState.colors.primary}`}
                                sx={{ bgcolor: alpha(themeState.colors.primary, 0.15), color: themeState.colors.primary, fontWeight: 600 }}
                            />
                            <Chip
                                size="small"
                                label={`Secondary: ${themeState.colors.secondary}`}
                                sx={{ bgcolor: alpha(themeState.colors.secondary, 0.15), color: themeState.colors.secondary, fontWeight: 600 }}
                            />
                        </Stack>
                    </CardContent>
                </Card>

                {/* ── Typography ── */}
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                            <FormatSizeIcon color="primary" fontSize="small" />
                            <Typography variant="h6" fontWeight={600}>Typography</Typography>
                        </Stack>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={3}>
                            <FormControl size="small" fullWidth>
                                <InputLabel>Font Family</InputLabel>
                                <Select
                                    value={themeState.typography}
                                    label="Font Family"
                                    onChange={(e) => dispatch(setTypography(e.target.value))}
                                >
                                    {FONTS.map(f => (
                                        <MenuItem key={f} value={f}>
                                            <Typography sx={{ fontFamily: f }}>{f}</Typography>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box>
                                <Typography variant="body2" gutterBottom>
                                    Base Font Size: <strong>{themeState.fontSize}px</strong>
                                </Typography>
                                <Slider
                                    value={themeState.fontSize}
                                    min={12} max={18} step={1}
                                    onChange={(_, v) => dispatch(setFontSize(v as number))}
                                    marks={[{ value: 12, label: '12px' }, { value: 14, label: '14px' }, { value: 18, label: '18px' }]}
                                    size="small"
                                />
                            </Box>
                            <Box
                                sx={{
                                    p: 2, borderRadius: 2, bgcolor: 'action.hover',
                                    fontFamily: themeState.typography, fontSize: themeState.fontSize,
                                }}
                            >
                                <Typography variant="subtitle2" fontWeight={700} fontFamily={themeState.typography}>
                                    {themeState.typography} — The quick brown fox
                                </Typography>
                                <Typography variant="body2" fontFamily={themeState.typography} color="text.secondary">
                                    Jumps over the lazy dog. 0123456789
                                </Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

                {/* ── Shape ── */}
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                            <RoundedCornerIcon color="primary" fontSize="small" />
                            <Typography variant="h6" fontWeight={600}>Shape</Typography>
                        </Stack>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="body2" gutterBottom>
                                    Border Radius: <strong>{themeState.borderRadius}px</strong>
                                </Typography>
                                <Slider
                                    value={themeState.borderRadius}
                                    min={0} max={24} step={2}
                                    onChange={(_, v) => dispatch(setBorderRadius(v as number))}
                                    marks={[{ value: 0, label: 'Sharp' }, { value: 8, label: 'Rounded' }, { value: 24, label: 'Pill' }]}
                                    size="small"
                                />
                            </Box>
                            {/* Preview */}
                            <Stack direction="row" spacing={1.5}>
                                {['Button', 'Card', 'Input'].map(label => (
                                    <Box
                                        key={label}
                                        sx={{
                                            flex: 1, py: 1, textAlign: 'center',
                                            border: `1px solid ${theme.palette.primary.main}`,
                                            borderRadius: `${themeState.borderRadius}px`,
                                            color: 'primary.main', fontSize: 12, fontWeight: 600,
                                        }}
                                    >
                                        {label}
                                    </Box>
                                ))}
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
        </Stack>
    );
}
