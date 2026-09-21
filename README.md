# Resume Builder - WordPress Plugin

A React-powered WordPress plugin that allows users to create, manage, and arrange multiple resume sections via a clean front-end interface. It seamlessly integrates with a custom WordPress REST API to save user data directly to the database.

## Setup & Installation Instructions

Follow these steps to get the plugin running in your local WordPress environment:

### 1. Install and Activate the Plugin

- Download or clone this repository.
- Place the entire `resume-builder` folder into your WordPress plugin directory at `wp-content/plugins/`.
- Log in to your WordPress Admin Dashboard.
- Navigate to **Plugins** in the left-hand menu.
- Find "Resume Builder" in the list and click **Activate**.

### 2. Build the React Application

This plugin uses modern React (via `@wordpress/element`), so the JavaScript needs to be compiled before the interface will appear.

- Open your terminal or command prompt.
- Navigate inside the plugin directory (e.g., `cd wp-content/plugins/resume-builder`).
- Run `npm install` to download all necessary dependencies.
- Run `npm run build` to compile the React code. (Alternatively, run `npm start` if you plan to make live edits to the code).

### 3. Using the Resume Builder

Once activated and built, you can start building resumes:

- In the WordPress Admin Dashboard, you will now see a new menu item on the left called **Resumes**.
- Click **Resumes -> Add New**.
- Enter a title for your resume at the top (e.g., "My Software Engineer Resume").
- In the main text editor box below the title, type the shortcode exactly like this: `[resume_builder]`
- Click the blue **Publish** button on the right side of the screen.
- Click **View Post** at the top of the screen to open the front end of the site. You will now see the interactive React Resume Builder!

### 4. Running Automated Tests

This project includes Jest unit tests to verify the React component logic (rendering and state updates).

- In your terminal, ensure you are still inside the `resume-builder` plugin directory.
- Run the command: `npm run test`
- Jest will automatically find the `.test.js` files and execute the testing suites.

---

## Data Model Choice & Justification

This plugin utilizes a highly efficient hybrid approach: **Custom Post Types (CPT) + Post Meta (JSON stringified)**.

- **Custom Post Type (`resume`):** Utilizing a standard WordPress CPT is the best structural choice because it allows us to leverage WordPress's native built-in ownership rules, user role permissions, and querying capabilities right out of the box. It also trivially solves the requirement to support "multiple resumes per user", as users can simply create as many separate Resume posts as they want.
- **Post Meta for Data (`_resume_data`):** React applications rely on heavily nested, dynamic data structures (e.g., a dynamic array of sections, each containing a dynamic array of items). Instead of over-engineering custom relational database tables or creating dozens of individual post meta keys for every single list item, storing the entire state as a single sanitized JSON string in a post meta field is significantly more performant. It allows the custom REST API endpoint to load and save the entire application state in a single, lightning-fast database transaction without complex SQL joins.

## Future Improvements

Given more time, here are a few features I would add to enhance the user experience:

1. **Custom Color Themes**
   - **Idea:** Allow users to choose their own accent color for the resume preview.
   - **Implementation:** I would add a simple color picker in the editor panel and use CSS variables (`--primary-color`) in the React app to dynamically update the preview's styling.

2. **Drag-and-Drop Reordering**
   - **Idea:** Upgrade the current "Up/Down" arrow buttons to a full drag-and-drop interface.
   - **Implementation:** I would integrate a lightweight library like `@hello-pangea/dnd` (a modern fork of `react-beautiful-dnd`) to make reordering sections feel more tactile and modern.

3. **JSON Export / Import**
   - **Idea:** Let users backup their raw resume data and import it later.
   - **Implementation:** I would add a "Download JSON" button that converts the `resumeData` state into a downloadable `.json` file, and a file input to parse and load it back into state.
