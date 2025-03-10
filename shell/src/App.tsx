import { useState } from "react";

import "./App.css";
import PokemonDetails from "remoteApp1/PokemonDetails";
import PokemonHistory from "remoteApp2/PokemonHistory";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Vite + React</h1>
      <PokemonDetails />
      <PokemonHistory />

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
