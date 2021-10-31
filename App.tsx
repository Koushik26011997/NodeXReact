import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import MainStackNav from './navigations/MainStackNav';
import FlashMessage from "react-native-flash-message";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={styles.backgroundStyle}>
      <StatusBar backgroundColor="#f4511e" barStyle="light-content" />
      <NavigationContainer>
        <MainStackNav />
      </NavigationContainer>
      <FlashMessage position="top" />
    </GestureHandlerRootView >
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
    justifyContent: 'center',
  }
});

export default App;
