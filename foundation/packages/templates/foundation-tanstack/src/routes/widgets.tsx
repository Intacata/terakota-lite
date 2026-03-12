import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { alpha, useTheme } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BarChartIcon from '@mui/icons-material/BarChart';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import AddIcon from '@mui/icons-material/Add';
import AppShell from '~/layouts/AppShell';

const WIDGETS = [
    { id: 'clock', title: 'Clock', desc: 'Live clock with timezone support.', category: 'Utilities', icon: <AccessTimeIcon />, color: '#1976d2', status: 'stable' },
    { id: 'kpi', title: 'KPI Card', desc: 'Performance indicator with trends.', category: 'Analytics', icon: <BarChartIcon />, color: '#9c27b0', status: 'stable' },
    { id: 'text', title: 'Markdown', desc: 'Rich text block with Markdown.', category: 'Content', icon: <TextFieldsIcon />, color: '#2e7d32', status: 'stable' },
] as const;

function Widgets() {
    const theme = useTheme();
    const [filter, setFilter] = useState('All');
    const cats = ['All', ...Array.from(new Set(WIDGETS.map(w => w.category)))];
    const visible = filter === 'All' ? WIDGETS : WIDGETS.filter(w => w.category === filter);
    return (
        <AppShell>
            <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
                    <Stack spacing={0.5}>
                        <Typography variant="h4" fontWeight={700}>Widget Library</Typography>
                        <Typography variant="body2" color="text.secondary">Browse and add widgets to your dashboards.</Typography>
                    </Stack>
                    <Button variant="contained" startIcon={<AddIcon />} size="small" disableElevation>New Dashboard</Button>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {cats.map(cat => (
                        <Chip key={cat} label={cat} clickable onClick={() => setFilter(cat)}
                            color={filter === cat ? 'primary' : 'default'} variant={filter === cat ? 'filled' : 'outlined'} size="small" />
                    ))}
                </Stack>
                <Divider />
                <Grid container spacing={2}>
                    {visible.map(w => (
                        <Grid item xs={12} sm={6} md={4} key={w.id}>
                            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: theme.shadows[4] } }}>
                                <CardContent>
                                    <Stack spacing={2}>
                                        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                                            <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: alpha(w.color, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', color: w.color }}>{w.icon}</Box>
                                            <Chip label="Stable" color="success" size="small" variant="outlined" />
                                        </Stack>
                                        <Stack spacing={0.5}>
                                            <Typography variant="subtitle1" fontWeight={700}>{w.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">{w.desc}</Typography>
                                        </Stack>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                                            <Chip label={w.category} size="small" sx={{ bgcolor: 'action.hover', fontSize: '0.7rem' }} />
                                            <Button size="small" variant="outlined">Add widget</Button>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </AppShell>
    );
}

export const Route = createFileRoute('/widgets')({ component: Widgets });
