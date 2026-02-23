/**
 * Globe3D.jsx — 3D interactive globe visualization (canvas only, no extra UI)
 *
 * DATA SOURCES:
 *   - /public/map.json (TopoJSON geometry) — fetched at runtime
 *   - Risk data passed via `data` prop (parent fetches recent_data.json)
 *
 * PROPS:
 *   data               : Array<{country, prediction_prob, …}>
 *   maxPredictionProb   : number
 *   selectedCountry     : string | null
 *   onCountryClick      : ({properties:{name:string}}) => void
 *   onCountryHover      : (name:string|null) => void
 *   onBackgroundClick   : () => void
 *   resetTrigger        : number — increment to reset camera to default
 */

import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// ─── Inline TopoJSON → GeoJSON decoder (no extra dependency) ─────────────────
function topojsonFeature(topology, object) {
  const arcs = topology.arcs;
  function arcToCoords(arcIndex) {
    const reversed = arcIndex < 0;
    const arc = arcs[reversed ? ~arcIndex : arcIndex];
    const coords = [];
    let x = 0, y = 0;
    for (let i = 0; i < arc.length; i++) {
      x += arc[i][0];
      y += arc[i][1];
      coords.push([
        topology.transform
          ? x * topology.transform.scale[0] + topology.transform.translate[0]
          : arc[i][0],
        topology.transform
          ? y * topology.transform.scale[1] + topology.transform.translate[1]
          : arc[i][1],
      ]);
    }
    if (reversed) coords.reverse();
    return coords;
  }
  function ringToCoords(ring) {
    const coords = [];
    for (const arcIdx of ring) {
      const c = arcToCoords(arcIdx);
      coords.push(...(coords.length ? c.slice(1) : c));
    }
    return coords;
  }
  function geometryToFeature(geom) {
    let coordinates;
    switch (geom.type) {
      case 'Polygon':
        coordinates = geom.arcs.map(ringToCoords);
        return { type: 'Feature', id: geom.id, properties: geom.properties || {}, geometry: { type: 'Polygon', coordinates } };
      case 'MultiPolygon':
        coordinates = geom.arcs.map(poly => poly.map(ringToCoords));
        return { type: 'Feature', id: geom.id, properties: geom.properties || {}, geometry: { type: 'MultiPolygon', coordinates } };
      default:
        return { type: 'Feature', id: geom.id, properties: geom.properties || {}, geometry: { type: geom.type, coordinates: [] } };
    }
  }
  const obj = typeof object === 'string' ? topology.objects[object] : object;
  return { type: 'FeatureCollection', features: obj.geometries.map(geometryToFeature) };
}

// ─── Constants ───────────────────────────────────────────────────────────────
const GLOBE_RADIUS = 100;
const SEGMENTS = 64;
const TOPO_URL = '/map.json';
const HIGHLIGHT_COLOR = new THREE.Color(0xffcc00);

// ─── Color scale matching the 2D map's logarithmic scheme ────────────────────
function riskToColor(p, maxProb) {
  if (p == null || isNaN(p) || p === -1 || p < 0) return new THREE.Color('#cfcccc');
  const maxForScale = maxProb + maxProb * 0.5;
  const k = 100;
  const scaledP = Math.min(Math.log(1 + k * p) / Math.log(1 + k * maxForScale), 1);
  const r = (235 - Math.round(235 * scaledP)) / 255;
  const g = (235 - Math.round(235 * scaledP)) / 255;
  const b = 235 / 255;
  return new THREE.Color(r, g, b);
}

// ─── Lat / Lon → Vec3 on sphere ──────────────────────────────────────────────
function latLonToVec3(lat, lon, radius) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function featureCentroid(feature) {
  let sumLon = 0, sumLat = 0, n = 0;
  (function walk(c) {
    if (typeof c[0] === 'number') { sumLon += c[0]; sumLat += c[1]; n++; }
    else c.forEach(walk);
  })(feature.geometry.coordinates);
  return n ? [sumLat / n, sumLon / n] : [0, 0];
}

// ─── Antimeridian normalisation ──────────────────────────────────────────────
function normalizeRing(ring) {
  let hi = false, lo = false;
  for (const [lon] of ring) { if (lon > 160) hi = true; if (lon < -160) lo = true; }
  if (hi && lo) return ring.map(([lon, lat]) => [lon < 0 ? lon + 360 : lon, lat]);
  return ring;
}

