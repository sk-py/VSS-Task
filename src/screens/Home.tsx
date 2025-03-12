import React, {useState, useEffect} from 'react';
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
import {useResponsive} from '../hooks/useResponsive';
import {SelectCountry as Dropdown} from 'react-native-element-dropdown';

// Type definitions for our data structures
interface EmailItem {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  status: 'draft' | 'sent';
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
      uri: 'https://cdn-icons-png.flaticon.com/512/9195/9195557.png',
    },
  },
  {
    value: 'Logout',
    lable: 'Logout',
    image: {
      uri: 'https://www.clipartmax.com/png/middle/119-1198492_green-logout-icon-logout-icon-png-red.png',
    },
  },
];

const Home = ({navigation}: {navigation: any}) => {
  const {wp, hp} = useResponsive();

  // State management
  const [selectedMailType, setSelectedMailType] = useState<
    'Draft Mails' | 'Sent Mails'
  >('Draft Mails');
  const [searchQuery, setSearchQuery] = useState('');
  const [emails, setEmails] = useState<EmailItem[]>([]);

  // Load emails from AsyncStorage
  const loadEmails = async () => {
    try {
      const storedEmails = await AsyncStorage.getItem('emails');
      if (storedEmails) {
        setEmails(JSON.parse(storedEmails));
      }
    } catch (error) {
      console.error('Error loading emails:', error);
    }
  };

  // Load emails on mount and when navigating back
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadEmails();
    });
    return unsubscribe;
  }, [navigation]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      setSelectedMailType('Draft Mails');
      setSearchQuery('');
      setEmails([]);
    
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Handle dropdown option selection
  const handleOptionSelect = (option: any) => {
    if (option.value === 'Logout') {
      setSelectedMailType(option.value);
      handleLogout();
    } else {
      setSelectedMailType(option.value);
    }
  };

  // Filter emails based on selected type and search query
  const filteredEmails = emails.filter(email => {
    const matchesType =
      selectedMailType === 'Draft Mails'
        ? email.status === 'draft'
        : email.status === 'sent';
    const matchesSearch =
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.to.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Render individual email card
  const renderEmailCard = ({item}: {item: EmailItem}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CreateDraft', {emailId: item.id})}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.subject}
        </Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      <Text style={styles.to} numberOfLines={1}>
        To: {item.to}
      </Text>
      <Text style={styles.preview} numberOfLines={2}>
        {item.body}
      </Text>
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
      width: wp(92),
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
      backgroundColor: '#F8F9FA',
      borderRadius: wp(2),
      paddingHorizontal: wp(2),
      // marginRight: wp(1),
      borderWidth: 1,
      borderColor: '#E9ECEF',
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
      color: '#495057',
    },
    selectedTextStyle: {
      fontSize: wp(4),
      marginLeft: wp(2),
      color: '#212529',
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
      backgroundColor: '#F8F9FA',
      borderRadius: wp(2),
      paddingHorizontal: wp(4),
      paddingVertical: Platform.OS === 'ios' ? hp(2) : hp(1.5),
      fontSize: wp(4),
      borderWidth: 1,
      borderColor: '#E9ECEF',
    },
    listContainer: {
      padding: wp(5),
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: wp(3),
      padding: wp(4),
      marginBottom: hp(1.5),
      shadowColor: 'lightgrey',
      ...Platform.select({
        ios: {
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 3,
        },
      }),
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
      color: '#212529',
      flex: 1,
    },
    timestamp: {
      fontSize: wp(3.5),
      color: '#6C757D',
      marginLeft: wp(2),
    },
    to: {
      fontSize: wp(4),
      color: '#495057',
      marginBottom: hp(0.8),
    },
    preview: {
      fontSize: wp(3.8),
      color: '#6C757D',
      lineHeight: wp(5),
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
      shadowColor: 'grey',
      ...Platform.select({
        ios: {
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.25,
          shadowRadius: 4,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    fabIcon: {
      fontSize: wp(8),
      color: '#FFFFFF',
      fontWeight: '300',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: hp(20),
    },
    emptyText: {
      fontSize: wp(4.5),
      color: '#6C757D',
      textAlign: 'center',
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
          placeholderTextColor="#6C757D"
        />
      </View>

      {/* Email List */}
      <FlatList
        data={filteredEmails}
        renderItem={renderEmailCard}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.listContainer,
          filteredEmails.length === 0 && styles.emptyContainer,
        ]}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>
            No {selectedMailType.toLowerCase()} found
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateDraft')}
        activeOpacity={0.8}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
