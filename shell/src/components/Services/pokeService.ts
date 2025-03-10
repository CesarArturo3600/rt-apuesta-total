import axios, { AxiosResponse } from "Axios";
import { filterPokemons } from "@utils/filterPokemons";
interface pokedata {
  name: string;
  url: string;
}

interface getPokemonsResponse {
  count: number;
  next?: string;
  previus?: null;
  results: pokedata;
}

//const habilities = ["fire", "water", "electric", "dragon", "ghost"];

const pokemonApi = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 1000,
});

const pokeData = {
  getPokemons: async (): Promise<AxiosResponse<getPokemonsResponse>> => {
    try {
      const response = await pokemonApi.get("pokemon?limit=100000&offset=0");
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getPokemonsHabilities: async (type: string = "dragon") => {
    try {
      const response = await pokemonApi.get(`type/${type}`);
      //filtrar aqui
      const res = await filterPokemons(response.data, 10);
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};

export default pokeData;
