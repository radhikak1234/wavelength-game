import React from "react";
import "./App.css";
import { WavelengthBar } from "./components/WavelengthBar/WavelengthBar";
import { Target } from "./components/Target/Target";

export const Wavelength = () => {
  return (
    <div className="App">
      <Target />
      <WavelengthBar spectrumLeft={"Cold"} spectrumRight={"Hot"} />
    </div>
  );
};
