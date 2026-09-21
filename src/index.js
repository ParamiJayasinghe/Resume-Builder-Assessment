import { createRoot } from "@wordpress/element";

const App = () => {
  const [resumeData, setResumeData] = useState({
    fullName: "",
    sections: [
      { id: "edu", title: "Education", type: "education", items: [] },
      { id: "work", title: "Work History", type: "work", items: [] },
      { id: "achieve", title: "Achievements", type: "achievements", items: [] },
    ],
  });

  const handleNameChange = (e) => {
    setResumeData({ ...resumeData, fullName: e.target.value });
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {/* Left Column: Editor */}
      <div
        style={{
          flex: 1,
          background: "#fff",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        <h2>Resume Builder Editor</h2>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Full Name:
          </label>
          <input
            type="text"
            value={resumeData.fullName}
            onChange={handleNameChange}
            placeholder="e.g., Jane Doe"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <h3>Sections</h3>
        {resumeData.sections.map((section) => (
          <div
            key={section.id}
            style={{
              border: "1px solid #eee",
              padding: "15px",
              marginBottom: "15px",
              background: "#fafafa",
            }}
          >
            <h4 style={{ margin: "0 0 10px 0" }}>{section.title}</h4>
            <button style={{ padding: "5px 10px", cursor: "pointer" }}>
              + Add {section.title} Item
            </button>
          </div>
        ))}
      </div>

      {/* Right Column: Live Preview */}
      <div
        style={{
          flex: 1,
          background: "#f6f7f7",
          padding: "20px",
          borderTop: "4px solid #0073aa",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#888",
            fontSize: "14px",
            textTransform: "uppercase",
          }}
        >
          Live Preview
        </h2>
        <h1 style={{ margin: "0 0 20px 0" }}>
          {resumeData.fullName || "Your Name"}
        </h1>

        {resumeData.sections.map((section) => (
          <div key={section.id} style={{ marginBottom: "20px" }}>
            <h3
              style={{ borderBottom: "2px solid #ddd", paddingBottom: "5px" }}
            >
              {section.title}
            </h3>
            {section.items.length === 0 ? (
              <p style={{ color: "#999", fontStyle: "italic" }}>
                No details provided yet.
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

const rootElement = document.getElementById("resume-builder-root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
