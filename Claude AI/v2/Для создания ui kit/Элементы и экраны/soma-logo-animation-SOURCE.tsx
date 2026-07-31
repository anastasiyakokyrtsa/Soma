const R = 115;
const CX = 240;
const CY = 240;
const CIRCUMFERENCE = 2 * Math.PI * R; // ≈ 722.566

const ORBIT_PATH =
  `M ${CX} ${CY - R} ` +
  `A ${R} ${R} 0 0 1 ${CX + R} ${CY} ` +
  `A ${R} ${R} 0 0 1 ${CX} ${CY + R} ` +
  `A ${R} ${R} 0 0 1 ${CX - R} ${CY} ` +
  `A ${R} ${R} 0 0 1 ${CX} ${CY - R}`;

const BEGIN      = 0.6;
const DRAW_DUR   = 3.8;
const TEXT_DELAY = BEGIN + DRAW_DUR + 0.5;   // 6.6s
const TEXT_DUR   = 2.0;
const PULSE_START = TEXT_DELAY + 0.8;        // 7.4s — pulse begins as text settles
const PULSE_DUR  = 3.0;                      // one pulse cycle

// Purple palette derived from #8B7CF6
const C_OUTER = "#8B7CF6";   // base purple
const C_MID   = "#A99CF8";   // lighter purple
const C_INNER = "#C4BBFA";   // pale purple
const C_DOT   = "#8B7CF6";
const C_TEXT_HALO = "#7B6CE6";
const C_TEXT_MID  = "#A99CF8";
const C_TEXT_INNER= "#C8C0FB";
const C_TEXT_SHARP= "#DDD9FF";

interface SomaLogoAnimationProps {
  animationKey?: number;
}

