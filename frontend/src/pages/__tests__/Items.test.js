import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import { DataProvider } from "../../state/DataContext";
import Items from "../Items";
import "@testing-library/jest-dom";

jest.spyOn(console, "error").mockImplementation(() => {});

global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  console.log("Setting up fetch mock");
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      items: [
        { id: 1, name: "Laptop Pro", category: "Electronics", price: 2499 },
      ],
      meta: { totalItems: 1, totalPages: 1 },
    }),
  });
});

describe("Items Component", () => {
  beforeEach(() => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          { id: 1, name: "Laptop Pro", category: "Electronics", price: 2499 },
        ],
        meta: { totalItems: 1, totalPages: 1 },
      }),
    });
  });

  it("renders items correctly", async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <DataProvider>
          <Items />
        </DataProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText("Laptop Pro")).toBeInTheDocument();
  });

  it("handles search input", async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <DataProvider>
          <Items />
        </DataProvider>
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText("Search items...");
    fireEvent.change(searchInput, { target: { value: "Laptop" } });

    expect(await screen.findByText("Laptop Pro")).toBeInTheDocument();
  });
});
