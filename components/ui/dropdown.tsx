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
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const selectedOption = options.find((o) => o.value === value);

  return (
    <View style={{ gap: 6 }}>
      {label && (
        <Text
          style={{
            fontFamily: Fonts.medium,
            fontSize: 13,
            color: colors.textSecondary,
            marginLeft: 2,
          }}
        >
          {label}
        </Text>
      )}
      <Pressable
        onPress={() => setVisible(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.inputBackground,
          borderRadius: 12,
          borderCurve: 'continuous',
          borderWidth: 1.5,
          borderColor: error ? colors.error : colors.inputBorder,
          paddingHorizontal: 14,
          paddingVertical: 14,
        }}
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
            fontFamily: Fonts.regular,
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
              backgroundColor: colors.card,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderCurve: 'continuous',
              paddingBottom: insets.bottom + 8,
              maxHeight: '60%',
            }}
          >
            <View
              style={{
                alignItems: 'center',
                paddingVertical: 12,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: colors.border,
                }}
              />
            </View>
            {label && (
              <Text
                style={{
                  fontFamily: Fonts.semiBold,
                  fontSize: 16,
                  color: colors.textPrimary,
                  paddingHorizontal: 20,
                  paddingBottom: 12,
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
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingHorizontal: 20,
                      paddingVertical: 14,
                      backgroundColor: isSelected
                        ? colors.primaryMuted
                        : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: isSelected ? Fonts.semiBold : Fonts.regular,
                        fontSize: 16,
                        color: isSelected
                          ? colors.primary
                          : colors.textPrimary,
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
