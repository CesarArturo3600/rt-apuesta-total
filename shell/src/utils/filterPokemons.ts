interface Pokemon {
  pokemon: {
    name: string;
  };
}

interface FilteredData {
  [key: string]: { name: string }[];
}

export const filterPokemons = (
  data: { name: string; pokemon: Pokemon[] },
  quantity: number = 10
): FilteredData => {
  const { name, pokemon } = data;

  const shortResult = {
    [name]: pokemon
      .slice(0, quantity)
      .map(({ pokemon: { name } }) => ({ name })),
  };
  return shortResult;
};
