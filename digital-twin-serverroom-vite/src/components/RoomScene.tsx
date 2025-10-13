import React from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import Server3D from "./Server3d"
import Steam from "./Steam"
import AC from "./Ac3D"

interface ServerState { id: number; isOnline: boolean; temperature: number }
interface RoomSceneProps {
  servers: ServerState[]
  acOn: boolean
  toggleServer: (id: number) => void
}

export default function RoomScene({ servers, acOn, toggleServer }: RoomSceneProps) {
  return (
    <div className="h-[600px] w-full bg-gray-900 rounded-lg shadow-inner">
      <Canvas shadows>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 8, 5]} intensity={1.3} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.7} />

        <PerspectiveCamera makeDefault position={[6, 4, 8]} fov={50} />
        <OrbitControls enablePan={false} maxDistance={12} />

        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[15, 15]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.8} metalness={0.2} />
        </mesh>

        {servers.map((s, i) => {
          const spacing = 2.5
          const x = (i - (servers.length - 1) / 2) * spacing
          const y = 1.4
          const z = 0
          return (
            <group key={s.id}>
              <Server3D id={s.id} position={[x, y, z]} temperature={s.temperature} isOnline={s.isOnline} onTogglePower={toggleServer} />
              <Steam position={[x, y + 1.3, z]} active={s.temperature > 45 && s.isOnline} />
            </group>
          )
        })}

        <AC position={[0, 3, -3]} isOn={acOn} />
      </Canvas>
    </div>
  )
}
