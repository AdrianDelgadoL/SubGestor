let user = localStorage.getItem("currentUser")
  ? JSON.parse(localStorage.getItem("currentUser"))
  : "";
let token = localStorage.getItem("token")
  ? JSON.parse(localStorage.getItem("token"))
  : null;

export const initialState = {
  user: "" || user,
  token: null || token,
  loading: false,
};

export const AuthReducer = (initialState, action) => {
  switch (action.type) {
    case "REQUEST_LOGIN":
      return {
        ...initialState,
        loading: true
      };
    case "LOGIN_SUCCESS":
      localStorage.setItem('currentUser', JSON.stringify(action.payload.user.email))
      localStorage.setItem('token', JSON.stringify(action.payload.token))
      return {
        ...initialState,
        user: action.payload.user.email,
        token: action.payload.token,
        loading: false
      };
    case "LOGOUT":
      localStorage.setItem('currentUser', null)
      return {
        ...initialState,
        user: "",
        token: null
      };
    case "AUTH_ERROR":
    case "LOGIN_ERROR":
      return {
        ...initialState,
        loading: false,
        user: "",
        token: null
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};