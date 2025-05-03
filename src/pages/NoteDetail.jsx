import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { deleteNote } from "../services/noteThunk";

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allNotes = useSelector((state) => state.notes?.notes);

  const [currentNote, setCurrentNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundNote = allNotes.find((note) => note._id === id);

      if (foundNote) {
        setCurrentNote(foundNote);
        setLoading(false);
      } else {
        setError("Note not found. It may have been deleted or moved.");
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      console.log("Delete note with ID:", id);

      dispatch(deleteNote(id))
        .unwrap()
        .then(() => {
          console.log("Note deleted successfully");

          setLoading(false);
          navigate("/dashboard");
        })
        .catch((error) => {
          console.error("Failed to delete note:", error);
          setLoading(false);
          alert("Note not deleted");
        });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
