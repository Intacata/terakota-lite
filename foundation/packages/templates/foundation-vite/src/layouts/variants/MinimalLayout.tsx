import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import { useTheme, alpha } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useNavigate } from 'react-router-dom';

import { toggleTheme } from '~/features/theme/themeSlice';
import { toggleRightPanel } from '~/features/sidebar/sidebarSlice';
import type { RootState } from '~/store';
import RightSideBar from '~/layouts/components/RightSideBar';
import type { LayoutVariant } from '~/features/sidebar/sidebarSlice';

export const TOPBAR_HEIGHT = 64;
const LayoutRoot  = styled(Box)({ display: 'flex', flexDirection: 'column', minHeight: '100vh' });
const ContentArea = styled(Box)({ display: 'flex', flex: 1, overflow: 'hidden' });
const Main        = styled(Box)({ flex: 1, overflow: 'auto', paddingTop: TOPBAR_HEIGHT });

interface MinimalLayoutProps { children: React.ReactNode; variant: LayoutVariant; }

export default function MinimalLayout({ children, variant }: MinimalLayoutProps) {
    const theme     = useTheme();
    const dispatch  = useDispatch();
    const navigate  = useNavigate();
    const themeMode = useSelector((s: RootState) => s.theme.mode);
    const direction = useSelector((s: RootState) => s.theme.direction);
    const hasRight  = variant === 'minimal-right';

    return (
        <LayoutRoot>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    bgcolor: alpha(theme.palette.background.paper, 0.85),
                    backdropFilter: 'blur(12px)',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    color: 'inherit',
                    zIndex: theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar sx={{ minHeight: `${TOPBAR_HEIGHT}px !important` }}>
                    <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
                        TERAKOTA_FOUNDATION_NAME
                    </Typography>
                    <Tooltip title={themeMode === 'dark' ? 'Light mode' : 'Dark mode'}>
                        <IconButton size="small" onClick={() => dispatch(toggleTheme())}>
                            {themeMode === 'dark' ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Settings">
                        <IconButton size="small" onClick={() => navigate('/settings')}>
                            <SettingsOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    {hasRight && (
                        <Tooltip title="Toggle panel">
                            <IconButton size="small" onClick={() => dispatch(toggleRightPanel())}>
                                <ViewSidebarOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Avatar sx={{ ml: 1, width: 32, height: 32, fontSize: 13, bgcolor: 'primary.main', cursor: 'pointer' }}>T</Avatar>
                </Toolbar>
            </AppBar>

            <ContentArea>
                {hasRight && direction === 'rtl' && <RightSideBar />}
                <Main>
                    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto', minHeight: '100%' }}>
                        {children}
                    </Box>
                </Main>
                {hasRight && direction === 'ltr' && <RightSideBar />}
            </ContentArea>
        </LayoutRoot>
    );
}
