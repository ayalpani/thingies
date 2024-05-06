import {Flex} from "@chakra-ui/react";
import {Header} from "./Header";
import "./App.css";
import {DropZone} from "./DropZone";

export function App() {
  return (
    <Flex flex={1} flexDirection="column">
      <Header />
      <DropZone />
    </Flex>
  );
}
