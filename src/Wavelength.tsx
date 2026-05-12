import React, { useEffect, KeyboardEvent, useRef, useState } from "react";
import "./App.css";
import { WavelengthBar } from "./components/WavelengthBar/WavelengthBar";
import { SpectrumCard } from "./components/SpectrumCard/SpectrumCard";
import { Target } from "./components/Target/Target";
import ShuffleIcon from "./assets/shuffle.png";
import Show from "./assets/show.png";
import Hide from "./assets/hide.png";
import Check from "./assets/check.png";
import styled, { keyframes } from "styled-components";
import { Header } from "./components/Header/Header";
import { CardsSource, useSpectrumCards } from "./hooks/useSpectrumCards";

type RoundSummary = {
  team1Delta: number;
  team2Delta: number;
};

const confettiPieces = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: (index * 13) % 100,
  delay: (index % 7) * 0.18,
  duration: 2.8 + (index % 5) * 0.35,
  rotation: (index % 2 === 0 ? 1 : -1) * (14 + index * 3),
  color: ["#ff6b6b", "#ffd166", "#06d6a0", "#4cc9f0", "#c77dff"][index % 5],
}));

const confettiFall = keyframes`
  0% {
    transform: translate3d(0, -10vh, 0) rotate(var(--rotation));
  }

  100% {
    transform: translate3d(20px, 110vh, 0) rotate(calc(var(--rotation) + 540deg));
  }
`;

