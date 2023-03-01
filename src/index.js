import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./render/App";
import keycloak from "./render/keycloak";

const root = ReactDOM.createRoot(document.getElementById("root"));
keycloak
  .init({
    onLoad: "login-required",
    checkLoginIframe: false,
    redirectUri: "http://localhost:3000",
  })
  .then((authenticated) => {
    // setAuthenticated(authenticated);
    console.log(
      authenticated ? "User is authenticated!" : "User is not authenticated!"
    );
    root.render(
      <React.StrictMode>
        <App authenticated={authenticated} />
        {/* <App /> */}
      </React.StrictMode>
    );
    // You can do other things here, such as render your React app
  })
  .catch((err) => {
    console.error(err);
  });
