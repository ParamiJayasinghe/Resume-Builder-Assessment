import { createRoot } from "@wordpress/element";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("resume-builder-root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