// ─── Name normalisation (GeoJSON name ↔ risk-data name) ─────────────────────
function buildNameNormMap(features, riskMap) {
  const aliases = {
    'Czechia': 'Czech Republic', 'Czech Republic': 'Czechia',
    'North Macedonia': 'Macedonia', 'Macedonia': 'North Macedonia',
    "Cote d'Ivoire": 'Ivory Coast', 'Ivory Coast': "Cote d'Ivoire",
    'Democratic Republic of Congo': 'Democratic Republic of the Congo',
    'Democratic Republic of the Congo': 'Democratic Republic of Congo',
    'Timor-Leste': 'East Timor', 'East Timor': 'Timor-Leste', 'Timor': 'East Timor',
    'Republic of the Congo': 'Congo', 'Republic of Congo': 'Congo',
    'Swaziland': 'Eswatini', 'Eswatini': 'Swaziland',
    'Burma': 'Myanmar', 'Myanmar': 'Burma',
    'Cabo Verde': 'Cape Verde', 'Cape Verde': 'Cabo Verde',
    'São Tomé and Príncipe': 'Sao Tome and Principe',
    'Sao Tome and Principe': 'São Tomé and Príncipe',
    'United States of America': 'United States', 'USA': 'United States',
  };
  const normMap = new Map();
  for (const f of features) {
    const gn = f.properties?.name;
    if (!gn || riskMap.has(gn)) continue;
    if (aliases[gn] && riskMap.has(aliases[gn])) { normMap.set(gn, aliases[gn]); continue; }
    for (const rn of riskMap.keys()) {
      if (rn.toLowerCase() === gn.toLowerCase()) { normMap.set(gn, rn); break; }
    }
  }
  return normMap;
}

// ─── Build country meshes (ShapeGeometry — earcut triangulation, no holes) ───
function buildCountryMeshes(features, riskMap, maxProb) {
  const group = new THREE.Group();
  const meshDataMap = new Map();

  for (const feature of features) {
    const name = feature.properties?.name || 'Unknown';
    const prob = riskMap.get(name);
    const color = riskToColor(prob, maxProb);
    const polygons =
      feature.geometry.type === 'MultiPolygon' ? feature.geometry.coordinates
      : feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates]
      : [];

    for (const polygon of polygons) {
      let outerRing = polygon[0];
      if (!outerRing || outerRing.length < 4) continue;
      outerRing = normalizeRing(outerRing);

      // Build THREE.Shape from outer ring (lon→x, lat→y) for earcut triangulation
      const shape = new THREE.Shape();
      shape.moveTo(outerRing[0][0], outerRing[0][1]);
      for (let i = 1; i < outerRing.length; i++) shape.lineTo(outerRing[i][0], outerRing[i][1]);

      // Add holes
      for (let h = 1; h < polygon.length; h++) {
        let holeRing = polygon[h];
        if (!holeRing || holeRing.length < 4) continue;
        holeRing = normalizeRing(holeRing);
        const holePath = new THREE.Path();
        holePath.moveTo(holeRing[0][0], holeRing[0][1]);
        for (let i = 1; i < holeRing.length; i++) holePath.lineTo(holeRing[i][0], holeRing[i][1]);
        shape.holes.push(holePath);
      }

      // Triangulate in 2D then project to sphere
      let shapeGeo;
      try { shapeGeo = new THREE.ShapeGeometry(shape, 1); } catch { continue; }
      const posAttr = shapeGeo.getAttribute('position');
      const newPos = new Float32Array(posAttr.count * 3);
      for (let i = 0; i < posAttr.count; i++) {
        const lon = posAttr.getX(i), lat = posAttr.getY(i);
        const v = latLonToVec3(lat, lon, GLOBE_RADIUS + 0.15);
        newPos[i * 3] = v.x; newPos[i * 3 + 1] = v.y; newPos[i * 3 + 2] = v.z;
      }
      shapeGeo.setAttribute('position', new THREE.BufferAttribute(newPos, 3));
      shapeGeo.computeVertexNormals();

      const material = new THREE.MeshLambertMaterial({
        color, side: THREE.DoubleSide, transparent: true, opacity: 0.92,
      });
      const mesh = new THREE.Mesh(shapeGeo, material);
      mesh.userData = { name, prob, color: color.clone() };
      group.add(mesh);

      if (!meshDataMap.has(name)) {
        meshDataMap.set(name, { centroid: featureCentroid(feature), prob });
      }
    }
  }
  return { group, meshDataMap };
}

