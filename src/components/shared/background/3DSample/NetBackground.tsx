"use client"
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const NetBackground = () => {
  const mountRef = useRef<HTMLDivElement | null>(null); // Define the ref type

  useEffect(() => {
    if (!mountRef.current) return; // Ensure mountRef is not null

    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement); // Append renderer to the ref

    // Create a grid or net-like structure using PlaneGeometry and WireframeGeometry
    const geometry = new THREE.PlaneGeometry(10, 10, 10, 10); // Adjust size and segments
    const wireframe = new THREE.WireframeGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });

    const lines = new THREE.LineSegments(wireframe, material);
    scene.add(lines);

    // Set the camera position
    camera.position.z = 5;

    // Animate the background to give it a moving effect
    const animate = () => {
      requestAnimationFrame(animate);
      lines.rotation.x += 0.01;
      lines.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Clean up on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} />;
};

export default NetBackground;
