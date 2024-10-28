export const Gradients = ({ cardGradient }: { cardGradient: string }) => {
  return (
    <div className="w-full h-full overflow-hidden">
      <img 
        src={cardGradient} 
        alt="gradient" 
        width="100%" 
        height="100%" 
        className="object-cover" 
      />
    </div>
  )
}
