import { configureStore } from "@reduxjs/toolkit";
import {
  pokemonAll,
  pokemonsByAbilities,
  pokemonImg,
} from "../Services/pokeService";

export const store = configureStore({
  reducer: {
    [pokemonAll.reducerPath]: pokemonAll.reducer,
    [pokemonsByAbilities.reducerPath]: pokemonsByAbilities.reducer,
    [pokemonImg.reducerPath]: pokemonImg.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(pokemonAll.middleware)
      .concat(pokemonsByAbilities.middleware)
      .concat(pokemonImg.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
