import React, { useState } from "react";
import styled from "styled-components";
import { Slider } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { red, pink } from "@mui/material/colors";

interface Props {
  spectrumLeft?: string;
  spectrumRight?: string;
  setGuess: (x: number) => void;
  clue: string;
  showSlider?: boolean;
}

const theme = createTheme({
  palette: {
    primary: red,
    secondary: pink,
  },
});

export const WavelengthBar = ({
  spectrumLeft,
  spectrumRight,
  setGuess,
  clue,
  showSlider = false,
}: Props) => {
  return (
    <>
      <Flex>
        <Bar>
          <Concept>{spectrumLeft}</Concept>
          <Concept>{spectrumRight}</Concept>
        </Bar>
      </Flex>
      {showSlider && (
        <SliderContainer>
          <SliderDiv>
            <ThemeProvider theme={theme}>
              <Slider
                onChange={(e, val) => setGuess(val as number)}
                color="secondary"
                defaultValue={50}
                aria-label="Default"
                valueLabelDisplay="auto"
                valueLabelFormat={(x) => clue || x}
              />
            </ThemeProvider>
          </SliderDiv>
        </SliderContainer>
      )}
    </>
  );
};

const Concept = styled.div`
  padding: 16px;
  font-size: 18px;
`;

const Bar = styled.div`
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

const SliderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const SliderDiv = styled.div`
  width: 76%;
  display: flex;
  justify-content: center;
  position: relative;
  top: -82px;
`;
