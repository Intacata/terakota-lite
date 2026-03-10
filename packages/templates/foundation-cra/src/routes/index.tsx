import { lazy, Suspense } from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import Landing from '~/pages/Landing';
import Login from '~/pages/Login';
import NotFound from '~/pages/NotFound';

const Home         = lazy(() => import('~/pages/Home'));
const Settings     = lazy(() => import('~/pages/Settings'));
const ErrorPage    = lazy(() => import('~/pages/ErrorPage'));
const Unauthorized = lazy(() => import('~/pages/Unauthorized'));
const LockScreen   = lazy(() => import('~/pages/LockScreen'));
const Registration = lazy(() => import('~/pages/Registration'));
const AppContainer = lazy(() => import('~/layouts/AppContainer'));

function PageLoader() {
    return <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2000 }} />;
}

export default function AppRoutes() {
    return (
        <HashRouter>
            <Suspense fallback={<PageLoader />}>
                <Switch>
                    <Route exact path="/" component={Landing} />
                    <Route exact path="/login" component={Login} />
                    <Route path={['/register', '/signup']} component={Registration} />
                    <Route path="/lock" component={LockScreen} />
                    <Route path="/404" component={NotFound} />
                    <Route path="/500" component={ErrorPage} />
                    <Route path="/403" component={Unauthorized} />
                    <Route path={['/home', '/dashboard']} render={() => <AppContainer page="home" />} />
                    <Route path="/settings" render={() => <AppContainer page="settings" />} />
                    <Redirect to="/404" />
                </Switch>
            </Suspense>
        </HashRouter>
    );
}
