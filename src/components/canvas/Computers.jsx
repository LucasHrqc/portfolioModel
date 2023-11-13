import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");
  const computerMesh = useRef();

  useFrame((state, delta) => {
    computerMesh.current.rotation.y += 0.7 * delta;
  });

  // Manually change the color of the material
  if (computer.scene) {
    computer.scene.traverse((child) => {
      if (child.isMesh) {
        // Set the color to red (you can change this to any valid color)
        child.material.color.set("red");
      }
    });
  }

  return (
    <mesh>
      {/* Ambient light to provide a baseline level of brightness */}
      <ambientLight intensity={0.5} />

      {/* Point light */}
      <pointLight position={[0, 2, 0]} intensity={0.8} />

      {/* Spot light */}
      <spotLight
        position={[0, 2, -2]}
        angle={0.5}
        penumbra={0}
        intensity={1}
        shadow-mapSize={1024}
      />

      <primitive
        object={computer.scene}
        scale={isMobile ? 0.6 : 0.55}
        position={isMobile ? [0, -0.3, -1] : [0, 0.5, -2]}
        rotation={[0, 0, 0.2]}
        ref={computerMesh}
      />
    </mesh>
  );
};

Computers.propTypes = {
  isMobile: PropTypes.bool,
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (ev) => {
      setIsMobile(ev.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameLoop="demand"
      camera={{ position: [-0.2, -5, -3], fov: 50 }}
      gl={{ preserveDrawingBuffer: false }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Suspense>

      <Preload all />
      <Computers isMobile={isMobile} />
    </Canvas>
  );
};

export default ComputersCanvas;
