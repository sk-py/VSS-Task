import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useResponsive} from '../hooks/useResponsive';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';

interface EmailFormData {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  status: 'draft' | 'sent';
}

type RouteParams = {
  CreateDraft: {
    emailId?: string;
  };
};

const CreateDraft = () => {
  const {wp, hp} = useResponsive();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'CreateDraft'>>();
  const emailId = route.params?.emailId;
  const [isSentEmail, setIsSentEmail] = useState(false);

  // Set navigation options
  useEffect(() => {
    navigation.setOptions({
      headerTitle: emailId
        ? isSentEmail
          ? 'View Email'
          : 'Edit Draft'
        : 'Create Draft',
    });
  }, [navigation, emailId, isSentEmail]);

  const {control, handleSubmit, setValue} = useForm<EmailFormData>({
    defaultValues: {
      id: emailId || Date.now().toString(),
      from: 'shaikh56742@gmail.com',
      to: '',
      subject: '',
      body: '',
      timestamp: new Date().toLocaleString(),
      status: 'draft',
    },
  });

  useEffect(() => {
    const loadDraft = async () => {
      if (emailId) {
        try {
          const emails = await AsyncStorage.getItem('emails');
          if (emails) {
            const parsedEmails = JSON.parse(emails);
            const email = parsedEmails.find(
              (d: EmailFormData) => d.id === emailId,
            );
            if (email) {
              Object.keys(email).forEach(key => {
                setValue(
                  key as keyof EmailFormData,
                  email[key as keyof EmailFormData],
                );
              });
              setIsSentEmail(email.status === 'sent');
            }
          }
        } catch (error) {
          console.error('Error loading email:', error);
        }
      }
    };
    loadDraft();
  }, [emailId, setValue]);

  const saveEmail = async (data: EmailFormData, status: 'draft' | 'sent') => {
    try {
      const emails = await AsyncStorage.getItem('emails');
      const allEmails = emails ? JSON.parse(emails) : [];

      const updatedData = {
        ...data,
        status,
        timestamp: new Date().toLocaleString().split(',')[0],
      };

      if (emailId) {
        // Update existing email
        const index = allEmails.findIndex(
          (d: EmailFormData) => d.id === emailId,
        );
        if (index !== -1) {
          allEmails[index] = updatedData;
        } else {
          allEmails.push(updatedData);
        }
      } else {
        // Add new email
        allEmails.push(updatedData);
      }

      await AsyncStorage.setItem('emails', JSON.stringify(allEmails));
      navigation.goBack();
    } catch (error) {
      console.error('Error saving email:', error);
    }
  };

  const onSave = async (data: EmailFormData) => {
    await saveEmail(data, 'draft');
  };

  const onSend = async (data: EmailFormData) => {
    try {
      console.log('Email data to send:', {
        ...data,
        status: 'sent',
        timestamp: new Date().toLocaleString().split(',')[0],
      });

      // Save as sent email
      await saveEmail(data, 'sent');
    } catch (error) {
      console.error('Error processing send:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    scrollContent: {
      padding: wp(5),
    },
    fieldContainer: {
      marginBottom: hp(2),
    },
    label: {
      fontSize: wp(3.5),
      color: '#666666',
      marginBottom: hp(0.5),
      fontWeight: '500',
    },
    input: {
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: wp(2),
      paddingHorizontal: wp(4),
      paddingVertical: Platform.OS === 'ios' ? hp(1.5) : hp(1),
      fontSize: wp(4),
      color: '#000000',
      backgroundColor: '#FFFFFF',
      shadowColor: 'grey',
      ...Platform.select({
        ios: {
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    disabledInput: {
      backgroundColor: '#F8F9FA',
      borderColor: '#E9ECEF',
      color: '#6C757D',
    },
    bodyInput: {
      height: hp(40),
      textAlignVertical: 'top',
      paddingTop: hp(2),
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: wp(5),
      paddingVertical: hp(2),
      borderTopWidth: 1,
      borderTopColor: '#E9ECEF',
      backgroundColor: '#FFFFFF',
      shadowColor: 'grey',
      ...Platform.select({
        ios: {
          shadowOffset: {width: 0, height: -3},
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    button: {
      width: wp(43),
      paddingVertical: hp(1.8),
      borderRadius: wp(2.5),
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 2,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    saveButton: {
      backgroundColor: '#F8F9FA',
      borderWidth: 1,
      borderColor: '#E9ECEF',
    },
    sendButton: {
      backgroundColor: '#6A3DE8',
    },
    buttonText: {
      fontSize: wp(4),
      fontWeight: '600',
      marginLeft: wp(2),
    },
    saveButtonText: {
      color: '#495057',
    },
    sendButtonText: {
      color: '#FFFFFF',
    },
    errorText: {
      color: '#dc3545',
      fontSize: wp(3.5),
      marginTop: hp(0.5),
    },
  });

  return (
    <View style={{flex: 1}}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>From</Text>
          <Controller
            control={control}
            name="from"
            render={({field: {value}}) => (
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={value}
                editable={false}
              />
            )}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>To</Text>
          <Controller
            control={control}
            name="to"
            rules={{required: 'Recipient email is required'}}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <>
                <TextInput
                  style={[
                    styles.input,
                    error && !isSentEmail && {borderColor: '#dc3545'},
                    isSentEmail && styles.disabledInput,
                  ]}
                  placeholder="Enter recipient's email"
                  placeholderTextColor="#ADB5BD"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isSentEmail}
                />
                {error && !isSentEmail && (
                  <Text style={styles.errorText}>{error.message}</Text>
                )}
              </>
            )}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Subject</Text>
          <Controller
            control={control}
            name="subject"
            rules={{required: 'Subject is required'}}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <>
                <TextInput
                  style={[
                    styles.input,
                    error && !isSentEmail && {borderColor: '#dc3545'},
                    isSentEmail && styles.disabledInput,
                  ]}
                  placeholder="Enter subject"
                  placeholderTextColor="#ADB5BD"
                  value={value}
                  onChangeText={onChange}
                  editable={!isSentEmail}
                />
                {error && !isSentEmail && (
                  <Text style={styles.errorText}>{error.message}</Text>
                )}
              </>
            )}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Message</Text>
          <Controller
            control={control}
            name="body"
            render={({field: {onChange, value}}) => (
              <TextInput
                style={[
                  styles.input,
                  styles.bodyInput,
                  isSentEmail && styles.disabledInput,
                ]}
                placeholder="Write your message here..."
                placeholderTextColor="#ADB5BD"
                multiline
                value={value}
                onChangeText={onChange}
                textAlignVertical="top"
                editable={!isSentEmail}
              />
            )}
          />
        </View>
      </ScrollView>

      {!isSentEmail && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSubmit(onSave)}
            activeOpacity={0.8}>
            <Text style={[styles.buttonText, styles.saveButtonText]}>
              Save Draft
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.sendButton]}
            onPress={handleSubmit(onSend)}
            activeOpacity={0.8}>
            <Text style={[styles.buttonText, styles.sendButtonText]}>
              Send Email
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CreateDraft;
