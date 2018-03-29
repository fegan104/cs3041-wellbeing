import Rectangle from './Rectangle.js'
import Text from './Text.js'

export default class AsciiCanvas {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.buffer = Array.apply(null, Array(width * height)).map(String.prototype.valueOf, ' ');
  }

  render() {
    let stringBuffer = '';
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        stringBuffer += this.buffer[x + y * this.width];
      }
      stringBuffer += '\n';
    }
    return stringBuffer;
  }

  setPixel(x, y, char) {
    x = Math.floor(x);
    y = Math.floor(y);
    if (x < 0 || x > this.width - 1 ||
      y < 0 || y > this.height - 1) {
      return;
    }
    this.buffer[x + y * this.width] = char;
  }

  renderSvg(svg) {
    const paths = svg.selectAll('.bar path');

    paths[0].forEach(e => {
      var rect = new Rectangle(e);
      rect.render(this);
    })

    const labels = svg.selectAll('text');
    labels[0].forEach(e => {
      const label = new Text(e);
      label.render(this);
    })
  }
}