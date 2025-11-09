import { Route, Routes } from "react-router";
import Home from "./components/Home";
import HomePage from "./components/HomePage";
import type { JSX } from "react";

function App(): JSX.Element {
  return (
    <>
      <Routes>
        <Route element={<Home />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
