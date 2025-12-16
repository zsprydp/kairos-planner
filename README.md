# Kairos Planner

A Charlotte Mason-inspired homeschooling planner application.

## Project Links

- **Project Console:** [Firebase Console](https://console.firebase.google.com/project/palimpsest-275eb/overview)
- **Hosting URL:** [https://palimpsest-275eb.web.app](https://palimpsest-275eb.web.app)

## Features

- **Anonymous Authentication:** Users start with a temporary session.
- **Google Sign-In:** Users can link their anonymous session to a Google account for permanent storage and cross-device syncing.
- **Firestore Database:** Real-time data persistence for students, rhythms, and assignments.
- **AI Integration:** Generates narrative summaries using Google Gemini.

## Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Ensure `.env` is populated with Firebase and Google AI API keys.

3.  **Run Locally:**
    ```bash
    npm run dev
    ```

4.  **Build & Deploy:**
    ```bash
    npm run build
    firebase deploy
    ```
