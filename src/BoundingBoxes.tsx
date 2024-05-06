import useAppStore from "./useStore";
import {Flex, Text} from "@chakra-ui/react";

export function BoundingBoxes() {
  const store = useAppStore();

  return (
    <>
      {/* Overlay bounding boxes */}
      {store.result.map((obj, index) => (
        <Flex
          className="BoundingBox"
          key={index}
          position="absolute"
          border="2px solid red"
          backgroundColor="rgba(255, 0, 0, 0.3)"
          left={`${obj.boundingBox.x * 100}%`}
          top={`${obj.boundingBox.y * 100}%`}
          width={`${obj.boundingBox.width * 100}%`}
          height={`${obj.boundingBox.height * 100}%`}
          pointerEvents="none"
        >
          <Text
            className="BoundingBoxLabel"
            color="white"
            fontSize="11px"
            backgroundColor="rgba(0, 0, 0, 0.5)"
            padding="3px 5px"
            position="absolute"
            right={0}
            bottom={0}
            whiteSpace="nowrap"
          >
            {obj.label}
          </Text>
        </Flex>
      ))}
    </>
  );
}
