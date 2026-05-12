import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the clue giver prompt", () => {
  render(<App />);
  expect(screen.getByText(/clue giver: draw a spectrum card/i)).toBeInTheDocument();
});
