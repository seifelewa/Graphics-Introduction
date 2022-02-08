const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  throw new Error("WebGL not supported");
}

//Data
const vertexData = [
  0.3, 0, 0,
  //
  0, 1, 0,
  //
  -0.3, 0, 0,
  //
  0, -1, 0,
  //
  //0, 1, 0,
  //
  //0, -1, 0,
];

const colorData = [
  0,
  1,
  0,
  //
  18 / 255,
  120 / 255,
  102 / 255,
  //
  1,
  0,
  0,
  //
  115 / 255,
  117 / 255,
  28 / 255,
  //
  //0, 0, 1,
  //
  //1, 0, 0,
];

//Create buffers and load data
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW); //static to not re-draw

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

//Vertex Shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER); // ` allows new line in string
gl.shaderSource(
  vertexShader,
  `
precision mediump float;
attribute vec3 position;
attribute vec3 color;
varying vec3 vColor;
void main() {
    vColor = color;
    gl_Position = vec4(position, 1);
}
`
);
gl.compileShader(vertexShader);

//Fragment shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(
  fragmentShader,
  `
precision mediump float;
varying vec3 vColor;
void main() {
    gl_FragColor = vec4(vColor, 1); 
}
`
); //rgb , a = 1 for not transperent
gl.compileShader(fragmentShader);
console.log(gl.getShaderInfoLog(fragmentShader));

//create program
const program = gl.createProgram();

//attach shaders
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, `color`);
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

//draw
gl.useProgram(program);
canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight / 2;
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.drawArrays(gl.TRIANGLE_FAN, -0, 4);
