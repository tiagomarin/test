import { render, act } from "@testing-library/react";
import { DataProvider, useData } from "../DataContext";

global.fetch = jest.fn();

describe("DataContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("fetchItems should fetch and update items and meta", async () => {
    const mockResponse = {
      items: [
        { id: 1, name: "Laptop Pro", category: "Electronics", price: 2499 },
      ],
      meta: { totalItems: 1, totalPages: 1 },
    };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    let result;
    const Wrapper = ({ children }) => {
      const data = useData();
      result = data;
      return children;
    };

    render(
      <DataProvider>
        <Wrapper />
      </DataProvider>
    );

    await act(async () => {
      await result.fetchItems(null, { page: 1, limit: 12 });
    });

    expect(result.items).toEqual(mockResponse.items);
    expect(result.meta).toEqual(mockResponse.meta);
  });

  it("fetchItems should handle errors gracefully", async () => {
    fetch.mockRejectedValueOnce(new Error("Network Error"));

    let result;
    const Wrapper = ({ children }) => {
      const data = useData();
      result = data;
      return children;
    };

    render(
      <DataProvider>
        <Wrapper />
      </DataProvider>
    );

    await act(async () => {
      await result.fetchItems(null, { page: 1, limit: 12 });
    });

    expect(result.items).toEqual([]);
    expect(result.meta).toEqual({ totalItems: 0, totalPages: 0 });
  });
});
