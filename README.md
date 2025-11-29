# VandiPattiyal - MTC Chennai Fleet Management Dashboard

This project is a web application that provides a dashboard for managing and viewing the fleet data of the Metropolitan Transport Corporation (MTC) in Chennai. It allows users to visualize data, search for specific buses, and view breakdowns by depot.

## Features

*   **Dashboard:** An overview of the entire fleet with key statistics.
*   **Fleet Search:** A searchable and paginated list of all buses in the fleet.
*   **Depot Breakdown:** A detailed view of the number of buses and their service types per depot.

## Run Locally

**Prerequisites:** Node.js

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.

## Deployment

This application is configured for deployment on Vercel. Pushes to the `main` branch will automatically trigger a new deployment.

### Vercel Configuration

To enable automatic deployments, you need to add a `VERCEL_TOKEN` to your GitHub repository's secrets.

1.  **Create a Vercel Access Token:**
    *   Go to your Vercel account settings and navigate to the **Tokens** page.
    *   Create a new token and copy it.

2.  **Add the token to your GitHub repository:**
    *   Go to your GitHub repository's **Settings** > **Secrets and variables** > **Actions**.
    *   Click **New repository secret**.
    *   Name the secret `VERCEL_TOKEN` and paste the token value.
