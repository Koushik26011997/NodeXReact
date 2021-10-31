import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Dimensions, Keyboard, ScrollView, StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { Ainput } from '../components/Ainput'
import { Rtext } from '../components/Rtext'
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'UserDatabase.db', location: 'default' });

const Details = (props: any) => {

    const { id } = props.route.params;
    console.log('id', id);
    const [loader, setLoader] = useState(false);
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [note, setNote] = useState('');
    const unit = ["KG", "Liter", "Piece", "Rs", "Others"];
    const [itemUnit, setItemUnit] = useState(unit[0]);

    useEffect(() => {
        if (id != '') {
            setLoader(true);
            fetchData();
        }
    }, []);

    const fetchData = () => {
        db.transaction((txn: any) => {
            txn.executeSql(
                'SELECT * FROM table_user where item_id = ?',
                [id],
                (tx: any, results: any) => {
                    // console.log('Results', results);
                    if (results.rows.length > 0) {
                        const item = results.rows.item(0);
                        // console.log('item1', item);
                        setItemName(item.item_name);
                        setItemPrice(item.item_price || '');
                        setItemUnit(item.item_unit);
                        setNote(item.item_note);
                        setLoader(false);
                    } else {
                        setLoader(false);
                        ToastAndroid.showWithGravity('No item found', ToastAndroid.LONG, ToastAndroid.CENTER);
                    }
                }
            );
        });
    }

    const handleData = () => {
        Keyboard.dismiss();

        if (!itemName) {
            ToastAndroid.showWithGravity('Please provide item name', ToastAndroid.LONG, ToastAndroid.CENTER);
            return;
        }
        else if (!itemPrice) {
            ToastAndroid.showWithGravity('Please provide item unit price', ToastAndroid.LONG, ToastAndroid.CENTER);
            return;
        }
        else if (!itemUnit) {
            ToastAndroid.showWithGravity('Please provide item unit name', ToastAndroid.LONG, ToastAndroid.CENTER);
            return;
        }
        else {
            if (id === '')
                saveData();
            else
                updateData();
        }
    };

    const updateData = () => {

        db.transaction((txn: any) => {
            // console.log('lll', itemPrice);
            txn.executeSql(
                'UPDATE table_user set item_name=?, item_price=?, item_unit=?, item_note=? where item_id=?',
                [itemName, itemPrice, itemUnit, note, id],
                (tx: any, results: any) => {
                    // console.log('Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        Alert.alert(
                            'Success',
                            itemName + ' is updated successfully',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => props.navigation.goBack(),
                                },
                            ],
                            { cancelable: false }
                        );
                    } else ToastAndroid.showWithGravity('Item not updated', ToastAndroid.LONG, ToastAndroid.CENTER);
                }
            );
        });
    }

    const saveData = () => {

        db.transaction((txn: any) => {
            txn.executeSql(
                'INSERT INTO table_user (item_name, item_price, item_unit, item_note) VALUES (?,?,?,?)',
                [itemName, itemPrice, itemUnit, note],
                (tx: any, results: any) => {
                    // console.log('Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        Alert.alert(
                            'Success',
                            itemName + ' is created successfully',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => props.navigation.goBack(),
                                },
                            ],
                            { cancelable: false }
                        );
                    } else ToastAndroid.showWithGravity('Item not created', ToastAndroid.LONG, ToastAndroid.CENTER);
                }
            );
        });
    }

    return (
        <ScrollView style={styles.backgroundStyle} nestedScrollEnabled={false} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
            {
                loader && <ActivityIndicator size="large" color="#f4511e" animating={true} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} />
            }

            <Rtext style={{ marginHorizontal: 12, marginBottom: 3, marginTop: 12 }} fontSize={14}>Item Name:</Rtext>
            <Ainput onChangeText={(val) => setItemName(val)} value={itemName} />

            <View style={{ marginTop: 24 }}>
                <Rtext style={{ marginHorizontal: 12, marginBottom: 3 }} fontSize={14}>Item Price / Unit:</Rtext>
                <Ainput onChangeText={(val) => setItemPrice(val)} value={itemPrice + ""} type="decimal-pad" />
            </View>

            <View style={{ marginTop: 24 }}>
                <Rtext style={{ marginHorizontal: 12, marginBottom: 3 }} fontSize={14}>Item Unit:</Rtext>
                <View style={{ backgroundColor: '#fff', flexDirection: 'row', borderRadius: 8, padding: 8, marginTop: 8, flexWrap: 'wrap', marginHorizontal: 8 }}>
                    {
                        unit.map((item: string, index: number) => {
                            return (<TouchableOpacity
                                key={index.toString()}
                                style={{
                                    width: Math.round(Dimensions.get("window").width / 5),
                                    backgroundColor: itemUnit === item ? '#3B7FF0' : '#FFFFFF', padding: 6,
                                    justifyContent: 'center', alignItems: 'center',
                                    borderRadius: 6
                                }}
                                onPress={() => setItemUnit(item)}>
                                <Rtext color={itemUnit === item ? '#FFFFFF' : '#000000'}>{item}</Rtext>
                            </TouchableOpacity>)
                        })
                    }
                </View>
            </View>

            <View style={{ marginTop: 24 }}>
                <Rtext style={{ marginHorizontal: 12, marginBottom: 3 }} fontSize={14}>Item Note: (If any)</Rtext>
                <Ainput onChangeText={(val) => setNote(val)} value={note} />
            </View>

            <TouchableOpacity style={styles.btnStyle} onPress={() => handleData()} disabled={loader}>
                <Rtext fontWeight="bold" fontSize={15} style={{ color: '#fff' }}>Save</Rtext>
            </TouchableOpacity>

        </ScrollView>
    )
}

export default Details

const styles = StyleSheet.create({
    backgroundStyle: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        padding: 12
    },
    btnStyle: { backgroundColor: '#f4511e', padding: 12, borderRadius: 8, margin: 8, marginTop: 32, justifyContent: 'center', alignItems: 'center' }
})
