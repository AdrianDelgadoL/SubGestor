let user = localStorage.getItem("currentUser")
  ? JSON.parse(localStorage.getItem("currentUser"))
  : "";
let token = localStorage.getItem("token")
  ? JSON.parse(localStorage.getItem("token"))
  : null;
let prefered_currency = localStorage.getItem("prefered_currency")
  ? JSON.parse(localStorage.getItem("prefered_currency"))
  : null;
let frequency = localStorage.getItem("frequency")
  ? JSON.parse(localStorage.getItem("frequency"))
  : null;

export const initialState = {
  user: "" || user,
  prefered_currency: "" || prefered_currency,
  frequency: "" || frequency,
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
      localStorage.setItem('prefered_currency', JSON.stringify(action.payload.user.prefered_currency))
      localStorage.setItem('frequency', JSON.stringify(action.payload.user.frequency))
      localStorage.setItem('token', JSON.stringify(action.payload.token))
      return {
        ...initialState,
        user: action.payload.user.email,
        token: action.payload.token,
        loading: false
      };
    case "LOGOUT":
      localStorage.setItem('currentUser', null)
      localStorage.setItem('prefered_currency', null)
      localStorage.setItem('frequency', null)
      localStorage.setItem('token', null)
      return {
        ...initialState,
        user: "",
        token: null
      };
    case "AUTH_ERROR":
    case "LOGIN_ERROR":
      localStorage.setItem('currentUser', null)
      localStorage.setItem('token', null)
      localStorage.setItem('prefered_currency', null)
      localStorage.setItem('frequency', null)
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