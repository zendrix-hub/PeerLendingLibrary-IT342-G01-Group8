// --- SETUP ---
// Import React, hooks, and Axios
import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';

// Define the base URL for our Spring Boot backend
const API_URL = "http://localhost:8080/api";

// Configure a default Axios instance for API calls
const api = axios.create({
    baseURL: API_URL
});

// --- HELPER / REUSABLE COMPONENTS ---

/**
 * The ReadHub Logo Component
 * (Based on the Figma design, name changed from "Peer Archive Hub")
 */
function Logo() {
    return (
        <div className="flex items-center space-x-2">
            {/* The circular logo icon */}
            <div className="p-2 bg-yellow-400 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            </div>
            {/* The logo text */}
            <div>
                <div className="font-bold text-lg text-red-900">ReadHub</div>
                <div className="text-xs font-medium text-gray-500">LIBRARY WEB PORTAL</div>
            </div>
        </div>
    );
}

/**
 * The main Header navigation bar for all logged-in pages
 * (Based on the Dashboard Figma design)
 */
function HeaderNav({ user, onLogout, setPage }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    // Get user initials for the profile avatar (e.g., "Jane Smith" -> "JS")
    const userInitials = user?.firstName?.[0].toUpperCase() + user?.lastName?.[0].toUpperCase() || '...';

    return (
        <nav className="bg-white shadow-md w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left Side: Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Logo />
                    </div>

                    {/* Center: Search (Placeholder from Figma) */}
                    <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
                        <div className="max-w-lg w-full lg:max-w-xs">
                            <label htmlFor="search" className="sr-only">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input id="search" name="search" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:placeholder-gray-400 sm:text-sm" placeholder="Search..." type="search" />
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Profile Dropdown */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <div className="ml-3 relative">
                            <div>
                                <button onClick={() => setDropdownOpen(!dropdownOpen)} type="button" className="bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" id="user-menu-button">
                                    <span className="sr-only">Open user menu</span>
                                    {/* The circular avatar */}
                                    <div className="h-10 w-10 rounded-full bg-red-800 text-white flex items-center justify-center font-bold">
                                        {userInitials}
                                    </div>
                                    <span className="hidden lg:block ml-2 text-gray-700 text-sm font-medium">Hi, {user?.firstName}</span>
                                    <svg className="hidden lg:block ml-1 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>

                            {/* Dropdown menu items */}
                            {dropdownOpen && (
                                <div 
                                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                    onClick={() => setDropdownOpen(false)} // Close dropdown on item click
                                >
                                    <a href="#" onClick={(e) => { e.preventDefault(); setPage('profile'); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</a>
                                    <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}


// --- PAGE COMPONENTS ---

/**
 * 1. Login Page Component
 * (Based on the Figma "Login Page")
 */
function LoginPage({ onLogin, setPage, error, clearError }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(email, password);
    };

    // Clear the error message as soon as the user starts typing
    useEffect(() => {
        if (email || password) clearError();
    }, [email, password]);

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side: Form */}
            <div className="flex flex-col items-center justify-center bg-white p-12">
                <div className="max-w-md w-full">
                    <div className="mb-12">
                        <Logo />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-gray-500 mb-8">Enter your details to proceed.</p>

                    {/* Error message display */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                            </div>
                            <a href="#" className="text-sm font-medium text-red-600 hover:text-red-500">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-red-800 text-white py-3 px-4 rounded-md font-semibold hover:bg-red-900 transition duration-300"
                        >
                            Sign In
                        </button>
                    </form>
                    
                    <p className="text-center text-sm text-gray-500 mt-8">
                        Don't have an account?{' '}
                        <a href="#" onClick={(e) => { e.preventDefault(); setPage('register'); }} className="font-medium text-red-600 hover:text-red-500">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>

            {/* Right Side: Image */}
            <div 
                className="hidden lg:block bg-cover bg-center" 
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560411326-61053077e01f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaWJyYXJ5JTIwYnVpbGRpbmd8ZW58MHx8fHwxNzMwMDI0NDExfDA&ixlib=rb-4.0.3&q=80&w=1080')" }}
            ></div>
        </div>
    );
}

/**
 * 2. Register Page Component
 * (Based on the Figma "Sign up Page")
 */
function RegisterPage({ onRegister, setPage, error, clearError }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState(''); // For "passwords do not match"

    const handleSubmit = (e) => {
        e.preventDefault();
        // Check if passwords match
        if (password !== confirmPassword) {
            setLocalError("Passwords do not match.");
            return;
        }
        // If they match, call the register function from the main App
        onRegister(firstName, lastName, email, password);
    };
    
    // Clear errors when user starts typing
    useEffect(() => {
        setLocalError('');
        clearError();
    }, [firstName, lastName, email, password, confirmPassword]);

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side: Form */}
            <div className="flex flex-col items-center justify-center bg-white p-12">
                <div className="max-w-md w-full">
                    <div className="mb-8">
                        <Logo />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h2>
                    <p className="text-gray-500 mb-6">Enter your details to create an account.</p>

                    {/* Error display (for API errors or local password mismatch) */}
                    {(error || localError) && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{error || localError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email-reg">Email</label>
                            <input
                                type="email"
                                id="email-reg"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password-reg">Password</label>
                            <input
                                type="password"
                                id="password-reg"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                required
                            />
                        </div>
                        <div className="mt-4 mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-red-800 text-white py-3 px-4 rounded-md font-semibold hover:bg-red-900 transition duration-300"
                        >
                            Sign Up
                        </button>
                    </form>
                    
                    <p className="text-center text-sm text-gray-500 mt-8">
                        Already have an account?{' '}
                        <a href="#" onClick={(e) => { e.preventDefault(); setPage('login'); }} className="font-medium text-red-600 hover:text-red-500">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>

            {/* Right Side: Image */}
            <div 
                className="hidden lg:block bg-cover bg-center" 
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544258210-2d85b14c023d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw3fHxtb2Rlcm4lMjBsaWJyYXJ5JTIwaW50ZXJpb3J8ZW58MHx8fHwxNzMwMDI0NTE0fDA&ixlib=rb-4.0.3&q=80&w=1080')" }}
            ></div>
        </div>
    );
}

/**
 * 3. Dashboard Page Component
 * (Based on the Figma "Dashboard Page")
 */
function DashboardPage({ user, onLogout, setPage }) {
    // This component will hold the main logged-in view
    return (
        <div className="min-h-screen bg-red-950">
            <HeaderNav user={user} onLogout={onLogout} setPage={setPage} />
            
            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Welcome back, {user?.firstName}!</h1>
                    <p className="text-red-200">Here's what's happening with your library activity.</p>
                </div>

                {/* Stat Cards (from Figma) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-yellow-400 p-6 rounded-lg shadow-md">
                        <h3 className="text-4xl font-bold text-red-900">3</h3>
                        <p className="text-red-800 font-medium">Items Currently Borrowed</p>
                    </div>
                    <div className="bg-yellow-400 p-6 rounded-lg shadow-md">
                        <h3 className="text-4xl font-bold text-red-900">-2 days</h3>
                        <p className="text-red-800 font-medium">Next Due: "To Kill A Mockingbird"</p>
                    </div>
                    <div className="bg-yellow-400 p-6 rounded-lg shadow-md">
                        <h3 className="text-4xl font-bold text-red-900">2</h3>
                        <p className="text-red-800 font-medium">Pending Requests</p>
                    </div>
                </div>

                {/* Overdue Banner (from Figma) */}
                <div className="bg-red-800 text-white p-4 rounded-lg flex justify-between items-center mb-8">
                    <p><span className="font-bold">You have 1 overdue item!</span> Please return these items as soon as possible to avoid penalties.</p>
                    <button className="bg-white text-red-800 font-semibold px-4 py-2 rounded-md text-sm hover:bg-gray-200">
                        View Overdue
                    </button>
                </div>

                {/* Main Content (My Loans / My Requests) - Placeholder data for now */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">My Loans (3)</h2>
                        <div className="space-y-4">
                            {/* Placeholder Item 1 */}
                            <div className="border p-4 rounded-md flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold">To Kill A Mockingbird</h4>
                                    <p className="text-sm text-gray-500">Lander: Candon University Library</p>
                                </div>
                                <span className="text-sm font-medium text-red-600">Due: 11/11/2025</span>
                            </div>
                            {/* Placeholder Item 2 */}
                            <div className="border p-4 rounded-md flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold">The Great Gatsby</h4>
                                    <p className="text-sm text-gray-500">Lander: Sarah Johnson</p>
                                </div>
                                <span className="text-sm font-medium text-gray-600">Due: 11/21/2025</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">My Requests (2)</h2>
                        {/* Placeholder for requests */}
                        <div className="border p-4 rounded-md text-center text-gray-500">
                            <p>Requests feature coming soon.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

/**
 * 4. Profile Page Component
 * (Created based on Dashboard aesthetics and backend requirements)
 */
function ProfilePage({ user, onUpdate, onDelete, setPage, onLogout, error, clearError }) {
    // State for the form fields
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [confirmDelete, setConfirmDelete] = useState(false);
    
    // This effect pre-fills the form as soon as the 'user' data is loaded
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setEmail(user.email);
        }
    }, [user]);

    // Clear errors when user types
    useEffect(() => {
        clearError();
    }, [firstName, lastName, email]);

    // Handle profile update
    const handleUpdate = (e) => {
        e.preventDefault();
        onUpdate(firstName, lastName, email);
    };

    // Handle account deletion
    const handleDelete = (e) => {
        e.preventDefault();
        if (confirmDelete) {
            onDelete(); // Call the main delete function
        } else {
            // On first click, just show the confirmation
            setConfirmDelete(true);
        }
    };
    
    return (
        <div className="min-h-screen bg-red-950">
            {/* Use the same header as the dashboard */}
            <HeaderNav user={user} onLogout={onLogout} setPage={setPage} />

            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Form is on a white "card" to match the dashboard's content */}
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8 mt-12">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">My Profile</h2>
                    
                    {/* Error display */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    
                    {/* Update Profile Form */}
                    <form onSubmit={handleUpdate}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="prof-firstName">First Name</label>
                                <input
                                    type="text"
                                    id="prof-firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="prof-lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="prof-lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="prof-email">Email</label>
                            <input
                                type="email"
                                id="prof-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                required
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="mt-6 w-full bg-red-800 text-white py-2 px-4 rounded-md font-semibold hover:bg-red-900 transition duration-300"
                        >
                            Update Profile
                        </button>
                    </form>
                    
                    <hr className="my-6" />
                    
                    {/* Delete Account Section */}
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900">Danger Zone</h3>
                        <p className="text-sm text-gray-500 mb-4">This action cannot be undone.</p>
                        <button
                            onClick={handleDelete}
                            className={`w-full py-2 px-4 rounded-md font-semibold transition duration-300 ${
                                confirmDelete 
                                ? 'bg-red-600 text-white hover:bg-red-700' // 'Are you sure?' style
                                : 'bg-transparent text-red-600 border border-red-600 hover:bg-red-100' // Default style
                            }`}
                        >
                            {confirmDelete ? 'Are you sure? Click to confirm.' : 'Delete My Account'}
                        </button>
                    </div>
                    
                    <div className="text-center mt-6">
                        <a href="#" onClick={(e) => { e.preventDefault(); setPage('dashboard'); }} className="text-sm font-medium text-gray-500 hover:text-gray-700">
                            &larr; Back to Dashboard
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}

// --- MAIN APP COMPONENT (CONTROLLER) ---

/**
 * This is the main component that controls the whole application.
 * It manages state (page, token, user) and all API calls.
 */
function App() {
    // State Management
    const [page, setPage] = useState('login'); // Controls navigation: 'login', 'register', 'dashboard', 'profile'
    const [token, setToken] = useState(null); // Stores the JWT
    const [user, setUser] = useState(null); // Stores logged-in user's data
    const [error, setError] = useState(null); // Stores login/register/profile error messages

    // On initial app load, check localStorage for an existing token
    useEffect(() => {
        const storedToken = localStorage.getItem('readhubToken');
        if (storedToken) {
            setToken(storedToken);
            // Set token for all future Axios requests
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            // Fetch the user's profile
            getProfile(storedToken);
        }
    }, []); // The empty array [] means this runs only once on mount

    // --- API CALL FUNCTIONS ---

    // Clear any active error message
    const clearError = () => setError(null);

    // API: Get User Profile (used after login or on refresh)
    const getProfile = async (currentToken) => {
        try {
            const response = await api.get('/users/profile', {
                headers: {
                    Authorization: `Bearer ${currentToken}` // Ensure header is set for this specific request
                }
            });
            setUser(response.data); // Save user data
            setPage('dashboard'); // Go to dashboard
        } catch (err) {
            // This means the token is old or invalid
            console.error("Profile fetch failed:", err);
            handleLogout(); // Log the user out
        }
    };

    // API: Handle Login
    const handleLogin = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const newToken = response.data.token;
            
            setToken(newToken);
            localStorage.setItem('readhubToken', newToken); // Save token to localStorage
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`; // Set for future requests
            
            await getProfile(newToken); // Fetch profile and go to dashboard
            clearError();
        } catch (err) {
            console.error("Login error:", err);
            // Use the clear error message from our backend
            setError(err.response?.data?.message || "Invalid email or password. Please try again.");
        }
    };

    // API: Handle Register
    const handleRegister = async (firstName, lastName, email, password) => {
        try {
            await api.post('/auth/register', { firstName, lastName, email, password });
            clearError();
            alert("Registration successful! Please log in."); // Give user feedback
            setPage('login'); // Send user to login page after successful registration
        } catch (err) {
            console.error("Registration error:", err);
            setError(err.response?.data || "Registration failed. Please try again.");
        }
    };

    // API: Handle Logout
    const handleLogout = () => {
        // Clear all user data from state and localStorage
        setToken(null);
        setUser(null);
        localStorage.removeItem('readhubToken');
        delete api.defaults.headers.common['Authorization'];
        setPage('login'); // Send user back to the login page
    };
    
    // API: Update Profile
    const handleUpdateProfile = async (firstName, lastName, email) => {
        try {
            const response = await api.put('/users/profile', { 
                userId: user.userId, // Send the user ID back
                firstName, 
                lastName, 
                email 
            });
            setUser(response.data); // Update local user state with new data
            clearError();
            // We use alert for simplicity, but a modal is better
            alert("Profile updated successfully!"); 
        } catch (err) {
            console.error("Update profile error:", err);
            setError(err.response?.data || "Failed to update profile.");
        }
    };
    
    // API: Delete Profile
    const handleDeleteProfile = async () => {
        try {
            await api.delete('/users/profile');
            alert("Account deleted successfully.");
            handleLogout(); // Log out after deleting the account
        } catch (err)
 {
            console.error("Delete profile error:", err);
            setError(err.response?.data || "Failed to delete account.");
        }
    };

    // --- Page Router Logic ---
    // This function decides which page component to show based on the 'page' state
    const renderPage = () => {
        // While loading the user's profile, show a loading screen
        if (token && !user) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <div className="text-2xl font-semibold">Loading...</div>
                </div>
            );
        }

        switch (page) {
            case 'login':
                return <LoginPage onLogin={handleLogin} setPage={setPage} error={error} clearError={clearError} />;
            case 'register':
                return <RegisterPage onRegister={handleRegister} setPage={setPage} error={error} clearError={clearError} />;
            case 'dashboard':
                return <DashboardPage user={user} onLogout={handleLogout} setPage={setPage} />;
            case 'profile':
                return <ProfilePage 
                            user={user} 
                            onUpdate={handleUpdateProfile} 
                            onDelete={handleDeleteProfile} 
                            setPage={setPage}
                            onLogout={handleLogout}
                            error={error}
                            clearError={clearError}
                        />;
            default:
                // Default to login page if state is unknown
                return <LoginPage onLogin={handleLogin} setPage={setPage} error={error} clearError={clearError} />;
        }
    };

    // The main app render
    return (
        <Fragment>
            {renderPage()}
        </Fragment>
    );
}

// Add the export default line
export default App;