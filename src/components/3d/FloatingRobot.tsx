import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, Box, Octahedron } from '@react-three/drei';
import * as THREE from 'three';

function Robot() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef}>
        {/* Head */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.8, 0.6, 0.7]} />
          <meshStandardMaterial color="#38BDF8" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[-0.2, 1.3, 0.36]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0.2, 1.3, 0.36]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={2} />
        </mesh>
        
        {/* Body */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[1, 1.2, 0.6]} />
          <meshStandardMaterial color="#3B82F6" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Core glow */}
        <mesh position={[0, 0.2, 0.31]}>
          <circleGeometry args={[0.2, 32]} />
          <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={3} />
        </mesh>
        
        {/* Arms */}
        <mesh position={[-0.7, 0.3, 0]}>
          <boxGeometry args={[0.3, 0.8, 0.3]} />
          <meshStandardMaterial color="#38BDF8" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.7, 0.3, 0]}>
          <boxGeometry args={[0.3, 0.8, 0.3]} />
          <meshStandardMaterial color="#38BDF8" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Legs */}
        <mesh position={[-0.25, -0.8, 0]}>
          <boxGeometry args={[0.3, 0.8, 0.3]} />
          <meshStandardMaterial color="#3B82F6" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.25, -0.8, 0]}>
          <boxGeometry args={[0.3, 0.8, 0.3]} />
          <meshStandardMaterial color="#3B82F6" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Antenna */}
        <mesh position={[0, 1.7, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.3, 16]} />
          <meshStandardMaterial color="#38BDF8" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.9, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={2} />
        </mesh>
      </group>
    </Float>
  );
}

function FloatingOrbs() {
  return (
    <>
      <Float speed={3} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[0.2, 32, 32]} position={[-2, 1, -1]}>
          <MeshDistortMaterial color="#22D3EE" distort={0.4} speed={2} transparent opacity={0.8} />
        </Sphere>
      </Float>
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
        <Torus args={[0.3, 0.1, 16, 32]} position={[2.5, 0.5, -1]} rotation={[Math.PI / 4, 0, 0]}>
          <meshStandardMaterial color="#3B82F6" metalness={0.9} roughness={0.1} />
        </Torus>
      </Float>
      
      <Float speed={2.5} rotationIntensity={2} floatIntensity={1}>
        <Box args={[0.3, 0.3, 0.3]} position={[-2.5, -0.5, 0]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <meshStandardMaterial color="#38BDF8" metalness={0.8} roughness={0.2} />
        </Box>
      </Float>
      
      <Float speed={1.8} rotationIntensity={1.5} floatIntensity={2}>
        <Octahedron args={[0.25]} position={[2, -1, -0.5]}>
          <meshStandardMaterial color="#22D3EE" metalness={0.9} roughness={0.1} />
        </Octahedron>
      </Float>
      
      <Float speed={2.2} rotationIntensity={1} floatIntensity={1.8}>
        <Sphere args={[0.15, 32, 32]} position={[1.5, 1.5, -2]}>
          <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.5} />
        </Sphere>
      </Float>
    </>
  );
}

export default function FloatingRobot() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#38BDF8" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3B82F6" />
        <spotLight position={[0, 5, 5]} angle={0.3} intensity={1} color="#22D3EE" />
        
        <Robot />
        <FloatingOrbs />
      </Canvas>
    </div>
  );
}
