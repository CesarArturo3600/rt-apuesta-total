import React, { useState } from "react";

// Componente para un solo carrusel
const PokemonCarousel = ({ title, pokemons }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Número de elementos a mostrar por página
  const itemsPerPage = 4;

  // Cálculo del número total de páginas
  const totalPages = Math.ceil(pokemons.length / itemsPerPage);

  // Manejar clic en botón siguiente
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerPage >= pokemons.length ? 0 : prevIndex + itemsPerPage
    );
  };

  // Manejar clic en botón anterior
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - itemsPerPage < 0
        ? Math.max(
            0,
            pokemons.length - (pokemons.length % itemsPerPage || itemsPerPage)
          )
        : prevIndex - itemsPerPage
    );
  };

  // Obtener los elementos para la página actual
  const currentItems = pokemons.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  // Calcular la página actual
  const currentPage = Math.floor(currentIndex / itemsPerPage) + 1;

  return (
    <div className="carousel">
      <h2>{title.toUpperCase()}</h2>
      <div className="carousel-container">
        {pokemons.length === 0 ? (
          <p>Cargando pokémon de tipo {title}...</p>
        ) : (
          <>
            <div className="carousel-navigation">
              <button
                className="carousel-button prev"
                onClick={handlePrev}
                disabled={pokemons.length <= itemsPerPage}
              >
                &lt;
              </button>

              <div className="pokemon-grid">
                {currentItems.map((pokemon, index) => (
                  <div
                    key={`${pokemon.name}-${index}`}
                    className="pokemon-card"
                  >
                    {pokemon.imageUrl ? (
                      <img
                        src={pokemon.imageUrl}
                        alt={pokemon.name}
                        className="pokemon-image"
                      />
                    ) : (
                      <div className="pokemon-image-placeholder">No imagen</div>
                    )}
                  </div>
                ))}
              </div>

              <button
                className="carousel-button next"
                onClick={handleNext}
                disabled={pokemons.length <= itemsPerPage}
              >
                &gt;
              </button>
            </div>

            {totalPages > 1 && (
              <div className="carousel-pagination">
                <span>
                  {currentPage} / {totalPages}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Componente principal que muestra todos los carruseles
const PokemonCarousels = ({ carouselsData }) => {
  return (
    <div className="carousels-container">
      {carouselsData.map((carousel) => (
        <PokemonCarousel
          key={carousel.ability}
          title={carousel.ability}
          pokemons={carousel.pokemons}
        />
      ))}
    </div>
  );
};

export default PokemonCarousels;
