import {Text, View, Button, StyleSheet} from "react-native";
import React, {useState} from "react";
import { set } from "react-native-reanimated";

const Inventory = () => {
    var itemsA = new Array();
    itemsA[0] = <Item name="water" quantity="10"/>;
    itemsA[1] = <Item name="sun" quantity="5"/>;
    itemsA[2] = <Item name="fertilizer" quantity="2"/>;

    const [items, setItems] = useState(itemsA);

    return (
        <View style={{borderTopWidth: 2, borderTopColor: "grey"}}>
            <Text style={[styles.heading, {backgroundColor: "lightblue", padding: 5}]}>
                Items
            </Text>
            <Text style={{flexDirection: "row", alignSelf: "flex-start", justifyContent: "space-between"}}>
                {items.length == 0 ? "Empty" : items}
            </Text>
        </View>
    );
}

const Item = (props) => {
    const [iName, setName] = useState(props.name);
    const [quantity, setQuantity] = useState(props.quantity);

    return (
        <Text>
            {iName}: {quantity + " "}
        </Text>
    );
}

const styles = StyleSheet.create({
    heading: {
        alignSelf: "center",
        justifyContent: "center",
        marginBottom: 18,
        fontWeight: "bold",
        fontSize: 18
    }
})

export default Inventory;