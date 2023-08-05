import { NavLink, useParams } from "react-router-dom";
import Logo from "./Logo";
import styles from "../styles/PageNav.module.css";

function PageNav() {
  const params = useParams();

  return (
    <nav className={styles.nav}>
      <Logo />

      <ul>
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li>
          <NavLink to="/product">Product</NavLink>
        </li>
        {params["*"] === "login" ? (
          <li>
            <NavLink to="/signup" className={styles.ctaLink}>
              Signup
            </NavLink>
          </li>
        ) : (
          <li>
            <NavLink to="/login" className={styles.ctaLink}>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default PageNav;
