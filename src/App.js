import { createRoot, useState, useEffect } from "@wordpress/element";

export const App = () => {
  const [resumeData, setResumeData] = useState({
    fullName: "",
    sections: [
      { id: "edu", title: "Education", type: "education", items: [] },
      { id: "work", title: "Work History", type: "work", items: [] },
      { id: "achieve", title: "Achievements", type: "achievements", items: [] },
    ],
  });

  // State for the new custom section input field
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (window.resumeBuilderData && window.resumeBuilderData.postId) {
      fetch(
        `${window.resumeBuilderData.root_url}resume-builder/v1/resume/${window.resumeBuilderData.postId}`,
        {
          headers: {
            "X-WP-Nonce": window.resumeBuilderData.nonce,
          },
        },
      )
        .then((res) => res.json())
        .then((data) => {
          if (data && data.sections) {
            setResumeData(data);
          }
        });
    }
  }, []);

  const handleSave = () => {
    if (!window.resumeBuilderData) return;
    setIsSaving(true);

    fetch(
      `${window.resumeBuilderData.root_url}resume-builder/v1/resume/${window.resumeBuilderData.postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": window.resumeBuilderData.nonce,
        },
        body: JSON.stringify(resumeData),
      },
    )
      .then((res) => res.json())
      .then((response) => {
        setIsSaving(false);
        if (response.success) {
          alert("Resume saved successfully!");
        }
      })
      .catch(() => {
        setIsSaving(false);
        alert("Error saving resume.");
      });
  };

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    const newSectionId = "custom-" + Date.now();

    setResumeData({
      ...resumeData,
      sections: [
        ...resumeData.sections,
        { id: newSectionId, title: newSectionTitle, type: "custom", items: [] },
      ],
    });

    setNewSectionTitle("");
  };

  const moveSection = (index, direction) => {
    const newSections = [...resumeData.sections];

    if (direction === "up" && index > 0) {
      // Swap current item with the one above it
      const temp = newSections[index - 1];
      newSections[index - 1] = newSections[index];
      newSections[index] = temp;
    } else if (direction === "down" && index < newSections.length - 1) {
      // Swap current item with the one below it
      const temp = newSections[index + 1];
      newSections[index + 1] = newSections[index];
      newSections[index] = temp;
    }

    setResumeData({ ...resumeData, sections: newSections });
  };

  const handleNameChange = (e) => {
    setResumeData({ ...resumeData, fullName: e.target.value });
  };

  const handleAddItem = (sectionId) => {
    const newSections = resumeData.sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: [...section.items, { title: "", description: "" }],
        };
      }
      return section;
    });
    setResumeData({ ...resumeData, sections: newSections });
  };

  const handleItemChange = (sectionId, itemIndex, field, value) => {
    const newSections = resumeData.sections.map((section) => {
      if (section.id === sectionId) {
        const newItems = [...section.items];
        newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
        return { ...section, items: newItems };
      }
      return section;
    });
    setResumeData({ ...resumeData, sections: newSections });
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        padding: "20px",
        width: "100vw",
        marginLeft: "calc(50% - 50vw)",
        boxSizing: "border-box",
      }}
    >
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0 }}>Resume Builder Editor</h2>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: "10px 20px",
              background: isSaving ? "#ccc" : "#0073aa",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: isSaving ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {isSaving ? "Saving..." : "Save Resume"}
          </button>
        </div>

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
        {resumeData.sections.map((section, index) => (
          <div
            key={section.id}
            style={{
              border: "1px solid #eee",
              padding: "15px",
              marginBottom: "15px",
              background: "#fafafa",
            }}
          >
            {/* Header with Title and Up/Down Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <h4 style={{ margin: 0 }}>{section.title}</h4>
              <div style={{ display: "flex", gap: "5px" }}>
                <button
                  onClick={() => moveSection(index, "up")}
                  disabled={index === 0}
                  style={{
                    padding: "3px 8px",
                    cursor: index === 0 ? "not-allowed" : "pointer",
                  }}
                  title="Move Up"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveSection(index, "down")}
                  disabled={index === resumeData.sections.length - 1}
                  style={{
                    padding: "3px 8px",
                    cursor:
                      index === resumeData.sections.length - 1
                        ? "not-allowed"
                        : "pointer",
                  }}
                  title="Move Down"
                >
                  ↓
                </button>
              </div>
            </div>

            {section.items.map((item, index) => (
              <div
                key={index}
                style={{
                  background: "#fff",
                  padding: "10px",
                  border: "1px solid #ddd",
                  marginBottom: "10px",
                }}
              >
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) =>
                    handleItemChange(section.id, index, "title", e.target.value)
                  }
                  placeholder="Title (e.g. Job Title, Degree)"
                  style={{ width: "100%", padding: "5px", marginBottom: "5px" }}
                />
                <textarea
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(
                      section.id,
                      index,
                      "description",
                      e.target.value,
                    )
                  }
                  placeholder="Description or Details..."
                  style={{ width: "100%", padding: "5px", minHeight: "60px" }}
                />
              </div>
            ))}

            <button
              onClick={() => handleAddItem(section.id)}
              style={{
                padding: "5px 10px",
                cursor: "pointer",
                background: "#f0f0f0",
                border: "1px solid #ccc",
              }}
            >
              + Add {section.title} Item
            </button>
          </div>
        ))}

        <div
          style={{
            marginTop: "30px",
            paddingTop: "20px",
            borderTop: "2px dashed #ddd",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0" }}>Add Custom Section</h4>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="e.g. Soft Skills, Certifications"
              style={{ flex: 1, padding: "8px" }}
            />
            <button
              onClick={handleAddSection}
              style={{
                padding: "8px 15px",
                background: "#0073aa",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                borderRadius: "4px",
              }}
            >
              Add Section
            </button>
          </div>
        </div>
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
            ) : (
              <ul style={{ paddingLeft: "20px", margin: 0 }}>
                {section.items.map((item, index) => (
                  <li key={index} style={{ marginBottom: "10px" }}>
                    <strong style={{ display: "block", fontSize: "16px" }}>
                      {item.title || "Untitled"}
                    </strong>
                    <p style={{ margin: "5px 0 0 0", whiteSpace: "pre-wrap" }}>
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
