import { View } from 'react-native';
import { theme } from '@/theme';

export function Divider({ vertical = false, inset = 0 }: { vertical?: boolean; inset?: number }) {
  return (
    <View
      style={
        vertical
          ? { width: 1, alignSelf: 'stretch', backgroundColor: theme.colors.divider, marginVertical: inset }
          : { height: 1, alignSelf: 'stretch', backgroundColor: theme.colors.divider, marginHorizontal: inset }
      }
    />
  );
}
