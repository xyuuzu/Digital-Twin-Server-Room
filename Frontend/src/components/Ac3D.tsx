import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from 'three';


interface ACProps {
  position: [number, number, number]
  isOn: boolean
}

export default function AC({ position, isOn }: ACProps) {
  const fanRef = useRef<THREE.Mesh>(null!)

  useFrame(() => {
    if (fanRef.current && isOn) fanRef.current.rotation.y += 0.05
  })

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1.2, 0.6, 0.4]} />
        <meshStandardMaterial color="#ddd" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh ref={fanRef} position={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 6]} />
        <meshStandardMaterial color="#666" />
      </mesh>
      {isOn && (
        <mesh position={[0, -0.3, -0.3]}>
          <planeGeometry args={[0.8, 0.4]} />
          <meshStandardMaterial color="#aaf" transparent opacity={0.3} side={2} />
        </mesh>
      )}
    </group>
  )
}
