import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import PlantData from '../tabs/plantData';
import Information from '../tabs/information';
import CameraScreen from '../tabs/camera';
import Graphs from '../tabs/graphs';
import Settings from '../tabs/settings';

const TabContainer = () => {
  const Stack = createNativeStackNavigator();
  const Drawer = createDrawerNavigator();
  const Tab = createBottomTabNavigator(); 

  return (

    <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#37DAD7',
      tabBarInactiveTintColor: '#000000',
      tabBarHideOnKeyboard: true,
      // tabBarActiveBackgroundColor: '#F5F5F5',
      tabBarStyle: { 
        position: 'absolute',
        left: 7,
        right: 7,
        elevation: 0,
        borderRadius: 15,
        height: 70,
        backgroundColor: '#CAE7EB',
        ...styles.shadow,
      },
      }} 
    >

      <Tab.Screen 
        component={PlantData}
        name="plantData"
        options={{ 
          tabBarShowLabel: false,
          headerShown: false,  
          tabBarIcon: ({color}) => (
            <Ionicons name="leaf" size={35} color={color} />
          
          )
        }} 
      />

      <Tab.Screen 
        component={Information}
        name="information"
        options={{ 
          tabBarShowLabel: false,
          headerShown: false,  
          tabBarIcon: ({color}) => (
            <Ionicons name="information-circle" size={35} color={color} />
          
          )
        }}  
      />

      <Tab.Screen 
        component={CameraScreen}
        name="camera"
        options={{ 
          tabBarShowLabel: false,
        headerShown: false,  
        tabBarIcon: () => (
         <View style={styles.scanIcon}>
          <Ionicons name="scan-circle" size={35} color="#000000" />
         </View>
        )
      }}
      />

      <Tab.Screen 
        component={Graphs}
        name="Graphs"
        options={{ 
          tabBarShowLabel: false,
        headerShown: false,  
        tabBarIcon: ({color}) => (
        <Ionicons name="analytics" size={35} color={color} />
        )
      }} 
      />

      <Tab.Screen 
        component={Settings}
        name="Settings"
        options={{ 
          tabBarShowLabel: false,
        headerShown: false,  
        tabBarIcon: ({color}) => (
        <Ionicons name="settings" size={35} color={color} />
        )
      }}  
      />

    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  shadow:{
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  scanIcon: {
    top: -35,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    backgroundColor: '#37DAD7',
    borderRadius: 50
  },
})

export default TabContainer;
