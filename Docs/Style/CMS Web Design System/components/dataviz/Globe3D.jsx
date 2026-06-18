import React from 'react';

/**
 * CMS Globe3D — a WebGL (three.js) rotating wireframe globe with glowing data
 * points, for "national reach" hero/dashboard moments. Loads three.js from CDN
 * on demand. Navy globe, gold data points. Reduced-motion → slow/no spin.
 */
export function Globe3D({ height = 320, points = 28, spin = true, accent = '#FDB81E', globeColor = '#2e486c' }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    let renderer, frame, disposed = false;
    const mount = ref.current;
    if (!mount) return;

    const loadThree = () => new Promise((resolve, reject) => {
      if (window.THREE) return resolve(window.THREE);
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/three@0.160.0/build/three.min.js';
      s.onload = () => resolve(window.THREE);
      s.onerror = reject;
      document.head.appendChild(s);
    });

    loadThree().then((THREE) => {
      if (disposed) return;
      const W = mount.clientWidth, H = height;
      const scene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
      cam.position.z = 3.2;
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      mount.appendChild(renderer.domElement);

      const group = new THREE.Group();
      scene.add(group);

      // wireframe globe
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 28, 20),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(globeColor), wireframe: true, transparent: true, opacity: 0.55 })
      );
      group.add(sphere);
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.985, 36, 28),
        new THREE.MeshBasicMaterial({ color: new THREE.Color('#0a2342'), transparent: true, opacity: 0.85 })
      );
      group.add(glow);

      // glowing data points on the surface
      const ptsGeo = new THREE.BufferGeometry();
      const arr = [];
      for (let i = 0; i < points; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = 2 * Math.PI * Math.random();
        const rr = 1.02;
        arr.push(rr * Math.sin(phi) * Math.cos(theta), rr * Math.cos(phi), rr * Math.sin(phi) * Math.sin(theta));
      }
      ptsGeo.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
      const ptsMat = new THREE.PointsMaterial({ color: new THREE.Color(accent), size: 0.08, sizeAttenuation: true });
      group.add(new THREE.Points(ptsGeo, ptsMat));

      group.rotation.x = 0.35;
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const speed = reduce ? 0 : (spin ? 0.0035 : 0);

      const animate = () => {
        group.rotation.y += speed;
        renderer.render(scene, cam);
        frame = requestAnimationFrame(animate);
      };
      animate();

      const onResize = () => {
        if (!mount) return;
        const nw = mount.clientWidth;
        cam.aspect = nw / height; cam.updateProjectionMatrix();
        renderer.setSize(nw, height);
      };
      window.addEventListener('resize', onResize);
      mount._cleanup = () => { window.removeEventListener('resize', onResize); };
    }).catch(() => {
      if (mount) mount.innerHTML = '<div style="height:100%;display:flex;align-items:center;justify-content:center;color:var(--text-subtle);font-family:var(--font-label);font-size:13px">WebGL globe unavailable</div>';
    });

    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      if (mount && mount._cleanup) mount._cleanup();
      if (renderer) { renderer.dispose && renderer.dispose(); if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); }
    };
  }, [height, points, spin, accent, globeColor]);

  return <div ref={ref} style={{ width: '100%', height }} aria-label="Rotating globe of national data points" />;
}
