import { ScrollView, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import { Chip } from '@/components/ui';
import { CoffeeIcon, SunsetIcon, ZapIcon, MapIcon } from '@/components/icons';
import type { RideType } from '@/types/ride';

interface Option {
  type: RideType;
  label: string;
  icon: (color: string) => JSX.Element;
}

const OPTIONS: Option[] = [
  { type: 'chill', label: 'Chill', icon: (c) => <MapIcon color={c} size={16} /> },
  { type: 'coffee', label: 'Coffee', icon: (c) => <CoffeeIcon color={c} size={16} /> },
  { type: 'sunset', label: 'Sunset', icon: (c) => <SunsetIcon color={c} size={16} /> },
  { type: 'training', label: 'Training', icon: (c) => <ZapIcon color={c} size={16} /> },
];

export interface RideTypeSelectorProps {
  value: RideType;
  onChange: (type: RideType) => void;
}

export function RideTypeSelector({ value, onChange }: RideTypeSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {OPTIONS.map((opt) => {
        const selected = value === opt.type;
        return (
          <Chip
            key={opt.type}
            label={opt.label}
            selected={selected}
            onPress={() => onChange(opt.type)}
            leftIcon={opt.icon(selected ? theme.colors.textInverse : theme.colors.brand500)}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: theme.spacing.sm, paddingVertical: 4 },
});
