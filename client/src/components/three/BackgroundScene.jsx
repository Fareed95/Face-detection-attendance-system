"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

export const BackgroundScene = ({ variant = "default", intensity = 1 }) => {
  const containerRef = useRef();
  const rendererRef = useRef();
  const composerRef = useRef();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composerRef.current = composer;

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Material based on variant
    let particlesMaterial;
    switch(variant) {
      case "cyber":
        particlesMaterial = new THREE.PointsMaterial({
          size: 0.005,
          color: 0x00ff00,
          blending: THREE.AdditiveBlending,
        });
        break;
      case "neon":
        particlesMaterial = new THREE.PointsMaterial({
          size: 0.005,
          color: 0xff00ff,
          blending: THREE.AdditiveBlending,
        });
        break;
      default:
        particlesMaterial = new THREE.PointsMaterial({
          size: 0.005,
          color: 0x4444ff,
          blending: THREE.AdditiveBlending,
        });
    }

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      particlesMesh.rotation.x += 0.0001;
      particlesMesh.rotation.y += 0.0001;
      composer.render();
    };

    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Mouse movement effect
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const x = (clientX / window.innerWidth) * 2 - 1;
      const y = -(clientY / window.innerHeight) * 2 + 1;
      
      particlesMesh.rotation.x += y * 0.0001;
      particlesMesh.rotation.y += x * 0.0001;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [variant, intensity]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-100"
      style={{ 
        background: variant === "cyber" 
          ? "radial-gradient(circle at center, rgba(0,255,0,0.1) 0%, rgba(0,0,0,1) 100%)"
          : variant === "neon"
            ? "radial-gradient(circle at center, rgba(255,0,255,0.1) 0%, rgba(0,0,0,1) 100%)"
            : "radial-gradient(circle at center, rgba(0,0,255,0.1) 0%, rgba(0,0,0,1) 100%)"
      }}
    />
  );
}; 