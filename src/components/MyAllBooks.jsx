import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import Rating from "./Rating";
import { AuthContext } from "../contexts/AuthContext";

const MyAllBooks = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchMyBooks = async () => {
      try {
        const token = await user.getIdToken();
        const response = await axios.get("http://localhost:3000/api/my-books", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to load books");
        }

        const booksData = response.data.data || [];
        if (!Array.isArray(booksData)) {
          throw new Error("Invalid data format received from server");
        }

        setBooks(booksData);
        setError(null);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to load books"
        );

        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, [user, navigate]);

  const handleDelete = async (bookId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const token = await user.getIdToken();
      await axios.delete(`http://localhost:3000/api/books/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
      Swal.fire("Deleted!", "Your book has been deleted.", "success");
    } catch (err) {
      console.error("Error deleting book:", err);
      Swal.fire(
        "Error!",
        err.response?.data?.message || "Failed to delete book",
        "error"
      );

      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Books</h1>
        <Link
          to="/add-book"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Book
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h2 className="text-xl font-semibold mb-2">No Books Found</h2>
          <p className="text-gray-600 mb-4">You haven't added any books yet.</p>
          <Link
            to="/add-book"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Your First Book
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cover
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/book-details/${book._id}`}>
                      <img
                        src={book.image || "/default-book-cover.jpg"}
                        alt={book.name}
                        className="w-12 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.src = "/default-book-cover.jpg";
                        }}
                      />
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/book-details/${book._id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {book.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{book.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {book.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Rating value={book.rating} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        book.quantity > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {book.quantity} {book.quantity === 1 ? "copy" : "copies"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/update-book/${book._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyAllBooks;
