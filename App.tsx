import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/Home';
import CreateDraft from './src/screens/CreateDraft';
import InitialScreen from './src/screens/InitialScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#000000',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen 
          name="CreateDraft" 
          component={CreateDraft} 
          options={{ 
            headerShown: true,
          }}
        />
        <Stack.Screen 
          name="InitialScreen" 
          component={InitialScreen} 
          options={{ 
            headerShown: true 
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}