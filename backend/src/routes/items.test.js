const request = require("supertest");
const express = require("express");
const itemsRouter = require("./items");

const app = express();
app.use(express.json());
app.use("/api/items", itemsRouter);

jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(() =>
      Promise.resolve(
        JSON.stringify([
          { id: 1, name: "Laptop Pro", category: "Electronics", price: 2499 },
          { id: 2, name: "Smartphone X", category: "Electronics", price: 999 },
        ])
      )
    ),
    writeFile: jest.fn(() => Promise.resolve()),
  },
}));

describe("GET /api/items", () => {
  it("should return paginated items", async () => {
    const res = await request(app).get("/api/items?page=1&limit=1");
    expect(res.statusCode).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.meta.totalItems).toBe(2);
  });

  it("should filter items by search query", async () => {
    const res = await request(app).get("/api/items?q=Laptop");
    expect(res.statusCode).toBe(200);
    expect(res.body.items[0].name).toBe("Laptop Pro");
  });

  it("should return 404 for invalid item ID", async () => {
    const res = await request(app).get("/api/items/999");
    expect(res.statusCode).toBe(404);
  });
});
