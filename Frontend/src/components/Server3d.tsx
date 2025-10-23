// Server3D.tsx
import { useRef } from "react"
import { Group, Mesh } from "three"
import { useFrame } from "@react-three/fiber"

interface ServerProps {
  id: number
  position: [number, number, number]
  temperature: number
  isOnline: boolean
  onTogglePower: (id: number, next: boolean) => void
}

export default function Server3D({
  position,
  temperature,
  isOnline,
}: ServerProps) {
  const groupRef = useRef<Group>(null!)
  const fanRef = useRef<Mesh>(null!)

  // Animasi kipas — hanya berputar saat online
  useFrame(() => {
    if (fanRef.current && isOnline) {
      fanRef.current.rotation.z += 0.3
    }
  })

  // Warna indikator tergantung suhu
  const indicatorColor = !isOnline
    ? "#222"
    : temperature > 45
    ? "#ff3300" // merah panas
    : temperature > 35
    ? "#ffaa00" // oranye hangat
    : "#00cc44" // hijau normal

  return (
    <group ref={groupRef} position={position}>
      {/* BODY */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 2.5, 2.2]} /> {/* server lebih besar */}
        <meshStandardMaterial color="#2b2b2b" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* PANEL DEPAN */}
      <mesh position={[0, 0, 1.1]}>
        <boxGeometry args={[1.1, 2.35, 0.05]} />
        <meshStandardMaterial color="#937a7aff" metalness={0.3} roughness={0.3} />
      </mesh>

      {/* SLOT DRIVE DEPAN */}
      {[...Array(3)].map((_, i) => (
        <mesh key={i} position={[0, 0.4 - i * 0.4, 1.12]}>
          <boxGeometry args={[0.9, 0.25, 0.03]} />
          <meshStandardMaterial color="#fffdfdff" />
        </mesh>
      ))}

      {/* LAMPU INDIKATOR */}
      <mesh position={[0.35, 0.6, 1.13]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          emissive={indicatorColor}
          color={indicatorColor}
          emissiveIntensity={isOnline ? 2.2 : 0}
        />
      </mesh>

      {/* FRAME KIPAS BELAKANG */}
      <mesh position={[0, 0, -1.1]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 24]} />
        <meshStandardMaterial color="#5b5e65ff" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* KIPAS */}
      <mesh ref={fanRef} position={[0, 0, -1.11]}>
        <cylinderGeometry args={[0.25, 0.25, 0.02, 6]} />
        <meshStandardMaterial color="#888" metalness={0.9} roughness={0.2} />
      </mesh>

    </group>
  )
}
