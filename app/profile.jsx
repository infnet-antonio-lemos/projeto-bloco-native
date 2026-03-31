import { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { isWeb } from '../utils/platform';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, fontSize } from '../constants/theme';

export default function ProfileScreen() {
  const { user, logout, updateProfilePicture } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const cameraRef = useRef(null);
  const fileInputRef = useRef(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  async function pickFromCamera() {
    if (isWeb()) {
      const permission = cameraPermission?.granted
        ? cameraPermission
        : await requestCameraPermission();
      if (!permission.granted) {
        if (isWeb()) {
          window.alert('Permita o acesso à câmera nas configurações do navegador.');
        } else {
          Alert.alert('Permissão necessária', 'Permita o acesso à câmera nas configurações do navegador.');
        }
        return;
      }
      setShowCamera(true);
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita o acesso à câmera nas configurações do dispositivo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
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

  async function capturePhoto() {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      setShowCamera(false);
      setUploading(true);
      await updateProfilePicture(photo.uri);
    } finally {
      setUploading(false);
    }
  }

  async function pickFromGallery() {
    if (isWeb()) {
      fileInputRef.current?.click();
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita o acesso à galeria nas configurações do dispositivo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
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

  function handleWebFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploading(true);
    updateProfilePicture(url).finally(() => {
      setUploading(false);
      e.target.value = '';
    });
  }

  function handleChangePhoto() {
    if (isWeb()) {
      setShowPhotoMenu(true);
      return;
    }
    Alert.alert('Alterar foto de perfil', 'Escolha uma opção', [
      { text: 'Câmera', onPress: pickFromCamera },
      { text: 'Galeria', onPress: pickFromGallery },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  return (
    <>
      {isWeb() && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleWebFileChange}
        />
      )}

      <Modal
        visible={showPhotoMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPhotoMenu(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setShowPhotoMenu(false)}
        >
          <View style={styles.menuSheet}>
            <Text style={styles.menuTitle}>Alterar foto de perfil</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => { setShowPhotoMenu(false); pickFromCamera(); }}
            >
              <MaterialIcons name="camera-alt" size={20} color={colors.primary} style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Câmera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => { setShowPhotoMenu(false); pickFromGallery(); }}
            >
              <MaterialIcons name="photo-library" size={20} color={colors.primary} style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Galeria</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemCancel]}
              onPress={() => setShowPhotoMenu(false)}
            >
              <Text style={styles.menuItemCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showCamera}
        animationType="slide"
        onRequestClose={() => setShowCamera(false)}
      >
        <View style={styles.cameraContainer}>
          <CameraView ref={cameraRef} style={styles.camera} facing="user" />
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.cameraCancelBtn}
              onPress={() => setShowCamera(false)}
              accessibilityLabel="Fechar câmera"
            >
              <MaterialIcons name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.captureBtn}
              onPress={capturePhoto}
              accessibilityLabel="Tirar foto"
            >
              <View style={styles.captureBtnInner} />
            </TouchableOpacity>
            <View style={{ width: 56 }} />
          </View>
        </View>
      </Modal>

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
    </>
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

  /* Web photo menu */
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  menuSheet: {
    backgroundColor: colors.backgroundCard,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  menuTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderColor,
  },
  menuItemIcon: {
    marginRight: spacing.md,
  },
  menuItemText: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
  },
  menuItemCancel: {
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  menuItemCancelText: {
    color: colors.errorColor,
    fontSize: fontSize.lg,
    fontWeight: '600',
    textAlign: 'center',
  },

  /* Web camera modal */
  cameraContainer: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    backgroundColor: colors.backgroundDark,
  },
  cameraCancelBtn: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtnInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.textPrimary,
  },
});
