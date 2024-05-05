import React, {useState, ChangeEvent, DragEvent, CSSProperties} from "react";
import "./App.css";

interface DetectedObject {
  label: string;
  coordinates: {
    x: number;
    y: number;
  };
  boundingBox: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
}

const App: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [detecting, setDetecting] = useState<boolean>(false);
  const [processed, setProcessed] = useState<boolean>(false);
  const [result, setResult] = useState<DetectedObject[]>([]);

  const handleImagePick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setResult([]);
      const file = event.target.files[0];
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
      setProcessed(false); // Reset the processed state
      console.log("Selected File:", file); // For debugging
      detectObjects(file); // Automatically start detection
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setResult([]);
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
      setProcessed(false); // Reset the processed state
      detectObjects(file); // Automatically start detection
    }
  };

  const detectObjects = async (file: File | null = image) => {
    if (file) {
      setDetecting(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://localhost:5000/api/detect", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setResult(data.objects);
          setProcessed(true); // Mark as processed after successful detection
          console.log("Detection Results:", data.objects); // For debugging
        } else {
          console.error("Failed to get a successful response.");
        }
      } catch (error) {
        console.error("Error during detection:", error);
      } finally {
        setDetecting(false);
      }
    } else {
      console.log("No image selected.");
    }
  };

  const calculateBoundingBoxStyle = (obj: DetectedObject): CSSProperties => {
    return {
      position: "absolute",
      border: "2px solid red",
      backgroundColor: "rgba(255, 0, 0, 0.3)",
      left: `${obj.boundingBox.x * 100}%`,
      top: `${obj.boundingBox.y * 100}%`,
      width: `${obj.boundingBox.width * 100}%`,
      height: `${obj.boundingBox.height * 100}%`,
      pointerEvents: "none",
    };
  };

  const handleNewPick = () => {
    // Click the hidden input for immediate re-pick
    const inputElement = document.getElementById(
      "file-pick"
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.click();
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#000",
          color: "white",
          height: "60px",
          minHeight: "60px",
          paddingLeft: "20px",
          fontWeight: "bold",
        }}
      >
        Thingies
      </header>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ddd",
          position: "relative",
        }}
      >
        {imageUrl && (
          <div style={{position: "absolute", inset: 0}}>
            <img
              src={imageUrl}
              alt="Picked"
              style={{
                objectFit: "cover",
                filter: "blur(5px) opacity(0.3)",
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
          </div>
        )}

        <input
          id="file-pick"
          type="file"
          accept="image/*"
          onChange={handleImagePick}
          style={{display: "none"}}
        />
        {imageUrl ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden", // Prevent overflow issues
            }}
          >
            {/* Container for Image */}
            <div
              style={{
                position: "relative",
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
              }}
            >
              <img
                src={imageUrl}
                alt="Picked"
                style={{
                  maxWidth: "100%",
                  maxHeight: "calc(100vh - 60px)",
                  objectFit: "contain", // Maintain aspect ratio
                  outline: "1px solid rgba(0,0,0,0.2)",
                }}
              />
              {/* Overlay bounding boxes */}
              {result.map((obj, index) => (
                <div key={index} style={calculateBoundingBoxStyle(obj)}>
                  <span
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      padding: "2px 4px",
                    }}
                  >
                    {obj.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          !detecting && (
            <p>Drop an image or click the button below to pick an image.</p>
          )
        )}

        {/* Floating Buttons Logic */}
        <button
          onClick={handleNewPick}
          disabled={detecting}
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            zIndex: 1000, // Ensure it's above other content
          }}
        >
          {detecting
            ? "Detecting..."
            : processed
            ? "Pick Another Image"
            : "Pick an Image"}
        </button>
      </div>
    </div>
  );
};

export default App;
