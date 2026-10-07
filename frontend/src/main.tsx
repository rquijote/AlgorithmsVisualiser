import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import BubbleSort from "./pages/BubbleSort";
import InsertionSort from "./pages/InsertionSort";
import SelectionSort from "./pages/SelectionSort";
import MergeSort from "./pages/MergeSort";
import QuickSort from "./pages/QuickSort";
import LinearSearch from "./pages/LinearSearch";
import BinarySearch from "./pages/BinarySearch";
import DepthFirstSearch from "./pages/DepthFirstSearch";
import BreadthFirstSearch from "./pages/BreadthFirstSearch";
import CompareAlgorithms from "./pages/CompareAlgorithms";
import Header from "./components/Header";
import ResponsiveWrapper from "./components/ResponsiveWrapper";
import "./styles/main.css"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <Header />
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/bubble-sort"
          element={
            <ResponsiveWrapper>
              <BubbleSort />
            </ResponsiveWrapper>
          }
        />
        <Route
          path="/insertion-sort"
          element={
            <ResponsiveWrapper>
              <InsertionSort />
            </ResponsiveWrapper>
          }
        />
        <Route
          path="/selection-sort"
          element={
            <ResponsiveWrapper>
              <SelectionSort />
            </ResponsiveWrapper>
          }
        />
        <Route
          path="/merge-sort"
          element={
            <ResponsiveWrapper>
              <MergeSort />
            </ResponsiveWrapper>
          }
        />
        <Route
          path="/quick-sort"
          element={
            <ResponsiveWrapper>
              <QuickSort />
            </ResponsiveWrapper>
          }
        />
        <Route
          path="/linear-search"
          element={
            <ResponsiveWrapper>
              <LinearSearch />
            </ResponsiveWrapper>
          }
        />
        <Route
          path="/binary-search"
          element={
            <ResponsiveWrapper>
              <BinarySearch />
            </ResponsiveWrapper>
          }
        />
        <Route
          path="/dfs"
          element={
            <ResponsiveWrapper>
              <DepthFirstSearch />
            </ResponsiveWrapper>
          }
        />
        <Route
          path="/bfs"
          element={
            <ResponsiveWrapper>
              <BreadthFirstSearch />
            </ResponsiveWrapper>
          }
        />
        <Route
          path="/compare-algorithms"
          element={
            <ResponsiveWrapper>
              <CompareAlgorithms />
            </ResponsiveWrapper>
          }
        />
      </Routes>
    </StrictMode>
  </BrowserRouter>
);
