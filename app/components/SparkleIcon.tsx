import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function SparkleIcon({ size = 22, color = '#16a34a', style }: { size?: number; color?: string; style?: any }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <Path d="M9.937 15.5 A2 2 0 0 0 8.5 14.063 l-6.135-1.582 a.5.5 0 0 1-.962 0 L8.5 9.936 A2 2 0 0 0 9.937 8.5 l1.582-6.135 a.5.5 0 0 1 .963 0 l1.582 6.135 A2 2 0 0 0 15.5 9.937 l6.135 1.581 a.5.5 0 0 1 .964 0 l-6.135 1.581 A2 2 0 0 0 14.063 15.5 l-1.581 6.135 a.5.5 0 0 1-.963 0 z" />
      <Path d="M20 3v4" />
      <Path d="M22 5h-4" />
      <Path d="M4 17v2" />
      <Path d="M5 18h3" />
    </Svg>
  );
} 