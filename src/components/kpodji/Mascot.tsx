import mascot from "@/assets/mascot.png";

export function Mascot({ size = 96, className = "", float = true }: { size?: number; className?: string; float?: boolean }) {
  return (
    <img
      src={mascot}
      alt="Zao, l'écureuil griot"
      width={size}
      height={size}
      className={`${float ? "animate-float" : ""} drop-shadow-xl ${className}`}
      style={{ width: size, height: size }}
      loading="lazy"
    />
  );
}

export function MascotBubble({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`flex items-end gap-2 ${className}`}>
      <Mascot size={72} />
      <div className="bg-white px-3 py-2 rounded-2xl rounded-bl-none shadow-md border border-ocre/20 max-w-[200px] mb-2">
        <p className="text-[12px] font-display font-bold text-deep-blue leading-tight">{text}</p>
      </div>
    </div>
  );
}
