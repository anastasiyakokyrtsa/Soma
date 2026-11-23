import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, fontFamily, radius, type } from '../theme';

// Replaces ExpandableChoiceCard on "Choose an approach" (WF 10-11) — she found
// the accordion visual unsatisfying and asked for a static radio-select card
// instead (reference: kit's "Radio Group" pattern, index.html ~L449). Card
// selected-state recipe (borderVioletFlat + faint violet tint) is reused as-is
// from ExpandableChoiceCard.cardExpanded rather than invented fresh, for the
// same "choice card family" consistency reason that file's own comment gives.
//
// Deviates from the kit's literal .radio CSS in two ways, deliberately, not by
// oversight:
// - No box-shadow glow on the selected radio/card. Established app-wide rule:
//   glow is reserved for buttons only, selection state reads through border
//   color, not glow (see memory/project_app_development.md).
// - Unchecked radio uses a flat neutral border (borderDefault), not the kit's
//   always-on violet gradient-border ring - matches both her reference
//   screenshot (plain outline when unselected) and this app's own established
//   convention that violet border = active/selected, not a permanent tint.
const RADIO_SIZE = 24;
const CARD_PADDING = 16;
const TEXT_GAP = 4;
const TITLE_LINE_HEIGHT = 18 * 1.1;
const DESCRIPTION_LINE_HEIGHT = 16 * 1.3;
// Reserves room for the tallest (2-line) description so all three cards land
// on the same height regardless of how short their own text is - the block
// itself (title+gap+text, gap untouched) is then centered in that extra room
// via `card.justifyContent: 'center'`, not stretched/centered internally.
const CARD_MIN_HEIGHT = CARD_PADDING * 2 + TITLE_LINE_HEIGHT + TEXT_GAP + DESCRIPTION_LINE_HEIGHT * 2;

export function RadioChoiceCard({
  title,
  description,
  selected,
  onPress,
  available = true,
  soonLabel,
}: {
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
  // Her catch (2026-11-23, ChooseApproachScreen): picking "Астрологический"
  // or "Синтез двух систем" looked like a real choice but led to exactly
  // the same screens as "Научно-практический" - only that one is actually
  // built. Same honest-unavailable-state convention as NavChip/
  // TeaCategoriesScreen (dim + a small "Скоро" caption), not a new pattern.
  available?: boolean;
  soonLabel?: string;
}) {
  return (
    <Pressable
      disabled={!available}
      style={[styles.card, selected && styles.cardSelected, !available && styles.cardUnavailable]}
      onPress={available ? onPress : undefined}
    >
      <View style={styles.row}>
        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected ? <View style={styles.radioDot} /> : null}
        </View>
        <View style={styles.textCol}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            {!available && soonLabel ? <Text style={styles.soonBadgeText}>{soonLabel}</Text> : null}
          </View>
          <Text style={styles.description}>{description}</Text>
        </View>
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
    padding: CARD_PADDING,
    minHeight: CARD_MIN_HEIGHT,
    justifyContent: 'center',
  },
  cardSelected: {
    borderColor: colors.borderVioletFlat,
    backgroundColor: 'rgba(139,124,246,0.12)',
  },
  // Same opacity-only dimming NavChip/TeaCategoriesScreen already use for
  // an unavailable card, not a new treatment.
  cardUnavailable: {
    opacity: 0.55,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textCol: {
    flex: 1,
    gap: TEXT_GAP,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // Plain text, no pill background - matches NavChip's own soonLabel
  // treatment exactly, not a new badge style.
  soonBadgeText: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  radio: {
    width: RADIO_SIZE,
    height: RADIO_SIZE,
    borderRadius: RADIO_SIZE / 2,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.violet400,
  },
  radioDot: {
    width: RADIO_SIZE - 10,
    height: RADIO_SIZE - 10,
    borderRadius: (RADIO_SIZE - 10) / 2,
    backgroundColor: colors.violet400,
  },
  title: {
    // One step heavier than semiBold, but still Nunito Sans, not the
    // `fontFamily.bold` token (that's Onest, reserved for screen headlines -
    // this is a card title, not one) - literal 'NunitoSans_700Bold', loaded
    // for just this in App.tsx (her call, 2026-10-11).
    fontFamily: 'NunitoSans_700Bold',
    fontSize: 18,
    lineHeight: TITLE_LINE_HEIGHT,
    color: colors.textPrimary,
  },
  description: {
    fontFamily: type.bodyM.fontFamily,
    fontSize: 16,
    lineHeight: DESCRIPTION_LINE_HEIGHT,
    color: colors.textSecondary,
  },
});
