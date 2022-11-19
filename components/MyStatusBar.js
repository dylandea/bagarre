import React from "react";

import {
	View,
	StatusBar,
	Platform,
	SafeAreaView
} from "react-native";





export default function MyStatusBar(props) {

	const STATUSBAR_HEIGHT =
Platform.OS === "android" ? StatusBar.currentHeight : 44; //permet de faire varier la taille de la status bar selon le téléphone

    return (
		<View style={{ height: STATUSBAR_HEIGHT, backgroundColor: props.backgroundColor }}>
			<SafeAreaView>
				<StatusBar
					translucent
					backgroundColor={props.backgroundColor}
					barStyle={props.barStyle}
				/>
			</SafeAreaView>
		</View>
	);

}