import React from "react";

export const SplashScreen = (props: { onEnter: () => void }) => (
  <div
    style={{
      flex: 1,
      height: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    }}
  >
    <p style={{ fontSize: 50, color: "#DA0027" }}>SOUND DESIGNER</p>
    <div
      onClick={props.onEnter}
      style={{
        width: 250,
        height: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        border: "1px solid white",
        cursor: "pointer",
      }}
    >
      <p style={{ color: "white", cursor: "pointer" }}>Begin</p>
    </div>
  </div>
);
