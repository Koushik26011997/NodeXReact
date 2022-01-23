import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getUsersList} from '../store/users';

const KP = () => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.counter.usersList);

  console.log('data', data);

  useEffect(() => {
    dispatch(getUsersList());

    return () => {};
  }, []);

  return (
    <View>
      <Text></Text>
    </View>
  );
};

export default KP;

const styles = StyleSheet.create({});
