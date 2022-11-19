import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

import * as React from 'react';

// redux
import { Provider } from "react-redux";

import token from './reducers/token.reducer'
import pseudo from './reducers/pseudo.reducer'
/*import avatar from './reducers/avatar.reducer'  */

import { createStore, combineReducers } from "redux";
const store = createStore(combineReducers({ pseudo, token}));

//modules pour la navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
/* import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; */

//icones
import { MaterialCommunityIcons } from "react-native-vector-icons";

//import des "screens":
import ChatScreen from "./screens/ChatScreen";
import SignInScreen from "./screens/SignInScreen";

//déclarations pour les différentes navigations
/* const Tab = createBottomTabNavigator(); */
const Stack = createNativeStackNavigator();

// 3 exemplaires de la Tab nav pour les trois principaux ecrans (sinon problèmes dans la navigation)
/* function HomeScreenTabs() {
	return (
		<Tab.Navigator
			initialRouteName="Home"
			screenOptions={({ route }) => ({
				tabBarActiveTintColor: "#ff7f50",
				tabBarInactiveTintColor: "#dfe4ea",
				tabBarLabelPosition: "beside-icon",
				tabBarShowLabel: false,
				tabBarStyle: [
					{
						display: "flex",
						backgroundColor: "#2f3542",
					},
					null,
				],

				tabBarHideOnKeyboard: true,
				tabBarIcon: ({ color }) => {
					let iconName;

					if (route.name === "Feed") {
						iconName = "hamburger";
					} else if (route.name === "Add") {
						iconName = "plus-circle";
					} else if (route.name === "Home") {
						iconName = "notebook";
					}
					return (
						<MaterialCommunityIcons
							name={iconName}
							size={24}
							color={color}
						/>
					);
				},
			})}
		>
			<Tab.Screen
				name="Feed"
				component={FeedScreen}
				options={{ headerShown: false }}
			/>
			<Tab.Screen
				name="Add"
				component={AddScreen}
				options={{ headerShown: false }}
			/>
			<Tab.Screen
				name="Home"
				component={HomeScreen}
				options={{ headerShown: false }}
			/>
		</Tab.Navigator>
	);
} */


export default function App() {
	return (
		<Provider store={store}>
			<NavigationContainer>
				<Stack.Navigator initialRouteName="ChatScreen">
					<Stack.Screen
						name="SignInScreen"
						component={SignInScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="ChatScreen"
						component={ChatScreen}
						options={{ headerShown: false }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</Provider>
	);
}
