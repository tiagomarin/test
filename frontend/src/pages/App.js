import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Items from "./Items";
import ItemDetail from "./ItemDetail";
import { DataProvider } from "../state/DataContext";
import NavBar from "../components/NavBar/NavBar";
import DefaultLayout from "../Layout/DefaultLayout";

function App() {
  return (
    <DataProvider>
      <NavBar />
      <DefaultLayout>
        <Routes>
          <Route path="/" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </DefaultLayout>
    </DataProvider>
  );
}

export default App;
