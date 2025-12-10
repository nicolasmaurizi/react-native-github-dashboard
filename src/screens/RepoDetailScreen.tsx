import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../App";
import { useTheme } from "../theme/ThemeContext";
import { useI18n } from "../i18n/I18nContext";
import { useGithubRepoDetail } from "../hooks/useGithubRepoDetail";

type RepoDetailRouteProp = RouteProp<RootStackParamList, "RepoDetail">;
type NavProp = NativeStackNavigationProp<RootStackParamList, "RepoDetail">;

export const RepoDetailScreen: React.FC = () => {
  const { params } = useRoute<RepoDetailRouteProp>();
  const navigation = useNavigation<NavProp>();
  const { owner, repoName } = params;

  const { theme } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();

  const { data: repo, isLoading, error } = useGithubRepoDetail(owner, repoName);

  const handleOpenGithub = () => {
    if (repo?.html_url) {
      Linking.openURL(repo.html_url).catch(() => {});
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={["top", "bottom"]}
    >
      {/* Padding interno */}
      <View
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 8,
        }}
      >
        {/* Header con botón de back */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: theme.border,
              marginRight: 12,
            }}
          >
            <Text style={{ color: theme.text, fontSize: 14 }}>{"‹ "}{t("back") ?? "Back"}</Text>
          </Pressable>

          <Text
            style={{
              color: theme.text,
              fontSize: 18,
              fontWeight: "600",
              flexShrink: 1,
            }}
            numberOfLines={1}
          >
            {repoName}
          </Text>
        </View>

        {/* Contenido principal */}
        {isLoading && (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator />
            <Text style={{ color: theme.muted, marginTop: 8 }}>
              {t("loading")}
            </Text>
          </View>
        )}

        {error && !isLoading && (
          <View style={{ paddingVertical: 16 }}>
            <Text style={{ color: "#f97316" }}>
              {t("error")}: {String(error.message)}
            </Text>
          </View>
        )}

        {!isLoading && !error && repo && (
          <ScrollView
            contentContainerStyle={{
              paddingBottom: insets.bottom + 24, 
            }}
          >
            <Text
              style={{
                color: theme.text,
                fontSize: 20,
                fontWeight: "700",
                marginBottom: 8,
              }}
            >
              {repo.full_name}
            </Text>

            {repo.description && (
              <Text
                style={{
                  color: theme.muted,
                  marginBottom: 12,
                }}
              >
                {repo.description}
              </Text>
            )}

            <View
              style={{
                backgroundColor: theme.card,
                padding: 12,
                borderRadius: 12,
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  color: theme.text,
                  fontSize: 14,
                  fontWeight: "600",
                  marginBottom: 6,
                }}
              >
                {t("repoInfo") ?? "Repository info"}
              </Text>

              <Text style={{ color: theme.muted, marginBottom: 4 }}>
                ⭐ {t("stars") ?? "Stars"}: {repo.stargazers_count}
              </Text>
              <Text style={{ color: theme.muted, marginBottom: 4 }}>
                🍴 {t("forks") ?? "Forks"}: {repo.forks_count}
              </Text>
              <Text style={{ color: theme.muted, marginBottom: 4 }}>
                🧪 {t("issues") ?? "Open issues"}: {repo.open_issues_count}
              </Text>
              <Text style={{ color: theme.muted, marginBottom: 4 }}>
                🧷 {t("language") ?? "Language"}:{" "}
                {repo.language ?? "Unknown"}
              </Text>
              <Text style={{ color: theme.muted }}>
                {t("updated")}:{" "}
                {new Date(repo.updated_at).toLocaleString()}
              </Text>
            </View>

            {/* Botón para abrir en GitHub */}
            <Pressable
              onPress={handleOpenGithub}
              style={{
                backgroundColor: theme.accent,
                paddingVertical: 12,
                borderRadius: 999,
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <Text
                style={{
                  color: "#0b1120",
                  fontWeight: "700",
                  fontSize: 14,
                }}
              >
                {t("openInGithub") ?? "Open in GitHub"}
              </Text>
            </Pressable>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};
