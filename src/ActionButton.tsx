import useAppStore from "./useStore";

export function ActionButton() {
  const store = useAppStore();
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
    <button
      onClick={handleNewPick}
      disabled={store.isDetecting}
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
      {store.isDetecting
        ? "Detecting..."
        : store.isProcessed
        ? "Pick Another Image"
        : "Pick an Image"}
    </button>
  );
}
