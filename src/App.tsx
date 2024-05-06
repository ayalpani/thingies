import {Flex} from "@chakra-ui/react";
import {Header} from "./Header";
import "./App.css";
import {DropZone} from "./DropZone";
import netlifyIdentity from "netlify-identity-widget";

netlifyIdentity.init();
window.netlifyIdentity = netlifyIdentity;

netlifyIdentity.on("login", (user) => {
  console.log(user);
  netlifyIdentity.close();
});

export function App() {
  const user = netlifyIdentity.currentUser();
  console.log({user});

  return (
    <Flex flex={1} flexDirection="column">
      {/* <div data-netlify-identity-menu></div> */}

      {user !== null && (
        <Flex onClick={() => netlifyIdentity.logout()}>Logout</Flex>
      )}
      <Header />
      <DropZone />
    </Flex>
  );
}
