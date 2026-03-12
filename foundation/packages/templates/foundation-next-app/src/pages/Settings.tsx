'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import IntegrationInstructionsOutlinedIcon from '@mui/icons-material/IntegrationInstructionsOutlined';

// ─── Tab panel ────────────────────────────────────────────────────────────────
function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
    return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

// ─── Profile tab ──────────────────────────────────────────────────────────────
function ProfileTab() {
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <Stack spacing={3}>
            {saved && <Alert severity="success" onClose={() => setSaved(false)}>Profile updated successfully.</Alert>}

            {/* Avatar */}
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Profile Picture</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack direction="row" alignItems="center" spacing={3}>
                        <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 24, fontWeight: 700 }}>TK</Avatar>
                        <Stack spacing={1}>
                            <Button variant="outlined" size="small">Upload Photo</Button>
                            <Button variant="text" size="small" color="error">Remove</Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>

            {/* Personal info */}
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Personal Information</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <TextField label="First Name" defaultValue="Terakota" size="small" fullWidth />
                        <TextField label="Last Name" defaultValue="User" size="small" fullWidth />
                        <TextField label="Email" defaultValue="user@terakota.live" size="small" fullWidth />
                        <TextField label="Phone" defaultValue="+1 555 000 0000" size="small" fullWidth />
                        <TextField label="Job Title" defaultValue="Product Designer" size="small" fullWidth />
                        <FormControl size="small" fullWidth>
                            <InputLabel>Time Zone</InputLabel>
                            <Select defaultValue="UTC-5" label="Time Zone">
                                <MenuItem value="UTC-8">Pacific Time (UTC-8)</MenuItem>
                                <MenuItem value="UTC-5">Eastern Time (UTC-5)</MenuItem>
                                <MenuItem value="UTC+0">Greenwich (UTC+0)</MenuItem>
                                <MenuItem value="UTC+1">Central Europe (UTC+1)</MenuItem>
                                <MenuItem value="UTC+5:30">India (UTC+5:30)</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </CardContent>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                <Button variant="outlined">Discard</Button>
                <Button variant="contained" onClick={handleSave}>Save Changes</Button>
            </Box>
        </Stack>
    );
}

