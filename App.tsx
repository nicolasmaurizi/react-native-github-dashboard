// App.tsx
import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { DashboardScreen } from "./src/screens/DashboardScreen";
import { RepoDetailScreen } from "./src/screens/RepoDetailScreen";
import { ThemeProvider } from "./src/theme/ThemeContext";
import { I18nProvider } from "./src/i18n/I18nContext";

export type RootStackParamList = {
  Dashboard: undefined;
  RepoDetail: { owner: string; repoName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// 👇 Crear el QueryClient UNA sola vez, fuera del componente
const queryClient = new QueryClient();

export default function App() {
  console.log("🔥 App real render");

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <I18nProvider>
            <NavigationContainer>
              <StatusBar
                barStyle="light-content"
                backgroundColor="#020617"
              />
              <Stack.Navigator
                initialRouteName="Dashboard"
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen
                  name="Dashboard"
                  component={DashboardScreen}
                />
                <Stack.Screen
                  name="RepoDetail"
                  component={RepoDetailScreen}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </I18nProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
