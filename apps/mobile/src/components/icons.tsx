import Svg, { Circle, Path, Polyline, Rect } from 'react-native-svg';

/**
 * Lightweight inline SVG icon set so the scaffold has no extra icon-library dependency.
 * Replace with `lucide-react-native` later for a fuller set.
 */

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const baseProps = (size = 22, strokeWidth = 2) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const HomeIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Path d="M3 12L12 3l9 9" />
    <Path d="M5 10v10h14V10" />
  </Svg>
);

export const MapIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Path d="M9 3l-6 3v15l6-3 6 3 6-3V3l-6 3-6-3z" />
    <Path d="M9 3v15M15 6v15" />
  </Svg>
);

export const RideIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Circle cx="6" cy="17" r="4" />
    <Circle cx="18" cy="17" r="4" />
    <Path d="M6 17l4-9h4l4 9" />
    <Path d="M10 8h4" />
  </Svg>
);

export const UsersIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <Circle cx="9" cy="7" r="4" />
    <Path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

export const ProfileIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Circle cx="12" cy="8" r="4" />
    <Path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
  </Svg>
);

export const PlayIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Path d="M6 4l14 8-14 8V4z" fill={color} />
  </Svg>
);

export const PauseIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Rect x="6" y="5" width="4" height="14" fill={color} />
    <Rect x="14" y="5" width="4" height="14" fill={color} />
  </Svg>
);

export const StopIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Rect x="5" y="5" width="14" height="14" rx="2" fill={color} />
  </Svg>
);

export const SearchIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Circle cx="11" cy="11" r="7" />
    <Path d="M21 21l-4.3-4.3" />
  </Svg>
);

export const NavIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Path d="M12 2L19 21l-7-4-7 4 7-19z" fill={color} />
  </Svg>
);

export const CoffeeIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Path d="M3 8h13v6a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
    <Path d="M16 9h2a3 3 0 0 1 0 6h-2" />
    <Path d="M6 2v3M10 2v3" />
  </Svg>
);

export const DropletIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Path d="M12 2.5l5.5 7a7 7 0 1 1-11 0L12 2.5z" />
  </Svg>
);

export const AlertIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Path d="M12 3l10 17H2L12 3z" />
    <Path d="M12 9v5M12 18h.01" />
  </Svg>
);

export const ClockIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Circle cx="12" cy="12" r="9" />
    <Polyline points="12 6 12 12 16 14" />
  </Svg>
);

export const SunsetIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Path d="M12 10V2M4.93 10.93l-1.41-1.41M19.07 10.93l1.41-1.41M2 18h20M4 22h16" />
    <Path d="M16 18a4 4 0 0 0-8 0" />
  </Svg>
);

export const ArrowRightIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Path d="M5 12h14M13 5l7 7-7 7" />
  </Svg>
);

export const SettingsIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </Svg>
);

export const ChevronRightIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Path d="M9 6l6 6-6 6" />
  </Svg>
);

export const PlusIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Path d="M12 5v14M5 12h14" />
  </Svg>
);

export const MailIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Rect x="3" y="5" width="18" height="14" rx="2" />
    <Path d="M3 7l9 6 9-6" />
  </Svg>
);

export const LockIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Rect x="4" y="11" width="16" height="10" rx="2" />
    <Path d="M8 11V7a4 4 0 1 1 8 0v4" />
  </Svg>
);

export const ZapIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill={color} />
  </Svg>
);

export const TargetIcon = ({ size, color = '#fff', strokeWidth }: IconProps) => (
  <Svg {...baseProps(size, strokeWidth)} stroke={color}>
    <Circle cx="12" cy="12" r="9" />
    <Circle cx="12" cy="12" r="5" />
    <Circle cx="12" cy="12" r="1.5" fill={color} />
  </Svg>
);
