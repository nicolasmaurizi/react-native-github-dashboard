import React, { useEffect, useState, useRef } from "react";
import {
	View,
	Text,
	TextInput,
	Image,
	ActivityIndicator,
	Pressable,
	Animated,
	StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGithubUser } from "../hooks/useGithubUser";
import { useGithubRepos } from "../hooks/useGithubRepos";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { useTheme } from "../theme/ThemeContext";
import { useI18n } from "../i18n/I18nContext";
import { computeGithubStats } from "../utils/githubStats";

export const DashboardScreen: React.FC = () => {
	const navigation =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { theme, toggleTheme } = useTheme();
	const { t, lang, toggleLang } = useI18n();

	const [inputUsername, setInputUsername] = useState("octocat");
	const [debouncedUsername, setDebouncedUsername] = useState("octocat");

	useEffect(() => {
		const id = setTimeout(() => {
			setDebouncedUsername(inputUsername.trim());
		}, 600);
		return () => clearTimeout(id);
	}, [inputUsername]);

	const {
		data: user,
		isLoading: isUserLoading,
		error: userError,
	} = useGithubUser(debouncedUsername);

	const {
		data: repos,
		isLoading: isReposLoading,
		error: reposError,
	} = useGithubRepos(debouncedUsername);

	const isLoading = isUserLoading || isReposLoading;
	const error = userError || reposError;

	const { totalRepos, totalStars, topLanguage, languagesChartData } =
		computeGithubStats(repos);

	const lastUpdatedRepo = (repos ?? [])[0];

	const maxLangCount =
		languagesChartData.length > 0
			? Math.max(...languagesChartData.map(([, count]) => count))
			: 0;

	const [refreshing, setRefreshing] = useState(false);
	const onRefresh = () => {
		setRefreshing(true);
		setTimeout(() => setRefreshing(false), 500);
	};

	const scrollY = useRef(new Animated.Value(0)).current;

	const langCardScale = scrollY.interpolate({
		inputRange: [0, 150],
		outputRange: [1, 0.8],
		extrapolate: "clamp",
	});

	const langCardOpacity = scrollY.interpolate({
		inputRange: [0, 150],
		outputRange: [1, 0],
		extrapolate: "clamp",
	});

	const langCardTranslateY = scrollY.interpolate({
		inputRange: [0, 150],
		outputRange: [0, -20],
		extrapolate: "clamp",
	});

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: theme.background }}
			edges={["top", "bottom"]}
		>
			<StatusBar
				backgroundColor={theme.background}
				barStyle={theme.name === "dark" ? "light-content" : "dark-content"}
			/>

			<View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8 }}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginBottom: 12,
						justifyContent: "space-between",
					}}
				>
					<Text
						style={{
							color: theme.text,
							fontSize: 22,
							fontWeight: "700",
						}}
					>
						{t("title")}
					</Text>

					<View style={{ flexDirection: "row" }}>
						<Pressable
							onPress={toggleLang}
							style={{
								paddingHorizontal: 8,
								paddingVertical: 4,
								borderRadius: 999,
								borderWidth: 1,
								borderColor: theme.border,
								marginRight: 8,
							}}
						>
							<Text style={{ color: theme.text, fontSize: 12 }}>
								{lang.toUpperCase()}
							</Text>
						</Pressable>

						<Pressable
							onPress={toggleTheme}
							style={{
								paddingHorizontal: 8,
								paddingVertical: 4,
								borderRadius: 999,
								borderWidth: 1,
								borderColor: theme.border,
							}}
						>
							<Text style={{ color: theme.text, fontSize: 12 }}>
								{theme.name === "dark" ? t("themeDark") : t("themeLight")}
							</Text>
						</Pressable>
					</View>
				</View>

				<TextInput
					value={inputUsername}
					onChangeText={setInputUsername}
					placeholder={t("placeholder")}
					placeholderTextColor={theme.muted}
					autoCapitalize="none"
					style={{
						borderRadius: 999,
						borderWidth: 1,
						borderColor: theme.border,
						paddingHorizontal: 16,
						paddingVertical: 8,
						color: theme.text,
						marginBottom: 16,
						backgroundColor:
							theme.name === "dark" ? "#020617" : "rgba(255,255,255,0.9)",
					}}
				/>

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

				{!isLoading && error && (
					<View style={{ paddingVertical: 16 }}>
						<Text style={{ color: "#f97316" }}>
							{t("error")}: {String(error.message)}
						</Text>
					</View>
				)}

				{!isLoading && !error && !user && (
					<View
						style={{
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Text style={{ color: theme.muted }}>
							{t("noUser") ?? "No user data yet."}
						</Text>
					</View>
				)}

				{!isLoading && !error && user && (
					<>
						{/* Perfil */}
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 16,
							}}
						>
							<Image
								source={{ uri: user.avatar_url }}
								style={{
									width: 64,
									height: 64,
									borderRadius: 999,
									marginRight: 12,
								}}
							/>
							<View style={{ flex: 1 }}>
								<Text
									style={{
										color: theme.text,
										fontSize: 18,
										fontWeight: "600",
									}}
								>
									{user.name ?? user.login}
								</Text>
								{user.bio && (
									<Text
										style={{ color: theme.muted, marginTop: 4 }}
										numberOfLines={2}
									>
										{user.bio}
									</Text>
								)}
								<View
									style={{
										flexDirection: "row",
										marginTop: 8,
										justifyContent: "space-between",
									}}
								>
									{[
										{ label: t("repos"), value: user.public_repos },
										{ label: t("followers"), value: user.followers },
										{ label: t("following"), value: user.following },
									].map((stat, index) => (
										<View
											key={stat.label}
											style={{
												flex: 1,
												marginRight: index < 2 ? 8 : 0,
												paddingVertical: 4,
												paddingHorizontal: 8,
												borderRadius: 999,
												backgroundColor: theme.card,
												alignItems: "center",
											}}
										>
											<Text
												style={{
													color: theme.muted,
													fontSize: 10,
													marginBottom: 2,
												}}
											>
												{stat.label}
											</Text>
											<Text
												style={{
													color: theme.text,
													fontSize: 12,
													fontWeight: "600",
												}}
											>
												{stat.value}
											</Text>
										</View>
									))}
								</View>
							</View>
						</View>

						<Animated.FlatList
							data={repos ?? []}
							keyExtractor={(item) => String(item.id)}
							onRefresh={onRefresh}
							refreshing={refreshing}
							contentContainerStyle={{ paddingBottom: 24 }}
							onScroll={Animated.event(
								[{ nativeEvent: { contentOffset: { y: scrollY } } }],
								{ useNativeDriver: true }
							)}
							scrollEventThrottle={16}
							ListHeaderComponent={
								<View>
									{/* 🔹 Resumen de actividad */}
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
											marginBottom: 16,
										}}
									>
										{/* total repos */}
										<View
											style={{
												flex: 1,
												backgroundColor: theme.card,
												padding: 12,
												borderRadius: 12,
												marginRight: 8,
											}}
										>
											<Text
												style={{
													color: theme.muted,
													fontSize: 12,
													marginBottom: 4,
												}}
											>
												{t("reposLabel")}
											</Text>
											<Text
												style={{
													color: theme.text,
													fontSize: 18,
													fontWeight: "700",
												}}
											>
												{totalRepos}
											</Text>
										</View>

										{/* total stars */}
										<View
											style={{
												flex: 1,
												backgroundColor: theme.card,
												padding: 12,
												borderRadius: 12,
												marginRight: 8,
											}}
										>
											<Text
												style={{
													color: theme.muted,
													fontSize: 12,
													marginBottom: 4,
												}}
											>
												{t("totalStars")}
											</Text>
											<Text
												style={{
													color: theme.text,
													fontSize: 18,
													fontWeight: "700",
												}}
											>
												{totalStars}
											</Text>
										</View>

										{/* top language */}
										<View
											style={{
												flex: 1,
												backgroundColor: theme.card,
												padding: 12,
												borderRadius: 12,
											}}
										>
											<Text
												style={{
													color: theme.muted,
													fontSize: 12,
													marginBottom: 4,
												}}
											>
												{t("topLanguage")}
											</Text>
											<Text
												style={{
													color: theme.text,
													fontSize: 16,
													fontWeight: "700",
												}}
												numberOfLines={1}
											>
												{topLanguage}
											</Text>
										</View>
									</View>

									{/* último repo actualizado */}
									{lastUpdatedRepo && (
										<View
											style={{
												backgroundColor: theme.card,
												padding: 12,
												borderRadius: 12,
												marginBottom: 16,
											}}
										>
											<Text
												style={{
													color: theme.muted,
													fontSize: 12,
													marginBottom: 4,
												}}
											>
												{t("lastUpdatedRepo")}
											</Text>
											<Text
												style={{
													color: theme.text,
													fontWeight: "600",
													marginBottom: 2,
												}}
											>
												{lastUpdatedRepo.name}
											</Text>
											<Text style={{ color: theme.muted, fontSize: 12 }}>
												{t("updated")}:{" "}
												{new Date(lastUpdatedRepo.updated_at).toLocaleString()}
											</Text>
										</View>
									)}

									{/* card de lenguajes animada */}
									{languagesChartData.length > 0 && (
										<Animated.View
											style={{
												backgroundColor: theme.card,
												padding: 12,
												borderRadius: 12,
												marginBottom: 16,
												opacity: langCardOpacity,
												transform: [
													{ scale: langCardScale },
													{ translateY: langCardTranslateY },
												],
											}}
										>
											<Text
												style={{
													color: theme.text,
													fontSize: 14,
													fontWeight: "600",
													marginBottom: 8,
												}}
											>
												{t("languagesChartTitle")}
											</Text>

											{languagesChartData.map(([langKey, count]) => {
												const pct =
													maxLangCount > 0 ? (count / maxLangCount) * 100 : 0;
												return (
													<View key={langKey} style={{ marginBottom: 6 }}>
														<View
															style={{
																flexDirection: "row",
																justifyContent: "space-between",
																marginBottom: 2,
															}}
														>
															<Text style={{ color: theme.text, fontSize: 12 }}>
																{langKey}
															</Text>
															<Text
																style={{ color: theme.muted, fontSize: 12 }}
															>
																{count}
															</Text>
														</View>
														<View
															style={{
																height: 6,
																borderRadius: 999,
																backgroundColor:
																	theme.name === "dark" ? "#1f2933" : "#e5e7eb",
															}}
														>
															<View
																style={{
																	height: "100%",
																	borderRadius: 999,
																	width: `${pct}%`,
																	backgroundColor: theme.accent,
																}}
															/>
														</View>
													</View>
												);
											})}
										</Animated.View>
									)}

									<Text
										style={{
											color: theme.text,
											fontSize: 16,
											fontWeight: "600",
											marginBottom: 8,
											marginTop: 4,
										}}
									>
										{t("reposLabel")}
									</Text>
								</View>
							}
							renderItem={({ item, index }) => {
								const opacity = new Animated.Value(0);
								const translateY = new Animated.Value(10);

								Animated.timing(opacity, {
									toValue: 1,
									duration: 300,
									delay: index * 40,
									useNativeDriver: true,
								}).start();

								Animated.timing(translateY, {
									toValue: 0,
									duration: 300,
									delay: index * 40,
									useNativeDriver: true,
								}).start();

								return (
									<Animated.View
										style={{
											opacity,
											transform: [{ translateY }],
											backgroundColor: theme.card,
											padding: 12,
											borderRadius: 10,
											marginBottom: 8,
										}}
									>
										<Pressable
											onPress={() =>
												navigation.navigate("RepoDetail", {
													owner: user.login,
													repoName: item.name,
												})
											}
										>
											<Text
												style={{
													color: theme.text,
													fontWeight: "600",
													marginBottom: 4,
												}}
											>
												{item.name}
											</Text>
											{item.description && (
												<Text
													style={{ color: theme.muted, marginBottom: 4 }}
													numberOfLines={2}
												>
													{item.description}
												</Text>
											)}
											<View
												style={{
													flexDirection: "row",
													justifyContent: "space-between",
												}}
											>
												<Text style={{ color: theme.muted, fontSize: 12 }}>
													⭐ {item.stargazers_count}
												</Text>
												<Text style={{ color: theme.muted, fontSize: 12 }}>
													{item.language ?? "Unknown"}
												</Text>
												<Text style={{ color: theme.muted, fontSize: 12 }}>
													{t("updated")}:{" "}
													{new Date(item.updated_at).toLocaleDateString()}
												</Text>
											</View>
										</Pressable>
									</Animated.View>
								);
							}}
						/>
					</>
				)}
			</View>
		</SafeAreaView>
	);
};
