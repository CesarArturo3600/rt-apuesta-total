import { BrowserRouter } from "react-router-dom";
import "@styles/main.scss";
import { AppRoutes } from "./Routes/AppRoutes";
//import PokemonDetails from "remoteApp1/PokemonDetails";
//import PokemonHistory from "remoteApp2/PokemonHistory";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
