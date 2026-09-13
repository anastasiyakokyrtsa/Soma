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
  // Tokens matched to BreathingInfoScreen's own bottom card (2026-09-13, her
  // ask) - cardFillFallback/radius.card/32px top padding/centered bold title
  // all come from there, for the two info-panels in the app to feel like one
  // family. Paragraph body stays textSecondary (not Breathing's textPrimary)
  // and left-aligned (not centered) on purpose: Breathing's description is
  // one short centered line of primary content, this is 3 full paragraphs of
  // supplementary reading - centering multi-line body text makes it harder
  // to read, and this is meant to sit quieter than the screen's real content.
  sheet: {
    backgroundColor: colors.cardFillFallback,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderBottomWidth: 0,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.borderDefault,
    marginBottom: 20,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    lineHeight: 24 * 1.2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  paragraph: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 16 * 1.4,
    color: colors.textSecondary,
    textAlign: 'left',
  },
  paragraphSpacing: {
    marginTop: 14,
  },
});
