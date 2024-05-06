import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DetectedObject } from "./types";

// Define the structure for individual stored images
interface Image {
    id: string;
    name: string;
    url: string;
}

// Define the shape of the state
interface AppState {
    isDetecting: boolean;
    setIsDetecting: (value: boolean) => void;

    isProcessed: boolean;
    setIsProcessed: (value: boolean) => void;

    result: DetectedObject[];
    setResult: (value: DetectedObject[]) => void;

    image: File | null;
    setImage: (value: File | null) => void;

    imageUrl: string | null;
    setImageUrl: (value: string | null) => void;

    imageAverageColor: string | null;
    setImageAverageColor: (value: string | null) => void;

    images: Image[];
    addImage: (image: Image) => void;
    removeImage: (id: string) => void;
}

// Create the store using Zustand with persist middleware
const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            isDetecting: false,
            setIsDetecting: (value) => set({ isDetecting: value }),

            isProcessed: false,
            setIsProcessed: (value) => set({ isProcessed: value }),

            result: [],
            setResult: (value: DetectedObject[]) => set({ result: value }),

            image: null,
            setImage: (value: File | null) => set({ image: value }),

            imageUrl: null,
            setImageUrl: (value: string | null) => set({ imageUrl: value }),

            imageAverageColor: null,
            setImageAverageColor: (value: string | null) => set({ imageAverageColor: value }),

            // Add image management state and logic
            images: [],
            addImage: (image: Image) =>
                set((state) => ({
                    images: [...state.images, image],
                })),
            removeImage: (id: string) =>
                set((state) => ({
                    images: state.images.filter((img) => img.id !== id),
                })),
        }),
        {
            name: "app-state-storage", // Key used in LocalStorage
        }
    )
);

export default useAppStore;
