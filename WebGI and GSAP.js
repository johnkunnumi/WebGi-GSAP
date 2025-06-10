/* webgi-scroll.js  ── final, TDZ-safe and CSP-safe */
import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js";
import ScrollTrigger from "https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/ScrollTrigger.min.js";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const viewerEl = document.getElementById("viewer-3d");
  if (!viewerEl) return;

  viewerEl.addEventListener("initialized", () => {
    const viewer = viewerEl.viewer;
    const cam    = viewer.scene.activeCamera;
    const pos    = cam.position;
    const tar    = cam.target;

    cam.setCameraOptions({ controlsEnabled: false });

    /* 1️⃣  declare the flag EARLY */
    let dirty = false;

    /* 2️⃣ helper that sets the flag */
    const markDirty = () => {
      dirty = true;
      viewer.setDirty();
    };

    /* 3️⃣ one preFrame listener */
    viewer.addEventListener("preFrame", () => {
      if (dirty) {
        cam.positionUpdated(true);
        cam.positionTargetUpdated(true);
        dirty = false;
      }
    });

    /* 4️⃣ build tweens AFTER flag + helper exist */
    const sections = [
      { s: ".section-2", p: { x:-3,   y:0.3,  z: 5.3 }, t:{ x:-0.5, y:-0.1, z:0.1  } },
      { s: ".section-3", p: { x:-1.7, y:-0.25,z:-4.6 }, t:{ x:-0.7, y:-0.25,z:-0.2 } },
      { s: ".section-4", p: { x:-2.4, y:6.5,  z:-0.08}, t:{ x:-0.25,y:-0.25,z:-0.09} },
      { s: ".section-5", p: { x:-0.01,y:0.6,  z: 3.8 }, t:{ x:-0.003,y:-0.4,z:0.41} },
    ];

    sections.forEach(({ s, p, t }) => {
      if (!document.querySelector(s)) return;

      gsap.to(pos, {
        ...p,
        onUpdate: markDirty,
        scrollTrigger:{
          trigger: s,
          start:   "top bottom",
          end:     "top top",
          scrub:   true,
        },
      });

      gsap.to(tar, {
        ...t,
        onUpdate: markDirty,
        scrollTrigger:{
          trigger: s,
          start:   "top bottom",
          end:     "top top",
          scrub:   true,
        },
      });
    });

    ScrollTrigger.refresh();
  });
});
