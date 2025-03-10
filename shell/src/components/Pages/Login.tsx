import logo from "@assets/pokelogo.png";
import { SetStateAction, useState } from "react";

interface onChangeThemeProps {
  target: { value: SetStateAction<string> };
}

const Login: React.FC = () => {
  const [theme, setTheme] = useState("light");

  const onChangeTheme = (e: onChangeThemeProps) => {
    setTheme(e.target.value);
  };

  const toggleTheme = theme === "light" ? "light" : "dark";

  return (
    <div className={`login-form theme-${toggleTheme}`}>
      <div className="login-form__container">
        <img className="login-form__logo" src={logo} alt="" />
        <form>
          <div className="form-group">
            <label htmlFor="">theme:</label>
            <select
              name="theme"
              id="theme"
              value={theme}
              onChange={onChangeTheme}
            >
              <option value="light">claro</option>
              <option value="dark">oscuro</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="">user:</label>
            <input className="login-form__user" type="text" />
          </div>
          <button className="login-form__button">Ingresar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
