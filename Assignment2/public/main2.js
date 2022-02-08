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

const uvData = [
  0, 1,
  //
  1, 1,
  //
  0, 0,
  //
  1, 0,
];
//Create buffers and load data
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW); //static to not re-draw

const uvBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvData), gl.STATIC_DRAW);

//Resource Loading
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

gl.texImage2D(
  gl.TEXTURE_2D,
  0,
  gl.RGBA,
  gl.RGBA,
  gl.UNSIGNED_BYTE,
  document.getElementById("texture-image")
);
gl.generateMipmap(gl.TEXTURE_2D);

//Vertex Shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER); // ` allows new line in string
gl.shaderSource(
  vertexShader,
  `
    precision mediump float;
    attribute vec3 position;
    attribute vec2 uv;
    varying vec2 vUV;

    void main() {
    vUV = uv;
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

varying vec2 vUV;
uniform sampler2D textureID;

void main() {
    gl_FragColor = texture2D(textureID, vUV); 
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

const uvLocation = gl.getAttribLocation(program, `uv`);
gl.enableVertexAttribArray(uvLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

gl.useProgram(program);

//draw
canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight / 2;
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.drawArrays(gl.TRIANGLE_FAN, -0, 4);
