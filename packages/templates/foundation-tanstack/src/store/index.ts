import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '~/features/theme/themeSlice';
import sidebarReducer from '~/features/sidebar/sidebarSlice';

const store = configureStore({
    reducer: {
        theme: themeReducer,
        sidebar: sidebarReducer,
        // ─── Add new feature slices here ──────────────────────────────────
        // auth: authReducer,
        // dashboard: dashboardReducer,
    },
    middleware: (getDefault) =>
        getDefault({
            serializableCheck: {
                // Ignore these action types (e.g. PWA install event objects)
                ignoredActions: ['pwa/setInstallPrompt'],
            },
        }),
    devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
