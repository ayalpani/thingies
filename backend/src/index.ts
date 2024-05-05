// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

import express, { Request, Response } from "express";
import multer from "multer";
import cors from "cors";
import { ImageAnnotatorClient, protos } from "@google-cloud/vision";

// Initialize Express app
const app = express();
app.use(cors());

// Configure file upload with Multer
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Google Cloud Vision client
const client = new ImageAnnotatorClient();

// Type for detected objects
interface DetectedObject {
    label: string;
    coordinates: {
        x: number;
        y: number;
    };
    boundingBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

// API endpoint for object detection
app.post("/api/detect", upload.single("file"), async (req: Request, res: Response) => {
    const image = req.file;

    console.log("Request received at /api/detect");
    if (!image) {
        console.log("No file found in the request.");
        return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Processing file:", image.originalname);


    try {
        // Ensure the objectLocalization method is available and perform object detection
        if (typeof client.objectLocalization === "function") {
            const [result] = await client.objectLocalization({
                image: { content: image.buffer.toString("base64") },
            });

            const annotations = result.localizedObjectAnnotations || [];
            const detectedObjects: DetectedObject[] = annotations.map((annotation: protos.google.cloud.vision.v1.ILocalizedObjectAnnotation) => {
                const vertices = annotation.boundingPoly?.normalizedVertices || [];

                // Calculate bounding box coordinates
                const xCoords = vertices.map(v => v.x || 0);
                const yCoords = vertices.map(v => v.y || 0);

                const minX = Math.min(...xCoords);
                const maxX = Math.max(...xCoords);
                const minY = Math.min(...yCoords);
                const maxY = Math.max(...yCoords);

                return {
                    label: annotation.name || "Unknown",
                    coordinates: {
                        x: minX,
                        y: minY,
                    },
                    boundingBox: {
                        x: minX,
                        y: minY,
                        width: maxX - minX,
                        height: maxY - minY,
                    },
                };
            });

            res.json({ objects: detectedObjects });
        } else {
            throw new Error("Object localization method is not available.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Object detection failed", message: (error as Error).message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
