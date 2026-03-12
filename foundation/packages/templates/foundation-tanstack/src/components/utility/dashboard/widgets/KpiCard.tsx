import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import type { WidgetProps } from '../WidgetRegistry';

interface KpiConfig {
    title: string;
    value: string | number;
    unit?: string;
    trend?: number;       // % change, positive/negative/zero
    prefix?: string;
    description?: string;
}

export default function KpiCard({ config }: WidgetProps<KpiConfig>) {
    const { title, value, unit, trend = 0, prefix = '', description } = config;

    const TrendIcon = trend > 0 ? TrendingUpIcon : trend < 0 ? TrendingDownIcon : TrendingFlatIcon;
    const trendColor = trend > 0 ? 'success.main' : trend < 0 ? 'error.main' : 'text.secondary';

    return (
        <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>{title}</Typography>
                <Stack spacing={0.5}>
                    <Typography variant="h4" fontWeight={700}>
                        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
                        {unit && <Typography component="span" variant="body2" color="text.secondary" ml={0.5}>{unit}</Typography>}
                    </Typography>
                    {trend !== 0 && (
                        <Chip
                            icon={<TrendIcon sx={{ fontSize: '0.85rem !important' }} />}
                            label={`${trend > 0 ? '+' : ''}${trend}%`}
                            size="small"
                            sx={{ width: 'fit-content', height: 20, fontSize: '0.7rem', color: trendColor, bgcolor: `${trendColor}20`, border: 'none' }}
                            variant="outlined"
                        />
                    )}
                    {description && <Typography variant="caption" color="text.disabled">{description}</Typography>}
                </Stack>
            </CardContent>
        </Card>
    );
}
