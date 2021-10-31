import React, { useState } from 'react'
import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import KPTextInput from '@iamkoushik/kp-textinput';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Rtext } from '../components/Rtext';
import { showFlashMessage } from '../utility/MyUtility';
import { EMAIL_REGEX, LOGIN_A_USER } from '../Constant';
import { request } from '../service/common';
import { Rloader } from '../components/Rloader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = (props: any) => {
    const [loader, setLoader] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const doLoginValidation = () => {
        if (!email) {
            showFlashMessage("Email can't be empty", '', 'danger');
            return;
        }
        else if (!EMAIL_REGEX.test(String(email).toLowerCase())) {
            showFlashMessage("Email is not valid one", '', 'danger');
            return;
        }
        else if (!password) {
            showFlashMessage("Password can't be empty", '', 'danger');
            return;
        }
        else if (password.length < 6) {
            showFlashMessage("Password must be atleast 6 chars long", '', 'danger');
            return;
        }
        else {
            doLogin();
        }
    }

    const doLogin = async () => {
        try {
            setLoader(true);
            let response = await request('post', LOGIN_A_USER,
                {
                    "email": email,
                    "password": password
                }
            );

            console.log('response.data', response.data);
            showFlashMessage(response.data.message, "", "success");

            await AsyncStorage.setItem("user", JSON.stringify(response.data.data));
            await AsyncStorage.setItem("token", response.data.token);

            setTimeout(() => {
                props.navigation.navigate("AddUser", { id: response.data.data._id });
                setEmail("");
                setPassword("");
            }, 1200);

        } catch (e) {
            if (e.response && e.response.data && e.response.data.message) {
                showFlashMessage(e.response.data.message, "", "danger");
            }
        }
        finally {
            setLoader(false);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', padding: 8 }}>
            { loader && <Rloader />}
            <KPTextInput
                customlabelStyle={{ fontFamily: 'Lato-Regular' }}
                textboxStyle={{ fontFamily: 'Lato-Regular' }}
                textboxplaceholder="Email Address"
                textboxvalue={email}
                type={"email-address"}
                isPassword={false}
                onChangeText={(value: string) => setEmail(value)}
                keyboardType={"default"}
                labelplaceholder="Email Address"
            />
            <View style={{ height: 12 }} />
            <KPTextInput
                customlabelStyle={{ fontFamily: 'Lato-Regular' }}
                textboxStyle={{ fontFamily: 'Lato-Regular' }}
                textboxplaceholder="Password"
                textboxvalue={password}
                type={"email-address"}
                isPassword={true}
                onChangeText={(value: string) => setPassword(value)}
                keyboardType={"default"}
                showPassword={true}
                labelplaceholder="Password"
            />

            <TouchableOpacity style={{ backgroundColor: '#f4511e', width: '95%', padding: 12, borderRadius: 6, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 36 }}
                onPress={() => doLoginValidation()}
            >
                <Rtext style={{ fontSize: 15, color: '#fff' }}>Tap here to Get In</Rtext>
            </TouchableOpacity>

            <TouchableOpacity style={{ backgroundColor: '#f4511e', width: '95%', padding: 12, borderRadius: 6, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 16 }}
                onPress={() => doLoginValidation()}
            >
                <Rtext style={{ fontSize: 15, color: '#fff' }}>Register Yourself</Rtext>
            </TouchableOpacity>

            <Rtext
                style={{ fontSize: 15, color: '#000', alignSelf: 'center', marginTop: 36 }} onPress={() => console.log("kk")}>Forgot your Password?</Rtext>

        </View>
    )
}

export default Login

const styles = StyleSheet.create({});
