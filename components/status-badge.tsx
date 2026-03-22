import React from 'react';
import { View, Text } from 'react-native';
import { Fonts } from '@/constants/Typography';
import { StatusColors } from '@/constants/Colors';
import type { ContestStatus } from '@/store/types';

interface StatusBadgeProps {
  status: ContestStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const colorSet = StatusColors[status] || StatusColors.Draft;
  const isSmall = size === 'sm';

  return (
    <View
      style={{
        backgroundColor: colorSet.bg,
        paddingHorizontal: isSmall ? 10 : 14,
        paddingVertical: isSmall ? 4 : 6,
        borderRadius: 20,
        borderCurve: 'continuous',
        alignSelf: 'flex-start',
      }}
    >
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
