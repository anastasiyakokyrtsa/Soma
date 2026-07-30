import { StyleSheet, Text, View } from 'react-native';
import { colors, type } from '../theme';

// Stand-in until each tab's real screen is built from Figma — swap out one at a
// time, same principle as the UI Kit: add what's missing as we get to it.
export function PlaceholderScreen({ label }: { label: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: colors.textSecondary,
    fontSize: type.bodyL.fontSize,
    fontWeight: type.bodyL.fontWeight,
  },
});
