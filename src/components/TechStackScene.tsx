import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, Environment, Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const skills = [
    "React", "TypeScript", "Node.js", "Python",
    "Three.js", "SQL", "AI/ML", "Next.js",
    "Tailwind", "Git", "AWS", "Docker"
];

const Word = ({ text, position, rotation }: { text: string; position: [number, number, number]; rotation: [number, number, number] }) => {
    return (
        <Float floatIntensity={2} rotationIntensity={1}>
            <Text
                position={position}
                rotation={rotation}
                fontSize={0.5}
                color="#4ecdc4"
                anchorX="center"
                anchorY="middle"
            >
                {text}
            </Text>
        </Float>
    );
};

const Wheel = () => {
    const groupRef = useRef<THREE.Group>(null);
    const radius = 5;

    // Create circular arrangement
    const words = useMemo(() => {
        return skills.map((skill, i) => {
            const angle = (i / skills.length) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            return {
                text: skill,
                position: [x, 0, z] as [number, number, number],
                rotation: [0, -angle, 0] as [number, number, number] // Face center or outwards
            };
        });
    }, []);

    useFrame((state) => {
        if (groupRef.current) {
            // Rotate slowly - Handled by OrbitControls now
            // groupRef.current.rotation.y += 0.005; 
            // Add some wobble
            groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            // Make it respond to scroll (simplified: just constant rotation for now to ensure stability, 
            // can add scroll speedup if scrollY is passed)
        }
    });

    return (
        <group ref={groupRef}>
            {words.map((w, i) => (
                <Word key={i} {...w} />
            ))}

            {/* Central engaging object */}
            <mesh>
                <icosahedronGeometry args={[1.5, 0]} />
                <meshStandardMaterial color="#F97316" wireframe />
            </mesh>
        </group>
    );
};

export default function TechStackScene() {
    return (
        <div className="w-full h-[400px] cursor-move relative">

            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                <color attach="background" args={["#000000"]} />
                <fog attach="fog" args={['#000000', 8, 15]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <SuspenseFallback />
                <Wheel />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Environment preset="city" />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.15} />
            </Canvas>
        </div>
    );
}

const SuspenseFallback = () => null;
