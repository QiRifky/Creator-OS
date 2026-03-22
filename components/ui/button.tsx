import React, { useCallback } from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { Fonts } from '@/constants/Typography';
import { Gradients } from '@/constants/Colors';
import { useTheme } from '@/components/theme-context';
import * as Haptics from 'expo-haptics';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const { colors, mode } = useTheme();

  const handlePress = useCallback(() => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  }, [onPress]);

  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  const hasGradient = (isPrimary || isDanger) && !disabled;

  const getBackgroundColor = () => {
    if (disabled) return mode === 'dark' ? colors.cardElevated : colors.shimmer;
    switch (variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.primaryMuted;
      case 'danger': return colors.error;
      case 'ghost': return 'transparent';
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textTertiary;
    switch (variant) {
      case 'primary': return '#FFFFFF';
      case 'secondary': return colors.primary;
      case 'danger': return '#FFFFFF';
      case 'ghost': return colors.textSecondary;
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => {
        const base: ViewStyle = {
          backgroundColor: getBackgroundColor(),
          paddingVertical: 17,
          paddingHorizontal: 28,
          borderRadius: 16,
          borderCurve: 'continuous',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          transform: [{ scale: pressed ? 0.97 : 1 }],
          opacity: pressed ? 0.88 : 1,
        };

        // Gradient for primary/danger buttons
        if (hasGradient) {
          (base as Record<string, unknown>).experimental_backgroundImage =
            isPrimary ? Gradients.primaryButton : Gradients.dangerButton;
        }

        // Glow shadow when not pressed
        if (!pressed && isPrimary && !disabled) {
          base.boxShadow = `0 4px 20px ${colors.primaryGlow}`;
        } else if (!pressed && isDanger && !disabled) {
          base.boxShadow = '0 4px 16px rgba(255, 107, 107, 0.25)';
        }

        return [
          base,
          variant === 'secondary' && {
            borderWidth: 1,
            borderColor: mode === 'dark' ? 'rgba(108, 99, 255, 0.18)' : 'rgba(108, 99, 255, 0.12)',
          },
          variant === 'ghost' && { paddingVertical: 10, paddingHorizontal: 16 },
          style,
        ];
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              {
                fontFamily: Fonts.semiBold,
                fontSize: 16,
                color: getTextColor(),
                letterSpacing: 0.2,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}
