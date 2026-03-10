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
import { useDispatch, useSelector } from 'react-redux';

import {
    toggleTheme,
    toggleDirection,
    setTypography,
    setBorderRadius,
    setFontSize,
    resetTheme,
} from '~/features/theme/themeSlice';
import type { RootState } from '~/store';

const fonts = ['Inter', 'Roboto', 'Poppins', 'DM Sans'];

export default function Settings() {
    const dispatch   = useDispatch();
    const theme      = useSelector((s: RootState) => s.theme);

    return (
        <Stack spacing={3}>
            <Typography variant="h4" fontWeight={700}>Settings</Typography>

            {/* Appearance */}
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Appearance</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={2.5}>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={theme.mode === 'dark'}
                                    onChange={() => dispatch(toggleTheme())}
                                />
                            }
                            label="Dark mode"
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={theme.direction === 'rtl'}
                                    onChange={() => dispatch(toggleDirection())}
                                />
                            }
                            label="Right-to-left (RTL)"
                        />

                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel>Font Family</InputLabel>
                            <Select
                                value={theme.typography}
                                label="Font Family"
                                onChange={(e) => dispatch(setTypography(e.target.value))}
                            >
                                {fonts.map((f) => (
                                    <MenuItem key={f} value={f}>{f}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box>
                            <Typography variant="body2" gutterBottom>
                                Border Radius: {theme.borderRadius}px
                            </Typography>
                            <Slider
                                value={theme.borderRadius}
                                min={0}
                                max={24}
                                step={2}
                                onChange={(_, v) => dispatch(setBorderRadius(v as number))}
                                sx={{ maxWidth: 300 }}
                            />
                        </Box>

                        <Box>
                            <Typography variant="body2" gutterBottom>
                                Font Size: {theme.fontSize}px
                            </Typography>
                            <Slider
                                value={theme.fontSize}
                                min={12}
                                max={18}
                                step={1}
                                onChange={(_, v) => dispatch(setFontSize(v as number))}
                                sx={{ maxWidth: 300 }}
                            />
                        </Box>

                        <Box>
                            <Button variant="outlined" color="error" size="small" onClick={() => dispatch(resetTheme())}>
                                Reset to Defaults
                            </Button>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    );
}
