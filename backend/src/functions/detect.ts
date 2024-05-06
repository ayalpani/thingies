import { Handler } from '@netlify/functions';
import { ImageAnnotatorClient, protos } from '@google-cloud/vision';

// Load credentials from the environment variable
const rawCredentials = process.env.GOOGLE_CREDENTIALS!;
const credentials = JSON.parse(rawCredentials);

// Initialize the Vision API client with your credentials
const client = new ImageAnnotatorClient({
    credentials: {
        private_key: credentials.private_key,
        client_email: credentials.client_email,
    },
    projectId: credentials.project_id,
});

// Type guard to ensure `objectLocalization` method is available
function isObjectLocalizationAvailable(client: ImageAnnotatorClient): client is ImageAnnotatorClient & {
    objectLocalization: (request: protos.google.cloud.vision.v1.IAnnotateImageRequest) => Promise<[protos.google.cloud.vision.v1.IAnnotateImageResponse]>;
} {
    return typeof client.objectLocalization === 'function';
}

const handler: Handler = async (event) => {
    try {
        // Check if an image is uploaded in the event body
        if (!event.body || !event.isBase64Encoded) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "No image uploaded or data is not base64 encoded." }),
            };
        }

        // Ensure `objectLocalization` method is available on the client
        if (!isObjectLocalizationAvailable(client)) {
            throw new Error('Object localization method is not available.');
        }

        const [result] = await client.objectLocalization({
            image: { content: event.body },
        });

        const annotations = result.localizedObjectAnnotations || [];
        const detectedObjects = annotations.map((annotation: protos.google.cloud.vision.v1.ILocalizedObjectAnnotation) => {
            const vertices = annotation.boundingPoly?.normalizedVertices || [];
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

        // Return the detected objects as JSON
        return {
            statusCode: 200,
            body: JSON.stringify({ objects: detectedObjects }),
        };
    } catch (error) {
        console.error("Error in object detection:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Object detection failed', message: (error as Error).message }),
        };
    }
};

export { handler };
