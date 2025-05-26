-----

# PRODUCTION RAG APPLICATION

This project features a Production-Ready Retrieval-Augmented Generation (RAG) application, built with a Next.js frontend and a PocketBase backend. 

-----

## Getting Started
first install and run pocketbase 
```bash
./pocketbase serve 
```

make a .env.local and add 

```bash
NEXT_PUBLIC_PB_URL=http://127.0.0.1:8090
```
now run  the development server:

```bash
npm run dev
```

  * **PocketBase Instance:** You'll need a running PocketBase instance (version 0.20.0 or later is recommended). If you don't have one, you can download the executable from the [PocketBase documentation](https://pocketbase.io/docs/).
  * **Node.js & npm:** Required for the Next.js frontend.
  * **Google Cloud Project:** Necessary for setting up Google OAuth.

-----

## Backend Setup: PocketBase Database & Authentication

This project's backend schema is managed through PocketBase migrations. You'll need to apply these to your PocketBase instance and then configure Google OAuth for user authentication.

### 1\. Applying Database Migrations

Our `pb_migrations` directory contains all the necessary files to set up your PocketBase database schema (collections, fields, etc.).

1.  **Locate the `pb_migrations` Folder:**
    After cloning this repository, you'll find the `pb_migrations` directory at the root of the project.

    ```bash
    # Example:
    ls pb_migrations/
    ```

2.  **Identify Your PocketBase Instance's `pb_migrations` Directory:**
    Find the `pb_migrations` directory associated with your running PocketBase instance. This is typically located in the same directory as your `pocketbase` executable or your custom PocketBase Go/JS application.

      * **Example (Linux/macOS):** `~/my_pocketbase_app/pb_migrations/`
      * **Example (Windows):** `C:\Users\YourUser\PocketBaseApps\my_app\pb_migrations\`

3.  **⚠️ Important: Clean Existing Migrations (If Applicable) ⚠️**
    If your PocketBase instance currently contains other migration files that are **not** part of this project, and you want a clean slate matching **only** this project's schema, we highly recommend that you **delete all existing `.js` files from your PocketBase instance's `pb_migrations` directory before copying ours.**

      * This ensures that only the migrations from this project are applied, preventing potential conflicts or unwanted schemas from previous projects.
      * Alternatively, if you want to **add** our schema to an existing one, you can skip deleting, but be aware of potential naming conflicts if you have collections with the same names (e.g., if you already have a `users` collection with different fields).

4.  **Copy the Migration Files:**
    Copy all the `.js` files from **this project's `pb_migrations` directory** into your **PocketBase instance's `pb_migrations` directory**.

      * **Example (Linux/macOS):**
        ```bash
        cp ./pb_migrations/*.js /path/to/your/pocketbase/instance/pb_migrations/
        ```
      * **Example (Windows - using PowerShell):**
        ```powershell
        Copy-Item -Path ".\pb_migrations\*.js" -Destination "C:\Path\To\Your\PocketBase\Instance\pb_migrations\"
        ```
      * You can also simply **drag-and-drop** the files using your file explorer.

5.  **Restart Your PocketBase Instance:**
    For the database schema changes to take effect, you **must restart your PocketBase instance**.

      * If you're running it from the command line, stop it (e.g., by pressing `Ctrl+C`) and then start it again:
        ```bash
        ./pocketbase serve
        ```
      * If it's running as a service, restart the service through your system's service manager.

    Upon restart, PocketBase will detect the new migration files and automatically apply them to its database. This will create all the necessary collections and fields required by this project.

6.  **Access the Admin UI:**
    You can now access your PocketBase Admin UI (typically at `http://127.0.0.1:8090/_/` or your custom URL) to verify that the new collections have been created. If it's a completely fresh `pb_data` directory for your instance, you may be prompted to create an initial admin user.

### 2\. Setting Up Google OAuth for User Authentication

After applying the database migrations, you'll need to configure Google OAuth within your PocketBase instance to enable social logins for the `users` collection.

1.  **Google Cloud Project Setup:**

      * Ensure you have a Google Cloud Project set up.
      * Obtain an **OAuth 2.0 Client ID** and **Client Secret** by creating a "Web application" type credential in the Google Cloud Console. Follow Google's official guide on [Set up OAuth 2.0](https://www.google.com/search?q=https://developers.google.com/identity/gsi/web/guides/get-google-api-key).
      * **Crucial Redirect URI:** When configuring your OAuth client in Google Cloud, add the following as an **Authorized redirect URI**:
        `http://127.0.0.1:8090/api/oauth2-redirect` (replace `http://127.0.0.1:8090` with your actual PocketBase domain if it's different).

2.  **Configure in PocketBase Admin UI:**

      * Log in to your PocketBase Admin UI (e.g., `http://127.0.0.1:8090/_/`).
      * In the left sidebar, click on **Settings**.
      * Click on **Auth Providers**.
      * Scroll down and find **Google (OAuth2)**. Click the **toggle switch** next to it to enable it.
      * Enter your **Client ID** into the corresponding field.
      * Enter your **Client Secret** into the corresponding field.
      * Scroll to the bottom of the page and click **Save changes**.

Your PocketBase instance is now configured to allow users to authenticate using their Google accounts.

-----

## Frontend Setup: Next.js Application

Once your PocketBase backend is ready, you can configure and run the Next.js frontend.

1.  **Navigate to the Project Root:**
    Ensure you are in the root directory of your cloned project.

2.  **Create `.env.local`:**
    Create a new file named `.env.local` in the root of your Next.js project.

3.  **Add PocketBase Endpoint:**
    Add the following line to your `.env.local` file, replacing the URL if your PocketBase instance runs on a different address or port:

    ```
    NEXT_PUBLIC_PB_URL=http://127.0.0.1:8090
    ```

4.  **Install Dependencies & Run Development Server:**

    ```bash
    npm install
    npm run dev
    ```

5.  **Open in Browser:**
    The Next.js development server will typically start on `http://localhost:3000`. Open this URL in your browser to see the application.

-----

