/* export interface PokemonImageData {
  name: string;
  imageUrl: string;
  ability: string;
}

export interface PokemonData {
  name: string;
  url: string;
}

export interface PokemonCarouselData {
  ability: string;
  pokemons: PokemonImageData[];
}

export interface FoundPokemon {
  name: string;
  imageUrl: string;
}
 */

export interface DataQueryPokemon {
  name?: string;
  url?: string;
}

interface DataQueryPokemonList {
  pokemon: DataQueryPokemon;
}

export interface DataQuery {
  name: string | undefined;
  pokemon: DataQueryPokemonList[] | [];
}

export interface QueryResponse {
  isLoading: boolean;
  isError: boolean;
  data?: DataQuery;
}

export interface AllQuery {
  query: QueryResponse;
  ability: string;
}

export interface UsePokemonDataArgs {
  [key: string]: QueryResponse;
}

export interface DataPokemons {
  [key: string]: DataQueryPokemon[];
}

export interface PokemonDataFormated {
  name?: string;
  image?: string;
}

//carousel
// Definimos la interfaz para cada slide
export interface SlideItem {
  id?: string;
  image: string;
  name: string;
}

// Definimos la interfaz para las propiedades del carrusel
export interface CarouselProps {
  autoplay?: boolean;
  speed?: number;
  autoplaySpeed?: number;
  slidesToShow?: number;
  slidesToScroll?: number;
  slides?: SlideItem[];
}
