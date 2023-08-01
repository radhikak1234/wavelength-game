import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { WavelengthBar } from "./components/WavelengthBar/WavelengthBar";
import { SpectrumCard } from "./components/SpectrumCard/SpectrumCard";
import { Target } from "./components/Target/Target";
import { shuffledCards } from "./components/SpectrumCard/spectrumCards";
import ShuffleIcon from "./assets/shuffle.png";
import Show from "./assets/show.png";
import Hide from "./assets/hide.png";
import Check from "./assets/check.png";
import styled from "styled-components";
import { Header } from "./components/Header/Header";

export const Wavelength = () => {
  const [position, setPosition] = useState(50);

  const [currentSection, setSection] = useState(1);
  const [showTarget, setShowTarget] = useState(true);
  const [showPoints, setShowPoints] = useState(false);
  const [guess, setGuess] = useState(50);
  const [clue, setClue] = useState("");
  const [showSlider, setShowSlider] = useState(false);
  const [message, setMessage] = useState("");
  const [currentCard, setCurrentCard] = useState<{
    right: string;
    left: string;
  }>(shuffledCards());
  const section4 = useRef(null);

  const transitionSection = (start: number, end: number) => {
    start && setTimeout(() => setSection(start), 0);
    end && setTimeout(() => setSection(end), 1200);
  };

  useEffect(() => {
    const element = document.getElementById(`step${currentSection}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentSection]);

  const shufflePosition = () => {
    setShowTarget(true);
    setPosition(Math.floor(Math.random() * 100));
    transitionSection(2, 3);
  };
  const drawCard = () => {
    setCurrentCard(shuffledCards());
    resetBoard();
    transitionSection(1, 2);
  };

  const startNextRound = () => {
    resetBoard();
    setSection(1);
    window.scrollTo(0, -80);
  };

  const resetBoard = () => {
    setPosition(50);
    setClue("");
    setShowTarget(true);
    setShowPoints(false);
    setShowSlider(false);
    setGuess(50);
  };

  const toggleTarget = () => {
    if (showTarget) {
      setShowSlider(true);
    }
    setShowTarget((prev) => !prev);
  };

  const submitClue = () => {
    if (clue) {
      setShowTarget(false);
      setShowSlider(true);
      setSection(4);
    }
  };

  const submitGuess = () => {
    transitionSection(4, 5);
  };

  const calculateScore = (side: number) => {
    setSection(6);
    setShowPoints(true);
    setShowTarget(true);
    const distance = Math.abs(position - guess);
    // if distance is 4 and under --> 4 points
    // else if distance is 8 and under --> 3 points
    // else if distance is 12 and under --> 2 points
    // else 0 points
    let points = 0;
    let opponentPoints = 0;

    if (distance <= 2) {
      points = 4;
    } else if (distance <= 7) {
      points = 3;
    } else if (distance <= 12) {
      points = 2;
    }
    // if they guess 'less' than the guess and the correct answer is less, or vice versa, then they get 1 point
    if ((position - guess) * side > 0) {
      opponentPoints = 1;
    }

    setMessage(
      `Target revealed! You scored ${points} points. Your opponent scored ${opponentPoints} points!`
    );
  };

  return (
    <div className="App">
      <Header></Header>
      <Section selected={currentSection === 1} id="step1">
        <Flex>
          <Step> {"Draw a spectrum card"} </Step>
          <StyledButton onClick={drawCard}>
            <img alt="draw a card" src={ShuffleIcon} width="45" height="45" />
          </StyledButton>
        </Flex>
        <SpectrumCard
          spectrumLeft={currentCard.left}
          spectrumRight={currentCard.right}
        ></SpectrumCard>
      </Section>
      <Section
        hide={currentSection >= 4}
        selected={currentSection === 2}
        id="step2"
      >
        <Flex>
          <Step> {"Give me a target"} </Step>
          <StyledButton onClick={shufflePosition}>
            <img alt="shuffle" src={ShuffleIcon} width="45" height="45" />
          </StyledButton>
        </Flex>

        {currentSection !== 4 && (
          <>
            <Target reveal={showPoints} show={showTarget} position={position} />
            <WavelengthBar
              clue={clue}
              spectrumLeft={currentCard.left}
              spectrumRight={currentCard.right}
              setGuess={setGuess}
              showSlider={false}
            />
          </>
        )}
      </Section>
      <Section selected={currentSection === 3} id="step3" ref={section4}>
        <Step> {"Submit a clue to hide the target"} </Step>
        <Flex>
          <Clue
            onChange={(e) => {
              setClue(e.target.value);
              if (currentSection !== 3) {
                setSection(3);
              }
            }}
            // disabled={!showTarget}
            placeholder="Enter clue..."
            value={clue}
          ></Clue>

          <StyledButton disabled={clue === ""} onClick={submitClue}>
            <img alt="Submit" src={Check} width="45" height="45" />
          </StyledButton>
        </Flex>
      </Section>
      {showSlider && (
        <Section selected={currentSection === 4} id="step4">
          <StyledButton onClick={toggleTarget}>
            <img
              title={showTarget ? "Hide Target" : "Show Target"}
              alt="show/hide target"
              src={showTarget ? Hide : Show}
              width="45"
              height="45"
            />
          </StyledButton>
          <Step>{"Your team can now make their guess using the slider"}</Step>
          <Title> {clue} </Title>

          <Target reveal={true} show={showTarget} position={position} />
          <WavelengthBar
            clue={clue}
            spectrumLeft={currentCard.left}
            spectrumRight={currentCard.right}
            setGuess={setGuess}
            showSlider={showSlider}
          />

          <Flex>
            <Step> Teammate's guess: {guess}/100 </Step>
            <StyledButton onClick={submitGuess}>
              <img alt="Submit guess" src={Check} width="45" height="45" />
            </StyledButton>
          </Flex>
        </Section>
      )}
      <Section
        hide={currentSection !== 5}
        selected={currentSection === 5}
        id="step5"
      >
        <Step>
          {
            "Your opponent can now guess either left or right of the guess to earn points"
          }
        </Step>
        <StyledButton onClick={() => calculateScore(-1)}>
          Less than {guess}
        </StyledButton>
        <StyledButton onClick={() => calculateScore(1)}>
          More than {guess}
        </StyledButton>
      </Section>
      {showPoints && (
        <Section selected={currentSection === 6} id="step6">
          <Step>
            {message}
            <Step> Correct answer: {position}/100 </Step>
            <Step> Teammate's guess: {guess}/100 </Step>
          </Step>
          <StyledButton onClick={startNextRound}>Next Round</StyledButton>
        </Section>
      )}
    </div>
  );
};

const Title = styled.div`
  padding: 25px;
  background: #5d6474;
`;

const Section = styled.section<{ selected?: boolean; hide?: boolean }>`
  padding: 32px 0;
  background: ${({ selected }) => selected && `#454953`};
  display: ${({ hide }) => hide && `none`};
  margin-top: 64px;
  scroll-margin-top: 82px;
`;

const Step = styled.div`
  font-size: 24px;
  margin: 24px 16px;
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
  margin: 12px;
  cursor: pointer;
  height: 47.5px;
  background-color: #abe1bf;
  border: 0;
  border-radius: 0.5rem;
  color: #111827;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
  text-align: center;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  &:hover {
    background-color: #fafafa;
  }
  &:disabled {
    background-color: #cbcbcb;
    cursor: not-allowed;
  }
`;
