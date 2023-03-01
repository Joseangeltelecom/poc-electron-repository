import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080/auth",
  realm: "realm",
  clientId: "web-client",
});

export default keycloak;
