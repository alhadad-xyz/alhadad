import { SHEET_RATIO } from './doodles';

// Liquid portrait: the cursor pours a fluid field over the hero. Where the
// fluid is dense it reveals the painted version (paper, contour rings around
// the silhouette, doodles); gravity drags the paint into drips and its
// velocity pushes the photo's pixels around.

const VERT = `#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

// Field: xy = velocity (uv/s), z = paint density.
const SIM = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform sampler2D uPrev;
uniform vec2 uTexel, uMouse, uForce;
uniform float uAspect, uDt;

float hash(float x) { return fract(sin(x * 91.3458) * 47453.5453); }
float noise(float x) { float i = floor(x); return mix(hash(i), hash(i + 1.0), smoothstep(0.0, 1.0, x - i)); }

void main() {
  vec4 s = texture(uPrev, vUv - texture(uPrev, vUv).xy * uDt);
  vec2 n = texture(uPrev, vUv + vec2(uTexel.x, 0)).xy + texture(uPrev, vUv - vec2(uTexel.x, 0)).xy
         + texture(uPrev, vUv + vec2(0, uTexel.y)).xy + texture(uPrev, vUv - vec2(0, uTexel.y)).xy;
  s.xy = mix(s.xy, n * 0.25, 0.25);
  // Heavier paint falls faster; per-column weight splits it into separate drips.
  s.y -= (0.3 + 1.4 * noise(vUv.x * 36.0)) * 2.2 * s.z * uDt;

  vec2 d = vUv - uMouse;
  d.x *= uAspect;
  float f = exp(-dot(d, d) * 700.0);
  s.xy += uForce * f;
  s.z += f * min(length(uForce) * 2.5, 1.0);

  o = vec4(s.xy * 0.985, min(s.z * 0.984, 1.0), 1.0);
}`;

const SHOW = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform sampler2D uSim, uPhoto, uPaint, uDist;
uniform vec4 uRect, uSheet;
uniform float uTime;

float hash(float x) { return fract(sin(x * 91.3458) * 47453.5453); }
float hash(vec2 v) { return fract(sin(dot(v, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 x) {
  vec2 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + 1.0), f.x), f.y);
}

