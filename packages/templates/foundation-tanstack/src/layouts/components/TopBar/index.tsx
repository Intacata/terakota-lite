import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import InputBase from '@mui/material/InputBase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, alpha } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LogoutIcon from '@mui/icons-material/Logout';

import { toggleSidebar, toggleMobileSidebar } from '~/features/sidebar/sidebarSlice';
import { setTheme } from '~/features/theme/themeSlice';
import type { RootState } from '~/store';
import { useNavigate } from '@tanstack/react-router';

export const TOPBAR_HEIGHT = 64;

// ─── Search bar ───────────────────────────────────────────────────────────────
function TopBarSearch() {
    const theme = useTheme();
    const [focused, setFocused] = useState(false);

    return (
        <Paper
            component={motion.div}
            animate={{ width: focused ? 320 : 200 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            elevation={0}
            sx={{
                display: 'flex',
                alignItems: 'center',
                px: 1.5,
                py: 0.5,
                borderRadius: 2.5,
                bgcolor: alpha(theme.palette.action.hover, 0.6),
                border: `1px solid ${focused ? theme.palette.primary.main : 'transparent'}`,
                transition: 'border-color 0.2s',
            }}
        >
            <SearchIcon sx={{ color: 'text.disabled', fontSize: 18, mr: 1 }} />
            <InputBase
                placeholder="Search..."
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                sx={{ fontSize: 14, flex: 1 }}
                inputProps={{ 'aria-label': 'search' }}
            />
            {focused && (
                <Chip
                    label="⌘K"
                    size="small"
                    sx={{ height: 18, fontSize: '0.65rem', bgcolor: 'action.selected', border: 'none' }}
                    variant="outlined"
                />
            )}
        </Paper>
    );
}

// ─── Sample notifications ──────────────────────────────────────────────────
const sampleNotifs = [
    { id: 1, title: 'Welcome to Terakota Foundation', time: 'Just now', read: false },
    { id: 2, title: 'Theme customizer is live', time: '2 min ago', read: false },
    { id: 3, title: 'New widget added to registry', time: '1 hr ago', read: true },
];

// ─── User avatar menu ─────────────────────────────────────────────────────────
function UserMenu() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const menuItems = [
        { label: 'My Profile',  icon: <PersonOutlineIcon fontSize="small" />,  path: '/settings' },
        { label: 'Settings',    icon: <SettingsOutlinedIcon fontSize="small" />, path: '/settings' },
        { divider: true },
        { label: 'Lock Screen', icon: <LockOutlinedIcon fontSize="small" />,   path: '/lock' },
        { label: 'Sign Out',    icon: <LogoutIcon fontSize="small" />,         path: '/login', color: 'error.main' },
    ];

    return (
        <>
            <Tooltip title="Account">
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small" sx={{ ml: 0.5 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 13, fontWeight: 700 }}>
                        TK
                    </Avatar>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    elevation: 4,
                    sx: {
                        mt: 1, minWidth: 200, borderRadius: 2,
                        overflow: 'visible',
                        '&::before': {
                            content: '""', display: 'block', position: 'absolute',
                            top: -4, right: 14, width: 8, height: 8,
                            bgcolor: 'background.paper',
                            transform: 'rotate(45deg)', zIndex: 0,
                        },
                    },
                }}
            >
                <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight={700}>Terakota User</Typography>
                    <Typography variant="caption" color="text.secondary">user@terakota.live</Typography>
                </Box>
                <Divider />
                {menuItems.map((item, i) =>
                    item.divider ? (
                        <Divider key={`div-${i}`} />
                    ) : (
                        <MenuItem
                            key={item.label}
                            onClick={() => { setAnchorEl(null); navigate({ to: item.path! }); }}
                            sx={{ py: 1, color: item.color ?? 'inherit' }}
                        >
                            <ListItemIcon sx={{ color: item.color ?? 'inherit' }}>{item.icon}</ListItemIcon>
                            <Typography variant="body2">{item.label}</Typography>
                        </MenuItem>
                    )
                )}
            </Menu>
        </>
    );
}

