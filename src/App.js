import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  // initialize pokemon data array
  const [pokemon, setPokemon] = useState([]);
  const offset = useRef(31);
  // fetch promise to get and assign pokemon data
  const fetchPokemon = offset => {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=21&offset=${offset}`)
      .then(res => res.json())
      .then(data => setPokemon(data.results))
      .catch(err => console.log(err));
  };
  // mimics componentDidMount lifecycle
  useEffect(() => {
    fetchPokemon(offset.current);
  }, [offset]);

  return (
    <div className="container-fluid">
      <div className={"row bg-light"}>
        {pokemon &&
          pokemon.map(({ name, url }, key) => (
            <div key={key} className="col-4">
              <div className="card" style={{ height: "100%" }}>
                <div className="card-body">
                  <div> Pokémon: {name}</div>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    link to Details JSON
                  </a>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
