import { Platform } from 'react-native';

export const getOS = () => {
  const simulated = process.env.EXPO_PUBLIC_SIMULATE_OS;
  return simulated || Platform.OS;
};

export const isIOS = () => getOS() === 'ios';
export const isAndroid = () => getOS() === 'android';
export const isWeb = () => getOS() === 'web';

export const platformSelect = (specifics) => {
  const os = getOS();
  return os in specifics ? specifics[os] : specifics.default;
};
