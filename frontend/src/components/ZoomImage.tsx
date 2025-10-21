import React, { useRef } from "react"

type ZoomImageProps = {
  src: string
  alt?: string
  zoom?: number
  className?: string
}

export const ZoomImage: React.FC<ZoomImageProps> = ({
  src,
  alt = "Zoom image",
  zoom = 2,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const lensRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current
    const lens = lensRef.current

    if (!container || !lens) return

    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const lensWidth = lens.offsetWidth / 2
    const lensHeight = lens.offsetHeight / 2

    let lensX = x - lensWidth
    let lensY = y - lensHeight

    lensX = Math.max(0, Math.min(lensX, rect.width - lens.offsetWidth))
    lensY = Math.max(0, Math.min(lensY, rect.height - lens.offsetHeight))

    lens.style.left = `${lensX}px`
    lens.style.top = `${lensY}px`
    lens.style.backgroundImage = `url(${src})`
    lens.style.backgroundPosition = `-${x * zoom - lensWidth}px -${y * zoom - lensHeight}px`
    lens.style.backgroundSize = `${rect.width * zoom}px ${rect.height * zoom}px`
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative group overflow-hidden ${className}`}
    >
      <img src={src} alt={alt} className="w-full object-cover" />
      <div
        ref={lensRef}
        className="absolute hidden group-hover:block w-[40%] h-[40%] border-2 border-none rounded-full pointer-events-none"
        style={{
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  )
}
