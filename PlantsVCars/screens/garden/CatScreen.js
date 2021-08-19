import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, Image, ScrollView, TextInput, Button } from 'react-native';

const CatScreen = ({ navigation, route }) => {
  return (
    <ScrollView>
      <Text>Some text</Text>
      <View>
        <Text>Some more text</Text>
        <Image
          source={{
            uri: 'https://reactnative.dev/docs/assets/p_cat2.png',
          }}
          style={{ width: 200, height: 200 }}
        />
      </View>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1
        }}
        defaultValue="You can type in me"
      />
     <Button
        title="Garden"
        onPress={() => navigation.navigate('Garden')}
      />
     <Button
        title="Dogs"
        onPress={() => navigation.navigate('Dogs')}
      />

    </ScrollView>
  );
}

export default CatScreen;