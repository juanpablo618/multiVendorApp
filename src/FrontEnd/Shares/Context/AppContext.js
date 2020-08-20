import { createContext } from "react";

export const AppContext = createContext({
  isLoggedIn: false,
  loggedInUser: null,
  token: null,
  role: null,
  image: null,
  logIn: () => {},
  logOut: () => {}
});
