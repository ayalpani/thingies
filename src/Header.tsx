import {Flex} from "@chakra-ui/react";
import {constants} from "./constants";
import netlifyIdentity from "netlify-identity-widget";

export function Header() {
  const user = netlifyIdentity.currentUser();

  return (
    <Flex
      alignItems="center"
      backgroundColor="#000"
      color="white"
      height={`${constants.headerHeight}px`}
      minHeight="60px"
      paddingLeft="20px"
      fontWeight="bold"
    >
      thingies. (
      {user?.email || <span onClick={() => netlifyIdentity.open()}>Login</span>}
      )
    </Flex>
  );
}
