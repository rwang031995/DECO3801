import 'react-native-gesture-handler';
import * as React from 'react';

import { View, Text, Image, ScrollView, TextInput, Button } from 'react-native';

const GardenScreen = ({ navigation, route }) => {
  return (
    <ScrollView>
      <Text>Garden Screen</Text>
      <Button
        title="Cats"
        onPress={() => navigation.navigate('Cats')}
      />
     <Button
        title="Dogs"
        onPress={() => navigation.navigate('Dogs')}
      />

    </ScrollView>
  );
}


export default GardenScreen;