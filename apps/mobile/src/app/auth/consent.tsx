import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { usePolicies, useRecordConsent } from "../../hooks/use-consent"

const POLICY_URLS = {
  terms: process.env.EXPO_PUBLIC_TERMS_URL ?? "https://sable.tv/legal/terms",
  privacy:
    process.env.EXPO_PUBLIC_PRIVACY_URL ?? "https://sable.tv/legal/privacy",
  community_guidelines:
    process.env.EXPO_PUBLIC_COMMUNITY_URL ?? "https://sable.tv/legal/community",
  payment:
    process.env.EXPO_PUBLIC_PAYMENT_URL ?? "https://sable.tv/legal/payment",
}

export default function ConsentScreen() {
  const [checked, setChecked] = useState(false)

  const policies = usePolicies()
  const recordConsent = useRecordConsent()

  const loading = recordConsent.isPending

  function handleContinue() {
    if (!checked || !policies.data || loading) return
    recordConsent.mutate(policies.data, {
      onError: () => {
        Alert.alert(
          "Something went wrong",
          "We couldn't record your consent. Please try again."
        )
      },
    })
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 items-center justify-center gap-8 px-6 py-16">
          {/* Wordmark */}
          <View className="items-center gap-1">
            <Text className="text-3xl text-white">
              <Text className="font-bold">Sable</Text> TV
            </Text>
            <Text className="text-center text-foreground text-sm">
              Before you continue, please review our policies.
            </Text>
          </View>

          {/* Card */}
          <View className="w-full gap-6 rounded-2xl border border-[#2E2E2E] bg-muted px-6 py-8">
            <View className="gap-2">
              <Text className="text-center font-bold text-white text-xl">
                Terms & Policies
              </Text>
              <Text className="text-center text-foreground text-sm">
                Please read and accept to continue.
              </Text>
            </View>

            {/* Loading policies */}
            {policies.isLoading && (
              <View className="items-center py-4">
                <ActivityIndicator color="#888" />
              </View>
            )}

            {/* Error loading policies */}
            {policies.isError && (
              <View className="items-center gap-3 py-2">
                <Text className="text-center text-red-400 text-sm">
                  Couldn't load policy versions. Check your connection.
                </Text>
                <TouchableOpacity
                  onPress={() => policies.refetch()}
                  className="rounded-lg border border-[#3A3A3A] px-6 py-2"
                >
                  <Text className="font-medium text-sm text-white">Retry</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Checkbox row — shown once policies are loaded */}
            {policies.isSuccess && (
              <TouchableOpacity
                onPress={() => setChecked(!checked)}
                className="flex-row items-start gap-3 active:opacity-70"
              >
                <View
                  className={`mt-0.5 h-5 w-5 items-center justify-center rounded border ${
                    checked
                      ? "border-primary bg-primary"
                      : "border-[#3A3A3A] bg-background"
                  }`}
                >
                  {checked && (
                    <Ionicons name="checkmark" size={13} color="#fff" />
                  )}
                </View>

                <Text className="flex-1 text-foreground text-sm leading-relaxed">
                  I have read, understood, and agree to the{" "}
                  <Text
                    className="font-medium text-primary"
                    onPress={() => Linking.openURL(POLICY_URLS.terms)}
                  >
                    Terms & Conditions
                  </Text>
                  {", "}
                  <Text
                    className="font-medium text-primary"
                    onPress={() => Linking.openURL(POLICY_URLS.privacy)}
                  >
                    Privacy Policy
                  </Text>
                  {", "}
                  <Text
                    className="font-medium text-primary"
                    onPress={() =>
                      Linking.openURL(POLICY_URLS.community_guidelines)
                    }
                  >
                    Community Guidelines
                  </Text>
                  {", and "}
                  <Text
                    className="font-medium text-primary"
                    onPress={() => Linking.openURL(POLICY_URLS.payment)}
                  >
                    Payment & Refund Policy
                  </Text>{" "}
                  of Sable TV.
                </Text>
              </TouchableOpacity>
            )}

            {/* Continue button */}
            <TouchableOpacity
              onPress={handleContinue}
              disabled={!checked || loading || !policies.isSuccess}
              className="items-center justify-center rounded-xl py-4"
              style={{
                backgroundColor:
                  checked && policies.isSuccess ? undefined : "#2A2A2A",
                opacity: !checked || !policies.isSuccess ? 0.6 : 1,
              }}
              {...(checked &&
                policies.isSuccess && {
                  className:
                    "items-center justify-center rounded-xl py-4 bg-primary active:opacity-80",
                })}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="font-semibold text-base text-white">
                  Continue
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
