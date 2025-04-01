import { useEffect, useMemo, useState } from "react";
import {
  DataPokemons,
  AllQuery,
  PokemonDataFormated,
} from "../interfaces/interface";
import { filterPokemon10 } from "../utils/filterPokemons";

interface UseProcessPokemonDataArgs {
  allQuerys: AllQuery[];
  loading: boolean | true;
  error: boolean;
}

const useProcessPokemonData = ({
  allQuerys,
  loading,
  error,
}: UseProcessPokemonDataArgs) => {
  const [pokemonData, setPokemonData] = useState({});

  const [progressPokemons, setProgressPokemons] = useState({
    current: 0,
    total: 0,
  });

  const [dataReady, setDataReady] = useState(false);

  const arrAbilities = useMemo(() => {
    return allQuerys.map((query) => query.ability);
  }, [allQuerys]);

  useEffect(() => {
    const chargePokemons = async () => {
      // obj contiene datos de pokemones x habilidad,
      // img sin procesar
      const allDataOnlyFiltered: DataPokemons = {};

      let totalPokemons: number = 0;

      for (const aQuery of allQuerys) {
        const { name, pokemon } = aQuery.query.data;
        const FilterPokemonsResult = filterPokemon10(pokemon, 10);
        allDataOnlyFiltered[name] = FilterPokemonsResult;
        totalPokemons += allDataOnlyFiltered[name].length;
      }

      const allDataFormated = {};

      let currentPokemon = 0;

      for (const ability of arrAbilities) {
        const arrPokemons = [];
        for (const anAbility of allDataOnlyFiltered[ability]) {
          try {
            const response = await fetch(`${anAbility.url}`);
            const { sprites } = await response.json();
            const image = sprites?.front_default;

            arrPokemons.push({ name: anAbility.name, image });
            currentPokemon++;
          } catch (err) {
            console.error(err);
          }
        }
        allDataFormated[ability] = arrPokemons;
      }
      setPokemonData(allDataFormated);
      setProgressPokemons({ current: currentPokemon, total: totalPokemons });
      setDataReady(true);
    };

    if (allQuerys && !loading && !error) {
      chargePokemons();
    }
  }, [loading, error, allQuerys]);

  return { pokemonData, progressPokemons, dataReady };
};

export default useProcessPokemonData;
