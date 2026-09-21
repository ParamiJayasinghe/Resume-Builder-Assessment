import { useState, useEffect } from "@wordpress/element";

const App = () => {
  const [resumeData, setResumeData] = useState({
    fullName: "",
    sections: [
      { id: "edu", title: "Education", type: "education", items: [] },
      { id: "work", title: "Work History", type: "work", items: [] },
      { id: "achieve", title: "Achievements", type: "achievements", items: [] },
    ],
  });

  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (window.resumeBuilderData && window.resumeBuilderData.postId) {
      fetch(
        `${window.resumeBuilderData.root_url}resume-builder/v1/resume/${window.resumeBuilderData.postId}`,
        { headers: { "X-WP-Nonce": window.resumeBuilderData.nonce } },
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
        if (response.success) alert("Resume saved successfully!");
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
      const temp = newSections[index - 1];
      newSections[index - 1] = newSections[index];
      newSections[index] = temp;
    } else if (direction === "down" && index < newSections.length - 1) {
      const temp = newSections[index + 1];
      newSections[index + 1] = newSections[index];
      newSections[index] = temp;
    }
    setResumeData({ ...resumeData, sections: newSections });
  };

  const handleNameChange = (e) =>
    setResumeData({ ...resumeData, fullName: e.target.value });

  const handleAddItem = (sectionId) => {
    const newSections = resumeData.sections.map((section) => {
      if (section.id === sectionId)
        return {
          ...section,
          items: [...section.items, { title: "", description: "" }],
        };
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
    <div className="rb-wrapper">
      <div className="rb-container">
        {/* Left Column: Editor */}
        <div className="rb-editor">
          <div className="rb-header">
            <h2>Resume Builder</h2>
            <button
              className="rb-btn rb-btn-primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Resume"}
            </button>
          </div>

          <div className="rb-input-group">
            <label className="rb-label">Full Name</label>
            <input
              type="text"
              className="rb-input"
              value={resumeData.fullName}
              onChange={handleNameChange}
              placeholder="e.g., Jane Doe"
            />
          </div>

          <div style={{ marginTop: "30px", marginBottom: "20px" }}>
            <h3 style={{ margin: 0, color: "#475569" }}>Sections</h3>
          </div>

          {resumeData.sections.map((section, index) => (
            <div key={section.id} className="rb-section-card">
              <div className="rb-section-header">
                <h4 className="rb-section-title">{section.title}</h4>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="rb-icon-btn"
                    onClick={() => moveSection(index, "up")}
                    disabled={index === 0}
                    title="Move Up"
                  >
                    ↑
                  </button>
                  <button
                    className="rb-icon-btn"
                    onClick={() => moveSection(index, "down")}
                    disabled={index === resumeData.sections.length - 1}
                    title="Move Down"
                  >
                    ↓
                  </button>
                </div>
              </div>

              {section.items.map((item, index) => (
                <div key={index} className="rb-item-card">
                  <input
                    type="text"
                    className="rb-input"
                    style={{ marginBottom: "10px" }}
                    value={item.title}
                    onChange={(e) =>
                      handleItemChange(
                        section.id,
                        index,
                        "title",
                        e.target.value,
                      )
                    }
                    placeholder="Title (e.g. Job Title, Degree)"
                  />
                  <textarea
                    className="rb-textarea"
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
                  />
                </div>
              ))}

              <button
                className="rb-btn rb-btn-secondary"
                onClick={() => handleAddItem(section.id)}
              >
                + Add {section.title} Item
              </button>
            </div>
          ))}

          <div
            style={{
              marginTop: "40px",
              paddingTop: "30px",
              borderTop: "2px dashed #e2e8f0",
            }}
          >
            <h4 style={{ margin: "0 0 15px 0", color: "#1e293b" }}>
              Add Custom Section
            </h4>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                className="rb-input"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder="e.g. Soft Skills, Certifications"
              />
              <button
                className="rb-btn rb-btn-primary"
                onClick={handleAddSection}
              >
                Add Section
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Preview */}
        <div className="rb-preview">
          <span className="rb-preview-badge">Live Preview</span>
          <h1 className="rb-preview-name">
            {resumeData.fullName || "Your Name"}
          </h1>

          {resumeData.sections.map((section) => (
            <div key={section.id} className="rb-preview-section">
              <h3 className="rb-preview-section-title">{section.title}</h3>

              {section.items.length === 0 ? (
                <p style={{ color: "#94a3b8", fontStyle: "italic", margin: 0 }}>
                  No details provided yet.
                </p>
              ) : (
                <div>
                  {section.items.map((item, index) => (
                    <div key={index} className="rb-preview-item">
                      <h4>{item.title || "Untitled"}</h4>
                      <p>{item.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
