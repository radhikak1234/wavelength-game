import React, { useState } from "react";
import "./App.css";
import { WavelengthBar } from "./components/WavelengthBar/WavelengthBar";
import { Target } from "./components/Target/Target";
import styled from "styled-components";

export const Wavelength = () => {
  const [position, setPosition] = useState<number>(
    Math.floor(Math.random() * 100)
  );
  const [showTarget, setShowTarget] = useState(true);

  const shufflePosition = () => {
    showTarget && setPosition(Math.floor(Math.random() * 100));
  };

  const toggleTarget = () => {
    setShowTarget((prev) => !prev);
  };

  console.log(showTarget);
  return (
    <div className="App">
      <Title> {"Wavelength: a game of provoking thoughts"} </Title>
      <ShuffleTarget disabled={!showTarget} onClick={shufflePosition}>
        {" Shuffle Target"}
      </ShuffleTarget>
      <ToggleTarget onClick={toggleTarget}>
        {showTarget ? "Hide Target" : "Show Target"}
      </ToggleTarget>
      <Target show={showTarget} position={position} />
      <WavelengthBar spectrumLeft={"Cold"} spectrumRight={"Hot"} />
    </div>
  );
};

const Title = styled.div`
  padding: 25px;
`;
const ShuffleTarget = styled.button`
  padding: 25px;
`;
const ToggleTarget = styled.button`
  padding: 25px;
`;
