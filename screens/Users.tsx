import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, FlatList, View, Image, Pressable, TouchableOpacity as TouchableBody } from 'react-native';
import { Rtext } from '../components/Rtext';
import { useIsFocused } from '@react-navigation/core';
import { GET_ALL_USERS } from '../Constant';
import { request } from '../service/common';
import { Rloader } from '../components/Rloader';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Users = (props: any) => {
    const isFocused = useIsFocused();
    const flatListRef = useRef();
    const [itemList, setItemList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    // const setList = (data: any) => {
    //     setItemList(data);
    // }

    const renderItem = (item: any, index: number) => {
        return (
            // <TouchableOpacity style={styles.rowStyle} onPress={() => props.navigation.navigate("AddUser", { id: item._id, setList: (data: any) => { setItemList(data) }, })}>
            <TouchableOpacity style={styles.rowStyle} onPress={() => props.navigation.navigate("AddUser", { id: item._id })}>
                <Rtext fontSize={15} fontWeight="bold" style={{ marginBottom: 3 }}>{"#" + (index + 1) + ". " + item.name}</Rtext>
                <Rtext fontSize={14} style={{ marginBottom: 3 }}>{item.email}</Rtext>
                <Rtext fontSize={14} style={{ marginBottom: 3 }}>{item.dob}</Rtext>
                <Rtext fontSize={14}>{item.gender}</Rtext>
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        getAllUsers();
    }, [isFocused]);

    const getAllUsers = async () => {
        try {
            setLoading(true);
            let response = await request('get', GET_ALL_USERS);
            await setItemList(response.data.data.reverse() || []);
        } catch (e) {
            if (e.response && e.response.data && e.response.data.message) {
                console.log(e.response.data.message);
            }
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.backgroundStyle}>
            {
                isLoading && <Rloader />
            }
            {
                itemList.length > 0 ?
                    <FlatList
                        data={itemList}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => { return renderItem(item, index) }} />
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Rtext color="#000" fontSize={14} >Sorry, No users(s) found.</Rtext>
                    </View>
            }

            <TouchableBody
                style={{ position: 'absolute', right: 24, bottom: 24 }}
                onPress={() => props.navigation.navigate("AddUser", { id: '' })}>
                <Image
                    source={require('../assets/icons/add.png')}
                    style={{
                        width: 52,
                        height: 52,
                    }} />
            </TouchableBody>

        </View>
    )
}

export default Users;

const styles = StyleSheet.create({
    backgroundStyle: { flex: 1, backgroundColor: '#F1F1F1' },
    rowStyle: { padding: 12, margin: 6, backgroundColor: '#fff', borderRadius: 6, elevation: 1 }
});
