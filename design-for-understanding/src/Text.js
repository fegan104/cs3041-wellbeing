import { getBounds } from './util.js'

// a text primtive that can be rendered to an AsciiCanvas
export default class Text {
  constructor(svgText) {
    this.svgText = svgText
    this.bounds = getBounds(svgText);
    this.text = svgText.textContent;
  }

  render(asciiCanvas) {
    let x = this.bounds.left + ((this.bounds.right - this.bounds.left) / 2) - (this.text.length / 2)
    const y = this.bounds.top;

    for (let i = 0; i < this.text.length; i++) {
      asciiCanvas.setPixel(x, y, this.text[i]);
      x++;
    }
  }
}