//import logo from "@assets/pokelogo.png";

import logo from "@assets/pokelogo.png";

const Login = () => {
  return (
    <div className="login-form">
      <div className="login-form__container">
        <img className="login-form__logo" src={logo} alt="" />
        <form>
          <div className="form-group">
            <label htmlFor="">theme:</label>
            <select name="" id="">
              <option value="claro">claro</option>
              <option value="oscuro">oscuro</option>
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
