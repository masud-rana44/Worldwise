import styles from "../styles/Button.module.css";

function Button({ children, onClick, type, ...rest }) {
  return (
    <button
      onClick={onClick}
      className={`${styles.btn} ${styles[type]}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
