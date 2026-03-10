import { createFileRoute } from '@tanstack/react-router';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StarIcon from '@mui/icons-material/Star';
import AppShell from '~/layouts/AppShell';

const KPI_DATA = [
    { title: 'Total Users',  value: '12,540', change: '+12%', positive: true,  icon: <PeopleIcon />,    color: '#1976d2' },
    { title: 'Dashboards',   value: '348',    change: '+5%',  positive: true,  icon: <DashboardIcon />, color: '#9c27b0' },
    { title: 'Revenue',      value: '$4,820', change: '+8%',  positive: true,  icon: <TrendingUpIcon />,color: '#2e7d32' },
    { title: 'Avg. Rating',  value: '4.7',    change: '-0.1', positive: false, icon: <StarIcon />,      color: '#ed6c02' },
];

function KpiCard({ title, value, change, positive, icon, color }: typeof KPI_DATA[0]) {
    return (
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack spacing={0.5}>
                        <Typography variant="body2" color="text.secondary">{title}</Typography>
                        <Typography variant="h4" fontWeight={700}>{value}</Typography>
                        <Chip label={change} size="small" color={positive ? 'success' : 'error'} variant="outlined"
                            sx={{ width: 'fit-content', height: 20, fontSize: '0.7rem' }} />
                    </Stack>
                    <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: `${color}20`,
                               display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                        {icon}
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

function Home() {
    return (
        <AppShell>
            <Stack spacing={3}>
                <Stack spacing={0.5}>
                    <Typography variant="h4" fontWeight={700}>Dashboard</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Welcome to Terakota Foundation — TanStack Start edition.
                    </Typography>
                </Stack>
                <Grid container spacing={2}>
                    {KPI_DATA.map(kpi => (
                        <Grid item xs={12} sm={6} md={3} key={kpi.title}>
                            <KpiCard {...kpi} />
                        </Grid>
                    ))}
                </Grid>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>Activity</Typography>
                        <Box sx={{ height: 180, bgcolor: 'action.hover', borderRadius: 2,
                                   display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography color="text.disabled">Add charts here</Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Stack>
        </AppShell>
    );
}
export const Route = createFileRoute('/home')({ component: Home });
