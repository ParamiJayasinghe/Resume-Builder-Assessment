import { createRoot } from "@wordpress/element";

const App = () => {
  return (
    <div
      style={{
        padding: "20px",
        border: "2px solid #0073aa",
        borderRadius: "8px",
      }}
    >
      <h2>React Resume Builder is Live!</h2>
      <p>Ready to build some sections.</p>
    </div>
  );
};

const rootElement = document.getElementById("resume-builder-root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
