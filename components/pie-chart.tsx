import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Fonts } from '@/constants/Typography';
import { useTheme } from '@/components/theme-context';

interface PieChartProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function PieChart({
  percentage,
  size = 140,
  strokeWidth = 14,
  label = 'Win Rate',
}: PieChartProps) {
  const { colors } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} style={{ position: 'absolute' }}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.border}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Win segment */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.accent}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <Text
          selectable
          style={{
            fontFamily: Fonts.extraBold,
            fontSize: 22,
            color: colors.textPrimary,
            fontVariant: ['tabular-nums'],
          }}
        >
          {percentage.toFixed(1)}%
        </Text>
      </View>
      <Text
        style={{
          fontFamily: Fonts.medium,
          fontSize: 13,
          color: colors.textSecondary,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
