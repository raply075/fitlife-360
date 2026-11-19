import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius } from '../theme';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'hijau' | 'makanan' | 'lari' | 'auth';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  style,
}) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'hijau':
        return { backgroundColor: colors.cardHijau, borderColor: colors.primary };
      case 'makanan':
        return { backgroundColor: colors.cardMakanan, borderColor: colors.warning };
      case 'lari':
        return { backgroundColor: colors.cardLari, borderColor: colors.info };
      case 'auth':
        return { backgroundColor: colors.cardAuth, borderColor: colors.primary };
      default:
        return { backgroundColor: colors.white, borderColor: colors.border };
    }
  };

  return (
    <View style={[styles.card, getVariantStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    marginVertical: spacing.xs,
    shadowColor: colors.slate,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
});
