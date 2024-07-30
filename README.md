<p align="center">
  <img src="docs/assets/icon.png" alt="Connecto Logo" width="120" />
</p>

<h1 align="center">Connecto Backend</h1>

<p align="center">
  🚀 A modern Node.js + TypeScript REST API for the Connecto social platform
</p>

---

## 🚀 Features

1. [📁 Project Structure](#project-structure)
2. [🔑 Authentication](#authentication)
3. [🔒 Protected Endpoints](#protected-endpoints)
4. [🧪 Validation](#validation)
5. [⚙️ .env Configuration](#.env)
6. 💻 [Technologies Used](#technologies)
7. [🚀 Deployment](#deployment)
8. [©️ License](#license)
9. [✍️ Author](#author)

---

## 📁 Project Structure <a id='project-structure'></a>

> Below is the modular architecture of the backend project using `TypeScript`, `Express`, `Mongoose`, and clean architecture principles.

<details>
<summary><strong>📁 src</strong></summary>
<details>
<summary><strong>⚙️ config</strong></summary>

> Application configuration modules

| File                | Description                                                                  |
| ------------------- | ---------------------------------------------------------------------------- |
| `cors.config.ts`    | Defines CORS policy to control cross-origin requests.                        |
| `db.config.ts`      | Sets up and manages the MongoDB connection using Mongoose.                   |
| `index.ts`          | Central entry point for all configuration modules for simplified imports.    |
| `logger.config.ts`  | Configures Winston logger for structured logging and integrates with Morgan. |
| `uploads.config.ts` | Defines Multer settings for secure and validated file uploads.               |

</details>

<details>
<summary><strong>🧭 controllers</strong> </summary>

> Business logic per feature

| Directory / File | Description                                       |
| ---------------- | ------------------------------------------------- |
| `auth/`          | Register/login logic                              |
| `comments/`      | CRUD for comments                                 |
| `posts/`         | Post operations including likes and file handling |
| `users/`         | Profile & password updates                        |
| `index.ts`       | Exports grouped controllers                       |

</details>

<details>
<summary><strong>🚨 errors</strong> </summary>

> Custom error classes and base handler

| File                    | Description                        |
| ----------------------- | ---------------------------------- |
| `base/HttpError.ts`     | Generic HTTP error base class      |
| `types/ClientErrors.ts` | 4xx client error definitions       |
| `types/ServerErrors.ts` | 5xx server error definitions       |
| `index.ts`              | Central export for all error types |

</details>

<details>
<summary><strong>🧱 middlewares</strong></summary>

> Express middlewares

| File                         | Description                                    |
| ---------------------------- | ---------------------------------------------- |
| `auth.middleware.ts`         | JWT authentication middleware                  |
| `errorHandler.middleware.ts` | Centralized error handling                     |
| `morganLogger.middleware.ts` | HTTP request logging using Morgan + Winston    |
| `upload.middleware.ts`       | Multer configuration for handling file uploads |
| `validate.middleware.ts`     | Zod-based request schema validation            |
| `index.ts`                   | Central export for middleware functions        |

</details>

<details>
<summary><strong>🗃️ models</strong> </summary>

> Mongoose schemas

| File                                 | Description                               |
| ------------------------------------ | ----------------------------------------- |
| `User.ts`, `Posts.ts`, `Comments.ts` | MongoDB schema definitions using Mongoose |
| `index.ts`                           | Aggregates and re-exports models          |

</details>

<details>
<summary><strong>🛣️ routes</strong> </summary>

> Express routes per module

| File              | Description                           |
| ----------------- | ------------------------------------- |
| `auth.routes.ts`  | Routes for authentication             |
| `users.routes.ts` | Routes for user management            |
| `posts.routes.ts` | Routes for post operations            |
| `index.ts`        | Combines and mounts all route modules |

</details>

<details>
<summary><strong>🛠️ utils</strong></summary>

> General utility functions

| File                     | Description                                           |
| ------------------------ | ----------------------------------------------------- |
| `jwt.ts`, `argon.ts`     | Utilities for authentication and hashing              |
| `dbUtils.ts`             | MongoDB-related helpers                               |
| `errorHandler.ts`        | Error transformation and forwarding helpers           |
| `serverUtils.ts`         | Helpers for server setup, shutdown, etc.              |
| `applyProtectedRoute.ts` | Adds JWT protection to route groups                   |
| `stackTrace.ts`          | Parses and formats stack traces for debugging/logging |
| `responses.ts`           | Standardized HTTP response formatting                 |
| `httpStatus.ts`          | Central HTTP status code definitions                  |
| `index.ts`               | Central utility re-export                             |

</details>

<details>
<summary><strong>✅ validations</strong></summary>

> Zod schemas for validation

| File / Directory                       | Description                               |
| -------------------------------------- | ----------------------------------------- |
| `auth/`, `comments/`, `posts`, `users` | Zod schema modules for request validation |
| `schemas.ts`                           | Central export of all Zod schema types    |

</details>
├──  app.ts

└── server.ts

</details>

## 🔑 Authentication <a id='authentication'></a>

### Public routes (no token required)

- `POST /auth/signup` – Create a new user
- `POST /auth/login` – Log in and receive JWT token

### JWT Secured

- JWT is stored in `Authorization: Bearer <token>` header
- Files access uses token in `?token=...` query string (e.g., `<img src="/files/user/avatar/foo.png?token=..." />`)
- Token settings (secret, expiry) are defined in `.env`

---

## 🔒 Protected Endpoints (require valid JWT) <a id='protected-endpoints'></a>

### 👤 Users - `/users`

- `GET /profile` – Get current user's profile
- `PATCH /profile` – Update name, family name, or avatar (with file upload)
- `PUT /password` – Change password
- `DELETE /` – Delete current user

### 📝 Posts - `/posts`

- `POST /` – Create new post (with optional file)
- `GET /` – Fetch all posts
- `GET /:id` – Get single post
- `PATCH /:id/like` – Like/unlike a post
- `PATCH /:id` – Update a post (and optionally update file)
- `DELETE /:id` – Delete a post
- `POST /:id/comments` – Add comment to a post
- `GET /:id/comments` – List comments on a post

### 💬 Comments - `/comments`

- `GET /:id` – Get single comment
- `PUT /:id` – Update comment content
- `DELETE /:id` – Delete comment

### 📦 Files - `/files`

- `GET /user/avatar/:filename?token=...` – Access user avatar (with token in URL)
- `GET /post/:filename?token=...` – Access post file (with token in URL)

---

## 🧪 Validation <a id='validation'></a>

All inputs are validated using [Zod](https://github.com/colinhacks/zod):

- Body (`req.body`)
- Params (`req.params`)
- Auth (`req.auth`)

If validation fails, the API responds with a `400 Bad Request` and details.

---

## ⚙️ .env Configuration <a id='.env'></a>

Make sure to create a `.env` file based on the example in the `.env.example` file

---

## 💻 Technologies Used <a id='technologies'></a>

A range of modern and robust technologies was used to develop **Connecto**, a secure and scalable social platform. Below is a detailed breakdown:

| Technology                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Description                                                                                                            |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| ![NodeJS](https://img.icons8.com/color/48/000000/nodejs.png)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | [**Node.js**](https://nodejs.org/) – Runtime for backend JavaScript execution.                                         |
| ![TypeScript](https://img.icons8.com/color/48/000000/typescript.png)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | [**TypeScript**](https://www.typescriptlang.org/) – Superset of JavaScript adding type safety and better tooling.      |
| ![ExpressJS](https://img.icons8.com/ios/48/000000/express-js.png)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | [**Express.js**](https://expressjs.com/) – Fast, unopinionated, minimalist web framework for Node.js.                  |
| ![JWT](https://avatars.githubusercontent.com/u/2824157?s=48&v=4)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | [**JWT (jsonwebtoken)**](https://github.com/auth0/node-jsonwebtoken) – Secure user authentication via JSON Web Tokens. |
| ![Multer](https://avatars.githubusercontent.com/u/5658226?s=48&v=4)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | [**Multer**](https://github.com/expressjs/multer) – Middleware for handling multipart/form-data for file uploads.      |
| ![Zod](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjNGY0NmU1IiBkPSJNMTkuMDg4IDIuNDc3TDI0IDcuNjA2TDEyLjUyMSAyMC40ODVsLS45MjUgMS4wMzhMMCA3LjU1OWw1LjEwOC01LjA4MnptLTE3LjQzNCA1LjJsNi45MzQtNC4wMDNINS42MDFMMS42MTkgNy42MzZ6bTEyLjExNy00LjAwM0wzLjMzMyA5LjdsMi4xNDkgMi41ODhsMTAuODA5LTYuMjQxbC0uMi0uMzQ2bDIuODUxLTEuNjQ2bC0uMzY1LS4zODF6bTcuNTIgMi44MzRMOC4yNTcgMTQuMDM0aDUuMTAxdi0uNGgzLjY2N2w1LjM0Ni01Ljk5OHptLTcuMTI5IDEwLjMzOEg5LjI2OGwyLjM2IDIuODQzeiIvPjwvc3ZnPg==) | [**Zod**](https://zod.dev/) – Type-safe schema validation for input data (Zod + TypeScript).                           |
| ![Mongoose](https://img.icons8.com/color/48/000000/mongodb.png)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | [**Mongoose**](https://mongoosejs.com/) – Elegant MongoDB object modeling for Node.js.                                 |
| ![Winston](https://avatars.githubusercontent.com/u/9682013?s=48&v=4)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | [**Winston**](https://github.com/winstonjs/winston) – Logging library for professional, structured logging.            |
| ![ESLint](https://img.icons8.com/color/48/000000/eslint.png)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | [**ESLint**](https://eslint.org/) – Pluggable linter for maintaining code quality and enforcing standards.             |
| ![Prettier](https://cdn.icon-icons.com/icons2/2107/PNG/48/file_type_light_prettier_icon_130445.png)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | [**Prettier**](https://prettier.io/) – Opinionated code formatter to ensure consistent styling.                        |
| ![VS Code](https://img.icons8.com/color/48/000000/visual-studio-code-2019.png)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | [**Visual Studio Code**](https://code.visualstudio.com/) – Primary code editor used for development.                   |
| ![Postman](https://cdn.icon-icons.com/icons2/3053/PNG/48/postman_macos_bigsur_icon_189815.png)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | [**Postman**](https://www.postman.com/) – API platform used for building, testing and documenting RESTful endpoints.   |

---

## 🚀 Deployment <a id="deployment"></a>

### 🛠️ Tooling & Environment

This project is equipped with a streamlined development setup to ensure high code quality and consistency across environments.

- **Nodemon** – Automatically restarts the server on file changes during development.
- **TypeScript** – Enables static type checking for better reliability and maintainability.
- **ESLint & Prettier** – Enforces consistent code style and catches common errors.
- **Environment Variables** – Supports environment-specific configuration via `.env` files.

### 📜 Available Scripts

Run the following scripts to manage development tasks efficiently:

```bash
npm run dev             # Start the development server with Nodemon
npm run lint            # Lint all source files using ESLint
npm run lint:fix        # Automatically fix lint issues
npm run format          # Format all files using Prettier
npm run format:check    # Check if files are properly formatted (without modifying)
```

---

## ©️ License <a id="license"></a>

> 🔒 **All Rights Reserved**

This project and its entire source code are proprietary.  
You are permitted to **view the code only** for informational or educational insight.

You may **not**:

- Reuse or copy any part of this codebase
- Modify, adapt, or build upon this project
- Distribute or make it publicly available
- Use it for personal, academic, or commercial projects

Unauthorized use will be considered a violation of copyright law.

For special permissions, contact the author at :
[![Email](https://img.shields.io/badge/Email-master.code.develop@gmail.com-blue?style=flat-square&logo=gmail)](mailto:master.code.develop@gmail.com)

---

## 🧠 Author <a id='author'></a>

<table align="center">
  <tr>
    <td align="center" width="150">
      <a href="https://github.com/MasterCodeDevelop">
        <img src="https://avatars.githubusercontent.com/u/87993888?s=400&u=33d476237e71a3007ffde35db126c017e9c46288&v=4" width="100" style="border-radius:50%" alt="MasterCodeDevelop" />
        <br />
        <sub><strong>MasterCodeDevelop</strong></sub>
      </a>
    </td>
    <td>
      <p>
        Passionate Full-Stack Developer. <br/>
        I craft scalable web platforms, clean architectures, and intelligent backend systems. <br/>
        Always aiming for production-grade quality with well-documented, testable, and modular code.
      </p>
      <p>
        🔗 Connect with me on <a href="https://github.com/MasterCodeDevelop">GitHub</a>
      </p>
      <p>
        💡 Contributions, issues and feature requests are welcome!
      </p>
    </td>
  </tr>
</table>

[Back to top](#top)
