// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { useGLTF, PresentationControls, Environment } from '@react-three/drei';
// import * as THREE from 'three';

// function Book({ scale = 1 }) {
//   const bookRef = useRef();
//   const pageRef = useRef();
  
//   // Simple book model using basic geometries
//   useFrame((state) => {
//     const time = state.clock.getElapsedTime();
//     bookRef.current.position.y = Math.sin(time) * 0.1;
//     if (pageRef.current) {
//       pageRef.current.rotation.y = Math.sin(time * 2) * 0.1;
//     }
//   });

//   return (
//     <group ref={bookRef} scale={scale}>
//       {/* Book cover */}
//       <mesh castShadow>
//         <boxGeometry args={[3, 4, 0.3]} />
//         <meshStandardMaterial 
//           color="#4F46E5"
//           roughness={0.5}
//           metalness={0.1}
//         />
//       </mesh>
      
//       {/* Book pages */}
//       <group ref={pageRef} position={[0, 0, 0.15]}>
//         {[...Array(5)].map((_, index) => (
//           <mesh key={index} position={[0, 0, index * 0.01]}>
//             <planeGeometry args={[2.8, 3.8]} />
//             <meshStandardMaterial 
//               color="#ffffff"
//               roughness={0.4}
//               side={THREE.DoubleSide}
//             />
//           </mesh>
//         ))}
//       </group>
//     </group>
//   );
// }

// export default function Book3D() {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   if (!isClient) return null; // Prevent rendering on the server

//   return (
//     <Canvas
//       camera={{ position: [0, 0, 8], fov: 45 }}
//       style={{ background: 'transparent' }}
//     >
//       <Environment preset="city" />
//       <ambientLight intensity={0.5} />
//       <directionalLight position={[10, 10, 5]} intensity={1} />
      
//       <PresentationControls
//         global
//         rotation={[0.13, 0.1, 0]}
//         polar={[-0.4, 0.2]}
//         azimuth={[-1, 0.75]}
//         config={{ mass: 2, tension: 400 }}
//         snap={{ mass: 4, tension: 400 }}
//       >
//         <Book scale={0.8} />
//       </PresentationControls>
//     </Canvas>
//   );
// }
