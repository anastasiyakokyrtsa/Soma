import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamily, radius } from '../theme';

// Reusable bottom sheet for optional "what does this mean" explanations —
// first use: the biorhythm-model disclaimer (audit findings #3/#9, owner+
// mentor confirmed 2026-09-05/13). Opened from an (i) button, never forced,
// no confirm button — this is reference info, not a choice to agree to.
// Uses Modal's native slide animation rather than a hand-rolled Reanimated
// gesture sheet - this is a low-stakes, one-off disclaimer, not worth the
// extra moving parts.
export function InfoSheet({
  visible,
  onClose,
  title,
  paragraphs,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  paragraphs: string[];
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Pressable style={styles.scrimTap} onPress={onClose} accessibilityRole="button" accessibilityLabel="Закрыть" />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>
          {paragraphs.map((p, i) => (
            <Text key={i} style={[styles.paragraph, i > 0 && styles.paragraphSpacing]}>
              {p}
            </Text>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrimTap: {
    flex: 1,
    backgroundColor: 'rgba(3,4,10,0.55)',
  },
  sheet: {
    backgroundColor: colors.cardFillSmFallback,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderBottomWidth: 0,
    paddingHorizontal: 24,
    paddingTop: 14,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.borderDefault,
    marginBottom: 18,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  paragraph: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 15 * 1.6,
    color: colors.textSecondary,
  },
  paragraphSpacing: {
    marginTop: 14,
  },
});
