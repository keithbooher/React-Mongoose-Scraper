import React from "react";
import "./Container.css";


export const Container = ({ fluid, children }) =>
  <div className={`container${fluid ? "-fluid" : ""} margin`} id="container">
    {children}
  </div>;