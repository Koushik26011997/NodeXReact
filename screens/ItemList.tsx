import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, FlatList, View, Image, TouchableOpacity } from 'react-native'
import { Rtext } from '../components/Rtext';
import { initializeDB } from '../utility/MyUtility';
import { openDatabase } from 'react-native-sqlite-storage';
import { useIsFocused } from '@react-navigation/core';

var db = openDatabase({ name: 'UserDatabase.db', location: 'default' });

const ItemList = (props: any) => {
    const isFocused = useIsFocused();
    const flatListRef = useRef();
    const [itemList, setItemList] = useState([]);

    const renderItem = (item: any, index: number) => {
        return (
            <TouchableOpacity style={styles.rowStyle} onPress={() => props.navigation.navigate("Details", { id: item.item_id })}>
                <Rtext fontSize={13}>{"#" + (index + 1) + ". " + item.item_name}</Rtext>
                <Rtext fontSize={13} style={{ marginTop: 6 }}>{"Price: " + 'Rs. ' + item.item_price + ' / ' + item.item_unit}</Rtext>
                {item.item_note != "" ? <Rtext fontSize={13} style={{ marginTop: 6 }}>{"Note: " + item.item_note}</Rtext> : null}
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        initializeDB();
        getAllData();
    }, [props, isFocused]);

    const getAllData = () => {
        console.log('calles');
        db.transaction((tx: any) => {
            tx.executeSql(
                'SELECT * FROM table_user',
                [],
                (tx: any, results: any) => {
                    var temp: any = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        temp.push(results.rows.item(i));
                        console.log("item", results.rows.item(i));
                    }
                    setItemList(temp);
                }
            );
        });
    }

    return (
        <View style={styles.backgroundStyle}>
            {
                itemList.length > 0 ?
                    <FlatList
                        data={itemList}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return renderItem(item, index);
                        }} />

                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Rtext color="#000" fontSize={14} >Sorry, No product(s) found.</Rtext>
                    </View>
            }

            <TouchableOpacity
                style={{ position: 'absolute', right: 24, bottom: 24 }}
                onPress={() => props.navigation.navigate("Details", { id: '' })}>
                <Image
                    source={require('../assets/icons/add.png')}
                    style={{
                        width: 52,
                        height: 52,
                    }} />
            </TouchableOpacity>
        </View>
    )
}

export default ItemList

const styles = StyleSheet.create({
    backgroundStyle: {
        flex: 1,
        // backgroundColor: '#15202B',
        backgroundColor: '#F1F1F1',
    },
    rowStyle: { padding: 12, margin: 6, backgroundColor: '#fff', borderRadius: 6 }
})
