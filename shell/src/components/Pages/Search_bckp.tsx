import {
  useGetPokemonsByAbilitiesQuery,
  useGetPokemonDataQuery,
} from "@services/pokeService";
import { useEffect, useState } from "react";
import { filterPokemons } from "../../utils/filterPokemons";
import PokemonCarousels from "../Molecules/PokemonCarousel";
import {
  FoundPokemon,
  PokemonCarouselData,
  PokemonData,
  PokemonImageData,
} from "../../interfaces/interface";

// Define interfaces para tipar los datos

const Searchbackup = () => {
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

  // Estado para controlar si estamos en modo búsqueda
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Estado para el pokémon encontrado
  const [foundPokemon, setFoundPokemon] = useState<FoundPokemon | null>(null);

  // Búsqueda de pokémon
  const [currentPokemonFind, setCurrentPokemonFind] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Consultas para diferentes habilidades
  const fireQuery = useGetPokemonsByAbilitiesQuery("fire");
  const waterQuery = useGetPokemonsByAbilitiesQuery("water");
  const electricQuery = useGetPokemonsByAbilitiesQuery("electric");
  const dragonQuery = useGetPokemonsByAbilitiesQuery("dragon");
  const ghostQuery = useGetPokemonsByAbilitiesQuery("ghost");

  // Consulta para buscar un pokémon específico
  const {
    data: currentFindPokeData,
    isError: currentFindPokeError,
    isLoading: currentFindPokeLoading,
  } = useGetPokemonDataQuery(currentPokemonFind, {
    skip: !searchTriggered,
  });

  const allQueries = [
    { query: fireQuery, ability: "fire" },
    { query: waterQuery, ability: "water" },
    { query: electricQuery, ability: "electric" },
    { query: dragonQuery, ability: "dragon" },
    { query: ghostQuery, ability: "ghost" },
  ];

  const isLoading = allQueries.some(({ query }) => query.isLoading);
  const isError = allQueries.find(({ query }) => query.isError);

  // Paso 1: Recopilar los resultados filtrados de cada consulta
  useEffect(() => {
    if (!isLoading && !isError) {
      const filteredData: { [key: string]: PokemonData[] } = {};

      allQueries.forEach(({ query, ability }) => {
        if (query.data) {
          const dataFiltered = filterPokemons(query.data, 10);
          filteredData[ability] = dataFiltered[ability] || [];
        }
      });

      setFilteredResults(filteredData);
    }
  }, [isLoading, isError]);

  // Cargar imágenes de pokémon para los carruseles
  useEffect(() => {
    const loadPokemonImages = async () => {
      // Inicializar la estructura de carruseles
      const initialCarousels: PokemonCarouselData[] = allQueries.map(
        ({ ability }) => ({
          ability,
          pokemons: [] as PokemonImageData[],
        })
      );

      let totalPokemon = 0;
      for (const ability of Object.keys(filteredResults)) {
        totalPokemon += filteredResults[ability].length;
      }

      setLoadingProgress({ current: 0, total: totalPokemon });
      let processed = 0;

      // Para cada habilidad
      for (const ability of Object.keys(filteredResults)) {
        const pokemonList = filteredResults[ability];

        // Para cada pokémon en la lista
        for (const pokemon of pokemonList) {
          try {
            // Realizar la consulta
            const response = await fetch(
              `https://pokeapi.co/api/v2/${pokemon.url}`
            );
            const details = await response.json();

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

    if (Object.keys(filteredResults).length > 0) {
      loadPokemonImages();
    }
  }, [filteredResults]);

  // Procesar los datos del pokémon buscado
  useEffect(() => {
    if (
      !currentFindPokeLoading &&
      !currentFindPokeError &&
      currentFindPokeData &&
      searchTriggered
    ) {
      // Asumiendo que currentFindPokeData tiene una estructura con name y sprites
      setFoundPokemon({
        name: currentFindPokeData.name,
        imageUrl: currentFindPokeData.sprites?.front_default || "",
      });

      // Ya no estamos cargando
      setIsSearchMode(false);
    } else if (currentFindPokeError && searchTriggered) {
      // En caso de error, volver a mostrar los carruseles
      setIsSearchMode(false);
      setSearchTriggered(false);
      setFoundPokemon(null);
      // Aquí podrías añadir un estado para mostrar un mensaje de error
    }
  }, [
    currentFindPokeLoading,
    currentFindPokeError,
    currentFindPokeData,
    searchTriggered,
  ]);

  // Manejador para el cambio en el input
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const finderPokemon = e.target.value.toLowerCase().trim();
    setCurrentPokemonFind(finderPokemon);
  };

  // Manejador para la tecla Enter
  const onHandleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentPokemonFind.trim() !== "") {
      // Activar el modo búsqueda y la consulta
      setIsSearchMode(true);
      setSearchTriggered(true);
      setFoundPokemon(null); // Limpiar resultados anteriores
    }
  };

  // Manejador para volver a los carruseles
  const handleBackToCarousels = () => {
    setIsSearchMode(false);
    setSearchTriggered(false);
    setCurrentPokemonFind("");
    setFoundPokemon(null);
  };

  return (
    <div className="search">
      {isLoading && <p>Cargando datos iniciales...</p>}
      {isError && <p className="error-message">Error al cargar los datos</p>}

      {!isLoading && !dataReady && !isSearchMode && (
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

      {(!isLoading && dataReady) || isSearchMode ? (
        <div className="search--container">
          <div className="search--pokemon">
            <input
              type="text"
              className="search--pokemon__input"
              placeholder="Ingresa el nombre del Pokémon y presiona Enter"
              value={currentPokemonFind}
              onChange={onChangeInput}
              onKeyDown={onHandleKeyDown}
            />
          </div>

          {/* Mostrar spinner cuando estamos buscando */}
          {isSearchMode && currentFindPokeLoading && (
            <div className="search--loading">
              <div className="spinner"></div>
              <p>Buscando pokémon...</p>
            </div>
          )}

          {/* Mostrar el pokémon encontrado */}
          {!isSearchMode && foundPokemon && (
            <div className="search--result">
              <div className="pokemon-card">
                <img
                  src={foundPokemon.imageUrl}
                  alt={foundPokemon.name}
                  className="pokemon-card__image"
                />
                <h3 className="pokemon-card__name">{foundPokemon.name}</h3>
                <button
                  className="pokemon-card__back-button"
                  onClick={handleBackToCarousels}
                >
                  Volver a los carruseles
                </button>
              </div>
            </div>
          )}

          {/* Mostrar carruseles si no estamos en modo búsqueda */}
          {!isSearchMode && !foundPokemon && (
            <PokemonCarousels carouselsData={carouselsData} />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Searchbackup;

/////////////////////////////////////////////

/* import {
  useGetPokemonsByAbilitiesQuery,
  useGetPokemonDataQuery,
} from "@services/pokeService";
import { useEffect, useState } from "react";
import { filterPokemons } from "../../utils/filterPokemons";
import PokemonCarousels from "../Molecules/PokemonCarousel";
import { skip } from "node:test";

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

  //busqueda de pokemon
  const [currentPokemonFind, setCurrentPokemonFind] = useState("");
  const [enterCurrentPokemonFind, setEnterCurrentPokemonFind] = useState(false);

  // Consultas para diferentes habilidades
  const fireQuery = useGetPokemonsByAbilitiesQuery("fire");
  const waterQuery = useGetPokemonsByAbilitiesQuery("water");
  const electricQuery = useGetPokemonsByAbilitiesQuery("electric");
  const dragonQuery = useGetPokemonsByAbilitiesQuery("dragon");
  const ghostQuery = useGetPokemonsByAbilitiesQuery("ghost");

  const {
    data: currentFindPokeData,
    isError: currentFindPokeError,
    isLoading: currentFindPokeLoading,
  } = useGetPokemonDataQuery(currentPokemonFind, {
    skip: !enterCurrentPokemonFind && !currentPokemonFind,
  });
  console.log("🚀 ~ Search ~ currentPokemonFind:", currentPokemonFind);
  console.log(
    "🚀 ~ Search ~ enterCurrentPokemonFind:",
    enterCurrentPokemonFind
  );

  const allQueries = [
    { query: fireQuery, ability: "fire" },
    { query: waterQuery, ability: "water" },
    { query: electricQuery, ability: "electric" },
    { query: dragonQuery, ability: "dragon" },
    { query: ghostQuery, ability: "ghost" },
  ];

  const isLoading = allQueries.some(({ query }) => query.isLoading);
  const isError = allQueries.find(({ query }) => query.isError);

  // Paso 1: Recopilar los resultados filtrados de cada consulta
  useEffect(() => {
    if (!isLoading && !isError) {
      const filteredData: { [key: string]: PokemonData[] } = {};

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

  useEffect(() => {
    const loadPokemonImages = async () => {
      // Inicializar la estructura de carruseles
      const initialCarousels: PokemonCarouselData[] = allQueries.map(
        ({ ability }) => ({
          ability,
          pokemons: [] as PokemonImageData[], // Especificar el tipo explícitamente
        })
      );

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

    if (Object.keys(filteredResults).length > 0) {
      //["fire","water","electric", ... ].lenght  5
      loadPokemonImages();
    }
  }, [filteredResults]);

  //rellena los datos del pokemon buscado
  // useEffect(() => {
  //   const fillCurrentPokemonData = async () => {
  //     const { name } = currentFindPokeData;
  //     console.log("🚀 ~ fillCurrentPokemonData ~ name:", name);
  //   };

  //   if (
  //     !currentFindPokeLoading &&
  //     !currentFindPokeError &&
  //     currentFindPokeData
  //   ) {
  //     fillCurrentPokemonData();
  //   }
  // }, [currentFindPokeLoading, currentFindPokeError, currentFindPokeData]);

  const onChangeInput = (e: { target: { value: string } }) => {
    const finderPokemon = e.target.value;
    setCurrentPokemonFind(finderPokemon);
  };

  const onHandleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log(">>>>>>>>", "push ENTER");
      setEnterCurrentPokemonFind(!currentPokemonFind);
    }
  };

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
          <div className="search--pokemon">
            <input
              type="text"
              className="search--pokemon__input"
              onChange={onChangeInput}
              onKeyDown={onHandleKeyDown}
            />
          </div>
          <PokemonCarousels carouselsData={carouselsData} />
        </div>
      )}
    </div>
  );
};

export default Search;
 */
