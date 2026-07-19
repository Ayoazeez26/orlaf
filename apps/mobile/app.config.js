export default {
  expo: {
    scheme: "sabletv",
    name: "Sable TV",
    slug: "sable-tv",
    userInterfaceStyle: "automatic",
    orientation: "default",
    web: {
      output: "static",
    },
    plugins: [
      "expo-router",
      "expo-video",
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme:
            "com.googleusercontent.apps.300592513583-st367gcou3n8oid5s1a5oa6430oj85n6",
        },
      ],
      "expo-secure-store",
      [
        "expo-build-properties",
        {
          ios: {
            extraPods: [{ name: "AppCheckCore", version: "11.2.0" }],
          },
        },
      ],
    ],
    android: {
      package: "com.clan.sabletv",
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ??
        "./android/app/google-services.json",
    },
    ios: {
      bundleIdentifier: "com.clan.sabletv",
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON_IOS ?? "./GoogleService-Info.plist",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "https://api.sable.app",
      googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      router: {},
      eas: {
        projectId: "24b7e2c2-a320-4cff-9b1d-1633f8684544",
      },
    },
  },
}
