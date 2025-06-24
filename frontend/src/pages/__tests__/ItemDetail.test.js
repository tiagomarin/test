import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ItemDetail from "../ItemDetail";

global.fetch = jest.fn();

describe("ItemDetail Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders item details correctly", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        name: "Laptop Pro",
        category: "Electronics",
        price: 2499,
      }),
    });

    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        initialEntries={["/items/1"]}
      >
        <Routes>
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </MemoryRouter>
    );

    const itemName = await screen.findByText("Laptop Pro");
    expect(itemName.textContent).toBe("Laptop Pro");

    const category = screen.getByText((content, element) => {
      return element.textContent === "Category: Electronics";
    });
    expect(category).toBeTruthy();

    const price = screen.getByText((content, element) => {
      return element.textContent === "Price: $2499";
    });
    expect(price).toBeTruthy();
  });

  it("redirects to home on error", async () => {
    fetch.mockRejectedValueOnce(new Error("Item not found"));

    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        initialEntries={["/items/999"]}
      >
        <Routes>
          <Route path="/" element={<p>Home</p>} />
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </MemoryRouter>
    );

    const homeText = await screen.findByText("Home");
    expect(homeText.textContent).toBe("Home");
  });
});

jest.spyOn(console, "error").mockImplementation(() => {});
