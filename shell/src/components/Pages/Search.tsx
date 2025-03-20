import { useGetPokemonsByAbilitiesQuery } from "@services/pokeService";
import { useEffect, useState } from "react";
import { filterPokemons } from "../../utils/filterPokemons";
import PokemonCarousels from "../Molecules/PokemonCarousel";

// Define interfaces para tipar los datos
interface PokemonImageData {
  name: string;
  imageUrl: string;
  ability: string;
}

interface PokemonData {
  name: string;
  url: string;
}

interface PokemonCarouselData {
  ability: string;
  pokemons: PokemonImageData[];
}

const Search = () => {
  // Estado para almacenar los resultados filtrados de cada consulta
  const [filteredResults, setFilteredResults] = useState<{
    [key: string]: PokemonData[];
  }>({});
  // Estado para almacenar los datos procesados por cada carrusel
  const [carouselsData, setCarouselsData] = useState<PokemonCarouselData[]>([]);
  // Estado para controlar si estamos listos para mostrar los datos
  const [dataReady, setDataReady] = useState(false);
  // Estado para controlar el progreso de la carga
  const [loadingProgress, setLoadingProgress] = useState<{
    current: number;
    total: number;
  }>({ current: 0, total: 0 });

  // Consultas para diferentes habilidades
  const fireQuery = useGetPokemonsByAbilitiesQuery("fire");
  const waterQuery = useGetPokemonsByAbilitiesQuery("water");
  const electricQuery = useGetPokemonsByAbilitiesQuery("electric");
  const dragonQuery = useGetPokemonsByAbilitiesQuery("dragon");
  const ghostQuery = useGetPokemonsByAbilitiesQuery("ghost");

  const allQueries = [
    { query: fireQuery, ability: "fire" },
    { query: waterQuery, ability: "water" },
    { query: electricQuery, ability: "electric" },
    { query: dragonQuery, ability: "dragon" },
    { query: ghostQuery, ability: "ghost" },
  ];

  /* const query = [
  { query: {data:{name:"fire",pokemons:[{name:'charizard',url:"www.charizar.com"}, {name:'charizard',url:"www.charizar.com"}, ...]}}, ability: "fire" },
  { query: waterQuery, ability: "water" },
  { query: electricQuery, ability: "electric" },
  { query: dragonQuery, ability: "dragon" },
  { query: ghostQuery, ability: "ghost" },

] */

  const isLoading = allQueries.some(({ query }) => query.isLoading);
  const isError = allQueries.find(({ query }) => query.isError);

  // Paso 1: Recopilar los resultados filtrados de cada consulta
  useEffect(() => {
    if (!isLoading && !isError) {
      const filteredData: { [key: string]: PokemonData[] } = {};

      // const evaluacion = {
      //   "fire":[{nombre:'oikami',url:'http://oirami.com'}, ...]
      // }

      allQueries.forEach(({ query, ability }) => {
        if (query.data) {
          const dataFiltered = filterPokemons(query.data, 10);
          // {"habilidad":[{name:"",url:""},{},{} ...]}
          filteredData[ability] = dataFiltered[ability] || []; //  =  [{},{},{}]
        }
      });

      setFilteredResults(filteredData);
    }
  }, [isLoading, isError]);

  // Paso 2: Para cada pokémon en los resultados filtrados, obtener su imagen
  useEffect(() => {
    const loadPokemonImages = async () => {
      // Inicializar la estructura de carruseles
      const initialCarousels: PokemonCarouselData[] = allQueries.map(
        ({ ability }) => ({
          ability,
          pokemons: [] as PokemonImageData[], // Especificar el tipo explícitamente
        })
      );

      //const initialCarousel = [
      // {ability:"fire",pokemons:[]},
      // {ability:"water",pokemons:[]},
      // {ability:"electric",pokemons:[]},
      // ... otros mas
      //]

      // Calcular el total de Pokémon a procesar

      //Object.keys
      //["fire","water","electric", ... ]

      let totalPokemon = 0;
      for (const ability of Object.keys(filteredResults)) {
        //   ["fire",water ...""]== Object.keys(filteredResults)

        totalPokemon += filteredResults[ability].length; // suma hasta 5 por que
        // filteredResult es {"fire":[{name:"",url:""}]}
      }

      setLoadingProgress({ current: 0, total: totalPokemon });
      let processed = 0;

      // Para cada habilidad
      for (const ability of Object.keys(filteredResults)) {
        const pokemonList = filteredResults[ability];
        // pokemonList = [{name:'',url:''}, ...]

        // Para cada pokémon en la lista
        for (const pokemon of pokemonList) {
          try {
            // Realizar la consulta
            const response = await fetch(
              `https://pokeapi.co/api/v2/${pokemon.url}`
            );
            const details = await response.json();
            console.log("🚀 ~ loadPokemonImages ~ details:", details);

            // Obtener la URL de la imagen
            const imageUrl = details.sprites?.front_default || "";

            // Agregar a la estructura de carruseles
            initialCarousels.forEach((carousel) => {
              if (carousel.ability === ability) {
                carousel.pokemons.push({
                  name: pokemon.name,
                  imageUrl: imageUrl,
                  ability: ability,
                });
              }
            });

            // Actualizar progreso
            processed++;
            setLoadingProgress({ current: processed, total: totalPokemon });

            // Actualizamos el estado para ver el progreso
            setCarouselsData([...initialCarousels]);
          } catch (error) {
            console.error(`Error loading image for ${pokemon.name}:`, error);
            processed++;
            setLoadingProgress({ current: processed, total: totalPokemon });
          }
        }
      }

      // Marcar como listo para mostrar
      setDataReady(true);
    };

    // Si tenemos resultados filtrados, cargar las imágenes
    //{"fire":[{name:"",url:""},{},{} ...],"water":[{name:"",url:""},{},{} ...]}
    //resultado de object.Keys
    //
    //[
    //  ["fire",[{name:"",url:""},{},{} ...]],
    //  ["water",[{name:"",url:""},{},{} ...]], ... otros arrays
    //]
    if (Object.keys(filteredResults).length > 0) {
      //["fire","water","electric", ... ].lenght  5
      loadPokemonImages();
    }
  }, [filteredResults]);

  return (
    <div className="search">
      {isLoading && <p>Cargando datos iniciales...</p>}
      {isError && <p className="error-message">Error al cargar los datos</p>}
      {!isLoading && !dataReady && (
        <div className="loading-progress">
          <p>
            Procesando imágenes de Pokémon... {loadingProgress.current} de{" "}
            {loadingProgress.total}
          </p>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: `${
                  (loadingProgress.current / loadingProgress.total) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>
      )}
      {!isLoading && dataReady && (
        <div className="search--container">
          <PokemonCarousels carouselsData={carouselsData} />
        </div>
      )}
    </div>
  );
};

export default Search;
