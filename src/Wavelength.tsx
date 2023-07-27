import React, { useState } from "react";
import "./App.css";
import { WavelengthBar } from "./components/WavelengthBar/WavelengthBar";
import { SpectrumCard } from "./components/SpectrumCard/SpectrumCard";
import { Target } from "./components/Target/Target";
import { shuffledCards } from "./components/SpectrumCard/spectrumCards";
import ShuffleIcon from "./assets/shuffle.png";
import styled from "styled-components";
import { Slide, Slider } from "@mui/material";

export const Wavelength = () => {
  const [position, setPosition] = useState(50);
  const [showTarget, setShowTarget] = useState(true);
  const [currentCard, setCurrentCard] = useState<{
    right: string;
    left: string;
  }>(shuffledCards());
  const shufflePosition = () => {
    setShowTarget(true);
    setPosition(Math.floor(Math.random() * 100));
  };
  const drawCard = () => {
    setCurrentCard(shuffledCards());
  };

  const toggleTarget = () => {
    setShowTarget((prev) => !prev);
  };

  return (
    <div className="App">
      <Title className="App-header">
        {" "}
        {"Wavelength: a game of provoking thoughts"}{" "}
      </Title>
      <Step> {"Step 1: draw a spectrum card"} </Step>
      <StyledButton onClick={drawCard}>
        <img alt="shuffle" src={ShuffleIcon} width="30" height={30} />
      </StyledButton>
      <SpectrumCard
        spectrumLeft={currentCard.left}
        spectrumRight={currentCard.right}
      ></SpectrumCard>
      <Step> {"Step 2: give me a target"} </Step>

      <StyledButton disabled={false} onClick={shufflePosition}>
        <img alt="shuffle" src={ShuffleIcon} width="30" height={30} />
      </StyledButton>

      <Target show={showTarget} position={position} />
      <WavelengthBar
        spectrumLeft={currentCard.left}
        spectrumRight={currentCard.right}
      />
      <Step> {"Step 3: submit a clue"} </Step>
      <Flex>
        <Clue placeholder="Enter clue..."></Clue>
        <StyledButton onClick={toggleTarget}>
          {showTarget ? "Hide Target" : "Show Target"}
        </StyledButton>
      </Flex>
    </div>
  );
};

const Title = styled.div`
  padding: 25px;
`;

const Step = styled.div`
  font-size: 24px;
  margin: 16px 0;
`;

const Flex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Clue = styled.input`
  padding: 8px;
  font-size: 24px;
  text-align: center;
  width: 300px;
  margin: 24px 8px;
`;

const StyledButton = styled.button`
  cursor: pointer;
  height: 47.5px;
  background-color: #ffffff;
  border: 0;
  border-radius: 0.5rem;
  color: #111827;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
  text-align: center;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  &:hover {
    background-color: #68ced1;
  }
`;
