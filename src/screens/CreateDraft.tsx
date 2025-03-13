import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { selectEmailById, addEmail, updateEmail } from '../app/slices/mails';
import { useResponsive } from '../hooks/useResponsive';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';


interface EmailFormData {
  id: string;
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
  const { wp, hp } = useResponsive();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute<RouteProp<RouteParams, 'CreateDraft'>>();
  const emailId = route.params?.emailId;
  const [isSentEmail, setIsSentEmail] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Get email from Redux if editing
  const existingEmail = emailId ? useSelector(selectEmailById(emailId)) : null;

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

  const { control, handleSubmit, setValue } = useForm<EmailFormData>({
    defaultValues: {
      id: emailId || Date.now().toString(),
      to: '',
      subject: '',
      body: '',
      timestamp: new Date().toLocaleString(),
      status: 'draft',
    },
  });

  useEffect(() => {
    if (emailId && existingEmail) {
      Object.keys(existingEmail).forEach(key => {
        setValue(
          key as keyof EmailFormData,
          existingEmail[key as keyof EmailFormData],
        );
      });
      setIsSentEmail(existingEmail.status === 'sent');
    }
  }, [emailId, existingEmail, setValue]);

  const saveEmail = async (data: EmailFormData, status: 'draft' | 'sent') => {
    try {
      const updatedData = {
        ...data,
        status,
        timestamp: new Date().toLocaleString().split(',')[0],
      };

      if (emailId) {
        dispatch(updateEmail(updatedData));
      } else {
        dispatch(addEmail(updatedData));
      }

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
      setIsSending(true);
      const emailData = {
        ...data,
        status: 'sent',
        timestamp: new Date().toLocaleString().split(',')[0],
      };

      // Send email to API
      const response = await fetch('https://foody-auth.vercel.app/api/email/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      // Checking if response is ok
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message;
        } catch {
          // As my server was sometimes returning text for unknown reasons instead of json
          errorMessage = await response.text();
        }
        throw new Error(errorMessage || `Server responded with status: ${response.status}`);
      }

      let responseData;
      try {
        responseData = await response.json();
        console.log('Response:', responseData);
      } catch (parseError) {
        console.log('Response was not JSON:', await response.text());
      }

      // Save as sent email only if API call was successful
      await saveEmail(data, 'sent');

      // Show success message
      Toast.show('Email sent successfully', Toast.LONG);
    } catch (error) {
      // Handle different types of errors
      if (error instanceof TypeError) {
        // Network errors
        Toast.show('Network Error: Please check your connection', Toast.LONG);
      } else {
        Toast.show(
          error instanceof Error ? error.message : 'Failed to send email',
          Toast.LONG
        );
      }
      // console.error('Error processing send:', error);

      // Keep the email as draft if sending failed
      await saveEmail(data, 'draft');

    } finally {
      setIsSending(false);
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
      shadowColor: 'lightgrey', 
      ...Platform.select({
        ios: {
          shadowOffset: { width: 0, height: 1 },
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
      paddingVertical: hp(1.4),
      paddingBottom: hp(4),
      borderTopWidth: 1,
      borderTopColor: '#E9ECEF',
      backgroundColor: '#FFFFFF',
      shadowColor: 'grey',
      ...Platform.select({
        ios: {
          shadowOffset: { width: 0, height: -3 },
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
          shadowOffset: { width: 0, height: 2 },
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
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>To</Text>
          <Controller
            control={control}
            name="to"
            rules={{ required: 'Recipient email is required' }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextInput
                  style={[
                    styles.input,
                    error && !isSentEmail && { borderColor: '#dc3545' },
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
            rules={{ required: 'Subject is required' }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextInput
                  style={[
                    styles.input,
                    error && !isSentEmail && { borderColor: '#dc3545' },
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
            render={({ field: { onChange, value } }) => (
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
            {isSending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={[styles.buttonText, styles.sendButtonText]}>
                Send Email
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CreateDraft;
