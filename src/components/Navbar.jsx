import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../services/authThunk";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = Boolean(token);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-primary-700  shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Smart Notes</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-600"
                >
                  Dashboard
                </Link>
                <Link
                  to="/create-note"
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-600"
                >
                  Create Note
                </Link>
                <div className="ml-4 relative">
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-600"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="bg-primary-600 inline-flex items-center justify-center p-2 rounded-md hover:bg-primary-500 focus:outline-none"
            >
              <svg
                className={`h-6 w-6 ${isMenuOpen ? "hidden" : "block"}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`h-6 w-6 ${isMenuOpen ? "block" : "hidden"}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:hidden bg-primary-600`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-500"
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
              <Link
                to="/create-note"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-500"
                onClick={toggleMenu}
              >
                Create Note
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-primary-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-500"
                onClick={toggleMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-500"
                onClick={toggleMenu}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
