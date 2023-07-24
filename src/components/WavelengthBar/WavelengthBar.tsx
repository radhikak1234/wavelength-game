import React from "react";
import styled from "styled-components";

interface Props {
  spectrumLeft?: string;
  spectrumRight?: string;
}

export const WavelengthBar = ({ spectrumLeft, spectrumRight }: Props) => {
  return (
    <Flex>
      <>{spectrumLeft}</>
      <RainbowBar />
      <>{spectrumRight}</>
    </Flex>
  );
};

const RainbowBar = styled.div`
  width: 75%;
  background: #68ced1;
`;

const Flex = styled.div`
  display: flex;
  height: 50px;
  justify-content: space-evenly;
`;
