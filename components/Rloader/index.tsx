import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

export interface RloaderProps {
  color?: string;
  style?: object;
}

const Rloader = (props: RloaderProps) => {
  const { color = '#0095ff', style = {} } = props;

  return (
    <View style={[styles.container, style]}>
      <Spinner visible={true} color={"#fff"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3
  },
});

export { Rloader };
