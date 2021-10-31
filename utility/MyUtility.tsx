import {
  Dimensions,
  Platform,
  PixelRatio,
  Linking,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { openDatabase } from 'react-native-sqlite-storage';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

// Set the Animation Time here globally
export const ANIMATION_TIME = 2000;

var db = openDatabase({ name: 'UserDatabase.db', location: 'default' });

export const normalizeSize = (
  size: number,
  lgSize: number = 0,
  smSize: number = 0,
) => {
  if (SCREEN_WIDTH >= 600) size = (lgSize != 0 ? lgSize : size) - 2;
  else if (SCREEN_WIDTH <= 330) size = (smSize != 0 ? smSize : size) - 1;

  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

export const openUrl = (url: string) => {
  if (url && url.trim() != '') {
    url = url.trim();
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  }
};

export const initializeDB = () => {
  db.transaction((txn: any) => {
    txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'", [], (tx: any, res: any) => {
      console.log('item:', res.rows.length);
      if (res.rows.length == 0) {
        txn.executeSql('DROP TABLE IF EXISTS table_user', []);
        txn.executeSql(
          'CREATE TABLE IF NOT EXISTS table_user(item_id INTEGER PRIMARY KEY AUTOINCREMENT, item_name VARCHAR(100), item_price REAL(10), item_unit VARCHAR(50), item_note VARCHAR(100))',
          []
        );
        console.log('table created successfully');
      }
    })
  })
}

export const showFlashMessage = (
  message: string = '',
  description: string = '',
  type: any = 'success',
  onPress = () => { },
  duration = 2000,
) => {
  showMessage({
    message: message,
    description: description,
    type: type,
    onPress,
    duration,
    // backgroundColor: "white",
    // color: "#606060",
    textStyle: { fontFamily: 'Lato-Regular', fontSize: 16, fontWeight: 'bold' }
  });
};