'use client';
/**
 * DashboardLayout — Smart layout dispatcher.
 *
 * Sidebar behaviour: the vertical sidebar is an OVERLAY that slides over
 * the content area without pushing it. Content always fills the full
 * viewport width — no jarring 260px content shift on open/close.
 *
 * Variants:
 *   sidebar-vertical       — Overlay sidebar + TopBar
 *   sidebar-vertical-right — Overlay sidebar + TopBar + Right panel
 *   sidebar-horizontal     — Horizontal navigation bar only
 *   sidebar-horizontal-right — Horizontal nav + Right panel
 *   sidebar-dual           — Sidebar + always-visible right panel
 *   minimal                — Header only
 *   minimal-right          — Header + Right panel
 *   tabbed                 — Tab-bar navigation
 */
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setMobileSidebarOpen } from '~/features/sidebar/sidebarSlice';
import type { RootState } from '~/store';
import TopBar, { TOPBAR_HEIGHT } from './components/TopBar';
import Sidebar from './components/Sidebar';
import ThemeCustomizer from '~/components/utility/ThemeCustomizer';
import RightSideBar from '~/layouts/components/RightSideBar';
import HorizontalLayout from '~/layouts/variants/HorizontalLayout';
import MinimalLayout from '~/layouts/variants/MinimalLayout';
import TabbedLayout from '~/layouts/variants/TabbedLayout';
import type { LayoutVariant } from '~/features/sidebar/sidebarSlice';

export const SIDEBAR_WIDTH      = 260;
export const SIDEBAR_MINI_WIDTH = 72;

// ─── Styled shells ────────────────────────────────────────────────────────────
const LayoutRoot = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
});

const ContentArea = styled(Box)({
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
});

const Main = styled(Box)({
    flexGrow: 1,
    overflow: 'auto',
    paddingTop: TOPBAR_HEIGHT,
});

// ─── Shared vertical sidebar shell ───────────────────────────────────────────
function VerticalSidebarShell({ children, withRightPanel }: {
    children: React.ReactNode;
    withRightPanel?: boolean;
}) {
    const muiTheme   = useTheme();
    const isMobile   = useMediaQuery(muiTheme.breakpoints.down('md'));
    const dispatch   = useDispatch();
    const open       = useSelector((s: RootState) => s.sidebar.open);
    const mobileOpen = useSelector((s: RootState) => s.sidebar.mobileOpen);
    const miniMode   = useSelector((s: RootState) => s.sidebar.miniMode);
    const direction  = useSelector((s: RootState) => s.theme.direction);
    const isRTL      = direction === 'rtl';

    const drawerWidth  = miniMode ? SIDEBAR_MINI_WIDTH : SIDEBAR_WIDTH;
    const sidebarVisible = isMobile ? mobileOpen : open;
    const sidebarEdge  = isRTL ? 'right' : 'left';

    // Content shift: main content slides away from the sidebar so nothing is hidden.
    // In LTR sidebar is on the left  → shift content right (marginLeft).
    // In RTL sidebar is on the right → shift content left  (marginRight).
    const contentShift = sidebarVisible && !isMobile ? drawerWidth : 0;
    const contentTransition = muiTheme.transitions.create(
        isRTL ? 'margin-right' : 'margin-left',
        {
            easing: muiTheme.transitions.easing.sharp,
            duration: sidebarVisible
                ? muiTheme.transitions.duration.enteringScreen
                : muiTheme.transitions.duration.leavingScreen,
        }
    );

    useEffect(() => {
        if (!isMobile && mobileOpen) dispatch(setMobileSidebarOpen(false));
    }, [isMobile, mobileOpen, dispatch]);

    const paperStyles = {
        width: drawerWidth,
        boxSizing: 'border-box' as const,
        top: 0,
        height: '100%',
        overflowX: 'hidden' as const,
        borderRight: !isRTL ? `1px solid ${muiTheme.palette.divider}` : 'none',
        borderLeft:  isRTL  ? `1px solid ${muiTheme.palette.divider}` : 'none',
    };

    return (
        <LayoutRoot>
            {/* TopBar — full width, sits above everything */}
            <TopBar />

            {/* ── Desktop sidebar (fixed overlay, pushes content via margin) ── */}
            {!isMobile && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        [sidebarEdge]: 0,
                        height: '100%',
                        width: sidebarVisible ? drawerWidth : 0,
                        zIndex: muiTheme.zIndex.drawer,
                        overflow: 'hidden',
                        transition: muiTheme.transitions.create('width', {
                            easing: muiTheme.transitions.easing.sharp,
                            duration: sidebarVisible
                                ? muiTheme.transitions.duration.enteringScreen
                                : muiTheme.transitions.duration.leavingScreen,
                        }),
                        bgcolor: 'background.paper',
                        borderRight: !isRTL ? `1px solid ${muiTheme.palette.divider}` : 'none',
                        borderLeft:  isRTL  ? `1px solid ${muiTheme.palette.divider}` : 'none',
                        boxShadow: sidebarVisible ? muiTheme.shadows[4] : 'none',
                    }}
                >
                    <Sidebar />
                </Box>
            )}

            {/* ── Mobile temporary drawer ──────────────────────────── */}
            {isMobile && (
                <Drawer
                    variant="temporary"
                    anchor={sidebarEdge}
                    open={mobileOpen}
                    onClose={() => dispatch(setMobileSidebarOpen(false))}
                    ModalProps={{ keepMounted: true }}
                    sx={{ '& .MuiDrawer-paper': { ...paperStyles, boxShadow: muiTheme.shadows[8] } }}
                >
                    <Sidebar />
                </Drawer>
            )}

            {/* ── Main content — shifts smoothly when sidebar opens ── */}
            <ContentArea>
                <Main
                    sx={{
                        [isRTL ? 'marginRight' : 'marginLeft']: `${contentShift}px`,
                        transition: contentTransition,
                    }}
                >
                    <Box sx={{ p: { xs: 2, sm: 2, md: 2.5 }, minHeight: '100%' }}>
                        {children}
                    </Box>
                </Main>
                {withRightPanel && <RightSideBar persistent />}
            </ContentArea>

            <ThemeCustomizer />
        </LayoutRoot>
    );
}

function DualPanelShell({ children }: { children: React.ReactNode }) {
    return <VerticalSidebarShell withRightPanel>{children}</VerticalSidebarShell>;
}

// ─── Main DashboardLayout export ─────────────────────────────────────────────
interface DashboardLayoutProps {
    children: React.ReactNode;
    variantOverride?: LayoutVariant;
}

export default function DashboardLayout({ children, variantOverride }: DashboardLayoutProps) {
    const reduxVariant = useSelector((s: RootState) => s.sidebar.layoutVariant);
    const variant = variantOverride ?? reduxVariant ?? 'sidebar-vertical';

    switch (variant) {
        case 'sidebar-vertical-right':
            return <VerticalSidebarShell withRightPanel>{children}</VerticalSidebarShell>;
        case 'sidebar-dual':
            return <DualPanelShell>{children}</DualPanelShell>;
        case 'sidebar-horizontal':
        case 'sidebar-horizontal-right':
            return <HorizontalLayout variant={variant}>{children}</HorizontalLayout>;
        case 'minimal':
        case 'minimal-right':
            return <MinimalLayout variant={variant}>{children}</MinimalLayout>;
        case 'tabbed':
            return <TabbedLayout>{children}</TabbedLayout>;
        case 'sidebar-vertical':
        default:
            return <VerticalSidebarShell>{children}</VerticalSidebarShell>;
    }
}
