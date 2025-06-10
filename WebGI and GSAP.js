// webgi-scroll.js
import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js";
import ScrollTrigger from "https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/ScrollTrigger.min.js";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("viewer-3d");
  if (!el) return;

  el.addEventListener("initialized", () => {
    const viewer = el.viewer;
    if (!viewer) return;

    const cam = viewer.scene.activeCamera;
    const pos = cam.position;
    const target = cam.target;

    cam.setCameraOptions({ controlsEnabled: false });

    let needsUpdate = false;
    const markDirty = () => {
      needsUpdate = true;
      viewer.setDirty();
    };

    viewer.addEventListener("preFrame", () => {
      if (needsUpdate) {
        cam.positionUpdated(true);
        cam.positionTargetUpdated(true);
        needsUpdate = false;
      }
    });

    const sections = [
      { sel: ".section-2", p: { x: -3, y: 0.3, z: 5.3 }, t: { x: -0.5, y: -0.1, z: 0.1 } },
      { sel: ".section-3", p: { x: -1.7, y: -0.25, z: -4.6 }, t: { x: -0.7, y: -0.25, z: -0.2 } },
      { sel: ".section-4", p: { x: -2.4, y: 6.5, z: -0.08 }, t: { x: -0.25, y: -0.25, z: -0.09 } },
      { sel: ".section-5", p: { x: -0.01, y: 0.6, z: 3.8 }, t: { x: -0.003, y: -0.4, z: 0.41 } },
    ];

    sections.forEach(section => {
      const elem = document.querySelector(section.sel);
      if (!elem) return;
      gsap.to(pos, {
        ...section.p,
        scrollTrigger: {
          trigger: section.sel,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
        onUpdate: markDirty,
      });
      gsap.to(target, {
        ...section.t,
        scrollTrigger: {
          trigger: section.sel,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
        onUpdate: markDirty,
      });
    });

    ScrollTrigger.refresh();
  });
});
