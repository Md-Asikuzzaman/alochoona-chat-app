# [Alochoona](https://alochoona.vercel.app/)

## Overview

A real-time chat application built with Next.js for both frontend and backend, MongoDB for data storage, Prisma for ORM, NextAuth for authentication, Tailwind CSS for styling, and deployed on Vercel. This application allows users to create accounts, log in, and engage in real-time messaging with features like optimistic UI, emoji support, infinite scrolling, and more.

## Key Features

- **User Account Management**: Users can create accounts, log in, and log out.
- **Real-Time Messaging**: Send and receive text messages in real-time.
- **Emoji Support**: Users can send and receive emojis in their messages.
- **Optimistic UI**: Messages are sent with an optimistic UI, providing immediate feedback to the user while the server processes the message.
- **Infinite Scrolling**: Fetch and display messages with infinite scrolling for a seamless chat experience.
- **Protected Message Interface**: The messaging interface is protected, ensuring that only authenticated users can access it.
- **Friend List**: Users can manage their friend list to see who is online and start conversations with friends.

## Technologies

- **Frontend & Backend**: [Next.js](https://nextjs.org/) - A React framework for building both the frontend and backend API routes within a single application.
- **Database**: [MongoDB](https://www.mongodb.com/) - NoSQL database for storing user data and messages.
- **ORM**: [Prisma](https://www.prisma.io/) - ORM for managing database interactions and schema with MongoDB.
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) - Authentication solution supporting multiple providers.
- **CSS Framework**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for styling the application.
-  **State Management**: [Zustand](https://github.com/pmndrs/zustand) - A minimal, fast, and scalable state management solution.
- **Schema Validation**: [Zod](https://github.com/colinhacks/zod) - TypeScript-first schema declaration and validation library.
- **Deployment**: [Vercel](https://vercel.com/) - Platform optimized for deploying Next.js applications.

## Installation Guide

To get the project running locally, follow these steps:

1. **Clone the Repository**
    ```sh
    git clone https://github.com/yourusername/project-name.git
    ```

2. **Navigate to the Project Directory**
    ```sh
    cd project-name
    ```

3. **Install Dependencies**
    ```sh
    npm install
    # or
    yarn install
    ```

4. **Configure Environment Variables**

    Create a `.env.local` file in the root directory and add the following environment variables:
    ```env
    DATABASE_URL=your-database-url
    NEXTAUTH_SECRET=your-nextauth-secret
    NEXTAUTH_URL=your-nextauth-url
    ```

5. **Run the Application**
    ```sh
    npm run dev
    # or
    yarn dev
    ```

6. **Access the Application**
    Open your browser and visit `http://localhost:3000`.

## Usage Instructions

- **Create an Account**: Sign up using the registration form.
- **Log In**: Access your account with your credentials.
- **Send Messages**: Use the chat interface to send and receive messages in real-time. Emojis can be inserted into messages.
- **View Friend List**: See who is online and start conversations.
- **Logout**: Use the logout option to exit your account.

## Testing

Instructions for running tests. Adjust based on your testing setup.

```sh
# Run tests
npm test
# or
yarn test
