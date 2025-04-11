import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../Store/AuthContext";
import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {
    authCtx.logout();
    navigate("/auth");
  };

  return (
    <header className={classes.header}>
      <Link to="/" className={classes.logo}>
        Expense Tracker
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}
          {isLoggedIn && (
            <>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
