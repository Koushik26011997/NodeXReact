import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import React from 'react';
import ItemList from '../screens/ItemList';
import {Rtext} from '../components/Rtext';
import Details from '../screens/Details';
import {Image, View, TouchableOpacity, Alert, BackHandler} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
import Users from '../screens/Users';
import AddUser from '../screens/AddUser';
import {request} from '../service/common';
import {showFlashMessage} from '../utility/MyUtility';
import Login from '../screens/Login';
import SetAlarm from '../screens/SetAlarm';
import KP from '../screens/KP';

const Stack = createNativeStackNavigator();
var db = openDatabase({name: 'UserDatabase.db', location: 'default'});

const MainStackNav = (props: any) => {
  const deleteItemData = (id: string, navigation: any) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'DELETE FROM table_user where item_id = ?',
        [id],
        (tx: any, results: any) => {
          console.log('Results', results.rowsAffected);
        },
      );
    });
    navigation.goBack();
  };

  const alert = (id: string, navigation: any) => {
    Alert.alert(
      'Delete?',
      'Do you want to delete this item?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => deleteItemData(id, navigation)},
      ],
      {cancelable: false},
    );
    return true;
  };

  const alertDelete = (id: string, navigation: any) => {
    Alert.alert(
      'Delete?',
      'Do you want to delete this user?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => deleteUserData(id, navigation)},
      ],
      {cancelable: false},
    );
    return true;
  };

  const deleteUserData = async (id: string, navigation: any) => {
    try {
      let response = await request('delete', 'api/user/' + id);

      Alert.alert(
        'Success',
        response.data.message,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
        {cancelable: false},
      );
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        showFlashMessage(e.response.data.message, '', 'danger');
      }
    }
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTopInsetEnabled: false,
        stackAnimation: 'flip',
      }}>
      {/* <Stack.Screen
        name="KP"
        component={KP}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SetAlarm"
        component={SetAlarm}
        options={{ headerShown: false }}
      /> */}

      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Users"
        component={Users}
        options={{
          headerCenter: () => (
            <Rtext style={{color: '#fff'}} fontSize={16} fontWeight="bold">
              {'All NodeX Users, 2021'}
            </Rtext>
          ),
        }}
      />

      <Stack.Screen
        name="AddUser"
        component={AddUser}
        options={({route, navigation}) => ({
          headerCenter: () => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 6,
              }}>
              {route?.params?.id === '' ? (
                <Rtext style={{color: '#fff'}} fontSize={16} fontWeight="bold">
                  {'Add New User'}
                </Rtext>
              ) : (
                <Rtext style={{color: '#fff'}} fontSize={16} fontWeight="bold">
                  {'Update User'}
                </Rtext>
              )}
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                route?.params?.id != '' &&
                alertDelete(route?.params?.id, navigation)
              }>
              {route?.params?.id != '' && (
                <Image
                  source={require('../assets/icons/delete.png')}
                  style={{
                    width: 20,
                    height: 28,
                    resizeMode: 'contain',
                    tintColor: '#fff',
                  }}
                />
              )}
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="ItemList"
        component={ItemList}
        options={{
          headerLeft: () => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 6,
              }}>
              <Image
                source={require('../assets/icons/logo.png')}
                style={{
                  width: 28,
                  height: 28,
                  resizeMode: 'center',
                  marginEnd: 3,
                  borderRadius: 12,
                }}
              />
              <Rtext style={{color: '#fff'}} fontSize={16} fontWeight="bold">
                {"Roy's Grocerry & Store"}
              </Rtext>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="Details"
        component={Details}
        options={({route, navigation}) => ({
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                route?.params?.id != '' && alert(route?.params?.id, navigation)
              }>
              {route?.params?.id != '' && (
                <Image
                  source={require('../assets/icons/delete.png')}
                  style={{
                    width: 20,
                    height: 28,
                    resizeMode: 'contain',
                    tintColor: '#fff',
                  }}
                />
              )}
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default MainStackNav;
