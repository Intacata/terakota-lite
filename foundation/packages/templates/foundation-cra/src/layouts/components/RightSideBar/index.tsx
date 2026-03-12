import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { setRightPanelOpen } from '~/features/sidebar/sidebarSlice';
import type { RootState } from '~/store';

export const RIGHT_PANEL_WIDTH = 280;

interface RightSideBarProps {
    /** When true the panel is always visible (sidebar-dual / sidebar-vertical-right) */
    persistent?: boolean;
}

export default function RightSideBar({ persistent = false }: RightSideBarProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    const dispatch = useDispatch();
    const open = useSelector((s: RootState) => s.sidebar.rightPanelOpen);

    const content = (
        <Box sx={{ width: RIGHT_PANEL_WIDTH, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, minHeight: 64 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ flexGrow: 1 }}>
                    Panel
                </Typography>
                {!persistent && (
                    <IconButton size="small" onClick={() => dispatch(setRightPanelOpen(false))}>
                        <ChevronRightIcon fontSize="small" />
                    </IconButton>
                )}
            </Box>
            <Divider />

            {/* Sections */}
            <Box sx={{ flex: 1, overflow: 'auto', px: 2, py: 2 }}>
                {/* Theme Quick-Access */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PaletteOutlinedIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={0.8}>
                        Theme
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Open the Theme Customizer in Settings → Appearance to adjust colors, fonts, and layout.
                </Typography>

                {/* Notifications placeholder */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <NotificationsNoneIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={0.8}>
                        Notifications
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    No new notifications.
                </Typography>

                {/* Info placeholder */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <InfoOutlinedIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={0.8}>
                        Info
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    This right panel is a customizable slot. Add widgets, context data, or tools here.
                </Typography>
            </Box>
        </Box>
    );

    // Always-visible variant (sidebar-dual, sidebar-vertical-right, sidebar-horizontal-right)
    if (persistent && !isMobile) {
        return (
            <Box
                component="aside"
                sx={{
                    width: RIGHT_PANEL_WIDTH,
                    flexShrink: 0,
                    borderLeft: `1px solid ${theme.palette.divider}`,
                    height: '100vh',
                    position: 'sticky',
                    top: 0,
                    overflow: 'hidden',
                }}
            >
                {content}
            </Box>
        );
    }

    // Temporary overlay variant
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={() => dispatch(setRightPanelOpen(false))}
            sx={{ '& .MuiDrawer-paper': { width: RIGHT_PANEL_WIDTH, boxSizing: 'border-box' } }}
        >
            {content}
        </Drawer>
    );
}
