import React from "react";
import styled from "styled-components";
import RedPointer from "../../assets/redpointer.png";

interface Props {
  currentTeam?: number;
  score: { team1: number; team2: number };
}

export const Header = ({ score, currentTeam }: Props) => {
  return (
    <div>
      <StickyHeader>
        <Flex>{"Wavelength: a game of provoking thoughts"}</Flex>
        <TeamScoreContainer side={currentTeam === 1 ? "left" : "right"}>
          <Team currentTeam={currentTeam === 1}>
            <TeamLabel>Team 1</TeamLabel>
            <div>{score.team1}</div>
          </Team>
          <Team currentTeam={currentTeam === 2}>
            <TeamLabel>Team 2</TeamLabel>
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