export const Wavelength = () => {
  const [position, setPosition] = useState(50);
  const [teamNames, setTeamNames] = useState({ 1: "Team 1", 2: "Team 2" });
  const [score, setScore] = useState({ team1: 0, team2: 0 });
  const [currentTeam, setCurrentTeam] = useState<1 | 2>(1);
  const [cardDrawVersion, setCardDrawVersion] = useState(0);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [currentSection, setSection] = useState(1);
  const [showTarget, setShowTarget] = useState(true);
  const [showPoints, setShowPoints] = useState(false);
  const [guess, setGuess] = useState(50);
  const [clue, setClue] = useState("");
  const [showSlider, setShowSlider] = useState(false);
  const [showShuffleButton, setShowShuffleButton] = useState(true);
  const [message, setMessage] = useState("");
  const [roundSummary, setRoundSummary] = useState<RoundSummary | null>(null);
  const [winningTeam, setWinningTeam] = useState<1 | 2 | null>(null);
  const section4 = useRef(null);
  const {
    cardForm,
    cards,
    cardsSource,
    cardsStatus,
    cardSubmitState,
    currentCard,
    drawCard: drawSpectrumCard,
    hasSupabaseConfig,
    onCardFormChange,
    submitCard,
  } = useSpectrumCards();

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
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [currentSection]);

  useEffect(() => {
    if (cardSubmitState.type === "success") {
      setIsLibraryOpen(false);
    }
  }, [cardSubmitState.type]);

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
    drawSpectrumCard();
    setCardDrawVersion((prev) => prev + 1);
    resetBoard();
  };

  const startNextRound = () => {
    setSection(1);
    setCurrentTeam(currentTeam === 1 ? 2 : 1);
    drawCard();
  };

  const restartGame = () => {
    setScore({ team1: 0, team2: 0 });
    setWinningTeam(null);
    setMessage("");
    setRoundSummary(null);
    setCurrentTeam(1);
    setSection(1);
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
    setRoundSummary(null);
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

    const updatedScore = {
      team1: score.team1 + (currentTeam === 1 ? points : opponentPoints),
      team2: score.team2 + (currentTeam === 2 ? points : opponentPoints),
    };
    const team1Delta = currentTeam === 1 ? points : opponentPoints;
    const team2Delta = currentTeam === 2 ? points : opponentPoints;
    const nextWinningTeam =
      updatedScore.team1 >= 11
        ? 1
        : updatedScore.team2 >= 11
          ? 2
          : null;

    setScore(updatedScore);
    setRoundSummary({ team1Delta, team2Delta });

    if (nextWinningTeam) {
      setWinningTeam(nextWinningTeam);
      setMessage(
        `${teamNames[nextWinningTeam]} wins! Final score: ${teamNames[1]} ${updatedScore.team1}, ${teamNames[2]} ${updatedScore.team2}.`
      );
      return;
    }

    setMessage("Target revealed!");
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      submitClue();
    }
  };

  return (
    <div className="App">
      {winningTeam && (
        <ConfettiOverlay aria-hidden="true">
          {confettiPieces.map((piece) => (
            <ConfettiPiece
              key={piece.id}
              $left={piece.left}
              $delay={piece.delay}
              $duration={piece.duration}
              $rotation={piece.rotation}
              $color={piece.color}
            />
          ))}
        </ConfettiOverlay>
      )}
      <Header
        teamNames={teamNames}
        setTeamNames={setTeamNames}
        currentTeam={currentTeam}
        score={score}
      ></Header>
      <Section topSection={true} selected={currentSection === 1} id="step1">
        <Flex>
          <Step> {"Clue giver: Draw a spectrum card"} </Step>

          <StyledButton disabled={currentSection !== 1} onClick={drawCard}>
            <img alt="draw a card" src={ShuffleIcon} width="45" height="45" />
          </StyledButton>
        </Flex>
        <SpectrumCard
          drawVersion={cardDrawVersion}
          spectrumLeft={currentCard.left}
          spectrumRight={currentCard.right}
        ></SpectrumCard>
        {!isLibraryOpen && (
          <LibraryToggleButton
            type="button"
            onClick={() => setIsLibraryOpen(true)}
          >
            Add your own spectrum card
          </LibraryToggleButton>
        )}
        {isLibraryOpen && (
          <AdminPanel>
            <AdminCloseButton
              type="button"
              aria-label="Close spectrum card library"
              onClick={() => setIsLibraryOpen(false)}
            >
              ×
            </AdminCloseButton>
            <AdminTitle>Spectrum Card Library</AdminTitle>
            <AdminStatus>Total cards available: {cards.length}.</AdminStatus>
            <AdminForm onSubmit={submitCard}>
              <AdminInput
                placeholder="Left side, e.g. Underrated"
                value={cardForm.left}
                onChange={(event) => onCardFormChange(event, "left")}
              />
              <AdminInput
                placeholder="Right side, e.g. Overrated"
                value={cardForm.right}
                onChange={(event) => onCardFormChange(event, "right")}
              />
              <AdminSubmitButton type="submit" disabled={!hasSupabaseConfig}>
                Add Card
              </AdminSubmitButton>
            </AdminForm>
            <AdminHelper>
              {hasSupabaseConfig
                ? `New cards are saved and previewed immediately.`
                : `Saving is not configured yet, so the game is using starter cards.`}
            </AdminHelper>
            {cardSubmitState.message && (
              <AdminFeedback $tone={cardSubmitState.type}>
                {cardSubmitState.message}
              </AdminFeedback>
            )}
          </AdminPanel>
        )}
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

          <ConfirmButton onClick={submitClue}>
            <img alt="Submit" src={Check} width="45" height="45" />
          </ConfirmButton>
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
            <ConfirmButton onClick={submitGuess}>
              <img alt="Submit guess" src={Check} width="45" height="45" />
            </ConfirmButton>
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
          {winningTeam ? (
            <Step>{message}</Step>
          ) : (
            <>
              <Step>{message}</Step>
              {roundSummary && (
                <RoundSummaryRow>
                  <RoundTeamCard $variant="team1">
                    <RoundTeamName>{teamNames[1]}</RoundTeamName>
                    <RoundDelta>+{roundSummary.team1Delta}</RoundDelta>
                  </RoundTeamCard>
                  <RoundTeamCard $variant="team2">
                    <RoundTeamName>{teamNames[2]}</RoundTeamName>
                    <RoundDelta>+{roundSummary.team2Delta}</RoundDelta>
                  </RoundTeamCard>
                </RoundSummaryRow>
              )}
            </>
          )}
          <ActionButton onClick={winningTeam ? restartGame : startNextRound}>
            {winningTeam ? "Play Again" : "Next Round"}
          </ActionButton>
        </Section>
      )}
    </div>
  );
};

const ConfettiOverlay = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 5;
`;

const ConfettiPiece = styled.div<{
  $left: number;
  $delay: number;
  $duration: number;
  $rotation: number;
  $color: string;
}>`
  position: absolute;
  top: -10%;
  left: ${({ $left }) => `${$left}%`};
  width: 12px;
  height: 20px;
  border-radius: 4px;
  background: ${({ $color }) => $color};
  opacity: 0.92;
  --rotation: ${({ $rotation }) => `${$rotation}deg`};
  animation: ${confettiFall} ${({ $duration }) => `${$duration}s`} linear
    infinite;
  animation-delay: ${({ $delay }) => `${$delay}s`};
  transform-origin: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
`;

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
  margin-top: ${({ topSection }) => (topSection ? `24px` : `64px`)};
`;

