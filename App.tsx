import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/Home';
import CreateDraft from './src/screens/CreateDraft';
import InitialScreen from './src/screens/InitialScreen';
import { persistor, store } from './src/app/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ActivityIndicator, View, Image } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PersistGate loading={<LoadingScreen />} persistor={persistor}>
      <Provider store={store}>
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
      </Provider>
    </PersistGate>
  );
}

const LoadingScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Image source={require('./src/assets/logo.png')} style={{ width: 200, height: 200 }} />
  </View>
  );
};
