/**
 * Token store — wraps expo-secure-store for OS secure storage.
 *
 * iOS: Keychain
 * Android: Keystore-backed EncryptedSharedPreferences
 *
 * Choice: expo-secure-store over react-native-keychain because the project
 * already uses Expo managed workflow and expo-secure-store ships with the
 * Expo SDK with no extra native config required.
 */
import * as SecureStore from "expo-secure-store"

const KEYS = {
  ACCESS_TOKEN: "sable_access_token",
  REFRESH_TOKEN: "sable_refresh_token",
} as const

export const TokenStore = {
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, accessToken),
      SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken),
    ])
  },

  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.ACCESS_TOKEN)
  },

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.REFRESH_TOKEN)
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN),
    ])
  },
}
