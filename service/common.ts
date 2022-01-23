import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import { BASE_URL } from '../Constant';

export const request = async (method: string, url: string, data: any = {}): Promise<any> => {

  console.log("BASE_URL", BASE_URL + url);

  let headerObj: any = { 'Content-Type': 'application/json', 'Accept': 'application/json' };

  if (method == 'upload') {
    headerObj['Content-Type'] = 'multipart/form-data';
  }

  const token = await AsyncStorage.getItem('token');
  if (token) {
    headerObj['Authorization'] = token;
    console.log('Authorization', token);
  }

  let instance = axios.create({
    baseURL: BASE_URL,
    timeout: 8000,
    headers: headerObj,
  });

  let base;

  if (method === 'post') {
    console.log('post');
    base = instance.post(url, data);
  }
  else if (method === 'put') {
    base = instance.put(url, data);
  }
  else if (method === 'patch') {
    base = instance.patch(url, data);
  }
  else if (method === 'delete') {
    base = instance.delete(url);
  }
  else if (method === 'upload') {
    base = RNFetchBlob.fetch('POST', BASE_URL + url, headerObj, data)
  }
  else
    base = instance.get(url, { params: data });

  return base;
}



