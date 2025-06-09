import { createBrowserRouter } from "react-router";
import Root from "../pages/Root";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import AllBooksPage from "../pages/AllBooksPage";
import AddBookPage from "../pages/AddBookPage";
import BorrowedPage from "../pages/BorrowedPage";
import PrivateRoute from "./PrivateRoute";
import BookDetailsPage from "../pages/BookDetailsPage";
import BooksPage from "../pages/BooksPage";
import BooksCategory from "../components/Home/BooksCategory";
import BookDetails from "../components/BookDetails";
import UpdateBook from "../components/Home/UpdateBook";
import MyAllBooks from "../components/MyAllBooks";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "/signin",
        Component: SignIn,
      },
      {
        path: "/signup",
        Component: SignUp,
      },
      {
        path: "/all-books",
        element: (
          <PrivateRoute>
            <AllBooksPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/add-book",
        element: (
          <PrivateRoute>
            <AddBookPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/borrowed-books",
        element: (
          <PrivateRoute>
            <BorrowedPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/books/:id",
        element: (
          <PrivateRoute>
            <BookDetailsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/books-category/:id",
        element: (
          <PrivateRoute>
            <BooksCategory />
          </PrivateRoute>
        ),
      },
      {
        path: "/book-details/:id",
        element: (
          <PrivateRoute>
            <BookDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/update-book/:id",
        element: (
          <PrivateRoute>
            <UpdateBook />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-all-books",
        element: (
          <PrivateRoute>
            <MyAllBooks />
          </PrivateRoute>
        ),
      },
      {
        path: "/books",
        Component: BooksPage,
      },
    ],
  },
]);

export default router;
