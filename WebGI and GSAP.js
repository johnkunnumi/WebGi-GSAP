/*  webgi-scroll.js  – GSAP ScrollTrigger + WebGI camera animation
   --------------------------------------------------------------
   Works with WebGI runtime v0.11.0 (https://dist.pixotronics.com/webgi/runtime/viewer-0.11.0.js)
   and GSAP 3.12.x.
*/

import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.2/all.js";

/* Scroll to top on hard refresh (optional) */
window.scrollTo(0, 0);

/* Wait for the DOM, then wire up WebGI once the viewer fires “initialized” */
document.addEventListener("DOMContentLoaded", () => {
  const viewerEl = document.getElementById("viewer-3d");
  if (!viewerEl) return console.warn("No #viewer-3d element found.");

  viewerEl.addEventListener("initialized", () => {
    const viewer  = viewerEl.viewer;
    const camera  = viewer.scene.activeCamera;
    const pos     = camera.position;
    const target  = camera.target;

    /* Disable OrbitControls so only ScrollTrigger drives the camera */
    camera.setCameraOptions({ controlsEnabled: false });

    /* Register GSAP plugin (global gsap already exposed by the import above) */
    gsap.registerPlugin(ScrollTrigger);

    /* Flag & helper to force WebGI to re-render on every tween update */
    let dirty = true;
    function markDirty() {
      dirty = true;
      viewer.setDirty();
    }

    viewer.addEventListener("preFrame", () => {
      if (dirty) {
        camera.positionUpdated(true);
        camera.positionTargetUpdated(true);
        dirty = false;
      }
    });

    /* ---------- SCROLL ANIMATION  ---------- */

    const tl = gsap.timeline({ defaults: { ease: "none" } });

    function addSection(section, newPos, newTarget) {
      tl.to(pos, {
        ...newPos,
        onUpdate: markDirty,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end:   "top top",
          scrub: true,
        },
      }).to(target, {
        ...newTarget,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end:   "top top",
          scrub: true,
        },
      });
    }

    /* Camera keyframes per section — edit to taste */
    addSection(".section-2",
      { x: -3,   y:  0.3, z:  5.3 },
      { x: -0.5, y: -0.1, z:  0.1 });

    addSection(".section-3",
      { x: -1.7, y: -0.25, z: -4.6 },
      { x: -0.7, y: -0.25, z: -0.2 });

    addSection(".section-4",
      { x: -2.4, y:  6.5,  z: -0.08 },
      { x: -0.25,y: -0.25, z: -0.09 });

    addSection(".section-5",
      { x: -0.01,y:  0.6,  z:  3.8 },
      { x: -0.003,y: -0.4, z:  0.41 });

    /* Force ScrollTrigger to recalc once everything is ready */
    ScrollTrigger.refresh();
  });
});
