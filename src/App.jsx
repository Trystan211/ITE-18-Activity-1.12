import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

// Function to generate random neon colors
const getRandomNeonColor = () => {
  const neonColors = [
    0x00ff00, // Neon Green
    0x00ffff, // Neon Blue
    0xff00ff, // Neon Pink
    0xffff00, // Neon Yellow
    0xff5733, // Neon Orange
    0x8b00ff, // Neon Purple
    0xff1493, // Neon Deep Pink
    0x00ff7f, // Neon Spring Green
  ];
  return neonColors[Math.floor(Math.random() * neonColors.length)];
};

// Function to generate a random size for the torus
const getRandomSize = () => {
  return Math.random() * (0.9 - 0.3) + 0.3; // Random size between 0.3 and 1.5
};

const ThreeDAnimation = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Add OrbitControls for zooming and orbiting
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth movement
    controls.dampingFactor = 0.1;
    controls.minDistance = 5; // Minimum zoom distance
    controls.maxDistance = 20; // Maximum zoom distance

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.5); // Soft light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Torus Knot Geometry (more complex and interesting)
    const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.1, 100, 16);
    const toruses = [];

    // Create 50 toruses with random sizes and neon colors
    for (let i = 0; i < 50; i++) {
      const neonColor = getRandomNeonColor(); // Random neon color
      const size = getRandomSize(); // Random size for each torus

      // Create torus material with neon color and emissive glow
      const neonMaterial = new THREE.MeshStandardMaterial({
        color: neonColor,
        emissive: neonColor,
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 0.8,
        flatShading: false
      });

      const torusGeometry = new THREE.TorusKnotGeometry(size, 0.1, 100, 16); // Varying size
      const torus = new THREE.Mesh(torusGeometry, neonMaterial);
      torus.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      scene.add(torus);
      toruses.push(torus);
    }

    // Add Text
    const loader = new FontLoader();
    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
      (font) => {
        const textGeometry = new TextGeometry("PENASO - ACT 2", {
          font: font,
          size: 0.5,
          height: 0.2,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(-3, 0, 0);
        scene.add(textMesh);
      }
    );

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate toruses
      toruses.forEach((torus) => {
        torus.rotation.x += 0.01;
        torus.rotation.y += 0.01;
      });

      // Update controls for smooth interaction
      controls.update();

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div ref={mountRef} style={{ height: "100vh", width: "100vw" }} />;
};

const App = () => {
  return <ThreeDAnimation />;
};

export default App;
