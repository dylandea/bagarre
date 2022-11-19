import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import WhatsappInput from "../components/WhatsappInput";
import MyStatusBar from "../components/MyStatusBar";
import uuid from "react-native-uuid";



import { SafeAreaView } from "react-native-safe-area-context";
/* import { myToken, myUsername } from "../env.js"; */

import { MaterialCommunityIcons } from "react-native-vector-icons";

import {
	ImageBackground,
	View,
	ScrollView,
	Platform,
	Image,
	StyleSheet,
	TouchableOpacity,
	Text,
	KeyboardAvoidingView,
	Keyboard,
} from "react-native";

import socketIOClient from "socket.io-client";
var socket = socketIOClient("https://bagarre-server.herokuapp.com/");

import AsyncStorage from "@react-native-async-storage/async-storage";

const APPBAR_HEIGHT = Platform.OS === "ios" ? 50 : 56; 

function ChatScreen(props) {

	const isFocused = useIsFocused();
	const navigation = useNavigation(); 

	const scrollViewRef = useRef();

	const [listMessage, setListMessage] = useState([]);
	const [searchInput, setSearchInput] = useState("");
	const [myUsername, setMyUsername] = useState("");
	const [inputHeight, setInputHeight] = useState(45);
	const [alreadyAtBottom, setAlreadyAtBottom] = useState(true);

	const [iOSKeyboard, setIOSKeyboard] = useState(0);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			"keyboardDidShow",
			() => {
				if (Platform.OS === "ios") {
					setIOSKeyboard(335);
				}

				if (alreadyAtBottom) {
					scrollViewRef.current.scrollToEnd({ animated: true });
				}
			}
		);
		const keyboardDidHideListener = Keyboard.addListener(
			"keyboardDidHide",
			() => {
				if (Platform.OS === "ios") {
					setIOSKeyboard(0);
				}

				if (alreadyAtBottom) {
					scrollViewRef.current.scrollToEnd({ animated: true });
				}
			}
		);

		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, []);

	useEffect(() => {
		var localData = [];

		const getDataFromLocalStorageAndServer = async () => {
			await AsyncStorage.getItem("username", function (error, data) {
				if (data !== null) {
					setMyUsername(data);
				} else {
					navigation.navigate("SignInScreen");
				}
			});

			await AsyncStorage.getItem("messages", function (error, data) {
				if (data !== null) {
					setListMessage(JSON.parse(data));
					localData = JSON.parse(data);
					console.log("getdatafromlocal fini !");
				} else {
					setListMessage([]);
				}
			});

			socket.on("Connection received", async (dataFromServer) => {
				console.log("From Server: You're connected !");
 
				let merge = [...dataFromServer, ...localData];

				let alreadyUsed = [];
				let final = [];
				merge.forEach((x) => {
					if (!alreadyUsed.includes(x.id)) {
						final.push(x);
					}
					alreadyUsed.push(x.id);
				});
				final.sort((a, b) => new Date(a.date) - new Date(b.date));

				setListMessage(final);

				const stringifiedMessages = JSON.stringify(final);
				await AsyncStorage.setItem("messages", stringifiedMessages);

				socket.emit("askforhistory", final);
			});

			return () => socket.off();
		};
		getDataFromLocalStorageAndServer();
	}, [isFocused]);

	useEffect(() => {
		socket.on("sendMessageToAll", async (newMessages) => {
		
		const newListMessage = newMessages;
		if (newListMessage !== undefined) {
			setListMessage(newListMessage);
		} else {
			setListMessage([]);
		}
			
			const stringifiedMessages = JSON.stringify(newListMessage);
			await AsyncStorage.setItem("messages", stringifiedMessages);
		});

		return () => socket.off();
	}, [listMessage]);

	let lastMessageDate;
	let lastMessageAuthor;

	const list = listMessage.map((messageData, i) => {
		let verticalMargin = lastMessageAuthor !== messageData.author ? 3 : 0;
		lastMessageAuthor = messageData.author;

		const monthNames = [
			"Janvier",
			"Février",
			"Mars",
			"Avril",
			"Mai",
			"Juin",
			"Juillet",
			"Août",
			"Septembre",
			"Octobre",
			"Novembre",
			"Décembre",
		];

		let dateDisplay = null;

		if (
			new Date(messageData.date).getDate() !==
			new Date(lastMessageDate).getDate()
		) {
			dateDisplay = (
				<View
					style={[
						styles.messageBox,
						{
							alignSelf: "center",
							backgroundColor: "#395060",
						},
					]}
				>
					<Text
						style={{
							color: "white",
							fontWeight: "bold",
							fontSize: 10.5,
							color: "#e2e2e2",
						}}
					>
						{new Date(messageData.date).getDate() ===
						new Date(lastMessageDate).getDate() + 1
							? "Hier"
							: `${new Date().getDate()} ${
									monthNames[new Date().getMonth()]
							  } ${new Date().getFullYear()}`}
					</Text>
				</View>
			);
		}

		lastMessageDate = new Date(messageData.date);

		var msg = messageData.content;
		//var msg = messageData.content.replace(/:\)/g, "\uD83D\uDE42");
		//msg = msg.replace(/:\(/g, "\u2639");
		//msg = msg.replace(/:p/g, "\uD83D\uDE1B");
		//var msg = msg.replace(/[a-z]*fuck[a-z]*/gi, "\u2022\u2022\u2022");

		let authorColor = "white";
		if (messageData.author === "Vanessa") {
			authorColor = "#fce06f";
		} else if (messageData.author === "Matthieu") {
			authorColor = "#fc6c6c";
		} else if (messageData.author === "José") {
			authorColor = "#9A93E4";
		} else if (messageData.author === "Marie") {
			authorColor = "#3B9C92";
		} else if (messageData.author === "Gabriel") {
			authorColor = "#EA7B9F";
		} else if (messageData.author === "Anne-Lise") {
			authorColor = "#A2B258";
		} else if (messageData.author === "Dylan") {
			authorColor = "#ED6940";
		} else if (messageData.author === "Suzanne") {
			authorColor = "#64A9E9";
		}

		if (messageData.type === "texte") {
			return (
				<View key={i}>
					{dateDisplay}
					<View
						style={[
							styles.messageBox,
							{
								alignSelf:
									messageData.author === myUsername
										? "flex-end"
										: "flex-start",
								backgroundColor:
									messageData.author === myUsername
										? "#00876c"
										: "#395060",
								marginTop: verticalMargin,
							},
						]}
					>
						{messageData.author !== myUsername ? (
							<Text
								style={{
									color: authorColor,
									fontWeight: "bold",
								}}
							>
								{messageData.author}
							</Text>
						) : (
							<></>
						)}
						<Text>
							<Text
								style={{
									color: "white",
									fontWeight: "bold",
									fontSize: 15,
								}}
							>
								{msg}
							</Text>
							<Text
								style={{
									color: "#e2e2e2",
									textAlign: "right",
									fontSize: 12,
									paddingTop: 5,
									marginBottom: -3,
									marginRight: -3,
									marginLeft: 5,
								}}
							>
								{"  " +
									(
										"0" +
										new Date(messageData.date).getHours()
									).slice(-2) +
									":" +
									(
										"0" +
										new Date(messageData.date).getMinutes()
									).slice(-2)}
							</Text>
						</Text>
					</View>
				</View>
			);
		} else {
			return (
				<View key={i}>
					{dateDisplay}
					<View
						style={[
							styles.messageBox,
							{
								alignSelf: "center",

								backgroundColor:
									messageData.type === "doigt"
										? "#fc7a5f"
										: "yellow",
							},
						]}
					>
						<Text
							style={{
								color: "black",
								fontWeight: "bold",
								textAlign: "center",
							}}
						>
							{msg}
						</Text>
					</View>
				</View>
			);
		}
	});

	const isCloseToBottom = ({
		layoutMeasurement,
		contentOffset,
		contentSize,
	}) => {
		return (
			layoutMeasurement.height + contentOffset.y >=
			contentSize.height - inputHeight
		);
	};

	let iconeScrollToBottom = null;
	if (!alreadyAtBottom) {
		iconeScrollToBottom = (
			<TouchableOpacity
				style={{
					position: "absolute",
					top: 10,
					right: 10,
					opacity: 0.8,
					zIndex: 100,
				}}
				onPress={() => {
					scrollViewRef.current.scrollToEnd({ animated: true });
				}}
			>
				<MaterialCommunityIcons
					name="arrow-down-circle"
					size={35}
					color="#2f3542"
					style={{}}
				/>
			</TouchableOpacity>
		);
	}

	//-----------------------------------RENDER-----------------------------------
	if (myUsername !== "") {
		return (
			<View style={{ flex: 1 }}>
				<MyStatusBar
					backgroundColor="#1F2C34"
					barStyle="light-content"
				/>
				<View style={styles.appBar}>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<Image
							source={require("../assets/users/famille.jpg")}
							style={{
								width: 60,
								height: 40,
								marginLeft: 10,
								borderRadius: 100,
							}}
						/>
						<Text
							style={{
								marginLeft: 10,
								fontSize: 20,
								color: "#fff",
							}}
						>
							Groupe Famille
						</Text>
					</View>
					{/* <View style={styles.searchSection}>
						<TextInput
							style={styles.searchInput}
							onChangeText={(value) => setSearchInput(value)}
							value={searchInput}
							placeholder="Chercher une recette"
							underlineColorAndroid="transparent"
						/>

						<MaterialCommunityIcons
							style={styles.searchIcon}
							name="magnify"
							size={28}
							color="#2f3542"
						/>
					</View> */}
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<TouchableOpacity style={{}} onPress={() => {}}>
							<MaterialCommunityIcons
								name="magnify"
								size={28}
								color="#fff"
								style={{
									paddingLeft: 20,
									paddingTop: 10,
									paddingBottom: 10,
									zIndex: 1,
								}}
							/>
						</TouchableOpacity>
						<TouchableOpacity style={{}} onPress={() => {}}>
							<MaterialCommunityIcons
								name="tune-vertical"
								size={28}
								color="#fff"
								style={{
									paddingLeft: 20,
									paddingRight: 20,
									paddingTop: 10,
									paddingBottom: 10,
									zIndex: 1,
								}}
							/>
						</TouchableOpacity>
					</View>
				</View>

				<ImageBackground
					style={{
						flex: 1,
						opacity: 1,
						paddingBottom:
							Platform.OS === "ios"
								? inputHeight + 20 + 5 + iOSKeyboard
								: inputHeight + 5,
					}}
					source={require("../assets/geometric_background.webp")}
					resizeMode="repeat"
				>
					{iconeScrollToBottom}
					<ScrollView
						style={{ paddingHorizontal: 10 }}
						ref={scrollViewRef}
						onContentSizeChange={() =>
							scrollViewRef.current.scrollToEnd({
								animated: true,
							})
						}
						onScroll={({ nativeEvent }) => {
							if (isCloseToBottom(nativeEvent)) {
								setAlreadyAtBottom(true);
							} else {
								setAlreadyAtBottom(false);
							}
						}}
						scrollEventThrottle={400}
						keyboardShouldPersistTaps={"handled"}
						showsVerticalScrollIndicator={false}
					>
						{list}
					</ScrollView>
				</ImageBackground>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "position" : "height"}
				>
					<WhatsappInput
						handleSubmit={(msg) => {
							let id = uuid.v4();

							let newStack = [...listMessage, {
								id: id,
								type: "texte",
								author: myUsername,
								content: msg,
								date: new Date(),
							}]

						
							socket.emit("sendMessage", newStack);

							/* setListMessage([
								...listMessage,
								{
									id: id,
									type: "texte",
									author: myUsername,
									content: msg,
									date: new Date(),
								},
							]); */
						}}

						handleWizz={() => {
							let id = uuid.v4();
							let newStack = [...listMessage, {
								id: id,
								type: "wizz",
								author: myUsername,
								content: `${myUsername} a envoyé un wizz !`,
								date: new Date(),
							}]

							/* socket.emit("sendMessage", newStack); */
							socket.emit("erase", newStack);
						}}

						handleMiddleFinger={() => {
							
							let id = uuid.v4();

							let phrases = [
								`${myUsername} cherche à provoquer une bagarre !`,
								`${myUsername} fait un doigt d'honneur à tout le monde !`,
								`${myUsername} fait un doigt d'honneur à Marie !`,
								`Non c'est trop impoli...`,
								`${myUsername} fait un doigt d'honneur au racisme !`,
								`${myUsername} met un doigt dans son propre cul !`,
								`Devinez ce que ${myUsername} a encore fait ?`,
								`${myUsername} range son doigt et trace sa route, au calme...`,
								`${myUsername} fait un doigt d'honneur à un clochard dans la rue !`,
								`Le premier qui répond à ce doigt est vraiment le boss !`,
							];

							let content =
								phrases[
									Math.floor(Math.random() * phrases.length)
								];

								let newStack = [...listMessage, {
									id: id,
									type: "doigt",
									author: myUsername,
									content: content,
									date: new Date(),
								}]

								
							socket.emit("sendMessage", newStack);
						}}
						handleInputHeightChange={(height) => {
							setInputHeight(height);
							if (alreadyAtBottom) {
								scrollViewRef.current.scrollToEnd({
									animated: true,
								});
							}
						}}
					/>
				</KeyboardAvoidingView>
			</View>
		);
	}
}


export default connect(null, null)(ChatScreen);

const styles = StyleSheet.create({
	appBar: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#1F2C34",
		height: APPBAR_HEIGHT,
		width: "100%",
	},
	messageBox: {
		borderRadius: 12,
		backgroundColor: "white",
		marginVertical: 3,
		marginHorizontal: 5,
		padding: 10,
		maxWidth: "85%",
	},
	searchIcon: {
		padding: 5,
	},
	searchInput: {
		flex: 1,
		paddingTop: 10,
		paddingRight: 10,
		paddingBottom: 10,
		paddingLeft: 20,
		backgroundColor: "#fff",
		color: "#424242",
	},
	searchSection: {
		flex: 1,
		height: 40,
		marginTop: 12,
		marginBottom: 12,
		borderRadius: 5,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
});
