const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const router = express.Router();
const DATA_PATH = path.join(__dirname, "../../../data/items.json");

let cachedStats = null;
let lastModifiedTime = null;

// Utility to get file modification time
async function getFileModifiedTime(filePath) {
  const stats = await fs.stat(filePath);
  return stats.mtimeMs;
}

// GET /api/stats
router.get("/", async (_, res, next) => {
  try {
    const currentModifiedTime = await getFileModifiedTime(DATA_PATH);

    // Recalculate stats only if the file has changed
    if (!cachedStats || currentModifiedTime !== lastModifiedTime) {
      const raw = await fs.readFile(DATA_PATH, "utf-8");
      const items = JSON.parse(raw);

      cachedStats = {
        total: items.length,
        averagePrice:
          items.reduce((acc, cur) => acc + cur.price, 0) / items.length,
      };

      lastModifiedTime = currentModifiedTime;
    }

    res.json(cachedStats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
