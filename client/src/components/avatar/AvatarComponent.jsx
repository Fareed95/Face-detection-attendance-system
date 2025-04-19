'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { motion } from 'framer-motion';

const AvatarComponent = ({
  isListening,
  currentLanguage,
  response
}) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const avatarRef = useRef(null);
  const mixerRef = useRef(null);
  const controlsRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingError, setLoadingError] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;

    // Initialize Three.js scene
    const initScene = async () => {
      try {
        // Scene setup
        sceneRef.current = new THREE.Scene();
        sceneRef.current.background = new THREE.Color(0x000000);
        sceneRef.current.fog = new THREE.Fog(0x000000, 1, 10);

        // Camera setup
        const aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        cameraRef.current = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        cameraRef.current.position.set(0, 0.75, 2); // Adjusted camera position for circular view
        cameraRef.current.lookAt(0, 0.75, 0);

        // Renderer setup
        rendererRef.current = new THREE.WebGLRenderer({ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        });
        rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        rendererRef.current.shadowMap.enabled = true;
        rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current.outputColorSpace = THREE.SRGBColorSpace;
        containerRef.current.appendChild(rendererRef.current.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        sceneRef.current.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(2, 2, 2);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        sceneRef.current.add(directionalLight);

        const fillLight = new THREE.DirectionalLight(0x0A84FF, 0.3); // Electric blue fill light
        fillLight.position.set(-2, 0, -2);
        sceneRef.current.add(fillLight);

        // Controls
        controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
        controlsRef.current.enableDamping = true;
        controlsRef.current.dampingFactor = 0.05;
        controlsRef.current.enableZoom = false;
        controlsRef.current.minPolarAngle = Math.PI / 2.5; // Adjusted to limit vertical rotation
        controlsRef.current.maxPolarAngle = Math.PI / 1.8;
        controlsRef.current.enablePan = false;
        controlsRef.current.target.set(0, 0.5, 0); // Set orbit target to match camera lookAt

        // Load Avatar Model
        const loadingManager = new THREE.LoadingManager();
        
        loadingManager.onProgress = (url, loaded, total) => {
          if (mounted) {
            const progress = Math.round((loaded / total) * 100);
            setLoadingProgress(progress);
            console.log(`Loading model... ${progress}%`);
          }
        };

        loadingManager.onError = (url) => {
          if (mounted) {
            setLoadingError(`Failed to load ${url}`);
            console.error(`Error loading: ${url}`);
          }
        };

        const loader = new GLTFLoader(loadingManager);
        
        try {
          const gltf = await new Promise((resolve, reject) => {
            loader.load(
              '/models/model.glb',
              resolve,
              (xhr) => {
                if (mounted) {
                  const progress = Math.round((xhr.loaded / xhr.total) * 100);
                  setLoadingProgress(progress);
                }
              },
              reject
            );
          });

          if (!mounted) return;

          avatarRef.current = gltf.scene;
          
          // Apply shadows to all meshes
          avatarRef.current.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              
              // Improve material quality
              if (child.material) {
                child.material.envMapIntensity = 1;
                child.material.needsUpdate = true;
              }
            }
          });

          // Center the model
          const box = new THREE.Box3().setFromObject(avatarRef.current);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          // Calculate scale to fit the model in view
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 1.5 / maxDim;
          avatarRef.current.scale.setScalar(scale);

          // Position model at center
          avatarRef.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
          avatarRef.current.position.y += 0.5; // Slight vertical adjustment
          
          sceneRef.current.add(avatarRef.current);

          // Animation mixer setup
          if (gltf.animations.length) {
            mixerRef.current = new THREE.AnimationMixer(avatarRef.current);
            const idleAction = mixerRef.current.clipAction(gltf.animations[0]);
            idleAction.play();
          }

          // Initial animation
          gsap.from(avatarRef.current.position, {
            y: avatarRef.current.position.y - 1,
            duration: 1.5,
            ease: "power3.out"
          });

          // Rotate model to face camera
          avatarRef.current.rotation.y = Math.PI;

        } catch (error) {
          if (mounted) {
            setLoadingError('Failed to load the 3D model');
            console.error('Error loading model:', error);
          }
        }
      } catch (error) {
        if (mounted) {
          setLoadingError('Failed to initialize 3D scene');
          console.error('Error initializing scene:', error);
        }
      }
    };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (mixerRef.current) {
        mixerRef.current.update(0.016); // ~60fps
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(width, height);
    };

    // Initialize
    initScene();
    animate();

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      mounted = false;
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }

      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, []);

  // Handle lip-sync animation
  useEffect(() => {
    if (!avatarRef.current || !response) return;

    // Animate mouth based on response
    const animateMouth = () => {
      if (!avatarRef.current.morphTargetDictionary) return;

      const mouthIndex = avatarRef.current.morphTargetDictionary.mouth_open;
      if (typeof mouthIndex === 'undefined') return;

      gsap.to(avatarRef.current.morphTargetInfluences, {
        [mouthIndex]: 1,
        duration: 0.1,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut"
      });
    };

    animateMouth();
  }, [response]);

  // Handle listening state
  useEffect(() => {
    if (!avatarRef.current) return;

    if (isListening) {
      // Animate avatar to show it's listening
      gsap.to(avatarRef.current.rotation, {
        y: avatarRef.current.rotation.y + 0.1,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    } else {
      // Reset animation
      gsap.to(avatarRef.current.rotation, {
        y: 0,
        duration: 0.5
      });
    }
  }, [isListening]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full rounded-full overflow-hidden"
      />
      
      {/* Loading indicator */}
      {(!avatarRef.current || loadingProgress < 100) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-electric-blue border-t-transparent mb-4"></div>
            <p className="text-electric-blue text-sm">
              {loadingError ? loadingError : `Loading Avatar... ${loadingProgress}%`}
            </p>
            {loadingError && (
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 neon-btn text-xs"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}

      {/* Language indicator */}
      <div className="absolute top-2 left-2 glass px-2 py-0.5 rounded-full text-xs">
        {currentLanguage === 'en' ? '🇺🇸' : '🌐'}
      </div>

      {/* Listening indicator */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 glass px-3 py-1 rounded-full"
        >
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-electric-blue rounded-full animate-pulse" />
            <span className="text-neon-cyan text-xs">Listening...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AvatarComponent; 