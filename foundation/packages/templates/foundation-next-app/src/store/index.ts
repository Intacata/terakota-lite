import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '~/features/theme/themeSlice';
import sidebarReducer from '~/features/sidebar/sidebarSlice';

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        sidebar: sidebarReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
