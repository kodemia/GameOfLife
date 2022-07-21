import { useState } from "react";

export default function Cell(props) {
  return (
    <div
      onClick={props.onClick}
      style={{
        border: "1px solid black",
        textAlign: "center",
        backgroundColor: props.state ? "green" : "gray",
      }}
    >
      {props.state && "x"}
    </div>
  );
}
