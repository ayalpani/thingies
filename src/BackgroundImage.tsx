import {Flex, Image} from "@chakra-ui/react";
import useAppStore from "./useStore";

export function BackgroundImage() {
  const store = useAppStore();
  if (!store.imageUrl) {
    return null;
  }

  return (
    <Flex
      position="absolute"
      inset={0}
      backgroundColor={`linear-gradient(white, ${
        store.imageAverageColor || "transparent"
      })`}
    >
      <Image
        src={store.imageUrl}
        alt="Picked"
        objectFit="cover"
        filter="blur(5px) opacity(0.3) grayscale(0.5)"
        width="100%"
        height="100%"
        position="absolute"
        top={0}
        left={0}
      />
    </Flex>
  );
}
