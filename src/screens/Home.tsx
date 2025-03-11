import React from 'react';
import { View, Text, Button } from 'react-native';

const Home = ({ navigation }: { navigation: any }) => {
    return (
        <View>
            <Text>Home</Text>
            <Button title="Create Draft" onPress={() => navigation.navigate('CreateDraft')} />
            <Button title="Initial Screen" onPress={() => navigation.navigate('InitialScreen')} />
        </View>
    );
}

export default Home;
