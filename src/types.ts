
export interface DetectedObject {
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