// ─── Country border outlines ─────────────────────────────────────────────────
function buildCountryOutlines(features) {
  const mat = new THREE.LineBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.4 });
  const group = new THREE.Group();
  for (const feature of features) {
    const polygons =
      feature.geometry.type === 'MultiPolygon' ? feature.geometry.coordinates
      : feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates]
      : [];
    for (const polygon of polygons) {
      let ring = polygon[0];
      if (!ring || ring.length < 3) continue;
      ring = normalizeRing(ring);
      const pts = ring.map(([lon, lat]) => latLonToVec3(lat, lon, GLOBE_RADIUS + 0.3));
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
    }
  }
  return group;
}

// ─── Atmospheric glow texture ────────────────────────────────────────────────
function generateGlowTexture() {
  const s = 256, c = document.createElement('canvas');
  c.width = s; c.height = s;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(s / 2, s / 2, s * 0.2, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(60,140,255,0.6)');
  g.addColorStop(0.5, 'rgba(30,80,180,0.15)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);
  return new THREE.CanvasTexture(c);
}

// ═══════════════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════════════
export default function Globe3D({
  data,
  maxPredictionProb,
  selectedCountry,
  onCountryClick,
  onCountryHover,
  onBackgroundClick,
  resetTrigger,
}) {
  const mountRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const countryGroupRef = useRef(null);
  const meshDataMapRef = useRef(new Map());
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const animFrameRef = useRef(null);
  const prevSelectedRef = useRef(null);
  const hoveredNameRef = useRef(null);
  const pointerDownRef = useRef(null);

  // Keep mutable refs to avoid stale closures in mount effect
  const dataRef = useRef(data);
  const maxProbRef = useRef(maxPredictionProb);
  useEffect(() => { dataRef.current = data; }, [data]);
  useEffect(() => { maxProbRef.current = maxPredictionProb; }, [maxPredictionProb]);

  // ── Initialise Three.js scene (runs once on mount) ─────────────────────────
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e17);

    const camera = new THREE.PerspectiveCamera(
      50, container.clientWidth / container.clientHeight, 1, 2000,
    );
    camera.position.set(0, 0, 300);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.12;
    controls.minDistance = 130;
    controls.maxDistance = 600;
    controls.rotateSpeed = 0.5;
    controls.enablePan = false;
    controlsRef.current = controls;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(200, 200, 200);
    scene.add(dir);

    // Ocean sphere
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(GLOBE_RADIUS, SEGMENTS, SEGMENTS),
      new THREE.MeshPhongMaterial({ color: 0x0b1d3a, shininess: 25 }),
    ));

    // Atmosphere glow
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: generateGlowTexture(), blending: THREE.AdditiveBlending,
      transparent: true, opacity: 0.18,
    }));
    sprite.scale.set(350, 350, 1);
    scene.add(sprite);

    // Fetch TopoJSON and build country meshes using risk data already in props
    fetch(TOPO_URL).then(r => r.json()).then(topo => {
      const geojson = topojsonFeature(topo, topo.objects.world);

      // Build risk lookup
      const riskMap = new Map();
      let maxProb = maxProbRef.current || 0.05;
      for (const d of (dataRef.current || [])) {
        const p = d.prediction_prob;
        if (typeof p === 'number' && !isNaN(p) && p >= 0) {
          riskMap.set(d.country, p);
          if (p > maxProb) maxProb = p;
        }
      }
      // Normalise mismatched names
      const nm = buildNameNormMap(geojson.features, riskMap);
      for (const [gn, rn] of nm.entries()) {
        if (!riskMap.has(gn) && riskMap.has(rn)) riskMap.set(gn, riskMap.get(rn));
      }

      const { group, meshDataMap } = buildCountryMeshes(geojson.features, riskMap, maxProb);
      scene.add(group);
      countryGroupRef.current = group;
      meshDataMapRef.current = meshDataMap;
      scene.add(buildCountryOutlines(geojson.features));
    }).catch(err => console.error('Globe3D: data load error', err));

    // Render loop
    function animate() {
      animFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Resize via ResizeObserver (handles container resize, not just window)
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth, h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    ro.observe(container);

    // Cleanup
    return () => {
      ro.disconnect();
      cancelAnimationFrame(animFrameRef.current);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) renderer.domElement.remove();
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Highlight + camera animation when selectedCountry changes ──────────────
  useEffect(() => {
    const group = countryGroupRef.current;
    if (!group) return;

    // Clear previous highlight
    if (prevSelectedRef.current) {
      group.children.forEach(m => {
        if (m.userData?.name === prevSelectedRef.current) {
          m.material.color.copy(m.userData.color);
          m.material.opacity = 0.92;
        }
      });
    }

    // Apply new highlight + animate camera
    if (selectedCountry) {
      group.children.forEach(m => {
        if (m.userData?.name === selectedCountry) {
          m.material.color.copy(HIGHLIGHT_COLOR);
          m.material.opacity = 1;
        }
      });
      const cd = meshDataMapRef.current.get(selectedCountry);
      if (cd) animateCamera(cd.centroid[0], cd.centroid[1], 250);
    }

    prevSelectedRef.current = selectedCountry;
  }, [selectedCountry]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Reset view when resetTrigger increments ────────────────────────────────
  useEffect(() => {
    if (resetTrigger > 0) animateCamera(0, 0, 300, true);
  }, [resetTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Camera animation helper ────────────────────────────────────────────────
  function animateCamera(lat, lon, dist, isDefault = false) {
    const cam = cameraRef.current, ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    const target = isDefault
      ? new THREE.Vector3(0, 0, dist)
      : latLonToVec3(lat, lon, GLOBE_RADIUS).normalize().multiplyScalar(dist);
    const start = cam.position.clone();
    const dur = 800, t0 = Date.now();
    (function tick() {
      const t = Math.min((Date.now() - t0) / dur, 1);
      const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      cam.position.lerpVectors(start, target, e);
      ctrl.target.set(0, 0, 0);
      ctrl.update();
      if (t < 1) requestAnimationFrame(tick);
    })();
  }

  // ── Raycasting: pointer move (hover highlight + parent callback) ───────────
  const handlePointerMove = useCallback((event) => {
    const container = mountRef.current;
    const group = countryGroupRef.current;
    if (!container || !group) return;

    const rect = container.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const hits = raycasterRef.current.intersectObjects(group.children, false);

    // Restore previous hover mesh (unless it's the selected country)
    if (hoveredNameRef.current && hoveredNameRef.current !== prevSelectedRef.current) {
      group.children.forEach(m => {
        if (m.userData?.name === hoveredNameRef.current && m.userData?.name !== prevSelectedRef.current) {
          m.material.color.copy(m.userData.color);
          m.material.opacity = 0.92;
        }
      });
    }

    if (hits.length > 0) {
      const name = hits[0].object.userData?.name;
      if (name && name !== prevSelectedRef.current) {
        group.children.forEach(m => {
          if (m.userData?.name === name) {
            m.material.color.copy(m.userData.color.clone().lerp(new THREE.Color(1, 1, 1), 0.25));
            m.material.opacity = 1;
          }
        });
      }
      hoveredNameRef.current = name;
      if (onCountryHover) onCountryHover(name || null);
    } else {
      hoveredNameRef.current = null;
      if (onCountryHover) onCountryHover(null);
    }
  }, [onCountryHover]);

  // ── Pointer down tracking (to distinguish click from drag) ─────────────────
  const handlePointerDown = useCallback((event) => {
    pointerDownRef.current = { x: event.clientX, y: event.clientY };
  }, []);

  // ── Click: select country or background ────────────────────────────────────
  const handleClick = useCallback((event) => {
    // Ignore clicks that are really drag-releases
    if (pointerDownRef.current) {
      const dx = event.clientX - pointerDownRef.current.x;
      const dy = event.clientY - pointerDownRef.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > 5) return;
    }

    const container = mountRef.current;
    const group = countryGroupRef.current;
    if (!container || !group) return;

    const rect = container.getBoundingClientRect();
    const mx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const my = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(new THREE.Vector2(mx, my), cameraRef.current);
    const hits = raycasterRef.current.intersectObjects(group.children, false);

    if (hits.length > 0) {
      const name = hits[0].object.userData?.name;
      if (name && onCountryClick) onCountryClick({ properties: { name } });
    } else {
      if (onBackgroundClick) onBackgroundClick();
    }
  }, [onCountryClick, onBackgroundClick]);

  // ─── Render: just the canvas container, nothing else ───────────────────────
  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', position: 'relative', cursor: 'grab' }}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    />
  );
}
