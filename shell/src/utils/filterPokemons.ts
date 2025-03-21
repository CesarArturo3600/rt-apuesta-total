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

export const filterPokemons = (
  data: { name: string; pokemon: Pokemon[] },
  quantity: number = 10
): FilteredData => {
  const { name: hability, pokemon } = data;

  const shortResult = {
    [hability]: pokemon.slice(0, quantity).map(({ pokemon: { name, url } }) => {
      const newUrl = shortURL(url);
      return { name, url: newUrl };
    }),
  };

  return shortResult;
};
