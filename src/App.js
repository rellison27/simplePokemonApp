import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [element, setElement] = useState(null);

  const Pokedex = require("pokeapi-js-wrapper");
  const P = new Pokedex.Pokedex();
  const offset = useRef(30);
  const prevY = useRef(0);

  const observer = useRef(
    new IntersectionObserver(
      entries => {
        const firstEntry = entries[0];
        const y = firstEntry.boundingClientRect.y;

        if (prevY.current > y) {
          setTimeout(() => loadMorePokemon(), 1000); // 1 sec delay
        }

        prevY.current = y;
      },
      { threshold: 0.25 }
    )
  );

  const fetchPokemon = offset => {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(response => {
        const pokeNames = response.results.map(({ name }) => name);
        console.log(pokeNames);
        P.getPokemonByName(pokeNames).then(res =>
          setPokemon(pokemon => [...pokemon, ...res])
        );
        setIsLoading(false);
      })
      .catch(error => console.log(error));
  };

  const loadMorePokemon = () => {
    offset.current += 20;
    fetchPokemon(offset.current);
  };

  useEffect(() => {
    fetchPokemon(offset.current);
  }, [offset]);

  useEffect(() => {
    const currentElement = element; // create a copy of the element from state
    const currentObserver = observer.current;

    if (currentElement) {
      // check if element exists to avoid errors
      currentObserver.observe(currentElement);
    }
    return () => {
      if (currentElement) {
        // check if element exists and stop watching
        currentObserver.unobserve(currentElement);
      }
    };
  }, [element]);
  console.log(pokemon);
  return (
    <div className="container-fluid">
      {!isLoading && (
        <div className="row bg-light">
          {pokemon.map(({ name, sprites: { front_default }, height }, key) => (
            <div
              key={key}
              className="col-4"
              style={{ textAlign: "center", paddingTop: 10 }}
            >
              <div className="card">
                <img src={front_default} className="card-img-top" alt="name" />
                <div className="card-body">
                  <p className="card-title">{name}</p>
                  <p className="card-text">Height: {height}</p>
                  <a href="_blank" className="btn-sm btn-primary">
                    Go somewhere
                  </a>
                </div>
              </div>
            </div>
          ))}
          <a ref={setElement} className="btn">
            loadMorePokemon
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
