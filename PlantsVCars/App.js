import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, Image, ScrollView, TextInput } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import GardenNav from './screens/garden/GardenNav';
import ChallengesScreen from './screens/challenges/ChallengesScreen';
import ForestScreen from './screens/forest/ForestScreen';
import PersonScreen from './screens/person/PersonScreen';


const Tab = createBottomTabNavigator();

const TabIconography = {
    'Garden':{  'icon': 'flower',    'tint': 'fuchsia'},
    'Forest':{  'icon': 'leaf',    'tint': 'green'},
    'Challenges':{  'icon': 'medal',    'tint': 'gold'},
    'Person':{  'icon': 'person',    'tint': 'blue'},
    };
    

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
      
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = TabIconography[route.name]["icon"];
            
            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: TabIconography[route.name]["tint"],
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Garden" component={GardenNav} />        
        <Tab.Screen name="Forest" component={ChallengesScreen} />        
        <Tab.Screen name="Challenges" component={ForestScreen} />        
        <Tab.Screen name="Person" component={PersonScreen} />        

      </Tab.Navigator>
      
    </NavigationContainer>
  );
};

export default App;