import React, { useEffect, KeyboardEvent, useRef, useState } from "react";
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
  const [teamNames, setTeamNames] = useState({ 1: "Team 1", 2: "Team 2" });
  const [score, setScore] = useState({ team1: 0, team2: 0 });
  const [currentTeam, setCurrentTeam] = useState<1 | 2>(1);

  const [currentSection, setSection] = useState(1);
  const [showTarget, setShowTarget] = useState(true);
  const [showPoints, setShowPoints] = useState(false);
  const [guess, setGuess] = useState(50);
  const [clue, setClue] = useState("");
  const [showSlider, setShowSlider] = useState(false);
  const [showShuffleButton, setShowShuffleButton] = useState(true);
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

  const currentTeamName = currentTeam === 1 ? teamNames[1] : teamNames[2];
  const currentOponentName = currentTeam === 1 ? teamNames[2] : teamNames[1];

  useEffect(() => {
    const element = document.getElementById(`step${currentSection}`);
    if (element) {
      if (currentSection === 1) {
        window.scrollTo();
      } else {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [currentSection]);

  const shufflePosition = () => {
    setShowTarget(true);
    setShowShuffleButton(false);
    setPosition(Math.floor(Math.random() * 100));
    transitionSection(2, 3);
    setTimeout(() => {
      if (showTarget) setShowTarget(false); // Hide the target after 5 seconds so everyone can open their eyes
    }, 5000);
  };

  const drawCard = () => {
    setCurrentCard(shuffledCards());
    resetBoard();
  };

  const startNextRound = () => {
    setSection(1);
    setCurrentTeam(currentTeam === 1 ? 2 : 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
    drawCard();
  };

  const resetBoard = () => {
    setPosition(50);
    setClue("");
    setShowTarget(true);
    setShowPoints(false);
    setShowSlider(false);
    setGuess(50);
    setShowShuffleButton(true);
  };

  const toggleTarget = () => {
    if (showTarget) {
      setShowSlider(true);
    }
    setShowTarget((prev) => !prev);
  };

  const submitClue = () => {
    setShowTarget(false);
    setShowSlider(true);
    setSection(4);
  };

  const submitGuess = () => {
    // transitionSection(4, 5);
    setSection(5);
  };

  console.log(currentSection);
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
      `Target revealed! ${currentTeamName} scored ${points} points. ${currentOponentName} scored ${opponentPoints} points.`
    );
    setScore({
      team1: score.team1 + (currentTeam === 1 ? points : opponentPoints),
      team2: score.team2 + (currentTeam === 2 ? points : opponentPoints),
    });
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      submitClue();
    }
  };

  return (
    <div className="App">
      <Header
        teamNames={teamNames}
        setTeamNames={setTeamNames}
        currentTeam={currentTeam}
        score={score}
      ></Header>
      <Section topSection={true} selected={currentSection === 1} id="step1">
        {currentSection === 6 && (
          <StyledButton onClick={startNextRound}>Next Round</StyledButton>
        )}
        <Flex>
          <Step> {"Clue giver: Draw a spectrum card"} </Step>

          <StyledButton disabled={currentSection !== 1} onClick={drawCard}>
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
        <Step>
          Everyone except clue giver, please close your eyes for 5 seconds
        </Step>

        <Flex>
          {showShuffleButton && (
            <Step> {"Clue giver: Get a randomized target"} </Step>
          )}
          {!showShuffleButton && showTarget && (
            <Step> {position + "/100"} </Step>
          )}

          {showShuffleButton ? (
            <StyledButton onClick={shufflePosition}>
              <img alt="shuffle" src={ShuffleIcon} width="45" height="45" />
            </StyledButton>
          ) : (
            <StyledButton onClick={toggleTarget}>
              <img
                title={showTarget ? "Hide Target" : "Show Target"}
                alt="show/hide target"
                src={showTarget ? Hide : Show}
                width="45"
                height="45"
              />
            </StyledButton>
          )}
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
      <Section
        hide={currentSection > 3 || showShuffleButton}
        selected={currentSection === 3}
        id="step3"
        ref={section4}
      >
        <Step> {"Submit a clue that matches your target"} </Step>
        <Flex>
          <ClueInput
            onKeyDown={onKeyDown}
            onChange={(e) => {
              setClue(e.target.value);
              if (currentSection !== 3) {
                setSection(3);
              }
            }}
            // disabled={!showTarget}
            placeholder="Enter clue..."
            value={clue}
          />

          <StyledButton onClick={submitClue}>
            <img alt="Submit" src={Check} width="45" height="45" />
          </StyledButton>
        </Flex>
      </Section>
      {showSlider && (
        <Section
          hide={currentSection < 4}
          selected={currentSection === 4 || currentSection === 6}
          id="step4"
        >
          {currentSection === 4 && (
            <Step>{"Your team can now make their guess using the slider"}</Step>
          )}
          {clue && <Clue> {clue} </Clue>}
          <Target reveal={true} show={showTarget} position={position} />
          <WavelengthBar
            clue={clue}
            spectrumLeft={currentCard.left}
            spectrumRight={currentCard.right}
            setGuess={setGuess}
            showSlider={showSlider}
            disableSlider={currentSection > 4}
          />

          <Flex>
            <Step> Teammate's guess: {guess}/100 </Step>
            {showPoints && <Step> Correct answer: {position}/100 </Step>}
          </Flex>
          {currentSection === 4 && (
            <StyledButton onClick={submitGuess}>
              <img alt="Submit guess" src={Check} width="45" height="45" />
            </StyledButton>
          )}
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
        <Flex>
          <StyledButton onClick={() => calculateScore(-1)}>&larr;</StyledButton>
          {guess}
          <StyledButton onClick={() => calculateScore(1)}>&rarr;</StyledButton>
        </Flex>
      </Section>
      {showPoints && (
        <Section selected={currentSection === 6} id="step6">
          <Step>{message}</Step>
          <StyledButton onClick={startNextRound}>Next Round</StyledButton>
        </Section>
      )}
    </div>
  );
};

const Clue = styled.div`
  padding: 24px;
  border: #abe1bf 2px solid;
  font-size: 32px;
  margin: 12px;
`;

const Section = styled.section<{
  topSection?: boolean;
  selected?: boolean;
  hide?: boolean;
}>`
  padding: 32px 0;
  background: ${({ selected }) => selected && `#454953`};
  display: ${({ hide }) => hide && `none`};
  margin-top: ${({ topSection }) => (topSection ? `136px` : `64`)};
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

const ClueInput = styled.input`
  padding: 8px;
  font-size: 24px;
  text-align: center;
  width: 225px;
  margin: 24px 16px;
`;

const StyledButton = styled.button`
  margin: 12px;
  cursor: pointer;
  height: 47.5px;
  background-color: #abe1bf;
  border: 0;
  border-radius: 0.5rem;
  color: #111827;
  font-size: 3rem;
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
