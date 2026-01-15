/**
 * API Configuration
 * 
 * This file sets up a centralized Axios instance to handle HTTP requests.
 * It prevents the need to repeat the backend URL in every component.
 */

import axios from 'axios';

// Create an Axios instance with a base URL
const API = axios.create({
    // Ensure this matches the port your backend 'server.js' is running on (default is 5000)
    baseURL: 'http://localhost:5000/api', 
});

// Export the configured instance for use throughout the application
export default API;