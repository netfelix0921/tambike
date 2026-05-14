import { StyleSheet, View } from 'react-native';
import { theme } from '@/theme';
import { IconButton } from '@/components/ui';
import { PauseIcon, PlayIcon, StopIcon } from '@/components/icons';

export interface RideControlsProps {
  status: 'idle' | 'recording' | 'paused';
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

/**
 * Big, glove-friendly controls for during-the-ride operation.
 */
export function RideControls({ status, onStart, onPause, onResume, onStop }: RideControlsProps) {
  return (
    <View style={styles.row}>
      {status === 'recording' ? (
        <>
          <IconButton
            size={68}
            variant="tonal"
            icon={<StopIcon color={theme.colors.danger} size={28} />}
            onPress={onStop}
            accessibilityLabel="Stop ride"
          />
          <IconButton
            size={84}
            variant="solid"
            icon={<PauseIcon color={theme.colors.textInverse} size={32} />}
            onPress={onPause}
            accessibilityLabel="Pause ride"
          />
        </>
      ) : status === 'paused' ? (
        <>
          <IconButton
            size={68}
            variant="tonal"
            icon={<StopIcon color={theme.colors.danger} size={28} />}
            onPress={onStop}
            accessibilityLabel="End ride"
          />
          <IconButton
            size={84}
            variant="solid"
            icon={<PlayIcon color={theme.colors.textInverse} size={32} />}
            onPress={onResume}
            accessibilityLabel="Resume ride"
          />
        </>
      ) : (
        <IconButton
          size={84}
          variant="solid"
          icon={<PlayIcon color={theme.colors.textInverse} size={36} />}
          onPress={onStart}
          accessibilityLabel="Start ride"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xl,
  },
});