// ─── Notifications tab ────────────────────────────────────────────────────────
function NotificationsTab() {
    const notifSettings = [
        { label: 'Email notifications', desc: 'Receive updates and alerts via email', defaultOn: true },
        { label: 'Push notifications',  desc: 'Browser push notifications for real-time alerts', defaultOn: true },
        { label: 'Marketing emails',    desc: 'Product updates, tips and feature announcements', defaultOn: false },
        { label: 'Security alerts',     desc: 'Get notified about sign-ins and security events', defaultOn: true },
        { label: 'Weekly digest',       desc: 'Summary of your activity every Monday morning', defaultOn: false },
    ];

    return (
        <Stack spacing={3}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Notification Preferences</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <List disablePadding>
                        {notifSettings.map((s, i) => (
                            <ListItem key={s.label} disablePadding sx={{ py: 1.5, borderBottom: i < notifSettings.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                                <ListItemText
                                    primary={<Typography variant="body2" fontWeight={500}>{s.label}</Typography>}
                                    secondary={<Typography variant="caption" color="text.secondary">{s.desc}</Typography>}
                                />
                                <ListItemSecondaryAction>
                                    <FormControlLabel
                                        control={<Switch defaultChecked={s.defaultOn} size="small" />}
                                        label=""
                                        sx={{ mr: 0 }}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>

            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Notification Frequency</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <FormControl size="small" sx={{ minWidth: 220 }}>
                        <InputLabel>Digest frequency</InputLabel>
                        <Select defaultValue="daily" label="Digest frequency">
                            <MenuItem value="realtime">Real-time</MenuItem>
                            <MenuItem value="daily">Daily digest</MenuItem>
                            <MenuItem value="weekly">Weekly digest</MenuItem>
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>
        </Stack>
    );
}

// ─── Security tab ─────────────────────────────────────────────────────────────
function SecurityTab() {
    const sessions = [
        { device: 'MacBook Pro — Chrome', location: 'New York, US',  time: 'Active now',   current: true },
        { device: 'iPhone 15 — Safari',   location: 'New York, US',  time: '2 hours ago',  current: false },
        { device: 'Windows PC — Edge',    location: 'Chicago, US',   time: '3 days ago',   current: false },
    ];

    return (
        <Stack spacing={3}>
            {/* Password */}
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Change Password</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={2} maxWidth={400}>
                        <TextField label="Current Password" type="password" size="small" fullWidth />
                        <TextField label="New Password" type="password" size="small" fullWidth />
                        <TextField label="Confirm New Password" type="password" size="small" fullWidth />
                        <Button variant="contained" sx={{ alignSelf: 'flex-start' }}>Update Password</Button>
                    </Stack>
                </CardContent>
            </Card>

            {/* 2FA */}
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h6" fontWeight={600}>Two-Factor Authentication</Typography>
                            <Typography variant="body2" color="text.secondary" mt={0.5}>
                                Add an extra layer of security to your account.
                            </Typography>
                        </Box>
                        <Chip label="Disabled" size="small" color="default" />
                    </Stack>
                    <Divider sx={{ my: 2 }} />
                    <Button variant="outlined" size="small">Enable 2FA</Button>
                </CardContent>
            </Card>

            {/* Sessions */}
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Active Sessions</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <List disablePadding>
                        {sessions.map((s, i) => (
                            <ListItem key={s.device} disablePadding sx={{ py: 1.5, borderBottom: i < sessions.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                                <ListItemText
                                    primary={
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography variant="body2" fontWeight={500}>{s.device}</Typography>
                                            {s.current && <Chip label="This device" size="small" color="success" />}
                                        </Stack>
                                    }
                                    secondary={`${s.location} · ${s.time}`}
                                />
                                {!s.current && (
                                    <ListItemSecondaryAction>
                                        <Button size="small" color="error">Revoke</Button>
                                    </ListItemSecondaryAction>
                                )}
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>
        </Stack>
    );
}

// ─── Integrations tab ─────────────────────────────────────────────────────────
function IntegrationsTab() {
    const integrations = [
        { name: 'Slack',   desc: 'Send dashboard alerts to Slack channels', connected: true },
        { name: 'GitHub',  desc: 'Link pull requests and issues to dashboards', connected: false },
        { name: 'Jira',    desc: 'Sync project metrics and sprint data', connected: false },
        { name: 'Zapier',  desc: 'Automate workflows with 5000+ apps', connected: false },
    ];

    return (
        <Stack spacing={2}>
            {integrations.map((intg) => (
                <Card key={intg.name} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography variant="subtitle1" fontWeight={600}>{intg.name}</Typography>
                                <Typography variant="body2" color="text.secondary">{intg.desc}</Typography>
                            </Box>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                {intg.connected && <Chip label="Connected" size="small" color="success" variant="outlined" />}
                                <Button variant={intg.connected ? 'outlined' : 'contained'} size="small" color={intg.connected ? 'error' : 'primary'}>
                                    {intg.connected ? 'Disconnect' : 'Connect'}
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            ))}
        </Stack>
    );
}

// ─── Settings page ────────────────────────────────────────────────────────────
export default function Settings() {
    const [tab, setTab] = useState(0);

    const tabs = [
        { label: 'Profile',       icon: <PersonOutlineIcon fontSize="small" /> },
        { label: 'Notifications', icon: <NotificationsNoneIcon fontSize="small" /> },
        { label: 'Security',      icon: <SecurityOutlinedIcon fontSize="small" /> },
        { label: 'Integrations',  icon: <IntegrationInstructionsOutlinedIcon fontSize="small" /> },
    ];

    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h4" fontWeight={700}>Settings</Typography>
                <Typography variant="body2" color="text.secondary">
                    Manage your account, security and connected services.
                </Typography>
            </Box>

            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                variant="scrollable"
                scrollButtons="auto"
            >
                {tabs.map((t) => (
                    <Tab
                        key={t.label}
                        label={t.label}
                        icon={t.icon}
                        iconPosition="start"
                        sx={{ textTransform: 'none', fontWeight: 500, minHeight: 48 }}
                    />
                ))}
            </Tabs>

            <TabPanel value={tab} index={0}><ProfileTab /></TabPanel>
            <TabPanel value={tab} index={1}><NotificationsTab /></TabPanel>
            <TabPanel value={tab} index={2}><SecurityTab /></TabPanel>
            <TabPanel value={tab} index={3}><IntegrationsTab /></TabPanel>
        </Stack>
    );
}
