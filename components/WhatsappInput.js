import React, { useState } from "react";
import {
	Dimensions,
	TextInput,
	TouchableOpacity,
	View,
	Image,
	
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function WhatsappInput(props) {
	const [currentMessage, setCurrentMessage] = useState("");
	const { width } = Dimensions.get("window");


	return (
		<View
			style={{
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: "center",
				position: "absolute",
				left: 0,
				bottom: Platform.OS === "ios" ? 20 : 0,
				maxHeight: 150,
				padding: 5,
				width,
			}}
		>
			<View
				style={{
					backgroundColor: "white",
					width: width - 60,
					borderRadius: 25,
					elevation: 2,
					minHeight: 45,
				}}
			>
				<TextInput
					value={currentMessage}
					onChangeText={(value) => setCurrentMessage(value)}
					onLayout={(event) => {
						props.handleInputHeightChange(
							event.nativeEvent.layout.height
						);
					}}
					style={{
						height: "100%",
						paddingHorizontal: 20,
						fontSize: 18,
					}}
					multiline
					placeholder="Message..."
				/>
			</View>

			{!currentMessage.trim() ? (
				<TouchableOpacity
					style={{
						position: "absolute",
						right: 5,
						bottom: 5,
						justifyContent: "center",
						alignItems: "center",
						width: 45,
						height: 45,
						backgroundColor: "green",
						borderRadius: 24,
						elevation: 2,
					}}
					onPress={() => {
						props.handleMiddleFinger()
					}}
				>
					<Image
						style={{ width: 35, height: 35 }}
						source={require("../assets/middle-finger_1f595.png")}
					/>
				</TouchableOpacity>
			) : currentMessage === "wizz" ? (
				<TouchableOpacity
					style={{
						position: "absolute",
						right: 5,
						bottom: 5,
						justifyContent: "center",
						alignItems: "center",
						width: 45,
						height: 45,
						backgroundColor: "green",
						borderRadius: 24,
						elevation: 2,
					}}
					onPress={() => {
						props.handleWizz()
					}}
				>
					<Image
						style={{ width: 50, height: 50 }}
						source={require("../assets/wizz_png.png")}
					/>
				</TouchableOpacity>
			) : (
				<TouchableOpacity
					style={{
						position: "absolute",
						right: 5,
						bottom: 5,
						justifyContent: "center",
						alignItems: "center",
						width: 45,
						height: 45,
						backgroundColor: "green",
						borderRadius: 24,
						elevation: 2,
					}}
					onPress={() => {
						props.handleSubmit(currentMessage);
						setCurrentMessage("");
					}}
				>
					<Ionicons size={25} name="md-send-sharp" color="white" />
				</TouchableOpacity>
			)}
		</View>
	);
}
