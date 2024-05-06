import {Flex} from "@chakra-ui/react";
import {constants} from "./constants";

export function Header() {
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
      thingies.
    </Flex>
  );
}
