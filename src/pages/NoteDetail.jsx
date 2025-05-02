import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

// Dummy data to replace API calls
const dummyNotes = [
  {
    _id: "1",
    title: "React Basics",
    summary: "An introduction to React and its core concepts.",
    content:
      "<p>React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and manage state efficiently.</p><p>Key concepts include:</p><ul><li>Components</li><li>Props</li><li>State</li><li>Lifecycle methods</li></ul>",
    tags: ["react", "javascript", "frontend"],
    createdAt: "2025-01-15T14:22:00Z",
    updatedAt: "2025-01-15T14:22:00Z",
  },
  {
    _id: "2",
    title: "State vs Props",
    summary: "Understanding the difference between state and props in React.",
    content:
      "<p>In React, both <strong>props</strong> and <strong>state</strong> hold information that influences rendering, but they serve different purposes:</p><p><strong>Props:</strong> Pass data from parent to child components. They are immutable from the child component's perspective.</p><p><strong>State:</strong> Managed within a component and can change over time. When state updates, the component re-renders.</p>",
    tags: ["react", "state", "props"],
    createdAt: "2025-02-03T10:15:00Z",
    updatedAt: "2025-02-05T16:30:00Z",
  },
  {
    _id: "3",
    title: "Hooks in React",
    summary: "Learn about useState and useEffect hooks.",
    content:
      "<p>Hooks are functions that let you use React features from functional components.</p><h3>useState</h3><p>Allows functional components to have state:</p><pre><code>const [count, setCount] = useState(0);</code></pre><h3>useEffect</h3><p>Handles side effects in functional components:</p><pre><code>useEffect(() => {<br>  document.title = `Count: ${count}`;<br>}, [count]);</code></pre>",
    tags: ["hooks", "useState", "useEffect"],
    createdAt: "2025-03-10T09:45:00Z",
    updatedAt: "2025-03-10T09:45:00Z",
  },
];

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State to manage the current note and loading status
  const [currentNote, setCurrentNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate API call to fetch a specific note
  useEffect(() => {
    // Simulate network delay
    const timer = setTimeout(() => {
      const foundNote = dummyNotes.find((note) => note._id === id);

      if (foundNote) {
        setCurrentNote(foundNote);
        setLoading(false);
      } else {
        setError("Note not found. It may have been deleted or moved.");
        setLoading(false);
      }
    }, 800); // Simulate loading delay

    return () => clearTimeout(timer);
  }, [id]);

  // Handle note deletion
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      console.log("Delete note with ID:", id);
      // In a real app, this would be an API call

      // Simulate successful deletion
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // If no note is found
  if (!currentNote) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-blue-800">
              {currentNote.title}
            </h1>
            <div className="flex space-x-2">
              <Link
                to={`/edit-note/${currentNote._id}`}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Summary
            </h2>
            <p className="text-gray-600 italic">{currentNote.summary}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Content
            </h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: currentNote.content }}
            />
          </div>

          {currentNote.tags.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {currentNote.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 border-t pt-4">
            <p className="text-sm text-gray-500">
              Created: {new Date(currentNote.createdAt).toLocaleString()}
              {currentNote.updatedAt !== currentNote.createdAt && (
                <span>
                  {" "}
                  | Updated: {new Date(currentNote.updatedAt).toLocaleString()}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NoteDetail;
