import { StyleSheet } from "react-native";

export default StyleSheet.create({
    placeholderText: {
        marginLeft: 24,
        marginTop: 4,
        position: 'absolute',
        paddingHorizontal: 4,
        fontSize: 13
    },
    textInputStyle: {
        fontSize: 15,
        height: 48,
        borderWidth: 1, borderRadius: 6,
        marginTop: 12, borderColor: "#000",
        paddingHorizontal: 12, marginHorizontal: 8, color: '#000'
    },
    searchIcon: {
        position: 'absolute',
        right: 18,
        top: 25,
    },
    iconStyle: { width: 22, height: 22, resizeMode: 'contain' }
});

