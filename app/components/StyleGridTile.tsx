import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, fontFamily, radius } from '../theme';
import { StyleSwatch } from './StyleSwatch';
import type { VisualStyleId } from '../theme/visualStyles';

// Grid cell for the 2x2 style picker (WF 12). Selection here deliberately
// does NOT reuse the OptionRow/SelectChip/ExpandableChoiceCard "violet tint
// overlay" recipe — tinting the fill would misrepresent what the style
// actually looks like, which defeats the point of a live color preview.
// Selection reads instead through a thicker violet border + glow, same
// language, different mechanism, chosen on purpose for this one case.
export function StyleGridTile({
  styleId,
  name,
  size,
  selected,
  onPress,
}: {
  styleId: VisualStyleId;
  name: string;
  size: number;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.wrap, { width: size, height: size }, selected && styles.wrapSelected]}
      onPress={onPress}
    >
      <StyleSwatch styleId={styleId} width={size} height={size} />
      {/* A self-contained pill reads more deliberate than a bottom gradient
          wash (previous version — "видно резкую нижнюю линию" per review),
          and — unlike a scrim — stays legible regardless of whether the
          swatch under it happens to be dark (Cosmos, Focus) or light (Dawn's
          pastel sky), since it carries its own background either way. */}
      <View style={styles.labelChip}>
        <Text style={styles.label}>{name}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
  },
  // Border width matched to the primary/secondary buttons' own border
  // (1.5px, style.css .btn-secondary) — 2.5px read as too heavy next to
  // everything else in this app (2026-08-08 review). Glow kept as-is.
  wrapSelected: {
    borderWidth: 1.5,
    borderColor: colors.violet400,
    boxShadow: '0px 0px 15px rgba(139,124,246,0.6)',
  },
  labelChip: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    backgroundColor: 'rgba(5,8,22,0.55)',
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  label: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: colors.textPrimary,
  },
});
