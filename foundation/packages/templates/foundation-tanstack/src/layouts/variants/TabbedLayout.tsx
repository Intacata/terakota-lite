/**
 * TabbedLayout — Tab-based navigation (like a browser/IDE).
 * Works for: tabbed
 */
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import { useTheme, alpha } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

import { toggleTheme } from '~/features/theme/themeSlice';
import type { RootState } from '~/store';

export const TOPBAR_HEIGHT = 112; // AppBar + Tabs row

const tabs = [
    { label: 'Home', path: '/home', icon: <HomeRoundedIcon fontSize="small" /> },
    { label: 'Settings', path: '/settings', icon: <SettingsRoundedIcon fontSize="small" /> },
];

const LayoutRoot = styled(Box)({ display: 'flex', flexDirection: 'column', minHeight: '100vh' });
const Main = styled(Box)({ flex: 1, overflow: 'auto', paddingTop: TOPBAR_HEIGHT });

interface TabbedLayoutProps { children: React.ReactNode; }

export default function TabbedLayout({ children }: TabbedLayoutProps) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const routerState = useRouterState();
    const pathname   = routerState.pathname;
    const themeMode = useSelector((s: RootState) => s.theme.mode);

    const currentTab = tabs.findIndex(t => pathname.startsWith(t.path));

    return (
        <LayoutRoot>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    bgcolor: alpha(theme.palette.background.paper, 0.9),
                    backdropFilter: 'blur(12px)',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    color: 'inherit',
                }}
            >
                <Toolbar sx={{ minHeight: '56px !important' }}>
                    <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
                        TERAKOTA_FOUNDATION_NAME
                    </Typography>
                    <Tooltip title={themeMode === 'dark' ? 'Light mode' : 'Dark mode'}>
                        <IconButton size="small" onClick={() => dispatch(toggleTheme())}>
                            {themeMode === 'dark'
                                ? <LightModeOutlinedIcon fontSize="small" />
                                : <DarkModeOutlinedIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                    <Avatar sx={{ ml: 1, width: 32, height: 32, fontSize: 13, bgcolor: 'primary.main', cursor: 'pointer' }}>T</Avatar>
                </Toolbar>
                <Tabs
                    value={currentTab < 0 ? 0 : currentTab}
                    onChange={(_, val) => navigate({ to: tabs[val].path })}
                    sx={{ borderTop: `1px solid ${theme.palette.divider}`, minHeight: 44 }}
                    TabIndicatorProps={{ style: { height: 3 } }}
                >
                    {tabs.map(tab => (
                        <Tab
                            key={tab.path}
                            label={tab.label}
                            icon={tab.icon}
                            iconPosition="start"
                            sx={{ minHeight: 44, textTransform: 'none', fontSize: 13, fontWeight: 500 }}
                        />
                    ))}
                </Tabs>
            </AppBar>

            <Main>
                <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 }, minHeight: '100%' }}>
                    {children}
                </Box>
            </Main>
        </LayoutRoot>
    );
}
