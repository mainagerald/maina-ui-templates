import { RefObject, useEffect, useState } from 'react'

interface MouseTilt {
  tiltX: number
  tiltY: number
}

export default function useMouseTilt(containerRef: RefObject<HTMLElement>, sensitivity: number = 15): MouseTilt {
  const [tilt, setTilt] = useState<MouseTilt>({ tiltX: 0, tiltY: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width/2
      const centerY = rect.top + rect.height/2
      
      setTilt({
        tiltY: -(e.clientY - centerY) / sensitivity,
        tiltX: (e.clientX - centerX) / sensitivity
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [containerRef, sensitivity])

  return tilt
}
