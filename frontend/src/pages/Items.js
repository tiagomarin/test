import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../state/DataContext";
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Pagination,
  Skeleton,
  Stack,
} from "@mui/material";
import { FixedSizeGrid } from "react-window";
import useWindowSize from "../hooks/useWindowSize";

function Items() {
  const { items, meta, fetchItems } = useData();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [limit, setLimit] = useState(12);
  const { width } = useWindowSize();
  const navigate = useNavigate();

  // Constrain the grid width to a maximum value
  const maxGridWidth = 1120;
  const gridPadding = 16;
  const cardSpacing = 16;
  const gridWidth = Math.min(width - gridPadding * 6, maxGridWidth);

  // Dynamically calculate column count and column width
  const columnCount = width >= 1200 ? 3 : width >= 800 ? 2 : 1;
  const columnWidth = Math.floor(
    (gridWidth - columnCount * cardSpacing) / columnCount
  ); // Subtract spacing between columns
  const rowHeight = 350; // Adjust row height to fit content

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetchItems(signal, {
      page,
      limit,
      q: search,
      categories: selectedCategories,
    }).catch((error) => {
      if (error.name !== "AbortError") {
        console.error(error);
      }
    });

    return () => {
      controller.abort();
    };
  }, [fetchItems, limit, page, search, selectedCategories]);

  const categories = [
    { title: "Electronics" },
    { title: "Furniture" },
    { title: "Clothing" },
    { title: "Books" },
  ];

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (_, value) => {
    setSelectedCategories(value.map((category) => category.title));
    setPage(1);
  };

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const toggleLimit = () => {
    setLimit((prevLimit) => (prevLimit === 12 ? 48 : 12));
    setPage(1);
  };

  // Virtualized Grid Cell Renderer
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= items.length) return null;

    const item = items[index];
    return (
      <Box
        style={{
          ...style,
          left: `${parseFloat(style.left) + columnIndex * cardSpacing}px`,
          top: `${parseFloat(style.top) + rowIndex * cardSpacing}px`,
        }}
        role="listitem"
        sx={{ p: 1 }}
      >
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover, &:focus-within": {
              transform: "scale(1.03)",
              boxShadow: 6,
            },
          }}
        >
          <CardActionArea
            onClick={() => {
              navigate(`/items/${item.id}`);
            }}
          >
            <CardMedia
              component="img"
              alt={item.name}
              sx={{
                height: { xs: "140px", md: "180px" },
              }}
              image={`https://picsum.photos/seed/${item.id}/200/300`}
            />
            <CardContent>
              <Stack sx={{ minHeight: "6rem" }}>
                <Typography variant="h6" gutterBottom>
                  {item.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  aria-label={`Price: $${item.price}`}
                >
                  ${item.price}
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                color="text.secondary"
                aria-label={`Category: ${item.category}`}
              >
                {item.category}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    );
  };

  // Handle loading state
  if (!items) {
    return (
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search items..."
          value={search}
          onChange={handleSearchChange}
          sx={{ mb: 2 }}
        />

        <Grid container spacing={2}>
          {Array.from(new Array(12)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: "100%" }}>
                <Skeleton variant="rectangular" height={140} />
                <CardContent>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // Handle empty state
  if (items.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search items..."
          value={search}
          onChange={handleSearchChange}
          sx={{ mb: 2 }}
        />
        <Typography variant="body1" align="center">
          No results were found with the current search, try something
          different.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TextField
        placeholder="Search items..."
        value={search}
        onChange={handleSearchChange}
        sx={{
          width: { xs: "100%", md: "65%" },
          mb: 2,
        }}
      />
      <Autocomplete
        multiple
        id="categories-filter"
        options={categories}
        getOptionLabel={(option) => option.title}
        filterSelectedOptions
        onChange={handleCategoryChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Filter by Categories"
            placeholder="Select categories"
          />
        )}
        sx={{
          width: { xs: "100%", md: "65%" },
          mb: 2,
        }}
      />
      <Typography variant="body1" sx={{ mb: 2 }}>
        Showing {items.length} of {meta.totalItems} items
      </Typography>

      <Button variant="contained" onClick={toggleLimit} sx={{ mb: 2 }}>
        {limit === 12 ? "Show 48 at a time" : "Show 12 at a time"}
      </Button>

      <Box role="list">
        <FixedSizeGrid
          columnCount={columnCount}
          columnWidth={columnWidth}
          height={550}
          rowCount={Math.ceil(items.length / columnCount)}
          rowHeight={rowHeight}
          width={gridWidth}
        >
          {Cell}
        </FixedSizeGrid>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={meta.totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}

export default Items;
