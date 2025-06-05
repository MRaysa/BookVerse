import React, { useState, useEffect, use } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "../api/api";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

const BorrowedPage = () => {
  const { user } = use(AuthContext);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await axios.get("/api/borrowed", {
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
        });
        setBorrowedBooks(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch borrowed books");
        console.error("Error fetching borrowed books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, [user]);

  const handleReturn = async (borrowId) => {
    try {
      setReturningId(borrowId);
      await axios.post(`/api/return/${borrowId}`, null, {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      });

      // Update local state
      setBorrowedBooks((prev) => prev.filter((book) => book._id !== borrowId));
      toast.success("Book returned successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to return book");
      console.error("Error returning book:", error);
    } finally {
      setReturningId(null);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Borrowed Books</h1>
        <p className="text-gray-600">
          Please log in to view your borrowed books.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Borrowed Books</h1>
        <p>Loading your borrowed books...</p>
      </div>
    );
  }

  return (
    <div className=" max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Borrowed Books</h1>

      {borrowedBooks.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600">You haven't borrowed any books yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {borrowedBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4"
            >
              <div className="w-full md:w-1/6">
                <img
                  src={book.bookDetails.image || "/default-book-cover.jpg"}
                  alt={book.bookDetails.name}
                  className="w-full h-auto rounded-md"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold">
                  {book.bookDetails.name}
                </h2>
                <p className="text-gray-600">by {book.bookDetails.author}</p>

                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Borrowed Date</p>
                    <p>{format(new Date(book.borrowedDate), "MMM dd, yyyy")}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p
                      className={
                        new Date(book.returnDate) < new Date()
                          ? "text-red-600"
                          : ""
                      }
                    >
                      {format(new Date(book.returnDate), "MMM dd, yyyy")}
                      {new Date(book.returnDate) < new Date() && (
                        <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          Overdue
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end md:justify-start">
                <button
                  onClick={() => handleReturn(book._id)}
                  disabled={returningId === book._id}
                  className={`px-4 py-2 rounded-md ${
                    returningId === book._id
                      ? "bg-gray-300 text-gray-600"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {returningId === book._id ? "Returning..." : "Return Book"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BorrowedPage;
