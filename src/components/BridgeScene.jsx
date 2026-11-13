import { useEffect, useRef, useState } from 'react';
import { G, buildBridge, deflection } from '../lib/bridge-model.js';
import Figure from './Figure.jsx';

/**
 * BridgeScene: the interactive 3D suspension bridge behind the hero.
 *
 * - Drawn entirely with lines (ink) and two gold main cables, like a plate
 *   from an engineering monograph.
 * - A point load crosses the deck; the bridge deflects under it. When the
 *   visitor moves the pointer over the hero, the pointer becomes the load.
 * - three.js is loaded only after the page has painted, and the animation
 *   pauses when the hero is off screen.
 * - If WebGL is unavailable, a static drawing is shown instead.
 */
export default function BridgeScene() {
  const mountRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      try {
        const THREE = await import('../lib/three-kit.js');
        if (disposed) return;
        cleanup = start(THREE, mount);
      } catch (err) {
        console.warn('3D bridge unavailable, showing the static drawing instead.', err);
        if (!disposed) setFailed(true);
      }
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  if (failed) {
    return (
      <div className="hero__fallback" aria-hidden="true">
        <Figure type="suspension" bare />
      </div>
    );
  }
  return <div ref={mountRef} className="hero__canvas" aria-hidden="true" />;
}

/* ───────────────────────────────────────────────────────────────────── */

