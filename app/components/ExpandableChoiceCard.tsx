import { Platform, Pressable, Text, UIManager, View, LayoutAnimation, StyleSheet } from 'react-native';
import { colors, fontFamily, radius, type } from '../theme';
import { ChevronIcon } from './icons/ChevronIcon';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

// "Choose an approach" (WF 10-11) — a single-select accordion, not just a
// bigger OptionRow: tapping a collapsed card selects+expands it, collapsing
// whichever card was open before; tapping the already-expanded card again
// (including its chevron — the whole card is one Pressable) toggles it back
// closed/deselected. No Figma spec exists for this screen (same
// "screen-source reality" as Gender/Support — see
// memory/project_app_development.md), so this reuses the exact selected-state
// recipe already established on OptionRow/SelectChip (borderVioletFlat + a
// faint violet tint) rather than inventing a new one — consistency with the
// rest of the "choice" component family matters more here than a bespoke
// treatment.
//
// Expand/collapse uses RN's built-in LayoutAnimation (not Reanimated) — this
// is a genuine auto-height transition (the description's height isn't known
// ahead of time), which is exactly the case LayoutAnimation exists for, and
// it sidesteps the whole class of animated-Text-remeasure bugs hit while
// building TextField's floating label (see that file's comments) since
// nothing here animates a Text node's own font size.
export function ExpandableChoiceCard({
  title,
  description,
  expanded,
  onPress,
}: {
  title: string;
  description: string;
  expanded: boolean;
  onPress: () => void;
}) {
  const handlePress = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(220, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
    );
    onPress();
  };

  return (
    <Pressable style={[styles.card, expanded && styles.cardExpanded]} onPress={handlePress}>
      <Text style={styles.title}>{title}</Text>
      {expanded ? <Text style={styles.description}>{description}</Text> : null}
      <View style={styles.chevronRow}>
        <ChevronIcon direction={expanded ? 'up' : 'down'} color={colors.textPrimary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bg0,
    paddingVertical: 22,
    paddingHorizontal: 24,
  },
  cardExpanded: {
    borderColor: colors.borderVioletFlat,
    backgroundColor: 'rgba(139,124,246,0.12)',
  },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    fontFamily: type.bodyM.fontFamily,
    fontSize: 15,
    lineHeight: 15 * 1.1,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  chevronRow: {
    alignItems: 'center',
    marginTop: 12,
  },
});
