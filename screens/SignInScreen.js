import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import {
	ImageBackground,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Image,
	StatusBar,
	Platform,

} from "react-native";

import { MaterialCommunityIcons } from "react-native-vector-icons";


import AsyncStorage from "@react-native-async-storage/async-storage";

import MyStatusBar from "../components/MyStatusBar";


function SignInScreen(props) {
	const navigation = useNavigation();

	listUsers = [{name:"Matthieu", image:require("../assets/users/Matthieu.webp")}, {name:"Gabriel", image:require("../assets/users/Gabriel.webp")},{name:"Dylan", image:require("../assets/users/Dylan.webp")},{name:"Vanessa", image:require("../assets/users/Vanessa.webp")},{name:"Anne-Lise", image:require("../assets/users/Anne-Lise.webp")},{name:"Marie", image:require("../assets/users/Marie.webp")},{name:"José", image:require("../assets/users/José.webp")},{name:"Suzanne", image:require("../assets/users/Suzanne.webp")}]

	const avatars = listUsers.map((x, i) => {
		return (
<TouchableOpacity
key={i}
				style={{margin: 10}}
				onPress={() => {
				
					AsyncStorage.setItem("username", x.name);
					navigation.navigate("ChatScreen");
				}}
			>
				<Image
					source={x.image}
					style={{
						width: 120,
						height: 120,

						borderRadius: 100,
					}}
				/>
				{/* <Text style={{textAlign:"center"}}>{x.name}</Text> */}
			</TouchableOpacity>
		)
	})

	return (
		<View style={{flex: 1,justifyContent:"center",
		alignItems:"center"}}>
			<MyStatusBar
					backgroundColor="#1F2C34"
					barStyle="dark-content"
				/>
			<Image
					source={require("../assets/logo.png")}
					style={{
						alignSelf:"flex-start",
						marginLeft: 20,
						marginTop:-30,
						marginBottom: 10,
						width:150,
						height:100
						

					
					}}
				/>
			<Text style={{fontSize: 30}}>Qui es-tu ?</Text>
		<View
			style={{
				display:"flex",
				justifyContent:"center",
				flexDirection: "row",
				flexWrap: "wrap",
				
			}}
		>
			

			{avatars}

		</View></View>
	);
}

/* function mapStateToProps(state) {
	return { countToDisplay: state.count };
} */

/* function mapDispatchToProps(dispatch) {
	return {
		onSubmitPseudo: function (pseudo) {
			dispatch({ type: "savePseudo", pseudo: pseudo });
		},
	};
} */

export default connect(null, null)(SignInScreen);


