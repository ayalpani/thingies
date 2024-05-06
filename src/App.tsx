import {Flex} from "@chakra-ui/react";
import {Header} from "./Header";
import "./App.css";
import {DropZone} from "./DropZone";
import netlifyIdentity from "netlify-identity-widget";
import {useEffect} from "react";

netlifyIdentity.init();
window.netlifyIdentity = netlifyIdentity;

export function App() {
  const user = netlifyIdentity.currentUser();
  // console.log({user});

  useEffect(() => {
    netlifyIdentity.on("login", (user) => {
      console.log("Logged in", user);
      // console.log(user);
      netlifyIdentity.close();
    });

    netlifyIdentity.on("logout", () => {
      console.log("Logged out");
    });
  }, []);

  return (
    <Flex flex={1} flexDirection="column">
      {user !== null && (
        <Flex onClick={() => netlifyIdentity.logout()}>Logout</Flex>
      )}
      <Header />
      <DropZone />
    </Flex>
  );
}
