import { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, fontSize } from '../constants/theme';

export default function ProfileScreen() {
  const { user, logout, updateProfilePicture } = useAuth();
  const [uploading, setUploading] = useState(false);

  async function pickFromCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita o acesso à câmera nas configurações do dispositivo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setUploading(true);
      await updateProfilePicture(result.assets[0].uri);
      setUploading(false);
    }
  }

  async function pickFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita o acesso à galeria nas configurações do dispositivo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setUploading(true);
      await updateProfilePicture(result.assets[0].uri);
      setUploading(false);
    }
  }

  function handleChangePhoto() {
    Alert.alert('Alterar foto de perfil', 'Escolha uma opção', [
      { text: 'Câmera', onPress: pickFromCamera },
      { text: 'Galeria', onPress: pickFromGallery },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        {uploading ? (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : user?.profilePicture ? (
          <Image source={{ uri: user.profilePicture }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <MaterialIcons name="person" size={64} color={colors.textSecondary} />
          </View>
        )}

        <TouchableOpacity
          style={styles.cameraBtn}
          onPress={handleChangePhoto}
          activeOpacity={0.8}
          accessibilityLabel="Alterar foto de perfil"
        >
          <MaterialIcons name="camera-alt" size={18} color={colors.backgroundDark} />
        </TouchableOpacity>
      </View>

      {/* User info */}
      <Text style={styles.displayName}>{user?.displayName}</Text>
      <Text style={styles.username}>@{user?.username}</Text>

      {/* Change photo button */}
      <TouchableOpacity
        style={styles.changePhotoBtn}
        onPress={handleChangePhoto}
        activeOpacity={0.8}
        disabled={uploading}
      >
        <MaterialIcons name="photo-camera" size={18} color={colors.backgroundDark} style={styles.btnIcon} />
        <Text style={styles.changePhotoBtnText}>Alterar foto de perfil</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={logout}
        activeOpacity={0.8}
      >
        <MaterialIcons name="logout" size={18} color={colors.errorColor} style={styles.btnIcon} />
        <Text style={styles.logoutBtnText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const AVATAR_SIZE = 120;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
    paddingHorizontal: spacing.lg,
  },

  /* Avatar */
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  avatarPlaceholder: {
    backgroundColor: colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: colors.primary,
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.backgroundDark,
  },

  /* User info */
  displayName: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  username: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    marginBottom: spacing.xxl,
  },

  /* Change photo */
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    width: '100%',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  changePhotoBtnText: {
    color: colors.backgroundDark,
    fontSize: fontSize.md,
    fontWeight: '700',
  },

  /* Divider */
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.borderColor,
    marginVertical: spacing.xl,
  },

  /* Logout */
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.4)',
    borderRadius: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    width: '100%',
    justifyContent: 'center',
  },
  logoutBtnText: {
    color: colors.errorColor,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  btnIcon: {
    marginRight: spacing.sm,
  },
});
