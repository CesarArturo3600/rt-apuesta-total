import { replace } from "react-router-dom";
import { DataQueryPokemon } from "../interfaces/interface";

interface Pokemon {
  pokemon: {
    name: string;
    url: string;
  };
}

interface FilteredData {
  [key: string]: { name: string; url: string }[];
}

const URLBASE = "https://pokeapi.co/api/v2/";

const shortURL = (url: string) => {
  return url.replace(URLBASE, "");
};

// export const filterPokemons = (
//   data: { name: string; pokemon: Pokemon[] },
//   quantity: number = 10
// ): FilteredData => {
//   const { name: hability, pokemon } = data;

//   const shortResult = {
//     [hability]: pokemon.slice(0, quantity).map(({ pokemon: { name, url } }) => {
//       const newUrl = shortURL(url);
//       return { name, url: newUrl };
//     }),
//   };

//   return shortResult;
// };

// export const only10 = (data: any, quantity: number) => {
//   let arrPokemons: DataQueryPokemon[] = [];
//   const { pokemon } = data;

//   //cortar en los primeros 10 elementos del arreglo
//   const only10 = pokemon.slice(0, quantity);

//   for (const ele of only10) {
//     const shortURL = ele?.pokemon?.url;
//     arrPokemons = [...arrPokemons, { name: ele.pokemon.name, url: shortURL }];
//   }
//   return arrPokemons;
// };

interface Pokemon {
  name: string;
  url: string;
}

export const filterPokemon10 = (pokemon, quantity: number) => {
  return pokemon.slice(0, quantity).map((ele) => ele.pokemon);
};
