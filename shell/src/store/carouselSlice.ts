import { createSlice } from "@reduxjs/toolkit";

const pokemonDataSlice = createSlice({
  name: "pokemonData",
  initialState: {
    data: [],
  },
  reducers: {
    setDataPokemon: (state, action) => (state.data = action.payload),
  },
});

const {} = pokemonDataSlice.actions;
