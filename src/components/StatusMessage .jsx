import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const StatusMessage = ({ status, message, duration = 5000 }) => {
  const { dispatch } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsVisible(false);
      // dispatch({ type: "user/errorUpdated" });
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, dispatch]);

  const style = {
    position: "fixed",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "15px 20px",
    width: "380px",
    fontSize: "15px",
    fontWeight: "500",
    background: `${status === "error" ? "#FFBABA" : "#DFF2BF"}`,
    color: `${status === "error" ? "#D8000C" : "#4F8A10"}`,
    borderRadius: "5px",
    textAlign: "center",
    display: isVisible ? "block" : "none",
  };

  return <div style={style}>{message}</div>;
};

export default StatusMessage;
