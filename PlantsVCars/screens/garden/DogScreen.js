import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, Image, ScrollView, TextInput, Button} from 'react-native';

const DogScreen = ({ navigation, route }) => {
  return (
    <ScrollView>
      <Text>Woof!</Text>
      <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Taka_Shiba.jpg',
          }}
          style={{ height: 200, flex: 1 }}
        />
    <Button
        title="Garden"
        onPress={() => navigation.navigate('Garden')}
      />
     <Button
        title="Cats"
        onPress={() => navigation.navigate('Cats')}
      />

    </ScrollView>
  );
}

export default DogScreen;