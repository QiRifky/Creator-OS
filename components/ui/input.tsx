import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Fonts } from '@/constants/Typography';
import { useTheme } from '@/components/theme-context';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export function Input({
  label,
  error,
  icon,
  isPassword,
  ...props
}: InputProps) {
  const { colors, mode } = useTheme();
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={{ gap: 7 }}>
      {label && (
        <Text
          style={{
            fontFamily: Fonts.medium,
            fontSize: 13,
            color: focused ? colors.primary : colors.textSecondary,
            marginLeft: 2,
            letterSpacing: 0.1,
          }}
        >
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: mode === 'dark' ? colors.surface : colors.inputBackground,
          borderRadius: 14,
          borderCurve: 'continuous',
          borderWidth: 1.5,
          borderColor: error
            ? colors.error
            : focused
            ? colors.primary
            : colors.inputBorder,
          paddingHorizontal: 16,
          gap: 12,
          boxShadow: focused
            ? `0 0 0 3px ${error ? colors.errorMuted : colors.primaryMuted}`
            : undefined,
        }}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={focused ? colors.primary : colors.textTertiary}
          />
        )}
        <TextInput
          {...props}
          secureTextEntry={isPassword && !showPassword}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor={colors.textTertiary}
          style={{
            flex: 1,
            fontFamily: Fonts.regular,
            fontSize: 15,
            color: colors.textPrimary,
            paddingVertical: 15,
          }}
        />
        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={12}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textTertiary}
            />
          </Pressable>
        )}
      </View>
      {error && (
        <Text
          selectable
          style={{
            fontFamily: Fonts.medium,
            fontSize: 12,
            color: colors.error,
            marginLeft: 2,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