const Step = styled.div`
  font-size: 24px;
  margin: 24px 16px;
`;

const RoundSummaryRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
  margin: 8px 16px 24px;
`;

const RoundTeamCard = styled.div<{ $variant: "team1" | "team2" }>`
  min-width: 180px;
  padding: 14px 18px;
  border-radius: 20px;
  color: #203128;
  background: ${({ $variant }) =>
    $variant === "team1"
      ? "linear-gradient(180deg, #b6e3fb 0%, #8fcff1 100%)"
      : "linear-gradient(180deg, #c5e8cc 0%, #a4d7af 100%)"};
  box-shadow:
    0 14px 28px rgba(15, 26, 20, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
`;

const RoundTeamName = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0.75;
`;

const RoundDelta = styled.div`
  margin-top: 6px;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
`;

const AdminPanel = styled.section`
  position: relative;
  width: min(760px, calc(100vw - 32px));
  margin: 8px auto 12px;
  padding: 20px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.06);
  box-shadow:
    0 18px 34px rgba(0, 0, 0, 0.16),
    inset 0 0 0 1px rgba(255, 255, 255, 0.08);
`;

const LibraryToggleButton = styled.button`
  margin-top: 4px;
  border: 0;
  border-radius: 999px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.08);
  color: white;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
`;

const AdminCloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
  }
`;

const AdminTitle = styled.div`
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.03em;
`;

const AdminStatus = styled.div`
  margin-top: 8px;
  font-size: 0.85rem;
  opacity: 0.82;
`;

const AdminForm = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
  gap: 12px;
  margin-top: 16px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const AdminInput = styled.input`
  border: 0;
  border-radius: 16px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.95);
  color: #203128;
  font-size: 0.95rem;
  box-shadow: inset 0 0 0 1px rgba(80, 102, 88, 0.14);
`;

const AdminSubmitButton = styled.button`
  border: 0;
  border-radius: 16px;
  padding: 0 14px;
  background: linear-gradient(180deg, #c9efce 0%, #98d5a7 100%);
  color: #1d3528;
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
  min-height: 44px;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const AdminHelper = styled.div`
  margin-top: 12px;
  font-size: 0.8rem;
  opacity: 0.72;
`;

const AdminFeedback = styled.div<{ $tone: "idle" | "success" | "error" }>`
  margin-top: 10px;
  color: ${({ $tone }) =>
    $tone === "success" ? "#b9ffcf" : $tone === "error" ? "#ffd2d2" : "white"};
  font-size: 0.86rem;
  font-weight: 700;
`;

const Flex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ClueInput = styled.input`
  width: min(320px, calc(100vw - 140px));
  margin: 24px 16px;
  padding: 14px 18px;
  border: 0;
  border-radius: 18px;
  background: linear-gradient(180deg, #f6fbf7 0%, #e6f3ea 100%);
  color: #203128;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  box-shadow:
    0 14px 24px rgba(23, 43, 31, 0.12),
    inset 0 0 0 1px rgba(94, 133, 111, 0.14);
  outline: none;
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    background 0.16s ease;

  &::placeholder {
    color: rgba(32, 49, 40, 0.56);
    font-weight: 500;
  }

  &:focus {
    background: linear-gradient(180deg, #ffffff 0%, #edf8f0 100%);
    transform: translateY(-1px);
    box-shadow:
      0 18px 28px rgba(23, 43, 31, 0.16),
      0 0 0 3px rgba(171, 225, 191, 0.45);
  }
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

const ActionButton = styled(StyledButton)`
  min-width: 184px;
  height: auto;
  padding: 14px 24px;
  border-radius: 999px;
  background: linear-gradient(180deg, #c9efce 0%, #98d5a7 100%);
  color: #1d3528;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  line-height: 1;
  text-transform: uppercase;
  box-shadow:
    0 14px 28px rgba(25, 46, 35, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.55);

  &:hover {
    background: linear-gradient(180deg, #daf6de 0%, #a8dfb4 100%);
    transform: translateY(-1px);
  }
`;

const ConfirmButton = styled(StyledButton)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 52px;
  border-radius: 18px;
  background: linear-gradient(180deg, #d6f6d8 0%, #a3deb0 100%);
  box-shadow:
    0 16px 26px rgba(23, 43, 31, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.65);

  &:hover {
    background: linear-gradient(180deg, #e2fae4 0%, #b7e8c0 100%);
    transform: translateY(-1px) scale(1.01);
  }

  img {
    width: 24px;
    height: 24px;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.08));
  }
`;
