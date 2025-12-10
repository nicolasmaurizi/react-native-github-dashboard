import React from "react";
import { View, Text, Pressable } from "react-native";

interface AppErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

interface AppErrorBoundaryProps {
	children: React.ReactNode;
}

export class AppErrorBoundary extends React.Component<
	AppErrorBoundaryProps,
	AppErrorBoundaryState
> {
	constructor(props: AppErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, info: React.ErrorInfo) {
		console.log("🔥 AppErrorBoundary caught error:", error);
		console.log("ℹ️ Info:", info);
	}

	handleReset = () => {
		this.setState({ hasError: false, error: undefined });
	};

	render() {
		if (this.state.hasError) {
			return (
				<View
					style={{
						flex: 1,
						backgroundColor: "#020617",
						alignItems: "center",
						justifyContent: "center",
						padding: 24,
					}}
				>
					<Text
						style={{
							color: "#e5e7eb",
							fontSize: 18,
							fontWeight: "700",
							marginBottom: 8,
							textAlign: "center",
						}}
					>
						Algo salió mal 😕
					</Text>
					<Text
						style={{
							color: "#9ca3af",
							fontSize: 14,
							marginBottom: 16,
							textAlign: "center",
						}}
					>
						Error inesperado.
					</Text>

					{__DEV__ && this.state.error && (
						<Text
							style={{
								color: "#f97316",
								fontSize: 12,
								marginBottom: 16,
								textAlign: "center",
							}}
						>
							{this.state.error.message}
						</Text>
					)}

					<Pressable
						onPress={this.handleReset}
						style={{
							paddingHorizontal: 16,
							paddingVertical: 8,
							borderRadius: 999,
							borderWidth: 1,
							borderColor: "#38bdf8",
						}}
					>
						<Text style={{ color: "#e5e7eb", fontWeight: "600" }}>
							Reintentar
						</Text>
					</Pressable>
				</View>
			);
		}

		return this.props.children;
	}
}