export function SomaLogoAnimation({ animationKey = 0 }: SomaLogoAnimationProps) {
  return (
    <svg
      key={animationKey}
      width="480"
      height="480"
      viewBox="0 0 480 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        <filter id="soma-f-outer" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id="soma-f-mid" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="soma-f-inner" x="-6%" y="-6%" width="112%" height="112%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="3" />
        </filter>

        <filter id="soma-f-dot" x="-220%" y="-220%" width="540%" height="540%" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="bg" />
          <feColorMatrix in="SourceAlpha" result="a1" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feMorphology in="a1" operator="dilate" radius="2" result="d1" />
          <feGaussianBlur in="d1" stdDeviation="5" result="b1" />
          <feColorMatrix in="b1" type="matrix"
            values="0 0 0 0 0.545 0 0 0 0 0.486 0 0 0 0 0.965  0 0 0 1 0" result="c1" />
          <feBlend in="c1" in2="bg" result="s1" />
          <feColorMatrix in="SourceAlpha" result="a2" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feGaussianBlur in="a2" stdDeviation="14" result="b2" />
          <feColorMatrix in="b2" type="matrix"
            values="0 0 0 0 0.42 0 0 0 0 0.37 0 0 0 0 0.9  0 0 0 0.75 0" result="c2" />
          <feBlend in="c2" in2="s1" result="s2" />
          <feBlend in="SourceGraphic" in2="s2" />
        </filter>

        <filter id="soma-f-text-halo" x="-30%" y="-120%" width="160%" height="340%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="14" result="blur" />
          <feColorMatrix in="blur" type="matrix"
            values="0 0 0 0 0.48 0 0 0 0 0.42 0 0 0 0 0.9  0 0 0 0.7 0" />
        </filter>
        <filter id="soma-f-text-mid" x="-20%" y="-100%" width="140%" height="300%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feColorMatrix in="blur" type="matrix"
            values="0 0 0 0 0.6 0 0 0 0 0.55 0 0 0 0 0.97  0 0 0 0.85 0" />
        </filter>
        <filter id="soma-f-text-inner" x="-10%" y="-60%" width="120%" height="220%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feColorMatrix in="blur" type="matrix"
            values="0 0 0 0 0.72 0 0 0 0 0.68 0 0 0 0 0.99  0 0 0 1 0" />
        </filter>
      </defs>

      <style>{`
        @keyframes soma-draw-glow {
          0%   { stroke-dashoffset: ${CIRCUMFERENCE}; opacity: 0.06; }
          10%  { opacity: 0.13; }
          30%  { opacity: 0.30; }
          60%  { opacity: 0.58; }
          85%  { opacity: 0.82; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes soma-draw-ring {
          from { stroke-dashoffset: ${CIRCUMFERENCE}; }
          to   { stroke-dashoffset: 0; }
        }
        /* Gentle breathe — runs infinitely after drawing finishes */
        @keyframes soma-pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.52; }
        }
        @keyframes soma-text-bloom {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        /* Text pulse mirrors ring pulse */
        @keyframes soma-text-pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.65; }
        }

        .soma-ring-base {
          stroke-dasharray: ${CIRCUMFERENCE};
          transform: rotate(-90deg);
          transform-origin: ${CX}px ${CY}px;
        }
        /* Glow rings: draw-glow first, then pulse loops */
        .soma-outer {
          opacity: 0;
          animation:
            soma-draw-glow ${DRAW_DUR}s linear ${BEGIN}s forwards,
            soma-pulse ${PULSE_DUR}s ease-in-out ${PULSE_START}s infinite;
        }
        .soma-mid {
          opacity: 0;
          animation:
            soma-draw-glow ${DRAW_DUR}s linear ${BEGIN}s forwards,
            soma-pulse ${PULSE_DUR}s ease-in-out ${PULSE_START + 0.15}s infinite;
        }
        .soma-inner {
          opacity: 0;
          animation:
            soma-draw-glow ${DRAW_DUR}s linear ${BEGIN}s forwards,
            soma-pulse ${PULSE_DUR}s ease-in-out ${PULSE_START + 0.3}s infinite;
        }
        /* Core ring just draws, no pulse (keeps the sharp outline stable) */
        .soma-core {
          stroke-dashoffset: ${CIRCUMFERENCE};
          animation: soma-draw-ring ${DRAW_DUR}s linear ${BEGIN}s forwards;
        }

        .soma-text-layer {
          opacity: 0;
          animation:
            soma-text-bloom ${TEXT_DUR}s ease-out ${TEXT_DELAY}s forwards,
            soma-text-pulse ${PULSE_DUR}s ease-in-out ${PULSE_START + 0.5}s infinite;
        }
      `}</style>

      {/* Outer halo */}
      <g filter="url(#soma-f-outer)">
        <circle cx={CX} cy={CY} r={R}
          stroke={C_OUTER} strokeOpacity="0.28" strokeWidth="22"
          className="soma-ring-base soma-outer" />
      </g>

      {/* Mid glow */}
      <g filter="url(#soma-f-mid)">
        <circle cx={CX} cy={CY} r={R}
          stroke={C_MID} strokeOpacity="0.6" strokeWidth="9"
          className="soma-ring-base soma-mid" />
      </g>

      {/* Inner glow */}
      <g filter="url(#soma-f-inner)">
        <circle cx={CX} cy={CY} r={R}
          stroke={C_INNER} strokeOpacity="0.9" strokeWidth="3.5"
          className="soma-ring-base soma-inner" />
      </g>

      {/* Core crisp ring */}
      <circle cx={CX} cy={CY} r={R}
        stroke="white" strokeWidth="1.2"
        className="soma-ring-base soma-core" />

      {/* Orbital dot */}
      <g filter="url(#soma-f-dot)">
        <circle r="2" fill="white">
          <animate attributeName="opacity"
            values="0;1" dur={`${0.7}s`}
            begin={`${BEGIN}s`} fill="freeze" />
          <animate attributeName="r"
            values="2;5" dur={`${DRAW_DUR}s`}
            begin={`${BEGIN}s`} fill="freeze" calcMode="spline"
            keySplines="0.4 0 0.6 1" keyTimes="0;1" />
          <animateMotion
            dur={`${DRAW_DUR}s`}
            begin={`${BEGIN}s`}
            fill="freeze"
            path={ORBIT_PATH}
            calcMode="linear" />
        </circle>
      </g>

      {/* Text — wide halo */}
      <text x={CX} y={CY + 8}
        textAnchor="middle" dominantBaseline="middle"
        fill={C_TEXT_HALO}
        fontFamily="'Inter', sans-serif" fontWeight="300" fontSize="30" letterSpacing="7"
        filter="url(#soma-f-text-halo)"
        className="soma-text-layer">Soma</text>

      {/* Text — mid glow */}
      <text x={CX} y={CY + 8}
        textAnchor="middle" dominantBaseline="middle"
        fill={C_TEXT_MID}
        fontFamily="'Inter', sans-serif" fontWeight="300" fontSize="30" letterSpacing="7"
        filter="url(#soma-f-text-mid)"
        className="soma-text-layer">Soma</text>

      {/* Text — inner glow */}
      <text x={CX} y={CY + 8}
        textAnchor="middle" dominantBaseline="middle"
        fill={C_TEXT_INNER}
        fontFamily="'Inter', sans-serif" fontWeight="300" fontSize="30" letterSpacing="7"
        filter="url(#soma-f-text-inner)"
        className="soma-text-layer">Soma</text>

      {/* Text — sharp top layer */}
      <text x={CX} y={CY + 8}
        textAnchor="middle" dominantBaseline="middle"
        fill={C_TEXT_SHARP}
        fontFamily="'Inter', sans-serif" fontWeight="300" fontSize="30" letterSpacing="7"
        className="soma-text-layer">Soma</text>
    </svg>
  );
}
