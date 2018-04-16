// obtains the boudns of an SVG element
export const getBounds = svgElement => {
  const bbox = svgElement.getBBox();
  const transform = svgElement.getCTM();

  return {
    left: bbox.x + transform.e,
    right: bbox.x + bbox.width + transform.e,
    top: bbox.y + transform.f,
    bottom: bbox.y + bbox.height + transform.f
  };
}