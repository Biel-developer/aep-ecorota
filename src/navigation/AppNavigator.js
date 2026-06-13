import React from 'react';

import {
  NavigationContainer
} from '@react-navigation/native';

import {
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs';

import {
  createNativeStackNavigator
} from '@react-navigation/native-stack';

import {
  Ionicons
} from '@expo/vector-icons';


import { COLORS } from '../theme';


import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import EcopontosScreen from '../screens/EcopontosScreen';
import GuiaScreen from '../screens/GuiaScreen';
import PerfilScreen from '../screens/PerfilScreen';



const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();





const TAB_ICONS = {


Home:{
icon:'leaf-outline',
active:'leaf',
label:'Início'
},



Scan:{
icon:'scan-outline',
active:'scan',
label:'Scanner'
},



Ecopontos:{
icon:'map-outline',
active:'map',
label:'Locais'
},



Guia:{
icon:'book-outline',
active:'book',
label:'Guia'
},



Perfil:{
icon:'person-outline',
active:'person',
label:'Perfil'
}


};







function TabNavigator(){


return(


<Tab.Navigator


screenOptions={({route})=>({



headerShown:false,



tabBarIcon:({focused,color})=>{


const item = TAB_ICONS[route.name];


return(

<Ionicons

name={
focused
?
item.active
:
item.icon
}

size={focused ? 26 : 23}

color={color}

/>


)

},






tabBarLabel: TAB_ICONS[route.name].label,



tabBarStyle:{


height:72,


backgroundColor:'#FFFFFF',


borderTopWidth:0,


paddingBottom:8,


paddingTop:8,



elevation:10,


shadowColor:'#000',


shadowOpacity:0.08,


shadowRadius:10



},





tabBarActiveTintColor:'#2E7D32',


tabBarInactiveTintColor:'#8A8A8A'



})}



>





<Tab.Screen

name="Home"

component={HomeScreen}

/>



<Tab.Screen

name="Scan"

component={ScanScreen}

/>



<Tab.Screen

name="Ecopontos"

component={EcopontosScreen}

/>



<Tab.Screen

name="Guia"

component={GuiaScreen}

/>



<Tab.Screen

name="Perfil"

component={PerfilScreen}

/>



</Tab.Navigator>



)

}









export default function AppNavigator(){



return(



<NavigationContainer>



<Stack.Navigator

screenOptions={{

headerShown:false

}}

>



<Stack.Screen

name="Main"

component={TabNavigator}

/>



</Stack.Navigator>



</NavigationContainer>


)


}