// ─── TopBar root ──────────────────────────────────────────────────────────────
// TopBar is always full-width — the sidebar is an overlay and does not shift it.
export default function TopBar() {
    const theme     = useTheme();
    const isMobile  = useMediaQuery(theme.breakpoints.down('md'));
    const dispatch  = useDispatch();
    const themeMode = useSelector((s: RootState) => s.theme.mode);
    const sidebarOpen = useSelector((s: RootState) => s.sidebar.open);
    const [fullscreen, setFullscreen] = useState(false);
    const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);

    // Resolve 'system' → actual dark/light so the toggle button always reflects
    // the VISIBLE appearance, even when the mode is driven by OS preference.
    const isDark = themeMode === 'dark'
        || (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const unreadCount = sampleNotifs.filter(n => !n.read).length;

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setFullscreen(true);
        } else {
            document.exitFullscreen();
            setFullscreen(false);
        }
    };

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                height: TOPBAR_HEIGHT,
                // Sidebar is an overlay → AppBar always spans the full viewport
                width: '100%',
                zIndex: (t) => t.zIndex.drawer + 1,
                backdropFilter: 'blur(12px)',
                backgroundColor: isDark
                    ? alpha(theme.palette.background.paper, 0.85)
                    : alpha('#ffffff', 0.88),
                color: 'text.primary',
                borderBottom: `1px solid ${theme.palette.divider}`,
                boxShadow: 'none',
            }}
        >
            <Toolbar sx={{ height: TOPBAR_HEIGHT, minHeight: `${TOPBAR_HEIGHT}px !important`, gap: 0.5, px: { xs: 1, sm: 2 } }}>
                {/* Hamburger — toggles the overlay sidebar */}
                <Tooltip title={isMobile ? 'Menu' : (sidebarOpen ? 'Close sidebar' : 'Open sidebar')}>
                    <IconButton
                        onClick={() => isMobile ? dispatch(toggleMobileSidebar()) : dispatch(toggleSidebar())}
                        size="small"
                        edge="start"
                        sx={{ mr: 0.5 }}
                    >
                        {sidebarOpen && !isMobile ? <MenuOpenIcon /> : <MenuIcon />}
                    </IconButton>
                </Tooltip>

                {/* Brand */}
                <Typography
                    variant="h6"
                    noWrap
                    sx={{ fontWeight: 800, letterSpacing: '-0.5px', mr: 2, display: { xs: 'none', sm: 'block' } }}
                >
                    TERAKOTA_FOUNDATION_NAME
                </Typography>

                {/* Search */}
                {!isMobile && <TopBarSearch />}

                <Box sx={{ flexGrow: 1 }} />

                {/* Right actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                    {/* Theme toggle */}
                    <Tooltip title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}>
                        <IconButton size="small" onClick={() => dispatch(setTheme(isDark ? 'light' : 'dark'))}>
                            {isDark ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>

                    {/* Fullscreen */}
                    <Tooltip title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                        <IconButton size="small" onClick={toggleFullscreen} sx={{ display: { xs: 'none', md: 'flex' } }}>
                            {fullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>

                    {/* Notifications */}
                    <Tooltip title="Notifications">
                        <IconButton size="small" onClick={(e) => setNotifAnchor(e.currentTarget)}>
                            <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 16, minWidth: 16 } }}>
                                <NotificationsNoneIcon fontSize="small" />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    <Menu
                        anchorEl={notifAnchor}
                        open={Boolean(notifAnchor)}
                        onClose={() => setNotifAnchor(null)}
                        PaperProps={{ sx: { width: 320, borderRadius: 2, mt: 1 }, elevation: 4 }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" fontWeight={700}>Notifications</Typography>
                            <Chip label={`${unreadCount} new`} size="small" color="primary" />
                        </Box>
                        <Divider />
                        {sampleNotifs.map((n) => (
                            <MenuItem key={n.id} sx={{ py: 1.5, alignItems: 'flex-start', bgcolor: n.read ? 'transparent' : 'action.hover' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                                    <Typography variant="body2" fontWeight={n.read ? 400 : 600}>{n.title}</Typography>
                                    <Typography variant="caption" color="text.disabled">{n.time}</Typography>
                                </Box>
                            </MenuItem>
                        ))}
                        <Divider />
                        <MenuItem sx={{ justifyContent: 'center', py: 1 }}>
                            <Typography variant="caption" color="primary.main" fontWeight={600}>View all notifications</Typography>
                        </MenuItem>
                    </Menu>

                    {/* User */}
                    <UserMenu />
                </Box>
            </Toolbar>
        </AppBar>
    );
}
