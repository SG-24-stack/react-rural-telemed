export default function Logo({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="relative flex items-center gap-3 cursor-pointer select-none max-w-full"
    >
      {/* Soft glow behind the logo so it reads clearly against busy backgrounds */}
      <div className="absolute -inset-3 sm:-inset-4 bg-white/40 rounded-2xl blur-xl pointer-events-none" />

      {/* Icon badge — echoes Apollo's icon-mark treatment: a rounded
          badge with a gold accent glyph, sitting separate from the
          wordmark rather than inline with it. */}
      <div className="relative flex items-center justify-center h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-white/15 border border-white/30 shrink-0 shadow-sm">
        <span className="text-xl sm:text-2xl drop-shadow-sm">🩺</span>
      </div>

      {/* Wordmark stack: two-tone name on top, small caps subtitle below —
          matching Apollo's "Apollo" (two-tone) + "PHARMACY" (caps, tracked) pattern */}
      <div className="relative flex flex-col leading-none">
        <span className="font-black text-lg sm:text-2xl tracking-wide font-sans truncate drop-shadow-sm">
          <span className="text-white">Rural </span>
          <span className="text-amber-400">Telemedicine</span>
        </span>
        <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-teal-100 uppercase mt-1">
          Telehealth Network
        </span>
      </div>
    </div>
  );
}