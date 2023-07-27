import { Slider } from "@mui/base";
import React from "react";
import styled from "styled-components";

interface Props {
  spectrumLeft?: string;
  spectrumRight?: string;
}

export const WavelengthBar = ({ spectrumLeft, spectrumRight }: Props) => {
  return (
    <>
      <Flex>
        <RainbowBar>
          <Concept>{spectrumLeft}</Concept>
          <Concept>{spectrumRight}</Concept>
        </RainbowBar>
      </Flex>
      <Slider defaultValue={50} aria-label="Default" />
    </>
  );
};

const Concept = styled.div`
  padding: 16px;
  font-size: 18px;
`;

const RainbowBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 76%;
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
