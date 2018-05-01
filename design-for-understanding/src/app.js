import AsciiCanvas from './AsciiCanvas.js'
import Rectangle from './Rectangle.js'
import Text from './Text.js'

const width = 160
const height = 40
d3.select('#ascii-dom').style({
  width: width + 'px',
  height: height + 'px'
});

const swearChar = () => {
  const r = Math.random()
  if(r < 0.25){
    return "#"
  } else if (r < 0.5){
    return "&"
  } else if (r < 0.75){
    return "@"
  } else {
    return "$"
  }
}

const d3Render = (data) => {

  const container = d3.select('#ascii-dom');

  const bar = fc.series.bar()
    .xValue(d => d.word)
    .yValue(d => d.count)
    .decorate(sel => {
      sel.enter()
        .select('path')
        .attr('ascii-fill', d => swearChar());
    });

  const chart = fc.chart.cartesian(
    d3.scale.ordinal(),
    d3.scale.linear())
    .xDomain(data.map(d => d.word))
    .yDomain(fc.util.extent().include(0).fields('count')(data))
    .margin({ bottom: 2, right: 5 })
    .xTickSize(0)
    .xTickPadding(1)
    .yTickSize(0)
    .yTicks(5)
    .yTickPadding(1)
    .yTickFormat(d3.format('s'))
    .yNice()
    .plotArea(bar);

  container
    .datum(data)
    .call(chart);
}

const svgToAscii = (svgId, asciiId) => {
  const CANVAS = new AsciiCanvas(width, height);
  CANVAS.renderSvg(d3.select(svgId));
  const ASCII = CANVAS.render();
  d3.select(asciiId).text(ASCII);
}

const DATA_URL = "/data/tarantino.json"

fetch(DATA_URL)
  .then(res => res.json())
  .then(data => data.filter(x => x.type === "word"))
  .then(swears => swears.reduce((a, b) => {
    if (!(b.word in a)) {
      a[b.word] = 1
      return { ...a }
    }
    const next = {}
    next[b.word] = a[b.word] + 1
    return { ...a, ...next }
  }, {}))
  .then(data => Object.keys(data).map((k, i) => {
    return {
      word: k,
      count: data[k]
    }
  }))
  .then(data => {
    data = data.filter(d => d.count > 20)
    data.sort((a, b) => b.count - a.count)
    console.log(data)
    d3Render(data);
    svgToAscii('#ascii-dom', '#ascii-output');
  })
  .catch(console.error)