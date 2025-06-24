import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

function DefaultLayout({ children }) {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {children} {/* Render the page content here */}
      </Box>
    </Container>
  );
}

export default DefaultLayout;
