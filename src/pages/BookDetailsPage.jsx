import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "../api";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import BorrowModal from "../components/BorrowModal";

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`/api/books/${id}`);
        setBook(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch book details");
        console.error("Error fetching book:", error);
        navigate("/all-books");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, navigate]);

  const handleBorrow = async (returnDate) => {
    try {
      await axios.post("/api/borrow", {
        bookId: id,
        returnDate,
      });
      toast.success("Book borrowed successfully!");
      // Refresh book data
      const response = await axios.get(`/api/books/${id}`);
      setBook(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to borrow book");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading book details...</div>;
  }

  if (!book) {
    return <div className="text-center py-8">Book not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 p-6">
            <img
              src={book.image || "/default-book-cover.jpg"}
              alt={book.name}
              className="w-full h-auto rounded-md"
            />
          </div>
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold mb-2">{book.name}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

            <div className="flex items-center mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mr-3">
                {book.category}
              </span>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span>{book.rating || "Not rated"}</span>
              </div>
            </div>

            <p className="text-gray-700 mb-6">{book.description}</p>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">
                  Available:{" "}
                  <span className="text-blue-600">{book.quantity}</span>
                </p>
              </div>

              {currentUser && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={book.quantity <= 0}
                  className={`px-4 py-2 rounded-md ${
                    book.quantity > 0
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {book.quantity > 0 ? "Borrow Book" : "Out of Stock"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <BorrowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleBorrow}
        user={currentUser}
      />
    </div>
  );
};

export default BookDetailsPage;
