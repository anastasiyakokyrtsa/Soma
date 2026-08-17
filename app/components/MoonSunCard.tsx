import { Image, View, Text, StyleSheet, type ImageSourcePropType } from 'react-native';
import { colors, fontFamily, radius } from '../theme';

// Ports UI Kit's "Moon and Sun Activity" card (.moonsun-card/-title/-img/
// -date/-phase/-rows/-row/-note, style.css ~L262-289) verbatim.
export function MoonSunCard({
  title,
  image,
  date,
  phase,
  rows,
  note,
}: {
  title: string;
  image: ImageSourcePropType;
  date: string;
  phase: string;
  rows: { label: string; value: string }[];
  note: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Image source={image} style={styles.img} resizeMode="cover" />
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.phase}>{phase}</Text>
      <View style={styles.rows}>
        {rows.map((r) => (
          <View key={r.label} style={styles.row}>
            <Text style={styles.rowLabel}>{r.label}</Text>
            <Text style={styles.rowValue}>{r.value}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.note}>{note}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 336,
    height: 487,
    alignItems: 'center',
    padding: 24,
    borderRadius: radius.lg,
    backgroundColor: colors.cardFillFallback,
  },
  title: {
    alignSelf: 'flex-start',
    fontFamily: fontFamily.bold,
    fontSize: 22,
    lineHeight: 22 * 1.2,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  img: {
    width: 110,
    height: 110,
    borderRadius: radius.sm,
    marginBottom: 16,
  },
  date: {
    fontFamily: fontFamily.light,
    fontSize: 14,
    lineHeight: 14 * 1.5,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  phase: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    lineHeight: 16 * 1.5,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  rows: {
    width: '100%',
    gap: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 28,
  },
  rowLabel: {
    width: 110,
    flexShrink: 0,
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 16 * 1.5,
    color: colors.textPrimary,
  },
  rowValue: {
    fontFamily: fontFamily.light,
    fontSize: 16,
    lineHeight: 16 * 1.5,
    color: colors.textPrimary,
  },
  note: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 16 * 1.3,
    color: colors.textPrimary,
  },
});
