import { useMemo } from "react";
import { useGetPokemonsByAbilitiesQuery } from "../../Services/pokeService";
import usePokemonData from "../../hooks/usePokemonData";
import useProcessPokemonData from "../../hooks/useProcessPokemonData";
import Carousel from "@molecules/Carousel";

export const Search = () => {
  // RTKQUERIES
  const FireQuery = useGetPokemonsByAbilitiesQuery("fire");
  const WaterQuery = useGetPokemonsByAbilitiesQuery("water");
  const ElectricQuery = useGetPokemonsByAbilitiesQuery("electric");
  const DragonQuery = useGetPokemonsByAbilitiesQuery("dragon");
  const GhostQuery = useGetPokemonsByAbilitiesQuery("ghost");

  const { loading, error, allQuerys } = usePokemonData({
    FireQuery,
    WaterQuery,
    ElectricQuery,
    DragonQuery,
    GhostQuery,
  });

  //arreglo de habilidades
  // const arrAbilities = useMemo(() => {
  //   return allQuerys.map((query) => query.ability);
  // }, [allQuerys]);

  const {
    pokemonData: pokeData,
    progressPokemons,
    dataReady,
  } = useProcessPokemonData({
    allQuerys,
    loading,
    error,
  });
  console.log("🚀 ~ Search ~ dataReady: >>> ", dataReady);
  console.log("🚀 ~ Search ~ progressPokemons: >>> ", progressPokemons);

  const data = useMemo(() => {
    return Object.entries(pokeData);
  }, [pokeData]);

  return (
    <div className="nSearch">
      {loading && <p>.................Cargando</p>}
      {error && <p>error de componente ...</p>}

      {!loading && !dataReady && (
        <div className="loading-progress">
          <p>
            Procesando imágenes de Pokémon... {progressPokemons.current} de{" "}
            {progressPokemons.total}
          </p>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: `${
                  (progressPokemons.current / progressPokemons.total) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {!loading &&
        pokeData &&
        data &&
        data.map((ele) => {
          const title = ele[0];
          const arrData = ele[1];

          return (
            <div key={title}>
              <h2>{ele[0]}</h2>
              <div>
                <Carousel autoplay={true} slides={arrData} />
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Search;
