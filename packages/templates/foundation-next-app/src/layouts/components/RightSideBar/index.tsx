'use client';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { setRightPanelOpen } from '~/features/sidebar/sidebarSlice';
import type { RootState } from '~/store';

export const RIGHT_PANEL_WIDTH = 280;

interface RightSideBarProps {
    /** Always-visible (sidebar-dual / sidebar-vertical-right) */
    persistent?: boolean;
}

export default function RightSideBar({ persistent = false }: RightSideBarProps) {
    const theme     = useTheme();
    const isMobile  = useMediaQuery(theme.breakpoints.down('lg'));
    const dispatch  = useDispatch();
    const open      = useSelector((s: RootState) => s.sidebar.rightPanelOpen);
    const direction = useSelector((s: RootState) => s.theme.direction);

    // In RTL this panel anchors to the LEFT; in LTR to the RIGHT.
    const anchor        = direction === 'rtl' ? 'left'  : 'right';
    const CloseIcon     = direction === 'rtl' ? ChevronLeftIcon : ChevronRightIcon;
    const borderStyle   = direction === 'rtl'
        ? { borderRight: `1px solid ${theme.palette.divider}` }
        : { borderLeft:  `1px solid ${theme.palette.divider}` };

    const content = (
        <Box sx={{ width: RIGHT_PANEL_WIDTH, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, minHeight: 64 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ flexGrow: 1 }}>
                    Panel
                </Typography>
                {!persistent && (
                    <IconButton size="small" onClick={() => dispatch(setRightPanelOpen(false))}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                )}
            </Box>
            <Divider />

            <Box sx={{ flex: 1, overflow: 'auto', px: 2, py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PaletteOutlinedIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={0.8}>
                        Theme
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Open the Theme Customizer via the palette button to adjust colors, fonts, and layout.
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <NotificationsNoneIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={0.8}>
                        Notifications
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    No new notifications.
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <InfoOutlinedIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={0.8}>
                        Info
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    This right panel is a customizable slot — add widgets, context data, or tools here.
                </Typography>
            </Box>
        </Box>
    );

    // Always-visible on desktop
    if (persistent && !isMobile) {
        return (
            <Box
                component="aside"
                sx={{
                    width: RIGHT_PANEL_WIDTH,
                    flexShrink: 0,
                    height: '100vh',
                    position: 'sticky',
                    top: 0,
                    overflow: 'hidden',
                    ...borderStyle,
                }}
            >
                {content}
            </Box>
        );
    }

    return (
        <Drawer
            anchor={anchor as any}
            open={open}
            onClose={() => dispatch(setRightPanelOpen(false))}
            sx={{ '& .MuiDrawer-paper': { width: RIGHT_PANEL_WIDTH, boxSizing: 'border-box' } }}
        >
            {content}
        </Drawer>
    );
}
