import React, { useRef, useMemo } from "react"
import { Points, BufferGeometry, Float32BufferAttribute, AdditiveBlending, Color } from "three"
import { useFrame } from "@react-three/fiber"

interface SteamProps {
  position: [number, number, number]
  active: boolean
}

export default function Steam({ position, active }: SteamProps) {
  const ref = useRef<Points>(null!)
  const count = 120

  const geometry = useMemo(() => {
    const geo = new BufferGeometry()
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 0.25
      positions[i * 3 + 1] = Math.random() * 0.5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.25
    }
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3))
    return geo
  }, [count])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position as any
    const time = clock.getElapsedTime()

    for (let i = 0; i < pos.count; i++) {
      pos.array[i * 3 + 1] += (0.008 + Math.random() * 0.015) * (active ? 1 : 0)
      pos.array[i * 3 + 0] += Math.sin(time * 0.6 + i) * 0.0006
      pos.array[i * 3 + 2] += Math.cos(time * 0.6 + i) * 0.0006
      if (pos.array[i * 3 + 1] > 1.5) pos.array[i * 3 + 1] = 0
    }
    pos.needsUpdate = true

    if (ref.current.material) {
      const mat = ref.current.material as any
      mat.opacity += ((active ? 0.45 : 0) - mat.opacity) * 0.05
    }
  })

  return (
    <points ref={ref} position={position}>
      <primitive object={geometry} attach="geometry" />
      <pointsMaterial
        size={0.08}
        transparent
        opacity={0.4}
        color={new Color("#ffffff")}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}
