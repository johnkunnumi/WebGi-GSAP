/* webgi-scroll.js ▶ Scroll-triggered WebGI camera movement for Webflow */
/* Imports GSAP ScrollTrigger via CDN */
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.2/all.js";

// Ensure page starts at the top when manually refreshed
window.scrollTo(0, 0);

document.addEventListener("DOMContentLoaded", () => {
  const viewerEl = document.getElementById("viewer-3d");
  if (!viewerEl) {
    console.warn("❌ #viewer-3d not found!");
    return;
  }

  // Wait for the WebGI viewer to signal it's ready
  viewerEl.addEventListener("initialized", () => {
    const viewer = viewerEl.viewer;
    if (!viewer) {
      console.error("❌ viewer instance not found.");
      return;
    }

    const camera = viewer.scene.activeCamera;
    const pos = camera.position;
    const target = camera.target;

    // Disable user controls
    camera.setCameraOptions({ controlsEnabled: false });

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Track when to force WebGI to re-render
    let updateFlag = false;
    function markDirty() {
      updateFlag = true;
      viewer.setDirty();
    }

    // Apply position updates right before each render frame
    viewer.addEventListener("preFrame", () => {
      if (updateFlag) {
        camera.positionUpdated(true);
        camera.positionTargetUpdated(true);
        updateFlag = false;
      }
    });

    // Build the scroll-triggered camera timeline
    const timeline = gsap.timeline({ defaults: { ease: "none" } });

    function animateSection(section, newPos, newTarget) {
      timeline.to(pos, {
        ...newPos,
        onUpdate: markDirty,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      });
      timeline.to(target, {
        ...newTarget,
        onUpdate: markDirty,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      });
    }

    // Define animations per section
    animateSection(".section-2",
      { x: -3, y: 0.3, z: 5.3 },
      { x: -0.5, y: -0.1, z: 0.1 });

    animateSection(".section-3",
      { x: -1.7, y: -0.25, z: -4.6 },
      { x: -0.7, y: -0.25, z: -0.2 });

    animateSection(".section-4",
      { x: -2.4, y: 6.5, z: -0.08 },
      { x: -0.25, y: -0.25, z: -0.09 });

    animateSection(".section-5",
      { x: -0.01, y: 0.6, z: 3.8 },
      { x: -0.003, y: -0.4, z: 0.41 });

    // Refresh ScrollTrigger once everything is set
    ScrollTrigger.refresh();
  });
});
