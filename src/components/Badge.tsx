import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

export interface BadgeProps {
  label: string;
  variant?: 'green' | 'amber' | 'blue' | 'purple' | 'slate' | 'teal';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'green',
}) => {
  const getStyle = () => {
    switch (variant) {
      case 'amber':
        return { bg: colors.cardMakanan, text: colors.warning };
      case 'blue':
        return { bg: colors.cardLari, text: colors.info };
      case 'purple':
        return { bg: colors.cardAuth, text: '#7E22CE' };
      case 'teal':
        return { bg: '#CCFBF1', text: '#0F766E' };
      case 'slate':
        return { bg: colors.borderLight, text: colors.slateMuted };
      default:
        return { bg: colors.cardHijau, text: colors.forest };
    }
  };

  const current = getStyle();

  return (
    <View style={[styles.badge, { backgroundColor: current.bg }]}>
      <Text style={[styles.label, { color: current.text }]}>{label}</Text>
    </View>
  );
};

export interface ProgressBarProps {
  progress: number; // 0 sampai 1
  color?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = colors.primary,
  height = 8,
}) => {
  const clamped = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={[styles.progressTrack, { height }]}>
      <View
        style={[
          styles.progressFill,
          { width: `${clamped * 100}%`, backgroundColor: color, height },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 1,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  progressTrack: {
    width: '100%',
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: borderRadius.full,
  },
});
