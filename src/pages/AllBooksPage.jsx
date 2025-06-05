import React, { useState, useEffect, use } from "react";
import { useNavigate } from "react-router";
import axios from "../api/api";
import BookCard from "../components/BookCard";
import BookTable from "../components/BookTable";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";

const AllBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'table'
  const [showAvailable, setShowAvailable] = useState(false);
  const { user } = use(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          `/api/books?available=${showAvailable}`
        );
        setBooks(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch books");
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [showAvailable]);

  const handleUpdate = (bookId) => {
    navigate(`/update-book/${bookId}`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading books...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Books</h1>

        <div className="flex space-x-4">
          <button
            onClick={() => setShowAvailable(!showAvailable)}
            className={`px-4 py-2 rounded-md ${
              showAvailable
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {showAvailable ? "Show All" : "Show Available"}
          </button>

          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="card">Card View</option>
            <option value="table">Table View</option>
          </select>
        </div>
      </div>

      {viewMode === "card" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onUpdate={user ? () => handleUpdate(book._id) : null}
            />
          ))}
        </div>
      ) : (
        <BookTable books={books} onUpdate={user ? handleUpdate : null} />
      )}
    </div>
  );
};

export default AllBooksPage;
