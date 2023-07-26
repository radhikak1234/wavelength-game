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
  background: linear-gradient(
    to right,
    #68ced1 0%,
    #68ced1 49.5%,
    #a2e4e6 49.5%,
    #a2e4e6 50.5%,
    #68ced1 50.5%,
    #68ced1 100%
  );
`;

const Flex = styled.div`
  margin: 16px 0;
  display: flex;
  height: 50px;
  justify-content: space-evenly;
`;
