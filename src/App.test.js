import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';

// Mock global data and fetch to prevent real database calls
beforeAll(() => {
    window.resumeBuilderData = {
        root_url: 'http://localhost/',
        nonce: '12345',
        postId: 1
    };

    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ fullName: "", sections: [] }),
        })
    );
});

describe('Resume Builder App', () => {

    it('renders the editor heading', async () => {
        // Wait for initial fetch
        await act(async () => {
            render(<App />);
        });

        // Verify heading exists
        const heading = screen.getByText(/Resume Builder/i);
        expect(heading).not.toBeNull();
    });

    it('updates the live preview when a name is typed', async () => {
        // Wait for initial fetch
        await act(async () => {
            render(<App />);
        });

        // Find input and simulate typing
        const input = screen.getByPlaceholderText('e.g., Jane Doe');

        act(() => {
            fireEvent.change(input, { target: { value: 'John Smith' } });
        });

        // Verify live preview update
        const previewName = screen.getByText('John Smith');
        expect(previewName).not.toBeNull();
    });

});
