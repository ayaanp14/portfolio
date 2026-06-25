"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/cn";

type ShaderCanvasProps = {
  className?: string;
  intensity?: number;
};

const vertexSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentSource = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform vec2 u_pointer;
  uniform float u_time;
  uniform float u_scroll;
  uniform float u_intensity;
  varying vec2 v_uv;

  mat2 rotate2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = rotate2d(0.46) * p * 2.02 + 0.13;
      amplitude *= 0.52;
    }

    return value;
  }

  void main() {
    vec2 uv = v_uv;
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 centered = (uv - 0.5) * aspect;
    vec2 pointer = (u_pointer - 0.5) * aspect;

    float slowTime = u_time * 0.055;
    float scrollShift = u_scroll * 0.00055;

    // Layered FBM creates a soft liquid refraction field without high-frequency shimmer.
    float silk = fbm(centered * 2.1 + vec2(slowTime, -slowTime * 0.7 + scrollShift));
    float glass = fbm(centered * 3.4 + vec2(-slowTime * 1.2, slowTime + scrollShift));
    float flow = smoothstep(0.22, 1.0, silk * 0.72 + glass * 0.42);
    float pointerGlow = 1.0 - smoothstep(0.0, 0.58, distance(centered, pointer));
    float vignette = smoothstep(0.96, 0.18, distance(uv, vec2(0.5)));

    vec3 base = vec3(0.018, 0.018, 0.02);
    vec3 cyan = vec3(0.33, 0.96, 1.0);
    vec3 blue = vec3(0.40, 0.58, 1.0);
    vec3 purple = vec3(0.48, 0.28, 0.92);
    vec3 whiteGlass = vec3(0.86, 0.94, 1.0);

    vec3 color = base;
    color += cyan * smoothstep(0.54, 0.98, flow) * 0.22;
    color += blue * smoothstep(0.36, 0.86, glass) * 0.14;
    color += purple * smoothstep(0.45, 0.94, silk) * 0.16;
    color += whiteGlass * pow(pointerGlow, 2.4) * 0.14;
    color *= vignette;

    gl_FragColor = vec4(color * u_intensity, 1.0);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);

  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export function ShaderCanvas({ className, intensity = 1 }: ShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      return;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    if (!vertexShader || !fragmentShader) {
      return;
    }

    const program = gl.createProgram();

    if (!program) {
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    const buffer = gl.createBuffer();
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const pointerLocation = gl.getUniformLocation(program, "u_pointer");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const scrollLocation = gl.getUniformLocation(program, "u_scroll");
    const intensityLocation = gl.getUniformLocation(program, "u_intensity");
    const pointer = { x: 0.5, y: 0.5 };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.floor(canvas.clientWidth * pixelRatio);
      const height = Math.floor(canvas.clientHeight * pixelRatio);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x += (event.clientX / window.innerWidth - pointer.x) * 0.18;
      pointer.y += (1 - event.clientY / window.innerHeight - pointer.y) * 0.18;
    };

    const render = (time: number) => {
      resize();
      gl.useProgram(program);
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(pointerLocation, pointer.x, pointer.y);
      gl.uniform1f(timeLocation, reducedMotion ? 0 : time * 0.001);
      gl.uniform1f(scrollLocation, window.scrollY);
      gl.uniform1f(intensityLocation, intensity);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!reducedMotion) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    render(0);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.cancelAnimationFrame(animationFrame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [intensity]);

  return <canvas ref={canvasRef} className={cn("h-full w-full", className)} aria-hidden="true" />;
}
