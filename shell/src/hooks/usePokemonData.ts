import { useMemo } from "react";
import { AllQuery, UsePokemonDataArgs } from "../interfaces/interface";

const usePokemonData = ({
  FireQuery,
  WaterQuery,
  ElectricQuery,
  DragonQuery,
  GhostQuery,
}: UsePokemonDataArgs) => {
  const { loading, error, allQuerys } = useMemo(() => {
    const allQuerys: AllQuery[] = [
      { query: FireQuery, ability: "fire" },
      { query: WaterQuery, ability: "water" },
      { query: ElectricQuery, ability: "electric" },
      { query: DragonQuery, ability: "dragon" },
      { query: GhostQuery, ability: "ghost" },
    ];

    return {
      allQuerys,
      loading: allQuerys.some(({ query }) => query.isLoading),
      error: allQuerys.find(({ query }) => query.isError),
    };
  }, [FireQuery, WaterQuery, ElectricQuery, DragonQuery, GhostQuery]);

  return { loading, error, allQuerys };
};

export default usePokemonData;
