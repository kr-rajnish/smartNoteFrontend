import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { deleteNote, getNotes } from "../services/noteThunk";
import {
  checkFirstLoginStatus,
  updateFirstLoginStatus,
} from "../services/authThunk";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../services/noteSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { notes, isLoading, filters } = useSelector((state) => state.notes);
  const { isFirstLogin } = useSelector((state) => state.auth);
  const [displayedNotes, setDisplayedNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 6,
  });

  // Initialize searchQuery from Redux state on component mount
  useEffect(() => {
    if (filters.search) {
      setSearchQuery(filters.search);
    }
  }, []);

  // Check for first login status
  useEffect(() => {
    dispatch(checkFirstLoginStatus());
  }, [dispatch]);

  // Set onboarding modal based on isFirstLogin status
  useEffect(() => {
    if (isFirstLogin) {
      setShowOnboarding(true);
    }
  }, [isFirstLogin]);

  // Load notes with search params on component mount and whenever search changes
  useEffect(() => {
    fetchNotes();
  }, [dispatch, filters]);

  // Fetch notes from API with search parameters
  const fetchNotes = async () => {
    try {
      // Log the search parameters for debugging
      console.log("Fetching notes with params:", {
        search: filters.search,
        tag: filters.tag,
      });

      await dispatch(
        getNotes({
          search: filters.search,
          tag: filters.tag,
        })
      );
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId = null;
      return (query) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        // If query is empty, search after 1 second
        if (!query) {
          timeoutId = setTimeout(() => {
            dispatch(
              setFilters({
                ...filters,
                search: query,
              })
            );
            setPagination((prev) => ({
              ...prev,
              currentPage: 1,
            }));
          }, 1000);
        } else {
          // If query has content, search after 2 seconds
          timeoutId = setTimeout(() => {
            dispatch(
              setFilters({
                ...filters,
                search: query,
              })
            );
            setPagination((prev) => ({
              ...prev,
              currentPage: 1,
            }));
          }, 2000);
        }
      };
    })(),
    [filters, dispatch]
  );

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Manual search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Manual search initiated:", searchQuery);

    // Update the filters in Redux store immediately
    dispatch(
      setFilters({
        ...filters,
        search: searchQuery,
      })
    );

    // Reset to first page when searching
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  // Update displayed notes and pagination whenever notes change
  useEffect(() => {
    // Calculate total pages based on notes count and items per page
    const totalPages = Math.ceil(notes.length / pagination.itemsPerPage);

    // Ensure current page is valid
    const validCurrentPage = Math.min(
      pagination.currentPage,
      Math.max(1, totalPages)
    );

    // Calculate start and end indices for pagination
    const startIndex = (validCurrentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;

    // Set displayed notes to the current page's items
    setDisplayedNotes(notes.slice(startIndex, endIndex));

    // Update pagination info
    setPagination((prev) => ({
      ...prev,
      currentPage: validCurrentPage,
      totalPages: Math.max(1, totalPages),
    }));
  }, [notes, pagination.currentPage, pagination.itemsPerPage]);

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    dispatch(
      setFilters({
        ...filters,
        search: "",
      })
    );
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
    // Scroll to top of the notes section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteNote = (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      dispatch(deleteNote(id))
        .unwrap()
        .then(() => {
          console.log("Note deleted successfully");
          alert("Note deleted");
          // Refresh notes list after deletion
          fetchNotes();
        })
        .catch((error) => {
          console.error("Failed to delete note:", error);
          alert("Note not deleted");
        });
    }
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    // Update the first login status in the database
    dispatch(updateFirstLoginStatus());
  };

  // Generate array of page numbers for pagination UI
  const pageNumbers = Array.from(
    { length: pagination.totalPages },
    (_, i) => i + 1
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {showOnboarding && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Welcome to Smart Notes!</h2>
            <p className="mb-4">
              Let's get started by creating your first note:
            </p>
            <ol className="list-decimal pl-5 mb-6 space-y-2">
              <li>Click on "Create Note"</li>
              <li>Add title and content</li>
              <li>Summary and tags will be suggested</li>
              <li>Save to see it here</li>
            </ol>
            <div className="flex justify-between">
              <Link
                to="/create-note"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleCloseOnboarding}
              >
                Create First Note
              </Link>
              <button
                onClick={handleCloseOnboarding}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Your Notes</h1>

      {/* Search */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Search notes by title, content or summary..."
            className="flex-grow px-4 py-2 border rounded-l"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r"
          >
            Search
          </button>
        </form>
        {isLoading && (
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-blue-600 rounded-full mr-2"></div>
            Searching...
          </div>
        )}
        {filters.search && !isLoading && (
          <div className="mt-2 text-sm text-gray-600 flex justify-between">
            <span>Showing results for: "{filters.search}"</span>
            <button
              onClick={handleClearSearch}
              className="text-blue-600 hover:text-blue-800"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Notes Grid */}
      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : displayedNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedNotes.map((note) => (
            <div key={note._id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold text-blue-800">
                  {note.title}
                </h2>
                <div className="flex space-x-2">
                  <Link
                    to={`/edit-note/${note._id}`}
                    className="text-gray-500 hover:text-blue-600"
                  >
                    ✏️
                  </Link>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 italic mt-2">
                {note.summary}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {note.tags &&
                  note.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
              <div className="mt-4 text-right">
                <Link
                  to={`/note/${note._id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View full note →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">
            {filters.search
              ? `No notes found matching "${filters.search}".`
              : "No notes found."}
          </p>
          <div className="flex justify-center space-x-4">
            {filters.search && (
              <button
                onClick={handleClearSearch}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Clear Search
              </button>
            )}
            <Link
              to="/create-note"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Note
            </Link>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          {/* Previous page button */}
          <button
            onClick={() =>
              handlePageChange(Math.max(1, pagination.currentPage - 1))
            }
            disabled={pagination.currentPage === 1}
            className={`px-3 py-1 mx-1 rounded ${
              pagination.currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            &laquo;
          </button>

          {/* Page numbers */}
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 mx-1 rounded ${
                pagination.currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next page button */}
          <button
            onClick={() =>
              handlePageChange(
                Math.min(pagination.totalPages, pagination.currentPage + 1)
              )
            }
            disabled={pagination.currentPage === pagination.totalPages}
            className={`px-3 py-1 mx-1 rounded ${
              pagination.currentPage === pagination.totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            &raquo;
          </button>
        </div>
      )}

      {/* Page info */}
      {!isLoading && displayedNotes.length > 0 && (
        <div className="text-center text-gray-500 mt-4">
          Showing page {pagination.currentPage} of {pagination.totalPages}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
