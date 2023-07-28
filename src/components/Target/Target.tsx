import React from "react";
import styled from "styled-components";
import RedPointer from "../../assets/redpointer.png";
interface Props {
  position?: number;
  show?: boolean;
  reveal?: boolean;
}

export const Target = ({ show = false, position = 50, reveal }: Props) => {
  return (
    <Flex show={show} position={position} moveDown={reveal}>
      <TargetBar>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>3</div>
        <div>2</div>
      </TargetBar>
      {!reveal && (
        <RedPointerImage
          alt="shuffle"
          src={RedPointer}
          width="25"
          height="25"
        />
      )}
    </Flex>
  );
};
const RedPointerImage = styled.img`
  position: absolute;
  top: 52px;
`;

const TargetBar = styled.div`
  border: white;
  border-width: 1px;
  border-style: solid;
  border-radius: 8px;
  width: 18%;
  height: 50px;
  background: linear-gradient(
    to right,
    #d2951e 0%,
    #d2951e 20%,
    #a3cfa3 20%,
    #a3cfa3 40%,
    #de5d3e 40%,
    #de5d3e 60%,
    #a3cfa3 60%,
    #a3cfa3 80%,
    #d2951e 80%,
    #d2951e 100%
  );
  position: absolute;
  display: flex;
  justify-content: space-around;
  font-size: 16px;
  align-items: center;
`;

const Flex = styled.div<{
  position: number;
  show?: boolean;
  moveDown?: boolean;
}>`
  margin-top: 16px;
  display: flex;
  height: 50px;
  justify-content: center;
  position: relative;
  top: ${({ moveDown }) => (moveDown ? "64px" : "-12px")};
  transition: all 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) !important;
  left: ${({ position, show }) => (show ? position * 0.74 - 37 : -65)}%;
`;
