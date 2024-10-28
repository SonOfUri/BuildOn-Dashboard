
export const LeftB = () => {
    return (
        <div
          className="absolute left-0 top-1/2 w-1/4 h-full transform -translate-y-1/2 flex justify-start items-center overflow-hidden"
          style={{
            perspective: "1000px", // Adds depth perspective
            transformStyle: "preserve-3d", // Ensures child elements maintain 3D transformations
        }}
        >
            <svg
                viewBox="0 0 400 600"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    transform: "rotateY(70deg) translateZ(-200px)", // 3D rotation and translation to make it appear coming out
                    transformOrigin: "right", // Makes the transformation occur from the center
                }}
                 className="opacity-90"
            >
                <g stroke="rgba(255,255,255,0.6)" fill="none" strokeWidth="1">
                {/* Distorted Horizontal lines */}
                {Array(40)
                    .fill(0)
                    .map((_, i) => (
                        <line
                            key={i}
                            x1="0"
                            y1={i * 30}
                            x2="400" // Right side aspect kept more narrow
                            y2={i * 30}
                        />
                    ))}
                {/* Distorted Vertical lines */}
                {Array(40)
                    .fill(0)
                    .map((_, i) => (
                        <line
                            key={i}
                            x1={i * 30}
                            y1="0"
                            x2={i * 30}
                            y2="600"
                        />
                    ))}
            </g>
                </svg>
            </div>
  )
}
