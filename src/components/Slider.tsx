interface SliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  label?: string;
  tooltip?: string;
  color?: string;
  small?: boolean;
}

export function Slider({ value, min, max, onChange, label, tooltip, color = '#6366f1', small }: SliderProps) {
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;

  const inputClass = small
    ? 'w-11 h-5 text-[10px]'
    : 'w-14 h-7 text-[11px]';

  return (
    <div className={`w-full ${small ? 'space-y-1' : 'space-y-1.5'}`}>
      {(label || tooltip) && (
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 leading-tight">
            {label && (
              <div className={`${small ? 'text-[10px]' : 'text-[11px]'} text-white/55 break-words`}>
                {label}
                {tooltip && <span className="text-white/25 ml-1">ⓘ</span>}
              </div>
            )}
            {!label && tooltip && (
              <div className={`${small ? 'text-[10px]' : 'text-[11px]'} text-white/25`}>
                ⓘ
              </div>
            )}
          </div>

          <input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={e => {
              const raw = parseInt(e.target.value, 10);
              const v = Number.isNaN(raw) ? min : raw;
              onChange(Math.max(min, Math.min(max, v)));
            }}
            className={`shrink-0 rounded bg-white/[.05] border border-white/[.12] text-center text-white/70 outline-none focus:border-white/25 ${inputClass}`}
          />
        </div>
      )}

      {!label && !tooltip && (
        <div className="flex justify-end">
          <input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={e => {
              const raw = parseInt(e.target.value, 10);
              const v = Number.isNaN(raw) ? min : raw;
              onChange(Math.max(min, Math.min(max, v)));
            }}
            className={`shrink-0 rounded bg-white/[.05] border border-white/[.12] text-center text-white/70 outline-none focus:border-white/25 ${inputClass}`}
          />
        </div>
      )}

      <div className={`relative rounded-full bg-white/[.08] ${small ? 'h-1.5' : 'h-2'}`}>
        <div
          className="absolute h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(+e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md transition-all pointer-events-none ${small ? 'w-3 h-3' : 'w-3.5 h-3.5'}`}
          style={{ left: `calc(${pct}% - ${small ? '6px' : '7px'})`, background: color }}
        />
      </div>
    </div>
  );
}
