import { createSlice } from "@reduxjs/toolkit";
import pokemonDataSlice from './carouselSlice';

const pokemonDataSlice = createSlice({
    name:'pokemonsData',
    initialState:{
        data:[]
    },
    reducers:{
        setPokemonData:(state,action) => state.data = action.payload
    }
})


export {setPokemonData} = pokemonDataSlice.actions

export default pokemonDataSlice.reducer;

