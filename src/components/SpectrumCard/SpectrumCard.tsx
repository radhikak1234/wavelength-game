import React from "react";
import styled from "styled-components";
interface Props {
  spectrumLeft?: string;
  spectrumRight?: string;
}

export const SpectrumCard = ({ spectrumLeft, spectrumRight }: Props) => {
  return (
    <Flex>
      <Card>
        <Concept>{spectrumLeft}</Concept>
        <Concept>{spectrumRight}</Concept>
      </Card>
    </Flex>
  );
};
const Concept = styled.div`
  width: 50%;
  font-size: 20px;
  text-wrap: wrap;
  padding: 16px;
`;

const Card = styled.div`
  background: linear-gradient(
    to right,
    #dda2e6 0%,
    #dda2e6 50%,
    #d1d168 50%,
    #d1d168 100%
  );
  width: 20rem;
  height: 200px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-radius: 12px;
`;

const Flex = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px;
`;
