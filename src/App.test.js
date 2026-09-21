import { render, screen, fireEvent, act } from "@testing-library/react";
import { App } from "./App";

// We have to "mock" (fake) the global data and the fetch function
// so the test doesn't crash trying to talk to a real WordPress database.
beforeAll(() => {
  window.resumeBuilderData = {
    root_url: "http://localhost/",
    nonce: "12345",
    postId: 1,
  };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ fullName: "", sections: [] }),
    }),
  );
});

describe("Resume Builder App", () => {
  it("renders the editor heading", async () => {
    // Wait for the initial fetch and state updates to finish
    await act(async () => {
      render(<App />);
    });

    // Check if the screen contains our main heading
    const heading = screen.getByText(/Resume Builder Editor/i);
    expect(heading).not.toBeNull();
  });

  it("updates the live preview when a name is typed", async () => {
    // Wait for the initial fetch and state updates to finish
    await act(async () => {
      render(<App />);
    });

    // Find the input box by looking for its placeholder text
    const input = screen.getByPlaceholderText("e.g., Jane Doe");

    // Simulate a user typing "John Smith" into the box
    // We also wrap this in act() because it updates state
    act(() => {
      fireEvent.change(input, { target: { value: "John Smith" } });
    });

    // Check if "John Smith" instantly appeared in the Live Preview area
    const previewName = screen.getByText("John Smith");
    expect(previewName).not.toBeNull();
  });
});
