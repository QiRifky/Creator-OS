import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Fonts } from '@/constants/Typography';
import { useTheme } from '@/components/theme-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function Dropdown({
  label,
  placeholder = 'Select...',
  options,
  value,
  onChange,
  error,
}: DropdownProps) {
  const { colors, mode } = useTheme();
  const [visible, setVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const selectedOption = options.find((o) => o.value === value);

  return (
    <View style={{ gap: 7 }}>
      {label && (
        <Text
          style={{
            fontFamily: Fonts.medium,
            fontSize: 13,
            color: colors.textSecondary,
            marginLeft: 2,
            letterSpacing: 0.1,
          }}
        >
          {label}
        </Text>
      )}
      <Pressable
        onPress={() => setVisible(true)}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: mode === 'dark' ? colors.surface : colors.inputBackground,
          borderRadius: 14,
          borderCurve: 'continuous',
          borderWidth: 1.5,
          borderColor: error ? colors.error : colors.inputBorder,
          paddingHorizontal: 16,
          paddingVertical: 15,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <Text
          style={{
            fontFamily: Fonts.regular,
            fontSize: 15,
            color: selectedOption ? colors.textPrimary : colors.textTertiary,
          }}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={18}
          color={colors.textTertiary}
        />
      </Pressable>
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

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: colors.overlay,
            justifyContent: 'flex-end',
          }}
          onPress={() => setVisible(false)}
        >
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: mode === 'dark' ? colors.cardElevated : colors.card,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderCurve: 'continuous',
              paddingBottom: insets.bottom + 8,
              maxHeight: '55%',
              borderTopWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View style={{ alignItems: 'center', paddingVertical: 12 }}>
              <View
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: colors.textTertiary,
                  opacity: 0.4,
                }}
              />
            </View>
            {label && (
              <Text
                style={{
                  fontFamily: Fonts.bold,
                  fontSize: 17,
                  color: colors.textPrimary,
                  paddingHorizontal: 24,
                  paddingBottom: 14,
                  letterSpacing: -0.2,
                }}
              >
                {label}
              </Text>
            )}
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    onPress={() => {
                      onChange(item.value);
                      setVisible(false);
                    }}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingHorizontal: 24,
                      paddingVertical: 15,
                      backgroundColor: isSelected
                        ? colors.primaryMuted
                        : pressed
                        ? colors.borderSubtle
                        : 'transparent',
                    })}
                  >
                    <Text
                      style={{
                        fontFamily: isSelected ? Fonts.semiBold : Fonts.regular,
                        fontSize: 16,
                        color: isSelected ? colors.primary : colors.textPrimary,
                      }}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={colors.primary}
                      />
                    )}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
