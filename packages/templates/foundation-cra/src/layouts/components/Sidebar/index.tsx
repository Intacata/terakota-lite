import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

import { setActiveItem, toggleOpenItem, toggleMiniMode } from '~/features/sidebar/sidebarSlice';
import type { RootState } from '~/store';
import type { MenuItem } from '~/features/sidebar/sidebarSlice';
import { TOPBAR_HEIGHT } from '~/layouts/components/TopBar';

export const defaultMenuItems: MenuItem[] = [
    {
        id: 'group-main',
        title: 'Main',
        type: 'group',
        children: [
            { id: 'home', title: 'Home', path: '/home', icon: 'home' },
            /*@if:widgets*/
            { id: 'widgets', title: 'Widgets', path: '/widgets', icon: 'extension',
              chip: { label: 'New', color: 'primary' } },
            /*@endif:widgets*/
        ],
    },
    {
        id: 'group-customize',
        title: 'Customize',
        type: 'group',
        children: [
            { id: 'theme-studio', title: 'Theme Studio', path: '/theme-studio', icon: 'palette' },
        ],
    },
    {
        id: 'group-system',
        title: 'System',
        type: 'group',
        children: [
            { id: 'settings', title: 'Settings', path: '/settings', icon: 'settings' },
        ],
    },
];

const iconMap: Record<string, React.ReactNode> = {
    home:      <HomeRoundedIcon fontSize="small" />,
    settings:  <SettingsRoundedIcon fontSize="small" />,
    extension: <ExtensionRoundedIcon fontSize="small" />,
    palette:   <PaletteRoundedIcon fontSize="small" />,
    info:      <InfoRoundedIcon fontSize="small" />,
    grid:      <GridViewRoundedIcon fontSize="small" />,
};

interface MenuItemRowProps {
    item: MenuItem;
    depth?: number;
    mini?: boolean;
}

