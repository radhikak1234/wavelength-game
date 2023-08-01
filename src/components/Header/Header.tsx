import React from "react";
import styled from "styled-components";
interface Props {
  currentPlayer?: string;
}

export const Header = ({ currentPlayer }: Props) => {
  return (
    <div>
      <Flex>{"Wavelength: a game of provoking thoughts"}</Flex>
    </div>
  );
};

const Flex = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px;
  position: fixed;
  top: 0;
  width: 100%;
  background: #abe1bf;
  color: #282c34;
`;
