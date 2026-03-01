import React from "react";
import { ThemeProvider } from "./components/theme-provider";
import RequestUI from "./components/request-ui";
import MainMenu from "./components/main-menu";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="App">
        <MainMenu />
        <RequestUI />
      </div>
    </ThemeProvider>
  );
}

export default App;
