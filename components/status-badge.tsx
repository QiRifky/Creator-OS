import React from 'react';
import { View, Text } from 'react-native';
import { Fonts } from '@/constants/Typography';
import { StatusColors } from '@/constants/Colors';
import { useTheme } from '@/components/theme-context';
import type { ContestStatus } from '@/store/types';

interface StatusBadgeProps {
  status: ContestStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const { mode } = useTheme();
  const colorSet = StatusColors[status] || StatusColors.Draft;
  const isSmall = size === 'sm';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colorSet.bg,
        paddingHorizontal: isSmall ? 10 : 14,
        paddingVertical: isSmall ? 4 : 6,
        borderRadius: 8,
        borderCurve: 'continuous',
        alignSelf: 'flex-start',
        gap: 5,
        boxShadow: mode === 'dark' && status !== 'Draft'
          ? `0 0 8px ${colorSet.glow}`
          : undefined,
      }}
    >
      {/* Indicator dot */}
      <View
        style={{
          width: isSmall ? 5 : 6,
          height: isSmall ? 5 : 6,
          borderRadius: 3,
          backgroundColor: colorSet.text,
        }}
      />
      <Text
        style={{
          fontFamily: Fonts.semiBold,
          fontSize: isSmall ? 11 : 13,
          color: colorSet.text,
          letterSpacing: 0.2,
        }}
      >
        {status}
      </Text>
    </View>
  );
}
