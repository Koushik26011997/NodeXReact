import React from 'react';
import { Text } from 'react-native';
import { normalizeSize } from '../../utility/MyUtility';


const Rtext = ({
  style = {},
  normalizeFontSize = 0,
  fontSize = 12,
  lgFontSize = 8,
  smFontSize = 0,
  fontStyle = 'normal',
  children = {},
  color = '#000000',
  fontWeight = 'normal',
  numberOfLines = 0,
  onPress = () => { },
}) => {
  const cusStyle = {
    fontStyle,
    color,
    fontSize: normalizeSize(fontSize),
    // normalizeFontSize == 0
    //   ? normalizeSize(fontSize, lgFontSize, smFontSize)
    //   : normalizeFontSize,
    fontFamily: fontWeight == 'normal' ? 'Lato-Regular' : 'Lato-Bold',
    //fontFamily: 'Lato-Regular'
  };
  return (
    <Text
      onPress={onPress}
      style={[styles.default, cusStyle, style]}
      numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
};

const styles = {
  default: {},
};

export { Rtext };
