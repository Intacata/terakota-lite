'use client';
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
import TableChartIcon from '@mui/icons-material/TableChart';
import MapIcon from '@mui/icons-material/Map';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';

// ─── Widget catalogue entry ───────────────────────────────────────────────────
interface WidgetEntry {
    id: string;
    title: string;
    description: string;
    category: string;
    icon: React.ReactNode;
    color: string;
    status: 'stable' | 'beta' | 'coming-soon';
}

const WIDGET_CATALOGUE: WidgetEntry[] = [
    {
        id: 'clock',
        title: 'Clock',
        description: 'Live clock with timezone support and multiple display formats.',
        category: 'Utilities',
        icon: <AccessTimeIcon />,
        color: '#1976d2',
        status: 'stable',
    },
    {
        id: 'kpi',
        title: 'KPI Card',
        description: 'Key performance indicator card with trend indicators and sparklines.',
        category: 'Analytics',
        icon: <BarChartIcon />,
        color: '#9c27b0',
        status: 'stable',
    },
    {
        id: 'text',
        title: 'Text / Markdown',
        description: 'Rich text block supporting Markdown — great for notes and descriptions.',
        category: 'Content',
        icon: <TextFieldsIcon />,
        color: '#2e7d32',
        status: 'stable',
    },
    {
        id: 'table',
        title: 'Data Table',
        description: 'Sortable, filterable data table with pagination and column controls.',
        category: 'Analytics',
        icon: <TableChartIcon />,
        color: '#ed6c02',
        status: 'beta',
    },
    {
        id: 'map',
        title: 'Map',
        description: 'Embeddable map widget with pin markers and region highlighting.',
        category: 'Geo',
        icon: <MapIcon />,
        color: '#0288d1',
        status: 'coming-soon',
    },
    {
        id: 'calendar',
        title: 'Calendar',
        description: 'Monthly / weekly calendar with event management and colour coding.',
        category: 'Utilities',
        icon: <CalendarMonthIcon />,
        color: '#c62828',
        status: 'coming-soon',
    },
];

const STATUS_COLOR: Record<string, 'success' | 'warning' | 'default'> = {
    stable:       'success',
    beta:         'warning',
    'coming-soon': 'default',
};

const STATUS_LABEL: Record<string, string> = {
    stable:       'Stable',
    beta:         'Beta',
    'coming-soon': 'Coming soon',
};

const CATEGORIES = ['All', ...Array.from(new Set(WIDGET_CATALOGUE.map(w => w.category)))];

// ─── Widgets page ─────────────────────────────────────────────────────────────
export default function Widgets() {
    const theme = useTheme();
    const [filter, setFilter] = useState('All');

    const visible = filter === 'All'
        ? WIDGET_CATALOGUE
        : WIDGET_CATALOGUE.filter(w => w.category === filter);

    return (
        <Stack spacing={3}>
            {/* Header */}
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
                <Stack spacing={0.5}>
                    <Typography variant="h4" fontWeight={700}>Widget Library</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Browse and add widgets to your dashboards. Stable widgets are ready to use.
                    </Typography>
                </Stack>
                <Button variant="contained" startIcon={<AddIcon />} size="small" disableElevation>
                    New Dashboard
                </Button>
            </Stack>

            {/* Category filters */}
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {CATEGORIES.map(cat => (
                    <Chip
                        key={cat}
                        label={cat}
                        clickable
                        onClick={() => setFilter(cat)}
                        color={filter === cat ? 'primary' : 'default'}
                        variant={filter === cat ? 'filled' : 'outlined'}
                        size="small"
                    />
                ))}
            </Stack>

            <Divider />

            {/* Widget cards */}
            <Grid container spacing={2}>
                {visible.map(widget => (
                    <Grid item xs={12} sm={6} md={4} key={widget.id}>
                        <Card
                            elevation={0}
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                height: '100%',
                                transition: 'box-shadow 0.2s, border-color 0.2s',
                                opacity: widget.status === 'coming-soon' ? 0.65 : 1,
                                '&:hover': widget.status !== 'coming-soon' ? {
                                    boxShadow: theme.shadows[4],
                                    borderColor: 'primary.light',
                                } : {},
                            }}
                        >
                            <CardContent>
                                <Stack spacing={2}>
                                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                                        <Box
                                            sx={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: 2,
                                                bgcolor: alpha(widget.color, 0.12),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: widget.color,
                                            }}
                                        >
                                            {widget.icon}
                                        </Box>
                                        <Chip
                                            label={STATUS_LABEL[widget.status]}
                                            color={STATUS_COLOR[widget.status]}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Stack>

                                    <Stack spacing={0.5}>
                                        <Typography variant="subtitle1" fontWeight={700}>{widget.title}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                                            {widget.description}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                                        <Chip
                                            label={widget.category}
                                            size="small"
                                            sx={{ bgcolor: 'action.hover', fontSize: '0.7rem' }}
                                        />
                                        {widget.status !== 'coming-soon' && (
                                            <Button size="small" variant="outlined" sx={{ ml: 'auto' }}>
                                                Add widget
                                            </Button>
                                        )}
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}
