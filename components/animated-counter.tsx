import React, { useEffect, useRef, useState } from 'react';
import { Text, type TextStyle } from 'react-native';
import { Fonts } from '@/constants/Typography';
import { useTheme } from '@/components/theme-context';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  style?: TextStyle;
}

export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1500,
  style,
}: AnimatedCounterProps) {
  const { colors } = useTheme();
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const startValueRef = useRef<number>(0);

  useEffect(() => {
    startValueRef.current = display;
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current =
        startValueRef.current + (value - startValueRef.current) * eased;

      setDisplay(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  const formatted = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString();

  return (
    <Text
      selectable
      style={[
        {
          fontFamily: Fonts.extraBold,
          fontSize: 32,
          color: colors.textPrimary,
          fontVariant: ['tabular-nums'],
        },
        style,
      ]}
    >
      {prefix}
      {formatted}
      {suffix}
    </Text>
  );
}
