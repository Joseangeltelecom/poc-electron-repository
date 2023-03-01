import React from "react";
import keycloak from "./keycloak";
function Login() {
  console.log(keycloak);
  return (
    <div>{keycloak && <button onClick={keycloak.login}>Login</button>}</div>
  );
}

export default Login;
