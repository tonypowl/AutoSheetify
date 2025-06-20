
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Trail, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// 3D Floating Note Component
const FloatingNote = ({ position, note, color, speed = 1 }: { position: [number, number, number], note: string, color: string, speed?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.2;
    }
  });

  return (
    <Float
      speed={speed}
      rotationIntensity={0.3}
      floatIntensity={0.5}
      floatingRange={[0, 0.5]}
    >
      <Trail
        width={2}
        length={8}
        color={color}
        attenuation={(t) => t * t}
      >
        <Text
          ref={meshRef}
          position={position}
          fontSize={0.8}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {note}
          <meshStandardMaterial
            emissive={color}
            emissiveIntensity={0.5}
            color={color}
            transparent
            opacity={0.9}
          />
        </Text>
      </Trail>
    </Float>
  );
};

// Curving Wave Lines Component
const WaveLines = () => {
  const groupRef = useRef<THREE.Group>(null);

  const curves = useMemo(() => {
    const curveData = [];
    for (let i = 0; i < 5; i++) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, -2 + i * 1, -5),
        new THREE.Vector3(-5, Math.sin(i) * 2, 0),
        new THREE.Vector3(0, Math.cos(i) * 3, 2),
        new THREE.Vector3(5, Math.sin(i + 1) * 2, 0),
        new THREE.Vector3(10, -1 + i * 0.5, -3),
      ]);
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      curveData.push({ geometry, color: i % 2 === 0 ? '#06b6d4' : '#8b5cf6' });
    }
    return curveData;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {curves.map((curveData, index) => (
        <primitive key={index} object={new THREE.Line(curveData.geometry, new THREE.LineBasicMaterial({
          color: curveData.color,
          transparent: true,
          opacity: 0.3,
        }))} />
      ))}
    </group>
  );
};

// Particle System Component
const ParticleField = () => {
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      const color = Math.random() > 0.5 ? new THREE.Color('#06b6d4') : new THREE.Color('#8b5cf6');
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + positions[i]) * 0.001;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Main 3D Scene Component
const Scene3D = () => {
  const notes = [
    { symbol: '♪', position: [-3, 2, 0] as [number, number, number], color: '#06b6d4', speed: 1.2 },
    { symbol: '♫', position: [3, -1, 1] as [number, number, number], color: '#8b5cf6', speed: 0.8 },
    { symbol: '♬', position: [-2, -2, -1] as [number, number, number], color: '#06b6d4', speed: 1.5 },
    { symbol: '♩', position: [2, 3, 2] as [number, number, number], color: '#a855f7', speed: 0.9 },
    { symbol: '♭', position: [-4, 0, -2] as [number, number, number], color: '#0891b2', speed: 1.1 },
    { symbol: '♯', position: [4, 1, -1] as [number, number, number], color: '#7c3aed', speed: 1.3 },
    { symbol: '𝄞', position: [0, -3, 1] as [number, number, number], color: '#06b6d4', speed: 0.7 },
    { symbol: '𝄢', position: [-1, 4, 0] as [number, number, number], color: '#8b5cf6', speed: 1.4 },
  ];

  return (
    <>
      {/* Ambient and Point Lights */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#8b5cf6" />
      <pointLight position={[0, 0, 10]} intensity={0.5} color="#a855f7" />

      {/* Floating Notes with Trails */}
      {notes.map((note, index) => (
        <FloatingNote
          key={index}
          position={note.position}
          note={note.symbol}
          color={note.color}
          speed={note.speed}
        />
      ))}

      {/* Wave Lines */}
      <WaveLines />

      {/* Particle Field */}
      <ParticleField />

      {/* Sparkles Effect */}
      <Sparkles
        count={100}
        scale={[20, 10, 10]}
        size={2}
        speed={0.3}
        color="#06b6d4"
      />
      <Sparkles
        count={80}
        scale={[15, 8, 8]}
        size={1.5}
        speed={0.5}
        color="#8b5cf6"
      />
    </>
  );
};

const FloatingNotes = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <Scene3D />
      </Canvas>
      
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-conic from-cyan-400/10 via-purple-400/10 to-cyan-400/10 rounded-full blur-2xl animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-slate-900/10 to-slate-900/30"></div>
    </div>
  );
};

export default FloatingNotes;
