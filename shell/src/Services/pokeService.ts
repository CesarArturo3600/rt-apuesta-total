import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const pokemonInterceptor = async (arg: any, Api: any, options: any) => {
  const results = await fetchBaseQuery({
    baseUrl: "https://pokeapi.co/api/v2/",
  })(arg, Api, options);

  if (results.error) {
    const error = results.error as FetchBaseQueryError;
    switch (error.status) {
      case 404:
        console.log(`${error.status}: Dato inexistente`);
        break;
      case 429:
        console.log(`${error.status}: exceso de solicitudes`);
        break;
      case 500:
        console.log(
          `${error.status}: Problemas en el servidor, servidor caido"`
        );
        break;
    }
  }
  return results;
};

export const pokemonAll = createApi({
  reducerPath: "pokemonAll",
  baseQuery: pokemonInterceptor,
  endpoints: (builder) => ({
    getPokemonsAll: builder.query({
      query: () => "pokemon?limit=100000&offset=0",
    }),
  }),
});

export const pokemonsByAbilities = createApi({
  reducerPath: "pokemonsByAbilities",
  baseQuery: pokemonInterceptor,
  endpoints: (builder) => ({
    getPokemonsByAbilities: builder.query({
      query: (ability) => `type/${ability}`,
    }),
  }),
});

export const pokemonImg = createApi({
  reducerPath: "pokemonImg",
  baseQuery: pokemonInterceptor,
  endpoints: (builder) => ({
    getPokemonsImg: builder.query({
      query: (url) => `${url}`,
    }),
  }),
});

export const { useGetPokemonsAllQuery } = pokemonAll;
export const { useGetPokemonsByAbilitiesQuery } = pokemonsByAbilities;
export const { useGetPokemonsImgQuery } = pokemonImg;
