import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const dummyNotes = [
  {
    _id: "1",
    title: "React Basics",
    summary: "An introduction to React and its core concepts.",
    tags: ["react", "javascript", "frontend"],
  },
  {
    _id: "2",
    title: "State vs Props",
    summary: "Understanding the difference between state and props in React.",
    tags: ["react", "state", "props"],
  },
  {
    _id: "3",
    title: "Hooks in React",
    summary: "Learn about useState and useEffect hooks.",
    tags: ["hooks", "useState", "useEffect"],
  },
  {
    _id: "4",
    title: "React Basics",
    summary: "An introduction to React and its core concepts.",
    tags: ["react", "javascript", "frontend"],
  },
  {
    _id: "5",
    title: "State vs Props",
    summary: "Understanding the difference between state and props in React.",
    tags: ["react", "state", "props"],
  },
  {
    _id: "6",
    title: "Hooks in React",
    summary: "Learn about useState and useEffect hooks.",
    tags: ["hooks", "useState", "useEffect"],
  },
  {
    _id: "7",
    title: "React Basics",
    summary: "An introduction to React and its core concepts.",
    tags: ["react", "javascript", "frontend"],
  },
  {
    _id: "8",
    title: "State vs Props",
    summary: "Understanding the difference between state and props in React.",
    tags: ["react", "state", "props"],
  },
  {
    _id: "9",
    title: "Hooks in React",
    summary: "Learn about useState and useEffect hooks.",
    tags: ["hooks", "useState", "useEffect"],
  },
  // ... remaining notes with unique IDs
];

const dummyUser = {
  name: "John Doe",
  isFirstLogin: true,
};

const Dashboard = () => {
  const [allNotes, setAllNotes] = useState([]);
  const [displayedNotes, setDisplayedNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 6,
  });

  // Load all notes once on component mount
  useEffect(() => {
    // Simulate API call to get all notes
    setLoading(true);
    setTimeout(() => {
      // Ensure all notes have unique IDs
      const uniqueNotes = dummyNotes.map((note, index) => ({
        ...note,
        _id: String(index + 1),
      }));

      setAllNotes(uniqueNotes);

      // Calculate total pages based on notes count and items per page
      const totalPages = Math.ceil(
        uniqueNotes.length / pagination.itemsPerPage
      );
      setPagination((prev) => ({
        ...prev,
        totalPages,
      }));

      setLoading(false);
    }, 500);

    if (dummyUser.isFirstLogin) {
      setShowOnboarding(true);
    }
  }, []);

  // Update displayed notes whenever pagination changes or all notes change
  useEffect(() => {
    updateDisplayedNotes();
  }, [pagination.currentPage, allNotes, searchQuery]);

  // Function to update displayed notes based on current page and search
  const updateDisplayedNotes = () => {
    let filteredNotes = allNotes;

    // Apply search filter if needed
    if (searchQuery) {
      filteredNotes = allNotes.filter((note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Update total pages based on filtered results
    const totalPages = Math.max(
      1,
      Math.ceil(filteredNotes.length / pagination.itemsPerPage)
    );

    // Ensure current page is valid
    const validCurrentPage = Math.min(pagination.currentPage, totalPages);
    if (validCurrentPage !== pagination.currentPage) {
      setPagination((prev) => ({
        ...prev,
        currentPage: validCurrentPage,
      }));
      return; // This will trigger another useEffect call with the corrected page
    }

    // Calculate start and end indices for pagination
    const startIndex = (validCurrentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;

    // Set displayed notes to the current page's items
    setDisplayedNotes(filteredNotes.slice(startIndex, endIndex));

    // Update pagination info
    setPagination((prev) => ({
      ...prev,
      totalPages,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page when searching
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
    // The actual filtering happens in updateDisplayedNotes
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
      setAllNotes((prev) => prev.filter((note) => note._id !== id));
    }
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
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
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="flex-grow px-4 py-2 border rounded-l"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r"
          >
            Search
          </button>
        </form>
      </div>

      {/* Notes Grid */}
      {loading ? (
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
                {note.tags.map((tag, i) => (
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
          <p className="text-gray-600 mb-4">No notes found.</p>
          <Link
            to="/create-note"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Note
          </Link>
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
      {!loading && displayedNotes.length > 0 && (
        <div className="text-center text-gray-500 mt-4">
          Showing page {pagination.currentPage} of {pagination.totalPages}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
