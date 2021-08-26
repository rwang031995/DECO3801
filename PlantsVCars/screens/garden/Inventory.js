import {Text, View, Button, StyleSheet, Alert, TouchableOpacity} from "react-native";
import React, {useState} from "react";
import { set } from "react-native-reanimated";

const Inventory = () => {
    var itemsA = new Array();
    itemsA[0] = <Item name="water" quantity={10}/>;
    itemsA[1] = <Item name="sun" quantity={5}/>;
    itemsA[2] = <Item name="fertilizer" quantity={2}/>;

    const [items, setItems] = useState(itemsA);

    return (
        <View style={{flex: 1}}>

            <View style={{borderTopWidth: 2, borderTopColor: "grey"}}>
                <Text style={styles.heading}>
                    Items
                </Text>
            </View>

            <View style={{flexDirection: "row"}}>
                <View style={{flex: 3}}>
                    <Text style={{flexDirection: "row", alignSelf: "flex-start", justifyContent: "space-between"}}>
                        {items.length == 0 ? "Empty" : items}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const Item = (props) => {
    const [iName, setName] = useState(props.name);
    const [quantity, setQuantity] = useState(parseInt(props.quantity));

    return (
        <>
            <Text>
                {iName}: {quantity + " "}
            </Text>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText} onPress={() => setQuantity(quantity + 1)}>
                    {iName}+
                </Text>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    heading: {
        alignSelf: "center",
        justifyContent: "center",
        marginBottom: 18,
        fontWeight: "bold",
        fontSize: 18
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 4,
    },
    buttonText: {
        fontSize: 8
    }
})

export default Inventory;