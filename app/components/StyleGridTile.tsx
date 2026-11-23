import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, fontFamily, radius } from '../theme';
import { StyleSwatch } from './StyleSwatch';
import { EyeIcon } from './icons/EyeIcon';
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
  onPressPreview,
  available = true,
  soonLabel,
}: {
  styleId: VisualStyleId;
  name: string;
  size: number;
  selected: boolean;
  onPress: () => void;
  onPressPreview: () => void;
  // Her catch (2026-11-23): picking Focus/Nature/Dawn here looked like a
  // real style change but doesn't actually re-theme the app yet (only
  // Cosmos is a real built theme, see theme/visualStyles.ts's own comment).
  // Selection disabled for these, same honest-unavailable convention as
  // NavChip/TeaCategoriesScreen/RadioChoiceCard - preview stays tappable on
  // purpose (looking costs nothing and isn't a false promise the way
  // letting someone "pick" it would be).
  available?: boolean;
  soonLabel?: string;
}) {
  return (
    <Pressable
      disabled={!available}
      style={[styles.wrap, { width: size, height: size }, selected && styles.wrapSelected, !available && styles.wrapUnavailable]}
      onPress={available ? onPress : undefined}
    >
      <StyleSwatch styleId={styleId} width={size} height={size} />
      {/* A self-contained pill reads more deliberate than a bottom gradient
          wash (previous version — "видно резкую нижнюю линию" per review),
          and — unlike a scrim — stays legible regardless of whether the
          swatch under it happens to be dark (Cosmos, Focus) or light (Dawn's
          pastel sky), since it carries its own background either way. */}
      <View style={styles.labelChip}>
        <Text style={styles.label}>{name}</Text>
        {!available && soonLabel ? <Text style={styles.soonLabel}>{soonLabel}</Text> : null}
      </View>
      {/* Replaces the screen-level "Предпросмотр" button (2026-09-20, "много
          места все это занимает") — same translucent-dark backdrop recipe as
          labelChip, for the same reason: stays legible over any swatch
          color. A nested Pressable inside the tile's own Pressable — RN's
          responder system gives the tap to whichever one is actually under
          the finger, so this doesn't also trigger tile selection. */}
      <Pressable style={styles.previewButton} onPress={onPressPreview} hitSlop={8}>
        <EyeIcon size={18} color={colors.textPrimary} />
      </Pressable>
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
  // Opacity-only, same convention as NavChip/TeaCategoriesScreen/
  // RadioChoiceCard's own unavailable state - the swatch itself (not just
  // the label chip) dims too, since it's the whole tile that isn't real yet.
  wrapUnavailable: {
    opacity: 0.55,
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
    fontSize: 15,
    color: colors.textPrimary,
  },
  soonLabel: {
    marginTop: 1,
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.textSecondary,
  },
  previewButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(5,8,22,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
