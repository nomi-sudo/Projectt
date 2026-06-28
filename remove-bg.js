const { Jimp } = require("jimp");

async function removeBackground() {
  try {
    console.log("Loading image...");
    const image = await Jimp.read("public/mascot.png");
    
    console.log("Removing background...");
    const targetColor = { r: 255, g: 255, b: 255 }; // Assuming white background
    const threshold = 30; // Tolerance for off-white colors

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];

      // Check if pixel color is close to white
      if (
        Math.abs(red - targetColor.r) < threshold &&
        Math.abs(green - targetColor.g) < threshold &&
        Math.abs(blue - targetColor.b) < threshold
      ) {
        // Set alpha to 0 (transparent)
        this.bitmap.data[idx + 3] = 0;
      }
    });

    console.log("Saving new image...");
    await image.write("public/mascot-transparent.png");
    console.log("Done! Saved as mascot-transparent.png");
  } catch (err) {
    console.error("Error:", err);
  }
}

removeBackground();
