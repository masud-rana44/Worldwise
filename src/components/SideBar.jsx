import AppNav from "./AppNav";
import Logo from "./Logo";
import Footer from "./Footer";
import styles from "../styles/SideBar.module.css";

function SideBar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Footer />
    </div>
  );
}

export default SideBar;
