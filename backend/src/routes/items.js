const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const router = express.Router();
const DATA_PATH = path.join(__dirname, "../../../data/items.json");

async function readData() {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

// GET /api/items
router.get("/", async (req, res, next) => {
  try {
    const data = await readData();
    const { page = 1, limit = 10, q, categories } = req.query;
    let results = data;

    // Filter by search query if provided
    if (q) {
      results = results.filter((item) =>
        item.name.toLowerCase().includes(q.toLowerCase())
      );
    }

    // Filter by categories if provided
    if (categories) {
      const categoryArray = categories.split(",");
      results = results.filter((item) => categoryArray.includes(item.category));
    }

    // Pagination logic
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedResults = results.slice(startIndex, endIndex);

    // Include metadata for pagination
    const totalItems = results.length;
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      items: paginatedResults,
      meta: {
        totalItems,
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get("/:id", async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find((i) => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error("Item not found");
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post("/", async (req, res, next) => {
  try {
    const item = req.body;
    const data = await readData();
    item.id = Date.now();
    data.push(item);
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
