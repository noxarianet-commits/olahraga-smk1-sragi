# Deploy to Vercel

This project is ready to be deployed to Vercel. Follow these steps:

## Prerequisites
- A GitHub repository containing this project.
- A Vercel account.

## Steps

1.  **Push to GitHub**: Ensure your latest code (including `vercel.json`) is pushed to your GitHub repository.
2.  **Import to Vercel**:
    - Log in to Vercel.
    - Click **"Add New..."** -> **"Project"**.
    - Select your repository.
3.  **Configure Project**:
    - **Framework Preset**: Vite (should be auto-detected).
    - **Root Directory**: `frontend` (if your repo has a root folder, otherwise leave as `./`).
4.  **Environment Variables**:
    - Expand the **"Environment Variables"** section.
    - Add the following variables (copy from your `.env` file):

    | Key | Value | Description |
    |-----|-------|-------------|
    | `VITE_API_URL` | `https://api-olahraga-smk1-sragi.vercel.app/api` | The URL of your backend API |
    | `VITE_IMGBB_API_KEY` | `eb31a65fccf40aadd4074a52d3d31743` | Your ImgBB API Key |

5.  **Deploy**: Click **"Deploy"**.

## Troubleshooting
- **404 on Refresh**: Ensure `vercel.json` exists in the root of your frontend directory to handle client-side routing.
- **API Errors**: Double-check your `VITE_API_URL` variable in Vercel.
