// adapted from https://codepen.io/BangEqual/pen/VLNowO

const colorFormat = {
  HEX: "HEX",
  RGB: "RGB",
  RGBA: "RGBA"
}

function getColorFormat(color) {
  // color is a string
  if (color.includes("#")) return colorFormat.HEX;
  else if (color.includes("rgb(")) return colorFormat.RGB;
  else if (color.includes("rgba(")) return colorFormat.RGBA;
}

function convertToRGBArray(color) {
  // color is a string
  switch (getColorFormat(color)) {
    case colorFormat.HEX:
      {
        return convertHEX(color);
      }
    case colorFormat.RGB: {
      return convertRGB(color);
    }
    case colorFormat.RGBA: {
      return convertRGB(color);
    }
  }
}

//return a workable RGB int array [r,g,b] from rgb/rgba representation
function convertRGB(val) {
  var rgb = val.split('(')[1].split(')')[0].split(',');
  alert(rgb.toString());
  return [
    parseInt(rgb[0], 10),
    parseInt(rgb[1], 10),
    parseInt(rgb[2], 10)
  ];
}

//return a workable RGB int array [r,g,b] from hex representation
function convertHEX(val) {
  //does the hex contain extra char?
  var hex = (val.length > 6) ? val.substr(1, val.length - 1) : val;
  // is it a six character hex?
  if (hex.length > 3) {

    //scrape out the numerics
    var r = hex.substr(0, 2);
    var g = hex.substr(2, 2);
    var b = hex.substr(4, 2);

    // if not six character hex,
    // then work as if its a three character hex
  } else {

    // just concat the pieces with themselves
    var r = hex.substr(0, 1) + hex.substr(0, 1);
    var g = hex.substr(1, 1) + hex.substr(1, 1);
    var b = hex.substr(2, 1) + hex.substr(2, 1);

  }
  // return our clean values
  return [
    parseInt(r, 16),
    parseInt(g, 16),
    parseInt(b, 16)
  ]
}

/**
 * padding function:
 * cba to roll my own, thanks Pointy!
 * ==================================
 * source: http://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
 */
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function makeColorGradient(color1, color2, steps) {
  // color1 and color2 are strings

  let colorGradient = [];

  let color1RGB = convertToRGBArray(color1);
  let color2RGB = convertToRGBArray(color2);
  // the percentage representation of the step
  let stepsPerc = 100 / (steps + 1);

  // diffs between both colors
  let colorClampRGB = [
    color2RGB[0] - color1RGB[0],
    color2RGB[1] - color1RGB[1],
    color2RGB[2] - color1RGB[2]
  ];

  // build the color array out with color steps
  for (let i = 0; i < steps; i++) {
    let clampedR = (colorClampRGB[0] > 0)
      ? pad((Math.round(colorClampRGB[0] / 100 * (stepsPerc * (i + 1)))).toString(16), 2)
      : pad((Math.round((color1RGB[0] + (colorClampRGB[0]) / 100 * (stepsPerc * (i + 1))))).toString(16), 2);

    let clampedG = (colorClampRGB[1] > 0)
      ? pad((Math.round(colorClampRGB[1] / 100 * (stepsPerc * (i + 1)))).toString(16), 2)
      : pad((Math.round((color1RGB[1] + (colorClampRGB[1]) / 100 * (stepsPerc * (i + 1))))).toString(16), 2);

    let clampedB = (colorClampRGB[2] > 0)
      ? pad((Math.round(colorClampRGB[2] / 100 * (stepsPerc * (i + 1)))).toString(16), 2)
      : pad((Math.round((color1RGB[2] + (colorClampRGB[2]) / 100 * (stepsPerc * (i + 1))))).toString(16), 2);

    colorGradient[i] = [
      '#',
      clampedR,
      clampedG,
      clampedB
    ].join('');
  }

  return colorGradient;
}