import {ChangeEvent, DragEvent} from "react";
import {Flex, Image, Text, Input} from "@chakra-ui/react";
import useAppStore from "./useStore";
import {ActionButton} from "./ActionButton";
import {BoundingBoxes} from "./BoundingBoxes";
import {BackgroundImage} from "./BackgroundImage";
import {constants} from "./constants";
import {getAverageColor} from "./lib/getAverageColor";

export function DropZone() {
  const store = useAppStore();

  const detectObjects = async (file: File | null = store.image) => {
    if (file) {
      store.setIsDetecting(true);

      try {
        const response = await fetch("/.netlify/functions/detect", {
          method: "POST",
          body: file,
          headers: {
            "Content-Type": file.type, // Use the MIME type of the file as the Content-Type
          },
        });

        if (response.ok) {
          const data = await response.json();
          store.setResult(data.objects);
          store.setIsProcessed(true); // Mark as processed after successful detection
          console.log("Detection Results:", data.objects); // For debugging
        } else {
          console.error("Failed to get a successful response.");
        }
      } catch (error) {
        console.error("Error during detection:", error);
      } finally {
        store.setIsDetecting(false);
      }
    } else {
      console.log("No image selected.");
    }
  };

  const resetAndDetect = (file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    getAverageColor(file).then((color) => {
      store.setImageAverageColor(color);
    });

    store.setResult([]);
    store.setImage(file);
    store.setImageUrl(URL.createObjectURL(file));
    store.setIsProcessed(false); // Reset the processed state
    detectObjects(file); // Automatically start detection
  };

  const handleImagePick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) resetAndDetect(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) resetAndDetect(file);
  };

  return (
    <Flex
      className="DropZone"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      flex={1}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bg="#ddd"
      position="relative"
    >
      <BackgroundImage />

      <Input
        id="file-pick"
        type="file"
        accept="image/*"
        onChange={handleImagePick}
        display="none"
      />
      {store.imageUrl ? (
        <Flex
          position="relative"
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
          overflow="hidden" // Prevent overflow issues
        >
          {/* Container for Image */}
          <Flex
            position="relative"
            maxWidth="100%"
            maxHeight="100%"
            width="auto"
            height="auto"
          >
            <Image
              src={store.imageUrl}
              alt="Picked"
              maxWidth="100%"
              maxHeight={`calc(100vh - ${constants.headerHeight}px)`}
              objectFit="contain" // Maintain aspect ratio
              outline="1px solid rgba(0,0,0,0.5)"
            />
            <BoundingBoxes />
          </Flex>
        </Flex>
      ) : (
        !store.isDetecting && (
          <Text fontSize={20} margin="40px">
            Drop an image here or pick an image
          </Text>
        )
      )}

      <ActionButton />
    </Flex>
  );
}
