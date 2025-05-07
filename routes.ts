

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /admin, /student, /teacher
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/signin",
    "/auth/signup",
    "/auth/reset",
    "/auth/verification",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth/";

