import { TouchableOpacity, TouchableNativeFeedback, View } from 'react-native';
import { isAndroid } from '../../utils/platform';

/**
 * Platform-aware pressable component.
 * Android: Material ripple via TouchableNativeFeedback.
 * iOS:     Opacity fade via TouchableOpacity.
 */
export default function PlatformPressable({ onPress, style, children, disabled }) {
  if (isAndroid()) {
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        disabled={disabled}
        background={TouchableNativeFeedback.Ripple('rgba(0,212,255,0.18)', false)}
        useForeground={TouchableNativeFeedback.canUseNativeForeground()}
      >
        <View style={[style, { overflow: 'hidden' }]}>{children}</View>
      </TouchableNativeFeedback>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.7} disabled={disabled}>
      {children}
    </TouchableOpacity>
  );
}
