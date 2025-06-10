import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.2/all.js";

// Ensure scroll starts at top
window.scrollTo(0, 0);

// Wait for Webflow DOM to be ready
window.addEventListener("DOMContentLoaded", () => {
  const element = document.getElementById("viewer-3d");

  if (!element) {
    console.error("viewer-3d element not found.");
    return;
  }

  // Listen for WebGI initialized event
  element.addEventListener("initialized", () => {
    const viewer = element.viewer;
    const manager = viewer.getManager();
    const camera = viewer.scene.activeCamera;
    const position = camera.position;
    const target = camera.target;

    viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline();

    // Animation timeline
    tl.to(position, {
      x: -3,
      y: 0.3,
      z: 5.3,
      scrollTrigger: {
        trigger: ".section-2",
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
      onUpdate,
    }).to(target, {
      x: -0.5,
      y: -0.1,
      z: 0.1,
      scrollTrigger: {
        trigger: ".section-2",
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    }).to(position, {
      x: -1.7,
      y: -0.25,
      z: -4.6,
      scrollTrigger: {
        trigger: ".section-3",
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
      onUpdate,
    }).to(target, {
      x: -0.7,
      y: -0.25,
      z: -0.2,
      scrollTrigger: {
        trigger: ".section-3",
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    }).to(position, {
      x: -2.4,
      y: 6.5,
      z: -0.08,
      scrollTrigger: {
        trigger: ".section-4",
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
      onUpdate,
    }).to(target, {
      x: -0.25,
      y: -0.25,
      z: -0.09,
      scrollTrigger: {
        trigger: ".section-4",
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    }).to(position, {
      x: -0.01,
      y: 0.6,
      z: 3.8,
      scrollTrigger: {
        trigger: ".section-5",
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
      onUpdate,
    }).to(target, {
      x: -0.003,
      y: -0.4,
      z: 0.41,
      scrollTrigger: {
        trigger: ".section-5",
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    });

    // Update logic
    let needsUpdate = true;

    function onUpdate() {
      needsUpdate = true;
      viewer.setDirty();
    }

    viewer.addEventListener("preFrame", () => {
      if (needsUpdate) {
        camera.positionUpdated(true);
        camera.positionTargetUpdated(true);
        needsUpdate = false;
      }
    });

    ScrollTrigger.refresh();
  });
});
