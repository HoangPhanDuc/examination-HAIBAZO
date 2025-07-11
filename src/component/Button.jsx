import React from "react";
import "../assets/css/button.css";

export default function Button(props) {
  return (
    <button onClick={props.handleTime} className="btn btn-light button-style">
      {props.content}
    </button>
  );
}
