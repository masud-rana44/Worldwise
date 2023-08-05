import { useState, useEffect } from "react";

const StatusMessage = ({ status = "success", message, duration = 4000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const style = {
    position: "fixed",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "12px 30px",
    fontSize: "15px",
    fontWeight: "500",
    background: status === "error" ? "#FFBABA" : "#DFF2BF",
    color: status === "error" ? "#D8000C" : "#4F8A10",
    borderRadius: "5px",
    textAlign: "center",
    display: isVisible ? "block" : "none",
  };

  return <div style={style}>{message}</div>;
};

export default StatusMessage;
