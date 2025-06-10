// webgi-gsap.js
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.2/all.js";

// Ensure Scroll starts from top
window.scrollTo(0, 0);

document.addEventListener("DOMContentLoaded", () => {
  const viewerEl = document.getElementById("viewer-3d");

  if (!viewerEl) {
    console.error("Viewer element not found.");
    return;
  }

  viewerEl.addEventListener("initialized", () => {
    const viewer = viewerEl.viewer;

    if (!viewer) {
      console.error("Viewer instance not found on viewerEl.");
      return;
    }

    const camera = viewer.scene.activeCamera;
    const position = camera.position;
    const target = camera.target;

    // Disable user camera control
    camera.setCameraOptions({ controlsEnabled: false });

    // Register GSAP plugin
    gsap.registerPlugin(ScrollTrigger);

    let updateRequired = false;

    function markUpdate() {
      updateRequired = true;
      viewer.setDirty();
    }

    viewer.addEventListener("preFrame", () => {
      if (updateRequired) {
        camera.positionUpdated(true);
        camera.positionTargetUpdated(true);
        updateRequired = false;
      }
    });

    // Define a function to animate camera for a section
    function animateCamera(sectionSelector, newPos, newTarget) {
      const section = document.querySelector(sectionSelector);
      if (!section) return;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      });

      timeline.to(position, {
        ...newPos,
        onUpdate: markUpdate,
      });

      timeline.to(target, {
        ...newTarget,
        onUpdate: markUpdate,
      }, 0);
    }

    // Define animations per section
    animateCamera(".section-2", { x: -3, y: 0.3, z: 5.3 }, { x: -0.5, y: -0.1, z: 0.1 });
    animateCamera(".section-3", { x: -1.7, y: -0.25, z: -4.6 }, { x: -0.7, y: -0.25, z: -0.2 });
    animateCamera(".section-4", { x: -2.4, y: 6.5, z: -0.08 }, { x: -0.25, y: -0.25, z: -0.09 });
    animateCamera(".section-5", { x: -0.01, y: 0.6, z: 3.8 }, { x: -0.003, y: -0.4, z: 0.41 });

    ScrollTrigger.refresh();
  });
});
