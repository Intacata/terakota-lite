import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { WidgetProps } from '../WidgetRegistry';

interface TextConfig { content: string; }

export default function TextWidget({ config }: WidgetProps<TextConfig>) {
    return (
        <Box sx={{ p: 1, height: '100%', overflow: 'auto' }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{config.content}</Typography>
        </Box>
    );
}
