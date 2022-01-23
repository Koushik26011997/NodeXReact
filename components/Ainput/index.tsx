import React, {useState} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {normalizeSize} from '../../utility/MyUtility';

const Ainput = ({
  autoFocus = false,
  value = '',
  onChangeText = (val: any) => {},
  multiline = false,
  onBlur = () => {},
  placeholder = '',
  numberOfLines = 1,
  border = '#76A8C8',
  style = {},
  type = 'default',
  editable = true,
  secureTextEntry = false,
}) => {
  return (
    <View style={[styles.containerStyle]}>
      <TextInput
        secureTextEntry={secureTextEntry}
        autoFocus={autoFocus}
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.inputStyle,
          style,
          {
            borderColor: border,
            color: 'black',
            fontFamily: 'Lato-Regular',
            paddingHorizontal: 12,
          },
        ]}
        autoCapitalize="words"
        autoCorrect={false}
        placeholder={placeholder}
        onBlur={onBlur}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={type}
        editable={editable}
        blurOnSubmit={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'column',
  },
  inputStyle: {
    marginHorizontal: 8,
    padding: 8,
    fontSize: normalizeSize(13),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#fff',
  },
});

export {Ainput};