void main() {
  vec4 s = texture(uSim, vUv);
  float m = smoothstep(0.26, 0.34, s.z);
  vec2 uv = vUv - s.xy * (0.01 + 0.03 * m) * uRect.zw;
  vec4 ph = texture(uPhoto, (uv - uRect.xy) / uRect.zw); // premultiplied

  // Painted version: contour rings ripple out from the silhouette like marker on paper.
  vec2 q = (uv - uSheet.xy) / uSheet.zw;
  // Line boil: the drawing redraws itself ~8 times a second, like hand-drawn animation.
  float frame = floor(uTime * 8.0);
  q += (vec2(noise(q * 14.0 + frame * 7.1), noise(q * 14.0 + frame * 3.7 + 31.0)) - 0.5) * vec2(0.0024, 0.005);
  vec4 pt = texture(uPaint, q); // rows flipped on upload by UNPACK_FLIP_Y
  vec2 outside = max(vec2(0), abs(q - 0.5) - 0.5);
  pt.gb *= step(dot(outside, outside), 0.0);
  float d = texture(uDist, q).r + length(outside * vec2(textureSize(uDist, 0)));
  float w = d + (noise(q * vec2(40.0, 18.0)) - 0.5) * 7.0;
  float ring = floor(w / 13.0);
  float line = (1.0 - smoothstep(0.7, 1.7, abs(fract(w / 13.0) - 0.5) * 13.0))
             * smoothstep(9.0, 14.0, d) * (1.0 - smoothstep(380.0, 510.0, d)) * step(hash(ring), 0.85);
  vec3 back = mix(vec3(0.949, 0.937, 0.914), vec3(mix(0.12, 0.6, hash(ring + 7.0))), line);
  back = mix(back, vec3(0.1), max(pt.g, smoothstep(2.0, 3.0, d) * (1.0 - smoothstep(4.5, 5.5, d)) * 0.85));
  vec3 c = clamp((ph.rgb - 0.5 * ph.a) * 1.2 + 0.5 * ph.a, 0.0, ph.a);
  vec3 under = back * (1.0 - ph.a) + c;
  // Marks on the person switch pen: white on hair and knit, black on skin and paper.
  vec3 pen = vec3(mix(0.08, 0.96, 1.0 - smoothstep(0.45, 0.55, dot(under, vec3(0.333)))));
  vec4 painted = vec4(mix(under, pen, pt.b), 1.0);
  o = mix(ph, painted, m);

  float g = fract(sin(dot(vUv * 1000.0 + uTime, vec2(12.9898, 78.233))) * 43758.5453);
  o.rgb = clamp(o.rgb + (g - 0.5) * 0.06 * o.a, 0.0, o.a);
}`;

const SIM_W = 320;
const STEP = 1000 / 60;
const IDLE_MS = 2000;

// Returns a cleanup function, or null when WebGL2 float targets are missing (the <img> stays).
export function mountLiquid(canvas, img, paint) {
  const gl = canvas.getContext('webgl2', { antialias: false });
  if (!gl || !gl.getExtension('EXT_color_buffer_float')) return null;

  const sim = program(gl, SIM);
  const show = program(gl, SHOW);
  const simH = Math.round((SIM_W * canvas.clientHeight) / Math.max(1, canvas.clientWidth)) || SIM_W;
  const fields = [target(gl, SIM_W, simH), target(gl, SIM_W, simH)];

  const photo = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, photo);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const sheet = texture(gl, paint.width, paint.height, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, paint.data);
  const dist = texture(gl, paint.width, paint.height, gl.R16F, gl.RED, gl.FLOAT, paint.dist);

  const rect = [0, 0, 1, 1];
  const sheetRect = [0, 0, 1, 1];
  let aspect = 1;
  const resize = () => {
    const dpr = Math.min(devicePixelRatio, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
    // CSS places the <img>; the shader draws the photo in the same box.
    const c = canvas.getBoundingClientRect();
    const i = img.getBoundingClientRect();
    rect[0] = (i.left - c.left) / c.width;
    rect[1] = (c.bottom - i.bottom) / c.height;
    rect[2] = i.width / c.width;
    rect[3] = i.height / c.height;
    const sw = (i.height * SHEET_RATIO) / c.width;
    sheetRect[0] = rect[0] + rect[2] / 2 - sw / 2;
    sheetRect[1] = rect[1];
    sheetRect[2] = sw;
    sheetRect[3] = rect[3];
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const pointer = { x: -1, y: -1, at: -Infinity };
  const onMove = (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.at = performance.now();
  };
  addEventListener('pointermove', onMove, { passive: true });

  const mouse = { x: 0.5, y: 0.6 };
  let raf = 0, last = 0, src = 0;

  const frame = (t) => {
    raf = requestAnimationFrame(frame);
    if (t - last < STEP - 1) return;
    last = t;

    // Idle: a slow figure-eight keeps the paint moving, like Lando's idle cursor.
    let tx, ty;
    if (t - pointer.at > IDLE_MS) {
      tx = rect[0] + rect[2] * (0.5 + 0.32 * Math.sin(t * 0.0007));
      ty = rect[1] + rect[3] * (0.68 + 0.12 * Math.sin(t * 0.0014));
    } else {
      const c = canvas.getBoundingClientRect();
      tx = (pointer.x - c.left) / c.width;
      ty = 1 - (pointer.y - c.top) / c.height;
    }
    const px = mouse.x, py = mouse.y;
    mouse.x += (tx - px) * 0.25;
    mouse.y += (ty - py) * 0.25;

    gl.useProgram(sim.p);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fields[1 - src].fb);
    gl.viewport(0, 0, SIM_W, simH);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fields[src].tex);
    gl.uniform1i(sim.u.uPrev, 0);
    gl.uniform2f(sim.u.uTexel, 1 / SIM_W, 1 / simH);
    gl.uniform2f(sim.u.uMouse, mouse.x, mouse.y);
    gl.uniform2f(sim.u.uForce, (mouse.x - px) * 30, (mouse.y - py) * 30);
    gl.uniform1f(sim.u.uAspect, aspect);
    gl.uniform1f(sim.u.uDt, 1 / 60);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    src = 1 - src;

    gl.useProgram(show.p);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.bindTexture(gl.TEXTURE_2D, fields[src].tex);
    gl.uniform1i(show.u.uSim, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, photo);
    gl.uniform1i(show.u.uPhoto, 1);
    gl.uniform4fv(show.u.uRect, rect);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, sheet);
    gl.uniform1i(show.u.uPaint, 2);
    gl.uniform4fv(show.u.uSheet, sheetRect);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, dist);
    gl.uniform1i(show.u.uDist, 3);
    gl.uniform1f(show.u.uTime, (t % 1000) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  // Only simulate while the hero is on screen.
  const io = new IntersectionObserver(([e]) => {
    cancelAnimationFrame(raf);
    if (e.isIntersecting) raf = requestAnimationFrame(frame);
  });
  io.observe(canvas);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    removeEventListener('pointermove', onMove);
  };
}

function program(gl, frag) {
  const p = gl.createProgram();
  for (const [type, src] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, frag]]) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    gl.attachShader(p, s);
  }
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const u = {};
  for (let i = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); i--; ) {
    const name = gl.getActiveUniform(p, i).name;
    u[name] = gl.getUniformLocation(p, name);
  }
  return { p, u };
}

function texture(gl, w, h, internal, format, type, data) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, data);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

function target(gl, w, h) {
  const tex = texture(gl, w, h, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT, null);
  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  return { tex, fb };
}
