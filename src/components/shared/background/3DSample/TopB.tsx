export const TopB = () => {
    return (
        <div
          className="absolute top-0 left-1/2 w-full h-full transform -translate-x-1/2 flex justify-center overflow-hidden"
          style={{
            perspective: "1000px", // Adds depth perspective
            transformStyle: "preserve-3d", // Ensures child elements maintain 3D transformations
          }}
        >
            <svg
                viewBox="0 0 800 400"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    transform: "rotateX(-70deg) translateZ(-100px)", // 3D rotation and translation to make it appear coming out from top
                    transformOrigin: "top",
                }}
                className="opacity-90"
            >
                <g stroke="rgba(255,255,255,0.6)" fill="none" strokeWidth="1">
                {/* Distorted Horizontal lines */}
                {Array(9)
                    .fill(0)
                    .map((_, i) => (
                        <line
                            key={i}
                            x1="0"
                            y1={i * 20}
                            x2="800"
                            y2={i * 20}
                        />
                    ))}
                {/* Distorted Vertical lines */}
                {Array(100)
                    .fill(0)
                    .map((_, i) => (
                        <line
                            key={i}
                            x1={i * 20}
                            y1="0"
                            x2={i * 20}
                            y2="400"
                        />
                    ))}
            </g>
            </svg>
        </div>
    )
}
