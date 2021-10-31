import React, { useEffect, useState } from 'react';
import { Image, Alert, Dimensions, Keyboard, ScrollView, StyleSheet, View, Platform } from 'react-native';
import { Ainput } from '../components/Ainput';
import { Rtext } from '../components/Rtext';
import { BASE_URL, REGISTER_A_USER } from '../Constant';
import { request } from '../service/common';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { normalizeSize, showFlashMessage } from '../utility/MyUtility';
import { Rloader } from '../components/Rloader';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DocumentPicker from 'react-native-document-picker';
import { NetworkInfo } from 'react-native-network-info';
import RNFetchBlob from 'rn-fetch-blob';

const AddUser = (props: any) => {

    const { id } = props.route.params;
    const DATE_FORMAT = 'DD-MM-YYYY';
    const [loader, setLoader] = useState(false);
    const [showDate, setShowDate] = useState(false);
    const [itemName, setItemName] = useState('');
    const [itemEmail, setItemEmail] = useState('');
    const [itemPassword, setItemPassword] = useState('');
    const [itemCPassword, setItemCPassword] = useState('');
    const itemGender = ["Female", "Male", "Others"];
    const [itemValue, setItemValue] = useState(itemGender[0]);
    const [itemDOB, setItemDOB] = useState(moment().format(DATE_FORMAT));

    useEffect(() => {
        if (id) {
            getUserData();
        }
    }, []);

    const getUserData = async () => {
        try {
            setLoader(true);
            let response = await request('get', "api/user/" + id);
            setItemName(response.data.data.name || '');
            setItemEmail(response.data.data.email || '');
            // setItemPassword(response.data.data.password || '');
            // setItemCPassword(response.data.data.password || '');
            setItemValue(response.data.data.gender || itemGender[0]);
            setItemDOB(response.data.data.dob || moment().format(DATE_FORMAT));

        } catch (e) {
            if (e.response && e.response.data && e.response.data.message) {
                showFlashMessage(e.response.data.message, "", "danger");
            }
        }
        finally {
            setLoader(false);
        }
    }

    const validateEmail = (email: string) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const handleData = () => {
        Keyboard.dismiss();
        if (!itemName) {
            showFlashMessage('Please provide name', "", "danger");
            return;
        }
        else if (!itemEmail) {
            showFlashMessage('Please provide email', "", "danger");
            return;
        }
        else if (!validateEmail(itemEmail)) {
            showFlashMessage('Please provide a valid email', "", "danger");
            return;
        }
        else if (!itemDOB) {
            showFlashMessage('Please provide DOB', "", "danger");
            return;
        }
        else if (!itemPassword) {
            showFlashMessage('Please provide Password', "", "danger");
            return;
        }
        else if (itemPassword.length < 6) {
            showFlashMessage('Password length must be 6 characters long', "", "danger");
            return;
        }
        else if (!itemCPassword) {
            showFlashMessage('Please provide Confirm Password', "", "danger");
            return;
        }
        else if (itemPassword !== itemCPassword) {
            showFlashMessage('Both Passwords does not matched', "", "danger");
            return;
        }
        else {
            if (!id)
                saveData();
            else
                updateData();
        }
    };

    const saveData = async () => {
        try {
            setLoader(true);
            let response = await request('post', REGISTER_A_USER,
                {
                    "name": itemName,
                    "email": itemEmail,
                    "password": itemPassword,
                    "dob": itemDOB,
                    "gender": itemValue
                }
            );

            Alert.alert(
                'Success',
                response.data.message,
                [
                    {
                        text: 'OK',
                        onPress: () => props.navigation.goBack(),
                    },
                ],
                { cancelable: false }
            );

        } catch (e) {
            if (e.response && e.response.data && e.response.data.message) {
                showFlashMessage(e.response.data.message, "", "danger");
            }
        }
        finally {
            setLoader(false);
        }
    }

    const updateData = async () => {
        try {
            setLoader(true);
            let response = await request('patch', "api/user/" + id,
                {
                    "name": itemName,
                    "password": itemPassword,
                    "dob": itemDOB,
                    "gender": itemValue
                }
            );

            Alert.alert(
                'Success',
                response.data.message,
                [
                    {
                        text: 'OK',
                        onPress: () => props.navigation.goBack(),
                    },
                ],
                { cancelable: false }
            );

        } catch (e) {
            if (e.response && e.response.data && e.response.data.message) {
                showFlashMessage(e.response.data.message, "", "danger");
            }
        }
        finally {
            setLoader(false);
        }
    }

    const openDocumentPicker = async () => {
        try {
            const res = await DocumentPicker.pick({ type: [DocumentPicker.types.images] });
            await uploadImage(res);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('cancelled by user');
            } else {
                console.log(err);
            }
        }
    };

    const uploadImage = async (res: any) => {

        // setLoader(true);
        const data = new FormData();
        data.append('dob', "26-01-1990");
        data.append('email', "iamkoushik2021550@gmail.com");
        data.append('gender', "Male");
        data.append('name', "Koushik Kar");
        data.append('password', "Koushik@123");
        data.append('userImage', {
            originalname: res[0]?.name,
            mimetype: res[0]?.type,
            uri: Platform.OS === 'android' ? res[0]?.uri : res[0]?.uri.replace('file://', ''),
            size: res[0]?.size
        });

        console.log('data', data);

        try {
            // let response = await request('upload', 'http://192.168.43.232:8005/api/user/register', data);
            // await console.log(response.data);

            let result = await fetch(
                'http://192.168.43.232:8005/api/user/register',
                {
                    method: 'post',
                    body: data,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    },
                },
            );

            let responseJson = await result.json();
            console.log(responseJson.status);

        } catch (error) {
            showFlashMessage(error, '', 'danger')
            console.log('error', error);
        }
    };

    return (
        <ScrollView style={styles.backgroundStyle} nestedScrollEnabled={false} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
            {
                loader && <Rloader />
            }
            <View style={{ flex: 1, paddingBottom: 24 }}>

                <TouchableOpacity style={styles.imgContainerStyle} onPress={() => openDocumentPicker()}>
                    <Image style={{ width: 46, height: 46, resizeMode: 'contain', borderRadius: 24 }} source={require("../assets/icons/user_icon.png")} />
                </TouchableOpacity>

                <Rtext style={{ marginHorizontal: 12, marginBottom: 3, marginTop: 12 }} fontWeight="bold" fontSize={14}>*Name: </Rtext>
                <Ainput onChangeText={(val) => setItemName(val)} value={itemName} />

                <View style={{ marginTop: 24 }}>
                    <Rtext style={{ marginHorizontal: 12, marginBottom: 3 }} fontWeight="bold" fontSize={14}>*Email: </Rtext>
                    <Ainput onChangeText={(val) => setItemEmail(val)} value={itemEmail} type="email-address" editable={id ? false : true} style={{ backgroundColor: id ? "#f1f1f1" : '#fff' }} />
                </View>

                <View style={{ marginTop: 24 }}>
                    <Rtext style={{ marginHorizontal: 12, marginBottom: 3 }} fontWeight="bold" fontSize={14}>*DOB: </Rtext>

                    <TouchableOpacity
                        onPress={() => setShowDate(true)}
                        style={{
                            borderColor: '#76A8C8',
                            marginHorizontal: 8,
                            padding: 16,
                            borderRadius: 8,
                            borderWidth: 1,
                            backgroundColor: '#fff'
                        }}>
                        <Rtext fontSize={normalizeSize(13)}>{itemDOB}</Rtext>
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 24 }}>
                    <Rtext style={{ marginHorizontal: 12, marginBottom: 3 }} fontWeight="bold" fontSize={14}>*Password: </Rtext>
                    <Ainput onChangeText={(val) => setItemPassword(val)} value={itemPassword} secureTextEntry={true} />
                </View>

                <View style={{ marginTop: 24 }}>
                    <Rtext style={{ marginHorizontal: 12, marginBottom: 3 }} fontWeight="bold" fontSize={14}>*Confirm Password: </Rtext>
                    <Ainput onChangeText={(val) => setItemCPassword(val)} value={itemCPassword} secureTextEntry={true} />
                </View>

                <View style={{ marginTop: 24 }}>
                    <Rtext style={{ marginHorizontal: 12, marginBottom: 3 }} fontWeight="bold" fontSize={14}>*Gender: </Rtext>
                    <View style={{ backgroundColor: '#fff', flexDirection: 'row', borderRadius: 8, padding: 8, marginTop: 8, marginHorizontal: 8 }}>
                        {
                            itemGender.map((item: string, index: number) => {
                                return (<TouchableOpacity
                                    key={index.toString()}
                                    style={{
                                        width: Math.round((Dimensions.get("window").width - 55) / 3),
                                        backgroundColor: itemValue === item ? '#3B7FF0' : '#FFFFFF',
                                        padding: 6,
                                        justifyContent: 'center', alignItems: 'center',
                                        borderRadius: 6
                                    }}
                                    onPress={() => setItemValue(item)}>
                                    <Rtext color={itemValue === item ? '#FFFFFF' : '#000000'} fontSize={14} fontWeight={itemValue === item ? 'bold' : 'normal'}>{item}</Rtext>
                                </TouchableOpacity>)
                            })
                        }
                    </View>
                </View>

                {/* <TouchableOpacity style={styles.btnStyle} onPress={() => props.route.params.setList([])} disabled={loader}> */}
                <TouchableOpacity style={styles.btnStyle} onPress={() => handleData()} disabled={loader}>
                    <Rtext fontWeight="bold" fontSize={15} style={{ color: '#fff' }}>{id ? 'Update' : 'Save'}</Rtext>
                </TouchableOpacity>

                <DateTimePickerModal
                    date={moment(itemDOB, DATE_FORMAT).toDate()}
                    isVisible={showDate}
                    mode="date"
                    onConfirm={(date) => (setItemDOB(moment(date).format(DATE_FORMAT)), setShowDate(false))}
                    onCancel={() => setShowDate(false)} />

            </View>

        </ScrollView>
    )
}

export default AddUser;

const styles = StyleSheet.create({
    backgroundStyle: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        padding: 10
    },
    btnStyle: {
        backgroundColor: '#f4511e',
        padding: 12, borderRadius: 8,
        margin: 8, marginTop: 32,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imgContainerStyle: {
        marginTop: 12,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'white',
        width: 80, height: 78,
        alignSelf: 'center',
        borderRadius: 40
    }
})
