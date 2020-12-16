import React from "react";
import styled from "styled-components";

type IconProps = {
  symbol: string;
  isActive: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export const Icon = ({ symbol, isActive, onClick }: IconProps) => {
  return (
    <Wrapper isActive={isActive} onClick={onClick}>
      {symbol}
    </Wrapper>
  );
};

const Wrapper = styled.button<{ isActive: boolean }>`
  padding: 5px;
  border-radius: 20%;
  color: white;
  font-size: 12px;
  background-color: ${(props) => (props.isActive ? "#56a7e9" : "#909499")};
  border: 0.5px solid black;
  margin: 2px;
  cursor: pointer;

  &:hover {
    background-color: #85ace0;
  }
`;
