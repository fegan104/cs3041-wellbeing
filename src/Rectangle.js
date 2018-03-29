import { getBounds } from './util.js'

// a rectangle primtive that can be rendered to an AsciiCanvas
export default class Rectangle {
  constructor(svgRect) {
    this.svgRect = svgRect
    this.bounds = getBounds(svgRect)
    this.fill = svgRect.getAttribute('ascii-fill') || '#';
  }

  render(asciiCanvas) {
    for (let i = this.bounds.left; i < this.bounds.right - 1; i++) {
      for (let j = this.bounds.top; j < this.bounds.bottom - 1; j++) {
        asciiCanvas.setPixel(i, j, this.fill);
      }
    }
  }
}