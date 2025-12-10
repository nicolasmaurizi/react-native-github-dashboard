import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardScreen } from "../screens/DashboardScreen";
import { RepoDetailScreen } from "../screens/RepoDetailScreen";
import { ThemeProvider, useTheme } from "../theme/ThemeContext";
import { I18nProvider } from "../i18n/I18nContext";

export type RootStackParamList = {
	Dashboard: undefined;
	RepoDetail: { owner: string; repoName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

const ThemedNavigator: React.FC = () => {
	const { theme } = useTheme();

	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="Dashboard"
				screenOptions={{
					headerStyle: { backgroundColor: theme.background },
					headerTintColor: theme.text,
				}}
			>
				<Stack.Screen
					name="Dashboard"
					component={DashboardScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="RepoDetail"
					component={RepoDetailScreen}
					options={{ title: "Repo detail" }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export const AppNavigator: React.FC = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<I18nProvider>
				<ThemeProvider>
					<ThemedNavigator />
				</ThemeProvider>
			</I18nProvider>
		</QueryClientProvider>
	);
};
