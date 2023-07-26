import React from "react";
import styled from "styled-components";

interface Props {
  position?: number;
  show?: boolean;
}

export const Target = ({ show = true, position = 50 }: Props) => {
  return (
    <Flex position={position}>
      {show && (
        <TargetBar>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>3</div>
          <div>2</div>
        </TargetBar>
      )}
    </Flex>
  );
};

const TargetBar = styled.div`
  width: 200px;
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
  font-size: 20px;
  align-items: center;
`;

const Flex = styled.div<{ position: number }>`
  margin-top: 16px;
  display: flex;
  height: 50px;
  justify-content: center;
  position: relative;
  right: ${({ position }) => position * 0.74 - 38}%;
`;
