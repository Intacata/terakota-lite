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

// ─── KPI Card ─────────────────────────────────────────────────────────────────
interface KpiCardProps {
    title: string;
    value: string;
    change: string;
    positive: boolean;
    icon: React.ReactNode;
    color: string;
}

function KpiCard({ title, value, change, positive, icon, color }: KpiCardProps) {
    return (
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack spacing={0.5}>
                        <Typography variant="body2" color="text.secondary">{title}</Typography>
                        <Typography variant="h4" fontWeight={700}>{value}</Typography>
                        <Chip
                            label={change}
                            size="small"
                            color={positive ? 'success' : 'error'}
                            variant="outlined"
                            sx={{ width: 'fit-content', height: 20, fontSize: '0.7rem' }}
                        />
                    </Stack>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: `${color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color,
                        }}
                    >
                        {icon}
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
    return (
        <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack spacing={0.5}>
                    <Typography variant="h4" fontWeight={700}>Dashboard</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Welcome to Terakota Foundation. This is your sample home page.
                    </Typography>
                </Stack>
            </Stack>

            {/* KPI Row */}
            <Grid container spacing={2}>
                {[
                    { title: 'Total Users',      value: '12,540', change: '+12% this month', positive: true,  icon: <PeopleIcon />,    color: '#1976d2' },
                    { title: 'Active Dashboards',value: '348',    change: '+5% this week',   positive: true,  icon: <DashboardIcon />, color: '#9c27b0' },
                    { title: 'Revenue',          value: '$4,820', change: '+8% vs last mo',  positive: true,  icon: <TrendingUpIcon />,color: '#2e7d32' },
                    { title: 'Avg. Rating',      value: '4.7',    change: '-0.1 this week',  positive: false, icon: <StarIcon />,      color: '#ed6c02' },
                ].map((kpi) => (
                    <Grid item xs={12} sm={6} md={3} key={kpi.title}>
                        <KpiCard {...kpi} />
                    </Grid>
                ))}
            </Grid>

            {/* Placeholder widgets */}
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Activity Overview
                            </Typography>
                            <Box
                                sx={{
                                    height: 240,
                                    bgcolor: 'action.hover',
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography color="text.disabled">
                                    Chart widget — add ApexCharts / Recharts here
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Quick Actions
                            </Typography>
                            <Stack spacing={1}>
                                {['Create Dashboard', 'Add Widget', 'Share View', 'View Reports'].map((action) => (
                                    <Box
                                        key={action}
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 1.5,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            cursor: 'pointer',
                                            '&:hover': { bgcolor: 'action.hover' },
                                        }}
                                    >
                                        <Typography variant="body2">{action}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Stack>
    );
}
