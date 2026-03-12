import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { WidgetProps } from '../WidgetRegistry';

interface ClockConfig { timezone?: string; format?: '12h' | '24h'; showDate?: boolean; }

export default function ClockWidget({ config }: WidgetProps<ClockConfig>) {
    const [time, setTime] = useState(new Date());
    useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id); }, []);

    const fmt = new Intl.DateTimeFormat('en', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: config.format === '12h',
        timeZone: config.timezone === 'local' ? undefined : config.timezone,
    });
    const dateFmt = new Intl.DateTimeFormat('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            <Typography variant="h4" fontWeight={700} fontFamily="monospace">{fmt.format(time)}</Typography>
            {config.showDate && <Typography variant="caption" color="text.secondary">{dateFmt.format(time)}</Typography>}
        </Box>
    );
}
