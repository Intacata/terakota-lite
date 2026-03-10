/**
 * HorizontalLayout — Top navigation bar only (no left sidebar).
 * Works for: sidebar-horizontal, sidebar-horizontal-right
 */
import { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, alpha } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';

import { toggleTheme } from '~/features/theme/themeSlice';
import { toggleRightPanel } from '~/features/sidebar/sidebarSlice';
import type { RootState } from '~/store';
import RightSideBar from '~/layouts/components/RightSideBar';
import type { LayoutVariant } from '~/features/sidebar/sidebarSlice';

export const TOPBAR_HEIGHT = 64;

const navItems = [
    { label: 'Home', path: '/home' },
    { label: 'Settings', path: '/settings' },
];

const LayoutRoot = styled(Box)({ display: 'flex', flexDirection: 'column', minHeight: '100vh' });
const ContentArea = styled(Box)({ display: 'flex', flex: 1, overflow: 'hidden' });
const Main = styled(Box)({ flex: 1, overflow: 'auto', paddingTop: TOPBAR_HEIGHT });

interface HorizontalLayoutProps {
    children: React.ReactNode;
    variant: LayoutVariant;
}

export default function HorizontalLayout({ children, variant }: HorizontalLayoutProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const themeMode = useSelector((s: RootState) => s.theme.mode);
    const hasRight = variant === 'sidebar-horizontal-right';

    return (
        <LayoutRoot>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    zIndex: theme.zIndex.drawer + 1,
                    bgcolor: alpha(theme.palette.background.paper, 0.85),
                    backdropFilter: 'blur(12px)',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    color: 'inherit',
                }}
            >
                <Toolbar sx={{ gap: 2, minHeight: `${TOPBAR_HEIGHT}px !important` }}>
                    <Typography variant="h6" fontWeight={700} noWrap sx={{ mr: 2 }}>
                        TERAKOTA_FOUNDATION_NAME
                    </Typography>

                    {/* Nav items — hidden on mobile */}
                    {!isMobile && (
                        <Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
                            {navItems.map(item => (
                                <Button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    size="small"
                                    sx={{
                                        color: location.pathname === item.path
                                            ? 'primary.main'
                                            : 'text.secondary',
                                        fontWeight: location.pathname === item.path ? 700 : 400,
                                        textTransform: 'none',
                                        borderRadius: 1,
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
                    )}

                    <Box sx={{ flexGrow: 1 }} />

                    <Tooltip title={themeMode === 'dark' ? 'Light mode' : 'Dark mode'}>
                        <IconButton size="small" onClick={() => dispatch(toggleTheme())}>
                            {themeMode === 'dark' ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>

                    {hasRight && (
                        <Tooltip title="Toggle panel">
                            <IconButton size="small" onClick={() => dispatch(toggleRightPanel())}>
                                <ViewSidebarOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}

                    {isMobile && <IconButton size="small"><MenuIcon fontSize="small" /></IconButton>}

                    <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: 'primary.main', cursor: 'pointer' }}>T</Avatar>
                </Toolbar>
            </AppBar>

            <ContentArea>
                <Main>
                    <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 }, minHeight: '100%' }}>
                        {children}
                    </Box>
                </Main>
                {hasRight && <RightSideBar persistent />}
            </ContentArea>
        </LayoutRoot>
    );
}
