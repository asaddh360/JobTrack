Deployment Guide: JobTrack Application
This guide provides instructions on how to set up, run, and deploy the JobTrack application.

Project Overview
Frontend & Core Backend: Next.js
AI Features: Genkit
Deployment Platform: Firebase App Hosting
1. Prerequisites
Before you begin, ensure you have the following installed:

Node.js: (LTS version recommended). Download from nodejs.org. This includes npm.
Firebase CLI: If you plan to deploy, install it globally:
npm install -g firebase-tools
2. Project Setup
Clone the Repository: If you haven't already, clone the project to your local machine.

# git clone <repository-url>
# cd <project-directory>
Install Dependencies: Navigate to the project's root directory in your terminal and run:

npm install
Environment Variables:

Create a .env file in the root of your project.
For the AI functionalities (powered by Genkit with Google AI), you'll need a Google AI API key. Add it to your .env file:
GOOGLE_API_KEY=YOUR_GOOGLE_AI_API_KEY
Replace YOUR_GOOGLE_AI_API_KEY with your actual key from Google AI Studio.
3. Running Locally for Development
You'll generally need two terminals running simultaneously:

Start the Next.js Development Server: (Handles the web application UI and API routes)

npm run dev
Your Next.js application will be accessible at http://localhost:9002.

Start the Genkit Development Server: (Handles AI flow executions and provides a developer UI)

npm run genkit:dev
The Genkit Developer UI will be accessible at http://localhost:3400. For auto-reloading Genkit on file changes:

npm run genkit:watch
4. Building for Production
To create an optimized build of your Next.js application for deployment:

npm run build
This command will output the build artifacts to the .next directory.

5. Deployment with Firebase App Hosting
This project is configured for Firebase App Hosting.

Firebase Login: If you haven't already, log in to your Firebase account:

firebase login
Firebase Project: Ensure you have a Firebase project created in the Firebase Console.

Initialize Firebase App Hosting (if needed): If you haven't linked your local project to a Firebase App Hosting backend:

firebase init hosting
Choose "Use an existing project" and select your Firebase project.
Select "App Hosting (Experimental)" as the hosting type.
Follow the prompts to configure the backend (e.g., select a region).
Deploy: Once your project is built and Firebase is initialized:

firebase deploy --only hosting
After successful deployment, the CLI will provide the URL to your live application.

Important for Deployed AI Features:

For AI features to work in the deployed environment, your GOOGLE_API_KEY (and any other sensitive keys) must be configured as secrets in your Firebase App Hosting backend.
You can manage secrets through the Firebase Console (go to your App Hosting backend settings) or using the Firebase CLI (firebase apphosting:backends:update YOUR_BACKEND_ID --update-secrets GOOGLE_API_KEY=YOUR_KEY_VALUE).
Additional Notes
The apphosting.yaml file in the project root contains basic configuration for Firebase App Hosting.
The package.json build script (next build) is automatically used by Firebase App Hosting during the deployment process.