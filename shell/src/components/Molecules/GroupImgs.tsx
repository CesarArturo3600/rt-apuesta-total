interface pokeGrupoProps {
  url?: string;
  ability?: string;
}

interface GroupImgsProps {
  pokemonGrupo: pokeGrupoProps[];
}

const GroupImgs = ({ pokemonGrupo }: GroupImgsProps) => {
  console.log("🚀 ~ GroupImgs ~ pokemonGrupo: ####", pokemonGrupo);

  return (
    <div className="carousel-group">
      {pokemonGrupo.map(({ url, ability }, index) => (
        <div key={index} className="carousel-group--item">
          <p>{url}</p>
        </div>
      ))}
    </div>
  );
};

export default GroupImgs;

/* {pokemonsWithImages.length > 0 ? (
          allQuery.map(({ ability }, index) => (
            <div key={ability} className="carousel-section">
              <h2 className="carousel-title">{ability.toUpperCase()}</h2>
              <div className="carousel">
                {pokemonsWithImages
                  .filter((pokemon) => pokemon.ability === ability)
                  .map((pokemon, idx) => (
                    <div
                      key={`${pokemon.name}-${idx}`}
                      className="carousel-item"
                    >
                      <img
                        src={pokemon.imageUrl}
                        alt={pokemon.name}
                        className="pokemon-image"
                      />
                      <h3>{pokemon.name}</h3>
                    </div>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <p>Cargando imágenes...</p>
        )} */
