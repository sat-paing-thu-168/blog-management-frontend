export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const isAuthenticated = () => {
  return (
    !!localStorage.getItem("accessToken") && !!localStorage.getItem("user")
  );
};