function MenuItemRow({ item, depth = 0, mini = false }: MenuItemRowProps) {
    const navigate   = useNavigate();
    const location   = useLocation();
    const dispatch   = useDispatch();
    const theme      = useTheme();
    const openItems  = useSelector((s: RootState) => s.sidebar.openItems);

    if (item.type === 'group') return null;

    const isActive    = !!item.path && location.pathname === item.path;
    const hasChildren = !!item.children?.length;
    const isOpen      = openItems.includes(item.id);
    const icon        = item.icon ? iconMap[item.icon] : null;
    const direction   = useSelector((s: RootState) => s.theme.direction);

    const handleClick = () => {
        if (hasChildren) dispatch(toggleOpenItem(item.id));
        else if (item.path) { dispatch(setActiveItem(item.id)); navigate(item.path); }
    };

    const button = (
        <ListItemButton
            onClick={handleClick}
            selected={isActive}
            sx={{
                pl: mini ? 1.5 : 1.5 + depth * 2,
                borderRadius: 1.5,
                mx: 0.75,
                mb: 0.25,
                minHeight: 40,
                justifyContent: mini ? 'center' : 'flex-start',
                transition: 'all 0.15s ease',
                '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    color: 'primary.main',
                    fontWeight: 600,
                    '& .MuiListItemIcon-root': { color: 'primary.main' },
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.18) },
                },
                '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.8) },
            }}
        >
            {icon && (\n                <ListItemIcon
                    sx={{
                        minWidth: mini ? 'auto' : 36,
                        color: isActive ? 'primary.main' : 'text.secondary',
                    }}
                >
                    {icon}
                </ListItemIcon>
            )}
            {!mini && (
                <>
                    <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{
                            variant: 'body2',
                            fontWeight: isActive ? 600 : 400,
                            fontSize: '0.85rem',
                        }}
                    />
                    {item.chip && (
                        <Chip
                            label={item.chip.label}
                            color={item.chip.color ?? 'primary'}
                            size="small"
                            sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700, mr: 0.5 }}
                        />
                    )}
                    {hasChildren && (isOpen ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />)}
                </>
            )}
        </ListItemButton>
    );

    return (
        <>
            <ListItem disablePadding>
                {mini ? <Tooltip title={item.title} placement={direction === 'rtl' ? 'left' : 'right'}>{button}</Tooltip> : button}
            </ListItem>
            {hasChildren && !mini && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List disablePadding>
                        {item.children!.map((child) => (
                            <MenuItemRow key={child.id} item={child} depth={depth + 1} mini={mini} />
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
}

function MenuGroup({ group, mini }: { group: MenuItem; mini: boolean }) {
    return (
        <Box sx={{ mb: 0.5 }}>
            {!mini && group.title && (
                <Typography
                    variant="caption"
                    sx={{
                        px: 2.5, pt: 1.5, pb: 0.5, display: 'block',
                        color: 'text.disabled', fontWeight: 700,
                        letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.65rem',
                    }}
                >
                    {group.title}
                </Typography>
            )}
            {mini && group.title && <Divider sx={{ my: 1, mx: 1 }} />}
            <List dense disablePadding>
                {(group.children ?? []).map((item) => (
                    <MenuItemRow key={item.id} item={item} mini={mini} />
                ))}
            </List>
        </Box>
    );
}

export default function Sidebar() {
    const theme     = useTheme();
    const dispatch  = useDispatch();
    const miniMode  = useSelector((s: RootState) => s.sidebar.miniMode);
    const direction = useSelector((s: RootState) => s.theme.direction);
    const rawItems  = useSelector((s: RootState) => s.sidebar.menuItems);
    const items     = rawItems.length > 0 ? rawItems : defaultMenuItems;

    const groups    = items.filter(i => i.type === 'group');
    const flatItems = items.filter(i => i.type !== 'group');

    // Collapse icon flips in RTL
    const CollapseIcon = direction === 'rtl' ? ChevronRightIcon : ChevronLeftIcon;

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollbarWidth: 'thin',
            }}
        >
            {/* Logo area — height MUST equal TOPBAR_HEIGHT for alignment */}
            <Box
                sx={{
                    px: miniMode ? 0 : 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: miniMode ? 'center' : 'space-between',
                    height: TOPBAR_HEIGHT,        // exact match to TopBar height
                    minHeight: TOPBAR_HEIGHT,
                    flexShrink: 0,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                {!miniMode && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: 11, fontWeight: 800 }}>TK</Avatar>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={800} lineHeight={1.2}>Terakota</Typography>
                            <Typography variant="caption" color="text.disabled" lineHeight={1}>Foundation</Typography>
                        </Box>
                    </Stack>
                )}
                {miniMode && (
                    <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: 11, fontWeight: 800 }}>TK</Avatar>
                )}
                {!miniMode && (
                    <Tooltip title="Mini mode">
                        <IconButton size="small" onClick={() => dispatch(toggleMiniMode())} sx={{ ml: 'auto' }}>
                            <CollapseIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* Navigation */}
            <Box sx={{ flexGrow: 1, pt: 1, pb: 2 }}>
                {groups.length > 0
                    ? groups.map(g => <MenuGroup key={g.id} group={g} mini={miniMode} />)
                    : <List dense disablePadding>{flatItems.map(i => <MenuItemRow key={i.id} item={i} mini={miniMode} />)}</List>
                }
            </Box>

            {/* Bottom — version / expand */}
            <Box
                sx={{
                    p: miniMode ? 1 : 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    justifyContent: miniMode ? 'center' : 'space-between',
                    alignItems: 'center',
                }}
            >
                {!miniMode && (
                    <Typography variant="caption" color="text.disabled">v1.0.0</Typography>
                )}
                <Tooltip title={miniMode ? 'Expand sidebar' : 'Collapse sidebar'} placement={direction === 'rtl' ? 'left' : 'right'}>
                    <IconButton size="small" onClick={() => dispatch(toggleMiniMode())}>
                        <MenuIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
}
