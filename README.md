# Smart Bank System

A modular and secure banking backend with a React frontend, designed to support core banking operations.

## Features

### Backend (FastAPI)
*   **User Authentication:** Secure user registration and login using JWT tokens.
*   **Account Management:** Create, view, and delete bank accounts (Savings, Current, Fixed Deposit).
*   **Money Transfer:** Securely transfer funds between accounts with balance validation.
*   **Database:** Uses SQLite for simplicity, easily extendable to PostgreSQL or other databases.
*   **CORS Enabled:** Configured to allow cross-origin requests for frontend integration.

### Frontend (React)
*   **User Dashboard:** Displays user's accounts, total balance, and total number of accounts.
*   **Account Creation Form:** Allows users to create new bank accounts.
*   **Money Transfer Form:** Facilitates transferring money between accounts.
*   **Delete Account Option:** Provides a confirmation modal for deleting accounts.
*   **Responsive Design:** Built with React-Bootstrap for a mobile-first approach.
*   **Improved UI/UX:** Card-based layout, loading indicators, and visual badges for account types/statuses, inspired by "Project Kisan" design.

## Technologies Used

### Backend
*   **FastAPI:** Modern, fast (high-performance) web framework for building APIs with Python 3.7+.
*   **SQLAlchemy:** Python SQL toolkit and Object Relational Mapper (ORM) for database interaction.
*   **Pydantic:** Data validation and settings management using Python type hints.
*   **Uvicorn:** ASGI server for running FastAPI applications.
*   **python-jose[cryptography]:** For JWT token encoding and decoding.
*   **Bcrypt:** For secure password hashing.
*   **SQLite:** Default database, configured for easy local development.

### Frontend
*   **React:** JavaScript library for building user interfaces.
*   **React-Router-DOM:** For declarative routing in React applications.
*   **React-Bootstrap:** Frontend framework for building responsive, mobile-first projects on the web.
*   **Axios:** Promise-based HTTP client for the browser and Node.js.
*   **jwt-decode:** Library for decoding JWT tokens.

## Setup Instructions

### Prerequisites
*   Python 3.8+
*   Node.js and npm (or yarn)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd multi-bank-integration
    ```
2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    ```
3.  **Activate the virtual environment:**
    *   On Windows:
        ```bash
        .\venv\Scripts\activate
        ```
    *   On macOS/Linux:
        ```bash
        source venv/bin/activate
        ```
4.  **Install backend dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
5.  **Run the backend server:**
    ```bash
    uvicorn main:app --host 127.0.0.1 --port 8001 --reload
    ```
    The API will be available at `http://127.0.0.1:8001`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install frontend dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Run the frontend development server:**
    ```bash
    npm start
    # or
    yarn start
    ```
    The React app will open in your browser, usually at `http://localhost:3000`.

## File Structure Explanation

### `multi-bank-integration/` (Backend)
*   `main.py`: FastAPI application entry point, CORS setup, router inclusion.
*   `requirements.txt`: Python dependencies.
*   `smartbank.db`: SQLite database file.
*   `banking/`: Core backend logic.
    *   `auth.py`: User authentication (password hashing, JWT).
    *   `config.py`: Application settings.
    *   `crud.py`: Database CRUD operations for models.
    *   `database.py`: SQLAlchemy setup.
    *   `models.py`: SQLAlchemy ORM models (User, Account, Transaction).
    *   `schemas.py`: Pydantic models for data validation.
    *   `routers/`: API endpoint definitions.
        *   `accounts.py`: Account-related endpoints (create, get, transfer, delete).
        *   `auth.py`: Authentication endpoints (register, login).

### `frontend/` (Frontend)
*   `public/`: Static assets (index.html, favicon, manifest).
*   `src/`: React application source code.
    *   `App.js`: Root React component, routing setup.
    *   `index.js`: React app entry point.
    *   `App.css`: Global custom CSS styles (including "Project Kisan" inspired theme).
    *   `pages/`: Page-level components.
        *   `DashboardPage.js`: User dashboard with account management.
        *   `LoginPage.js`: User login form.
        *   `RegisterPage.js`: User registration form.
    *   `services/`: API interaction logic.
        *   `account.service.js`: Functions for account API calls.
        *   `auth-header.js`: JWT token utility.
        *   `auth.service.js`: Authentication API calls.

## Recent Changes & Improvements

During the last session, the following key improvements were implemented:

*   **Fixed Username Display:** The dashboard now correctly displays the logged-in user's full name in the welcome message.
*   **Enhanced UI/UX (Project Kisan Inspired):**
    *   Implemented a **card-based layout** for better visual hierarchy and separation of sections.
    *   Added a **summary statistics panel** displaying total balance and total number of accounts.
    *   Integrated a **"neat and colourful" theme** using custom CSS, inspired by the provided "Project Kisan" design, including updated background, card, button, and text styling.
    *   Added **visual badges** for account types (e.g., Savings, Current, FD) and account statuses (e.g., Active, Locked, Closed) in the accounts table.
*   **Improved Form Feedback:** Added **loading indicators** to the "Create Account" and "Transfer Money" buttons to provide better user feedback during API calls.
*   **Delete Account Functionality:**
    *   **Backend:** Added a `DELETE /accounts/{account_id}` endpoint and corresponding CRUD logic to delete accounts.
    *   **Frontend:** Implemented a "Delete" button for each account in the dashboard table, along with a **confirmation modal** to prevent accidental deletions.

## Deployment

### GitHub
1.  Create a new empty repository on GitHub.
2.  Initialize a Git repository in your `multi-bank-integration` folder:
    ```bash
    git init
    git add .
    git commit -m "Initial commit: Smart Bank System backend"
    git branch -M main
    git remote add origin <YOUR_GITHUB_BACKEND_REPO_URL>
    git push -u origin main
    ```
3.  Initialize a Git repository in your `frontend` folder:
    ```bash
    cd frontend
    git init
    git add .
    git commit -m "Initial commit: Smart Bank System frontend"
    git branch -M main
    git remote add origin <YOUR_GITHUB_FRONTEND_REPO_URL>
    git push -u origin main
    ```
    *Note: It's recommended to have separate repositories for frontend and backend for easier deployment.*

### Netlify (for Frontend)
1.  **Push your frontend code to a GitHub repository** (as described above).
2.  **Log in to Netlify** and click "Add new site" -> "Import an existing project".
3.  **Connect to Git provider** (GitHub) and select your frontend repository.
4.  **Configure build settings:**
    *   **Base directory:** `frontend/` (or leave blank if your repo only contains the frontend)
    *   **Build command:** `npm run build` (or `yarn build`)
    *   **Publish directory:** `frontend/build` (or `build` if your repo only contains the frontend)
5.  Click "Deploy site". Netlify will build and deploy your React application.

---
