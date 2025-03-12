import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    TextInput,
    FlatList,
    StatusBar,
    Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useResponsive } from '../hooks/useResponsive';
import { SelectCountry as Dropdown } from 'react-native-element-dropdown';

// Type definitions for our data structures
interface EmailItem {
    id: string;
    title: string;
    to: string;
    preview: string;
    timestamp: string;
    type: 'draft' | 'sent';
}

const dropDownOptions = [
    {
        value: 'Draft Mails',
        lable: 'Draft Mails',
        image: {
            uri: 'https://cdn4.iconfinder.com/data/icons/email-fill-02/512/34-Open_Letter-512.png',
        },
    },
    {
        value: 'Sent Mails',
        lable: 'Sent Mails',
        image: {
            uri: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/high-10989861-9058071.png',
        },
    },
    {
        value: 'Logout',
        lable: 'Logout',
        image: {
            uri: 'https://cdn.iconscout.com/icon/premium/png-512-thumb/medium-10989899-9057958.png?f=webp&w=256',
        },
    },
];

const Home = ({ navigation }: { navigation: any }) => {
    const { wp, hp } = useResponsive();

    // State management
    const [selectedMailType, setSelectedMailType] = useState<'Draft Mails' | 'Sent Mails'>('Draft Mails');
    const [searchQuery, setSearchQuery] = useState('');

    // Dummy data for demonstration
    const emailData: EmailItem[] = [
        {
            id: '1',
            title: 'Register a Trademark',
            to: 'Daniel Santos',
            preview: 'Lorem ipsum dolor sit amet, consectetur lorem ipsum dolor sit amet, consectetur adipiscing elit...',
            timestamp: '4:45pm',
            type: 'draft'
        },
        {
            id: '2',
            title: 'Provisional Patent Filling',
            to: 'Gary White',
            preview: 'Lorem ipsum dolor sit amet, consectetur lorem ipsum dolor sit amet, consectetur adipiscing elit...',
            timestamp: '1:15pm',
            type: 'draft'
        },
        {
            id: '3',
            title: 'Employment Contract Review',
            to: 'Harry Kim',
            preview: 'Lorem ipsum dolor sit amet, consectetur lorem ipsum dolor sit amet, consectetur adipiscing elit...',
            timestamp: '11:28am',
            type: 'sent'
        },
        {
            id: '4',
            title: 'H-1B Application Services',
            to: 'Brenda Thompson',
            preview: 'Lorem ipsum dolor sit amet, consectetur lorem ipsum dolor sit amet, consectetur adipiscing elit...',
            timestamp: '10:30am',
            type: 'sent'
        }
    ];

    // Filter emails based on selected type and search query
    const filteredEmails = emailData.filter(email => {
        const matchesType = selectedMailType === 'Draft Mails' ? email.type === 'draft' : email.type === 'sent';
        const matchesSearch = email.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.to.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    // Handle logout
    const handleLogout = async () => {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    // Handle dropdown option selection
    const handleOptionSelect = (option: any) => {
        if (option.value === 'Logout') {
            handleLogout();
        } else {
            setSelectedMailType(option.value);
        }
    };

    // Render individual email card
    const renderEmailCard = ({ item }: { item: EmailItem }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('CreateDraft', { emailId: item.id })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
            <Text style={styles.to} numberOfLines={1}>{item.to}</Text>
            <Text style={styles.preview} numberOfLines={3}>{item.preview}</Text>
        </TouchableOpacity>
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#F8F9FA',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: wp(96),
            marginHorizontal: wp(4),
            paddingTop: hp(4),
            backgroundColor: '#FFFFFF',
        },
        headerTitle: {
            fontSize: wp(6),
            fontWeight: '600',
            color: '#000000',
        },
        dropdown: {
            height: hp(5),
            width: wp(40),
            backgroundColor: '#dbdbdb47',
            borderRadius: wp(4),
            paddingHorizontal: wp(2),
            marginRight:wp(2)
        },
        imageStyle: {
            width: wp(4.5),
            height: wp(4.5),
            borderRadius: wp(1),
            marginLeft: wp(0.5),
        },
        placeholderStyle: {
            fontSize: wp(4),
            marginLeft: wp(1.5),
        },
        selectedTextStyle: {
            fontSize: wp(4),
            marginLeft: wp(2),
        },
        iconStyle: {
            width: wp(5),
            height: wp(5),
        },
        searchContainer: {
            paddingHorizontal: wp(5),
            paddingVertical: hp(1.5),
            backgroundColor: '#FFFFFF',
        },
        searchInput: {
            backgroundColor: '#F5F5F5',
            borderRadius: wp(2),
            paddingHorizontal: wp(4),
            paddingVertical: hp(1.5),
            fontSize: wp(4),
        },
        listContainer: {
            padding: wp(5),
        },
        card: {
            backgroundColor: '#FFFFFF',
            borderRadius: wp(3),
            padding: wp(4),
            marginBottom: hp(1.5),
            elevation: 8,
            shadowColor: 'lightgrey',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        cardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: hp(0.8),
        },
        cardTitle: {
            fontSize: wp(4.5),
            fontWeight: '600',
            color: '#000000',
            flex: 1,
        },
        timestamp: {
            fontSize: wp(3.5),
            color: '#666666',
            marginLeft: wp(2),
        },
        to: {
            fontSize: wp(4),
            color: '#666666',
            marginBottom: hp(0.8),
        },
        preview: {
            fontSize: wp(3.5),
            color: '#999999',
        },
        fab: {
            position: 'absolute',
            right: wp(5),
            bottom: hp(3),
            width: wp(15),
            height: wp(15),
            borderRadius: wp(7.5),
            backgroundColor: '#6A3DE8',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 6,
            shadowColor: 'grey',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
        },
        fabIcon: {
            fontSize: wp(8),
            color: '#FFFFFF',
            fontWeight: '300',
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{selectedMailType}</Text>
                <Dropdown
                    style={styles.dropdown}
                    selectedTextStyle={styles.selectedTextStyle}
                    placeholderStyle={styles.placeholderStyle}
                    imageStyle={styles.imageStyle}
                    iconStyle={styles.iconStyle}
                    maxHeight={200}
                    value={selectedMailType}
                    data={dropDownOptions}
                    valueField="value"
                    labelField="lable"
                    imageField="image"
                    placeholder={selectedMailType}
                    onChange={handleOptionSelect}
                />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search emails..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#666"
                />
            </View>

            {/* Email List */}
            <FlatList
                data={filteredEmails}
                renderItem={renderEmailCard}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />

            {/* Floating Action Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CreateDraft')}
            >
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Home;
