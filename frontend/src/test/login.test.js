import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../pages/Login";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { message } from "antd";
import React from "react";
import { login } from "../store/thunks/auth.thunks";

//mocks
const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

//Mock react-Router
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

//mock redux hooks
jest.mock("../store/hooks", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

//mock thunk
jest.mock("../store/thunks/auth.thunks", () => ({
  login: jest.fn(() => ({ type: "auth/login" })),
}));

// Mock antd message
jest.mock("antd", () => ({
  Card: ({ children }) => <div>{children}</div>,

  Form: Object.assign(({ children }) => <form>{children}</form>, {
    Item: ({ children }) => <div>{children}</div>,
  }),

  Input: Object.assign((props) => <input {...props} />, {
    Password: (props) => <input type="password" {...props} />,
  }),

  Button: ({ children, onClick, loading }) => (
    <button onClick={onClick} disabled={loading}>
      {children}
    </button>
  ),

  message: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useAppDispatch.mockReturnValue(mockDispatch);

    useAppSelector.mockImplementation((selector) =>
      selector({
        auth: {
          isAuthenticated: false,
          loading: false,
        },
      })
    );
  });

  test("renders login form", () => {
    render(<Login />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("shows errors if the fields are empty", () => {
    render(<Login />);

    fireEvent.click(screen.getByText("Login"));
    expect(message.error).toHaveBeenCalledWith(
      "Email and password are required"
    );
  });

  test("logs in successfully and navigates to /task", async () => {
    // make fulfilled matcher return true
    login.fulfilled = {
      match: () => true,
    };

    mockDispatch.mockResolvedValue({
      type: "auth/login/fulfilled",
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@test.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByText("Login"));

    expect(mockDispatch).toHaveBeenCalledWith(
      login({
        email: "test@test.com",
        password: "123456",
      })
    );

    expect(message.success).toHaveBeenCalledWith("Login successful");
    expect(mockNavigate).toHaveBeenCalledWith("/task", { replace: true });
  });
});
