import React from "react";
import { render, screen } from "@testing-library/react";
import TaskOverview from "../components/tasks/TaskOverview";

const lotte = {
  id: 1,
  username: "lotte_g",
  password: "lotte123",
  role: "user",
};

const urgent = {
  id: 1,
  levelName: "urgent",
  colour: "red",
};

const neutral2 = {
  id: 2,
  levelName: "neutral",
  colour: "yellow",
};

const tasks = [
  {
    id: 1,
    description: "Decorate Christmas tree",
    sidenote: "Use the new lights",
    startDate: new Date("2024-12-15T10:00:00"),
    endDate: null,
    done: false,
    deadline: new Date("2024-12-24T23:59:59"),
    priority: urgent,
    user: lotte,
  },
  {
    id: 2,
    description: "Buy new Christmas tree",
    sidenote: "Get a fake one",
    startDate: new Date("2024-12-15T10:00:00"),
    endDate: null,
    done: false,
    deadline: new Date("2024-12-24T23:59:59"),
    priority: neutral2,
    user: lotte,
  },
];
window.React = React;

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

test("renders TaskOverview component", async () => {
  render(<TaskOverview tasks={tasks} />);
  expect(screen.getByText("Decorate Christmas tree"));
  expect(screen.getByText("Buy new Christmas tree"));
});
