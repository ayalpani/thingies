// averageColor.ts

// This function returns a Promise that resolves to a string representing an RGB color
export async function getAverageColor(imageFile: File, downscaleFactor: number = 0.1): Promise<string> {
    // Create an HTML Image object
    const img = new Image();
    const imgURL = URL.createObjectURL(imageFile);
    img.src = imgURL;

    // Wait for the image to load
    await new Promise<void>((resolve) => {
        img.onload = () => resolve();
    });

    // Create a temporary canvas for downscaling
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Handle cases where `getContext` may return `null`
    if (!ctx) {
        throw new Error("Couldn't get a 2D drawing context from the canvas");
    }

    // Set the canvas size according to the downscale factor
    canvas.width = img.width * downscaleFactor;
    canvas.height = img.height * downscaleFactor;

    // Draw the image onto the canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Calculate the sum of RGB values
    const data = imgData.data;
    let rSum = 0, gSum = 0, bSum = 0;
    for (let i = 0; i < data.length; i += 4) {
        rSum += data[i];
        gSum += data[i + 1];
        bSum += data[i + 2];
    }

    // Calculate the average RGB values
    const pixelCount = data.length / 4;
    const rAvg = Math.round(rSum / pixelCount);
    const gAvg = Math.round(gSum / pixelCount);
    const bAvg = Math.round(bSum / pixelCount);

    // Clean up the object URL
    URL.revokeObjectURL(imgURL);

    // Return the average color as an RGB string
    return `rgb(${rAvg}, ${gAvg}, ${bAvg})`;
}
