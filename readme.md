# Dynamic Stream Overlay
Dynamic Stream Overlay is a fully customizable and user-friendly system designed for managing dynamic draggable and resizable windows in a web-based environment. With added functionality for personalization and settings per window, this project is perfect for live streaming overlays, admin dashboards, or interactive frontend applications.
## Features
- **Draggable Windows:** Create, move, and resize windows freely within the container.
- **Persistent Storage:** Automatically saves windows' state (position, size, title, and configuration) to `localStorage` and restores them on page reload.
- **Expandable Configuration Menu:** Each window includes a button (`>`) to expand a menu with customization options.
    - **Title Bar Color Selector:** Change the color of the window's title bar dynamically.

- **Modern and Lightweight Design:** Includes a simple and aesthetic UI styled with a light pastel theme and smooth interactions.
- **Responsive and Cross-Browser Compatible:** Works seamlessly across various browsers and devices.

## Getting Started
### Prerequisites
- [Node.js](https://nodejs.org/) installed on your computer.
- A package manager like [npm](https://www.npmjs.com/).

### Installation
1. Clone the repository:
``` bash
   git clone https://github.com/your-username/your-repository-name.git
   cd your-repository-name
```
1. Install dependencies:
``` bash
   npm install
```
1. Start the development server:
``` bash
   npm start
```
1. Open the app in your browser (it will automatically launch in most cases).

### Building for Production
To create a production-optimized build, run:
``` bash
npm run build
```
The production files will be located in the `dist` folder.
## Usage
1. Open the application in your browser.
2. Use the `+` button to create new windows dynamically.
3. Customize each window by clicking the `>` button to expand the configuration menu.
4. Adjust title bar colors through the settings menu.

## Technology Stack
This project utilizes the following libraries and tools:
- **Webpack**: For bundling and optimizing the project's assets.
- **HTML5 & CSS3**: For a responsive and visually appealing frontend.
- **JavaScript (ES6)**: For interactive and dynamic functionalities.
- **LocalStorage**: To persist user settings and states.

## File Overview
- `index.html`: Entry point of the application.
- `style.css`: Contains the styling for the windows and UI components.
- `draggable_window_manager.js`: Handles the core logic of creating, dragging, resizing, and persisting windows.
- `webpack.config.*.js`: Configuration files for Webpack in development and production environments.

## License
This project uses the MIT License. See the `LICENSE.txt` file for details.
Feel free to customize or extend this as needed for your project! Let me know if you need further assistance.


