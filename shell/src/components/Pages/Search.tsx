import { useGetPokemonsByAbilitiesQuery } from "@services/pokeService";
import { useEffect, useState } from "react";
import { filterPokemons } from "../../utils/filterPokemons";
import { useGetPokemonsImgQuery } from "../../Services/pokeService";

interface dataBasicPokemonUrlProp {
  name: string;
  url: string;
}

interface dataBasicPokemonProp {
  [name: string]: dataBasicPokemonUrlProp;
}

const Search = () => {
  const [dataPokemon, setDataPokemon] = useState<dataBasicPokemonProp[]>([]);

  const fireQuery = useGetPokemonsByAbilitiesQuery("fire");
  const waterQuery = useGetPokemonsByAbilitiesQuery("water");
  const electricQuery = useGetPokemonsByAbilitiesQuery("electric");
  const dragonQuery = useGetPokemonsByAbilitiesQuery("dragon");
  const ghostQuery = useGetPokemonsByAbilitiesQuery("ghost");

  const allQueris = [
    { query: fireQuery, ability: "fire" },
    { query: waterQuery, ability: "water" },
    { query: electricQuery, ability: "electric" },
    { query: dragonQuery, ability: "dragon" },
    { query: ghostQuery, ability: "ghost" },
  ];

  const isLoading = allQueris.some(({ query }) => query.isLoading);
  const isError = allQueris.find(({ query }) => query.isError);

  const [dataPokemonIndex, setDataPokemonIndex] = useState(-1);
  const currentDataPokemon = dataPokemon[dataPokemonIndex];

  const key = currentDataPokemon && Object.entries(currentDataPokemon)[0][0];
  // aqui key vale ghost/fire/water ...

  const arrDataURLPokemon = key && currentDataPokemon[key];

  const urlPokemonImage =
    arrDataURLPokemon && arrDataURLPokemon[dataPokemonIndex]["url"];

  const { data: isDataPokemonUrlImg, isLoading: isLoadingPokemonImg } =
    useGetPokemonsImgQuery(urlPokemonImage, {
      skip: !urlPokemonImage || dataPokemonIndex <= 0,
    });

  console.log("🚀 ~ Search ~ isLoadingPokemonImg:", isLoadingPokemonImg);
  console.log("🚀 ~ Search ~ isDataPokemonUrlImg:", isDataPokemonUrlImg);
  //isDataPokemonImg : al ser un servicio detenido por skip devolvera undefined
  //isLoadingPokemonImg : sera false ya que es un servicio detenido

  useEffect(() => {
    if (!isLoading && !isError) {
      const arrDataBasicPokemon: dataBasicPokemonProp[] = [];

      allQueris.forEach(({ query, ability }) => {
        if (query.data) {
          const dataFiltered = filterPokemons(query.data, 5);

          arrDataBasicPokemon.push(dataFiltered);
        }
      });

      if (arrDataBasicPokemon.length > 0) {
        setDataPokemonIndex(0);
      }

      setDataPokemon(arrDataBasicPokemon);
    }
  }, [isLoading, isError]);

  useEffect(() => {
    if (dataPokemonIndex < dataPokemon.length - 1) {
      setDataPokemonIndex((prev) => prev + 1);
    }
  }, [dataPokemon, dataPokemonIndex]);

  return (
    <div className="search">
      {isLoading && <p>Cargando ...</p>}
      {isError && <p>Error</p>}
      {!isLoading && (
        <div className="search--container">
          <div className="carousel">
            <div className="carousel-container"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
