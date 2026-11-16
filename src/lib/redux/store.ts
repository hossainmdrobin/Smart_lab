import { configureStore } from "@reduxjs/toolkit";
import { peopleApi } from "@/src/lib/services/rtk/peopleApi";
import { publicationsApi } from "@/src/lib/services/rtk/publicationsApi";
import { projectsApi } from "@/src/lib/services/rtk/projectsApi";
import { researchThemesApi } from "@/src/lib/services/rtk/researchThemesApi";
import { opportunitiesApi } from "@/src/lib/services/rtk/opportunitiesApi";
import { newsApi } from "@/src/lib/services/rtk/newsApi";
import { usersApi } from "@/src/lib/services/rtk/usersApi";
import { settingsApi } from "@/src/lib/services/rtk/settingsApi";
import { mediaApi } from "@/src/lib/services/rtk/mediaApi";
import { contactApi } from "@/src/lib/services/rtk/contactApi";

export const store = configureStore({
  reducer: {
    [peopleApi.reducerPath]: peopleApi.reducer,
    [publicationsApi.reducerPath]: publicationsApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [researchThemesApi.reducerPath]: researchThemesApi.reducer,
    [opportunitiesApi.reducerPath]: opportunitiesApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [mediaApi.reducerPath]: mediaApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      peopleApi.middleware,
      publicationsApi.middleware,
      projectsApi.middleware,
      researchThemesApi.middleware,
      opportunitiesApi.middleware,
      newsApi.middleware,
      usersApi.middleware,
      settingsApi.middleware,
      mediaApi.middleware,
      contactApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
