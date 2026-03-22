import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from 'react-native-reanimated';
import { Fonts } from '@/constants/Typography';
import { useTheme } from '@/components/theme-context';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface PieChartProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function PieChart({
  percentage,
  size = 140,
  strokeWidth = 13,
  label = 'Win Rate',
}: PieChartProps) {
  const { colors, mode } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(circumference);

  useEffect(() => {
    const target = circumference - (percentage / 100) * circumference;
    progress.value = withTiming(target, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentage]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: progress.value,
  }));

  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} style={{ position: 'absolute' }}>
          <Defs>
            <LinearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#00D4AA" />
              <Stop offset="100%" stopColor="#6C63FF" />
            </LinearGradient>
          </Defs>
          {/* Background track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated arc with gradient */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#chartGrad)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${circumference}`}
            animatedProps={animatedProps}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <Text
          selectable
          style={{
            fontFamily: Fonts.extraBold,
            fontSize: 20,
            color: colors.textPrimary,
            fontVariant: ['tabular-nums'],
            letterSpacing: -0.5,
          }}
        >
          {percentage.toFixed(1)}%
        </Text>
      </View>
      {label ? (
        <Text
          style={{
            fontFamily: Fonts.medium,
            fontSize: 12,
            color: colors.textTertiary,
          }}
        >
          {label}
        </Text>
      ) : null}
    </View>
  );
}