function cssColor(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function start(THREE, mount) {
  const { Line2, LineMaterial, LineGeometry } = THREE;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const model = buildBridge();

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xffffff, 150, 420);
  const camera = new THREE.PerspectiveCamera(24, 1, 1, 2000);

  // ── Materials ──────────────────────────────────────────────────────
  const mat = {
    strong: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.86 }),
    light: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.4 }),
    faint: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.13 }),
    load: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.95, fog: false }),
    cable: new LineMaterial({ linewidth: 2.4, transparent: true, opacity: 1, fog: true, worldUnits: false }),
    joint: new THREE.PointsMaterial({ size: 4.2, sizeAttenuation: false, transparent: true, opacity: 0.95, map: dotTexture(THREE), alphaTest: 0.2 }),
  };

  // ── Line layers ────────────────────────────────────────────────────
  function layer(flat, material) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(flat);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const obj = new THREE.LineSegments(geo, material);
    obj.frustumCulled = false;
    scene.add(obj);
    return { geo, pos, base: Float32Array.from(flat), count: flat.length / 3 };
  }
  const strong = layer(model.strong, mat.strong);
  const light = layer(model.light, mat.light);
  layer(model.faint, mat.faint);

  // ── Cables (fat lines) ─────────────────────────────────────────────
  const cables = model.cables.map((points) => {
    const flat = points.flat();
    const geo = new LineGeometry();
    geo.setPositions(flat);
    const line = new Line2(geo, mat.cable);
    line.frustumCulled = false;
    scene.add(line);
    return { geo, points, line, segments: points.length - 1 };
  });

  // ── Joints on the cable ────────────────────────────────────────────
  const jointGeo = new THREE.BufferGeometry();
  const jointPos = new Float32Array(model.joints);
  const jointBase = Float32Array.from(model.joints);
  jointGeo.setAttribute('position', new THREE.BufferAttribute(jointPos, 3));
  const joints = new THREE.Points(jointGeo, mat.joint);
  joints.frustumCulled = false;
  scene.add(joints);

  // ── The load: an arrow that rides on the deck ──────────────────────
  const arrowGeo = new THREE.BufferGeometry();
  arrowGeo.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array([0, 10, 0, 0, 0.5, 0, 0, 0.5, 0, -1.1, 3, 0, 0, 0.5, 0, 1.1, 3, 0, -1.6, 10, 0, 1.6, 10, 0]), 3)
  );
  const arrow = new THREE.LineSegments(arrowGeo, mat.load);
  scene.add(arrow);

  // ── Colours follow the page theme ──────────────────────────────────
  function applyTheme() {
    const ink = new THREE.Color(cssColor('--ink', '#1f1e1c'));
    const gold = new THREE.Color(cssColor('--gold', '#b68235'));
    const bg = new THREE.Color(cssColor('--bg', '#f4f1ec'));
    mat.strong.color.copy(ink);
    mat.light.color.copy(ink);
    mat.faint.color.copy(ink);
    mat.cable.color.copy(gold);
    mat.joint.color.copy(gold);
    mat.load.color.copy(gold);
    scene.fog.color.copy(bg);
    needsRender = true;
  }
  const themeWatcher = new MutationObserver(applyTheme);
  themeWatcher.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // ── Camera framing ─────────────────────────────────────────────────
  const view = { yaw: 0, pitch: 0, dist: 300, target: new THREE.Vector3() };
  let width = 1;
  let height = 1;
  function resize() {
    width = mount.clientWidth || 1;
    height = mount.clientHeight || 1;
    renderer.setSize(width, height, false);
    const aspect = width / height;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    mat.cable.resolution.set(width, height);

    // Wide screens see the whole bridge almost in elevation. Narrow screens
    // turn the camera for a three-quarter view down the deck.
    const narrow = Math.min(1, Math.max(0, (1.5 - aspect) / 1.0));
    view.yaw = -0.3 - 0.52 * narrow;
    view.pitch = 0.085 + 0.05 * narrow;
    const span = (G.L * 2 + 56) * (1 - 0.42 * narrow); // length that must fit across the screen
    const visibleWidth = span * Math.cos(view.yaw);
    view.dist = (visibleWidth / aspect / (2 * Math.tan((camera.fov * Math.PI) / 360))) * (1.02 + 0.07 * (1 - narrow));
    // Look at a point above the deck so the bridge sits in the lower part of the hero.
    const visibleHeight = 2 * view.dist * Math.tan((camera.fov * Math.PI) / 360);
    // The camera stands left of centre, so the near (left) end of the bridge
    // looks longer. Aim a little left on wide screens to keep both anchorages in view.
    view.target.set(-9 * (1 - narrow), visibleHeight * 0.5 - 27 - 6 * narrow, 0);
    scene.fog.near = view.dist - 40;
    scene.fog.far = view.dist + 190;
    needsRender = true;
  }

  // ── Pointer: becomes the load, and nudges the camera ───────────────
  const host = mount.closest('.hero') || mount;
  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();
  const pointer = { active: false, x: 0, nx: 0, ny: 0 };
  function onPointerMove(e) {
    if (e.pointerType === 'touch') return;
    const rect = mount.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointer.nx = nx;
    pointer.ny = ny;
    ray.setFromCamera({ x: nx, y: ny }, camera);
    if (ray.ray.intersectPlane(plane, hit)) {
      pointer.x = Math.max(-G.L + 2, Math.min(G.L - 2, hit.x));
      pointer.active = true;
    }
  }
  function onPointerLeave() {
    pointer.active = false;
    pointer.nx = 0;
    pointer.ny = 0;
  }
  if (!reduceMotion) {
    host.addEventListener('pointermove', onPointerMove);
    host.addEventListener('pointerleave', onPointerLeave);
  }

  // ── Deflected shape ────────────────────────────────────────────────
  function deform(layerObj, dyn, X, amp) {
    const { pos, base, count } = layerObj;
    for (let i = 0; i < count; i++) {
      if (!dyn[i]) continue;
      const k = i * 3;
      pos[k + 1] = base[k + 1] + deflection(base[k], X, amp);
    }
    layerObj.geo.attributes.position.needsUpdate = true;
  }
  function deformCables(X, amp) {
    for (const c of cables) {
      // Line2 keeps its points as [start xyz, end xyz] per segment.
      const arr = c.geo.attributes.instanceStart.data.array;
      for (let s = 0; s < c.segments; s++) {
        const p0 = c.points[s];
        const p1 = c.points[s + 1];
        arr[s * 6 + 1] = p0[1] + deflection(p0[0], X, amp);
        arr[s * 6 + 4] = p1[1] + deflection(p1[0], X, amp);
      }
      c.geo.attributes.instanceStart.data.needsUpdate = true;
    }
    for (let i = 0; i < jointBase.length; i += 3) jointPos[i + 1] = jointBase[i + 1] + deflection(jointBase[i], X, amp);
    jointGeo.attributes.position.needsUpdate = true;
  }

  // ── Animation loop ─────────────────────────────────────────────────
  let needsRender = true;
  let visible = true;
  let raf = 0;
  let last = performance.now();
  let t = 0;
  let loadX = -G.L + 2;
  let amp = 0;
  let intro = reduceMotion ? 1 : 0;
  let camYaw = 0;
  let camPitch = 0;
  let scroll = 0;

  function setDrawProgress(p) {
    const e = 1 - Math.pow(1 - p, 3);
    strong.geo.setDrawRange(0, Math.floor((strong.count * e) / 2) * 2);
    light.geo.setDrawRange(0, Math.floor((light.count * e) / 2) * 2);
    for (const c of cables) c.geo.instanceCount = Math.max(0, Math.floor(c.segments * Math.min(1, e * 1.15)));
    jointGeo.setDrawRange(0, Math.floor((jointBase.length / 3) * Math.max(0, e * 1.4 - 0.4)));
    arrow.visible = p >= 1;
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!visible) {
      last = now;
      return;
    }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    let moving = needsRender;
    if (intro < 1) {
      intro = Math.min(1, intro + dt / 2.6);
      setDrawProgress(intro);
      moving = true;
    }

    if (!reduceMotion) {
      t += dt;
      // Without a pointer, the load travels end to end and back, like traffic.
      const travel = G.L - 2;
      const phase = (t * 0.085) % 2;
      const auto = -travel + 2 * travel * (phase < 1 ? phase : 2 - phase);
      const target = pointer.active ? pointer.x : auto;
      const k = 1 - Math.exp(-dt * (pointer.active ? 7 : 2.2));
      loadX += (target - loadX) * k;
      amp += ((intro >= 1 ? 2.3 : 0) - amp) * (1 - Math.exp(-dt * 2));
      camYaw += (pointer.nx * 0.045 - camYaw) * (1 - Math.exp(-dt * 3));
      camPitch += (pointer.ny * 0.02 - camPitch) * (1 - Math.exp(-dt * 3));
      moving = true;
    } else {
      loadX = 0;
      amp = 0;
    }

    if (!moving) return;
    needsRender = false;

    deform(strong, model.dynStrong, loadX, amp);
    deform(light, model.dynLight, loadX, amp);
    deformCables(loadX, amp);
    arrow.position.set(loadX, deflection(loadX, loadX, amp), 0);
    arrow.visible = intro >= 1 && !reduceMotion;

    const yaw = view.yaw + camYaw + scroll * 0.1;
    const pitch = view.pitch + camPitch + scroll * 0.03;
    camera.position.set(
      view.target.x + view.dist * Math.sin(yaw) * Math.cos(pitch),
      view.target.y + view.dist * Math.sin(pitch) - scroll * 14,
      view.target.z + view.dist * Math.cos(yaw) * Math.cos(pitch)
    );
    camera.lookAt(view.target.x, view.target.y - scroll * 14, view.target.z);
    renderer.render(scene, camera);
  }

  function onScroll() {
    const h = host.offsetHeight || 1;
    scroll = Math.min(1, Math.max(0, window.scrollY / h));
    needsRender = true;
  }

  const ro = new ResizeObserver(resize);
  ro.observe(mount);
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  io.observe(mount);
  const onVisibility = () => {
    if (!document.hidden) last = performance.now();
  };
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('scroll', onScroll, { passive: true });

  applyTheme();
  resize();
  setDrawProgress(intro);
  raf = requestAnimationFrame(frame);
  mount.classList.add('is-ready');

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    themeWatcher.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('scroll', onScroll);
    host.removeEventListener('pointermove', onPointerMove);
    host.removeEventListener('pointerleave', onPointerLeave);
    scene.traverse((obj) => obj.geometry && obj.geometry.dispose());
    Object.values(mat).forEach((m) => {
      if (m.map) m.map.dispose();
      m.dispose();
    });
    renderer.dispose();
    if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
  };
}

/** A small soft-edged disc used for the joints. */
function dotTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = '#fff';
  g.beginPath();
  g.arc(32, 32, 26, 0, Math.PI * 2);
  g.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
