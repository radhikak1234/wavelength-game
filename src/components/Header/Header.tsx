import React, { useState } from "react";
import styled from "styled-components";
import RedPointer from "../../assets/redpointer.png";
import Check from "../../assets/check.png";

interface Props {
  currentTeam?: number;
  score: { team1: number; team2: number };
  teamNames: { 1: string; 2: string };
  setTeamNames: (names: { 1: string; 2: string }) => void;
}

export const Header = ({
  score,
  currentTeam,
  teamNames,
  setTeamNames,
}: Props) => {
  const [showTeamName, setShowTeamName] = useState(true);

  const onTeam1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamNames({ ...teamNames, 1: e.target.value || "Team 1" });
  };
  const onTeam2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamNames({ ...teamNames, 2: e.target.value || "Team 2" });
  };

  return (
    <div>
      <StickyHeader>
        <Flex>
          <>
            <>Wavelength: a game of provoking thoughts</>
          </>
        </Flex>

        <TeamScoreContainer side={currentTeam === 1 ? "left" : "right"}>
          <Team currentTeam={currentTeam === 1}>
            <div>
              {!showTeamName && (
                <div>
                  <TeamInput
                    onChange={onTeam1Change}
                    defaultValue={teamNames[1]}
                    placeholder="Team 1"
                  ></TeamInput>
                  <StyledButton
                    onClick={() => {
                      setShowTeamName(true);
                    }}
                  >
                    <img alt="Submit" src={Check} width="25" height="25" />
                  </StyledButton>
                </div>
              )}
              {showTeamName && (
                <TeamLabel
                  onClick={() => {
                    setShowTeamName(false);
                  }}
                >
                  {teamNames[1]}
                </TeamLabel>
              )}
            </div>
            <div>{score.team1}</div>
          </Team>
          <Team currentTeam={currentTeam === 2}>
            {/* <TeamLabel>Team 2</TeamLabel> */}
            <div>
              {!showTeamName && (
                <div>
                  <TeamInput
                    onChange={onTeam2Change}
                    defaultValue={teamNames[2]}
                    placeholder="Team 2"
                  ></TeamInput>
                  <StyledButton
                    onClick={() => {
                      setShowTeamName(true);
                    }}
                  >
                    <img alt="Submit" src={Check} width="25" height="25" />
                  </StyledButton>
                </div>
              )}
              {showTeamName && (
                <TeamLabel
                  onClick={() => {
                    setShowTeamName(false);
                  }}
                >
                  {teamNames[2]}
                </TeamLabel>
              )}
            </div>
            <div>{score.team2}</div>
          </Team>
        </TeamScoreContainer>
        <RedPointerImage
          isFirstTeam={currentTeam === 1}
          alt="shuffle"
          src={RedPointer}
          width="25"
          height="25"
        />
      </StickyHeader>
    </div>
  );
};

const RedPointerImage = styled.img<{
  isFirstTeam?: boolean;
}>`
  position: relative;
  bottom: 50px;
  transition: 0.5s ease-in-out;
  right: ${({ isFirstTeam }) => (isFirstTeam ? `12px` : `-12px`)};
  rotate: ${({ isFirstTeam }) => (isFirstTeam ? `90deg` : `270deg`)};
`;

const StickyHeader = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 2;
`;

const Flex = styled.div`
  display: flex;
  justify-content: center;
  background: #abe1bf;
  color: #282c34;
  padding: 24px;
`;

const TeamScoreContainer = styled.div<{
  side?: string;
}>`
  display: flex;
  justify-content: space-around;
  background: #65ac7f;
  color: #282c34;
  font-size: 20px;
`;

const Team = styled.div<{
  currentTeam?: boolean;
}>`
  padding: 8px;
  width: 100%;
  color: #282c34;
  background: ${({ currentTeam }) => (currentTeam ? `#7cc3ed` : `#93cca8`)};
`;

const TeamLabel = styled.div``;

const TeamInput = styled.input`
  padding: 8px;
  font-size: 12px;
  text-align: center;
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
