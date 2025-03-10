import { useEffect, useState } from "react";
import pokeData from "../Services/pokeService";
//import Layout from "../Templates/Layout";

interface Pokemon {
  name: string;
}

interface PokeHabilities {
  [ability: string]: Pokemon[];
}

const Search = () => {
  const [PokelistByHab, setPokeListByHab] = useState<PokeHabilities[]>([]);

  useEffect(() => {
    const showPokemons = async () => {
      try {
        const response = await pokeData.getPokemons();
        return response.data.results;
      } catch (error) {
        console.log(error);
      }
    };
    const habilities = async () => {
      try {
        const habList = ["fire", "water", "electric", "dragon", "ghost"];
        const dataHab: PokeHabilities[] = [];
        for (const hab of habList) {
          const response = await pokeData.getPokemonsHabilities(hab);

          const newItem = { [hab]: response };
          dataHab.push(newItem);
        }
        setPokeListByHab(dataHab);
      } catch (error) {
        console.log(error);
        throw error;
      }
    };
    showPokemons();
    habilities();
  }, []);

  return <h1>soy Search</h1>;
};

export default Search;
