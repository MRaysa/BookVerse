// import { createContext } from "react";

// export const AuthContext = createContext(null);
import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  loading: true,
  createUser: () => {},
  signInUser: () => {},
  googleSignIn: () => {},
  signOutUser: () => {},
  updateUser: () => {},
});
