import React, { useState } from "react";
import styled from "styled-components";
import RedPointer from "../../assets/redpointer.png";
import Edit from "../../assets/edit.png";
import { Input } from "@mui/material";

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
  const [isEditingTeam1, setIsEditingTeam1] = useState(false);
  const [isEditingTeam2, setIsEditingTeam2] = useState(false);

  const onTeam1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamNames({ ...teamNames, 1: e.target.value || "Team 1" });
  };
  const onTeam2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamNames({ ...teamNames, 2: e.target.value || "Team 2" });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      setIsEditingTeam1(false);
      setIsEditingTeam2(false);
    }
  };

  return (
    <div>
      <StickyHeader>
        <Flex>
          <>Wavelength: a game of provoking thoughts</>
        </Flex>

        <TeamScoreContainer side={currentTeam === 1 ? "left" : "right"}>
          <Team currentTeam={currentTeam === 1}>
            <div>
              {isEditingTeam1 && (
                <div>
                  <TeamInput
                    autoFocus
                    onKeyDown={(e) => handleKeyDown(e)}
                    onBlur={() => setIsEditingTeam1(false)}
                    onChange={onTeam1Change}
                    defaultValue={teamNames[1]}
                    placeholder="Team 1"
                  ></TeamInput>
                </div>
              )}
              {isEditingTeam1 === false && (
                <FlexCenterContainer>
                  <TeamLabel>{teamNames[1]}</TeamLabel>
                  <EditButton
                    width="16px"
                    height="16px"
                    onClick={() => {
                      setIsEditingTeam1(true);
                    }}
                    src={Edit}
                    alt="Edit Team 1"
                  />
                </FlexCenterContainer>
              )}
            </div>
            <FlexCenterContainer>
              <Score>{score.team1}</Score>
            </FlexCenterContainer>
          </Team>
          <Team currentTeam={currentTeam === 2}>
            <div>
              {isEditingTeam2 && (
                <div>
                  <TeamInput
                    autoFocus
                    onKeyDown={(e) => handleKeyDown(e)}
                    onChange={onTeam2Change}
                    onBlur={() => setIsEditingTeam2(false)}
                    defaultValue={teamNames[2]}
                    placeholder="Team 2"
                  ></TeamInput>
                </div>
              )}
              {isEditingTeam2 === false && (
                <FlexCenterContainer>
                  <TeamLabel
                    onClick={() => {
                      setIsEditingTeam2(true);
                    }}
                  >
                    {teamNames[2]}
                  </TeamLabel>
                  <EditButton
                    width="16px"
                    height="16px"
                    onClick={() => setIsEditingTeam2(true)}
                    src={Edit}
                    alt="Edit Team 2"
                  />
                </FlexCenterContainer>
              )}
            </div>
            <FlexCenterContainer>
              <Score>{score.team1}</Score>
            </FlexCenterContainer>
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

const FlexCenterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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

const EditButton = styled.img`
  cursor: pointer;
  margin-left: 8px;
`;

const TeamInput = styled(Input)`
  padding: 8px;
  font-size: 12px;
  text-align: center;
  height: 24px;
`;

const Score = styled.div`
  font-size: 20px;
  color: red;
  background-color: white;
  width: 100%;
  border-radius: 20px;
  width: 24px;
  margin-top: 10px;
  padding: 4px;
`;
