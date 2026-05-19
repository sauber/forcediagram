import { createCanvas } from "canvas";

/** Canvas for drawing boxes, lines and text */
const width = 600;
const height = 600;
const data = new Uint8ClampedArray(width * height * 4);
const id = new ImageData(data, width, height);
const ib = await createImageBitmap(id);
console.log(ib);

// In this command line tool crete a canvas for drwing text and boxes on
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");
console.log(ctx);
