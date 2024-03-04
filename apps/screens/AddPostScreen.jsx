import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, ToastAndroid, Alert, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker'
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, getDocs, collection, addDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useUser } from '@clerk/clerk-expo';

import { app } from '../../firebaseConfig';

export default function AddPostScreen() {
  const [categoryList, setCategoryList] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const db = getFirestore(app);
  const storage = getStorage();
  const { user } = useUser();

  useEffect(() => {
    getCategoryList();
  }, []);

  // Used to get category list
  const getCategoryList = async () => {
    setCategoryList([]);
    const querySnapshot = await getDocs(collection(db, 'Category'));

    querySnapshot.forEach((doc) => {
      console.log('docs:', doc.data());
      setCategoryList(categoryList => [...categoryList, doc.data()])
    })
  }

  // Used to pick the image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // On Submit
  const onSubmitMethod = async (value) => {
    setLoading(true);
    // Convert URI to blob file
    const resp = await fetch(image);
    const blob = await resp.blob();
    const storageRef = ref(storage, 'communityPost/' + Date.now() + '.jpg');

    uploadBytes(storageRef, blob).then((snapshot) => {
      console.log('Uploaded a blob or file!')
    }).then((resp) => {
      getDownloadURL(storageRef).then(async (downloadUrl) => {
        console.log(downloadUrl);
        value.image = downloadUrl;
        value.userName = user.fullName;
        value.userEmail = user.primaryEmailAddress.emailAddress;
        value.userImage = user.imageUrl;

        const docRef = await addDoc(collection(db, "UserPost"), value)
        if (docRef.id) {
          setLoading(false);
          Alert.alert('Success!', 'Post Added Succesfully!')
        }
      })
    })
  }

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <View className='p-10'>
          <Text className='text-[27px] font-bold'>Add New Post</Text>
          <Text className='text-[16px] text-gray-500 mb-7'>Create New Post and Start Selling</Text>
          <Formik
            initialValues={{ title: '', desc: '', category: '', address: '', price: '', image: '', userName: '', userEmail: '', userImage: '', createdAt: Date.now() }}
            onSubmit={value => onSubmitMethod(value)}
            validate={(values) => {
              const errors = {}
              if (!values.title) {
                console.log('Title not Present');
                ToastAndroid.show('Title Must be there', ToastAndroid.SHORT)
                errors.name = "Title Must be there"
              }
              return errors;
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors }) => (
              <View>
                <TouchableOpacity onPress={pickImage}>
                  {image ?
                    <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 15 }} />
                    :
                    <Image
                      style={{ width: 100, height: 100, borderRadius: 15 }}
                      source={require('../../assets/images/placeholder.jpg')}
                    />
                  }
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  placeholder='Title'
                  value={values?.title}
                  onChangeText={handleChange('title')}
                />
                <TextInput
                  style={styles.input}
                  placeholder='Description'
                  value={values?.desc}
                  numberOfLines={5}
                  onChangeText={handleChange('desc')}
                />
                <TextInput
                  style={styles.input}
                  placeholder='Price'
                  value={values?.price}
                  keyboardType='number-pad'
                  onChangeText={handleChange('price')}
                />

                {/* Category list dropdown */}
                <View style={{ borderWidth: 1, borderRadius: 10, marginTop: 15 }}>
                  <Picker
                    selectedValue={values?.category}
                    className='border-2'
                    onValueChange={itemValue => setFieldValue('category', itemValue)}
                  >
                    {categoryList && categoryList.map((item, index) => (
                      <Picker.Item key={index} label={item.name} value={item.name} />
                    ))}
                  </Picker>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder='address'
                  value={values?.address}
                  onChangeText={handleChange('address')}
                />

                <TouchableOpacity
                  style={{ backgroundColor: loading ? '#ccc' : '#007BFF' }}
                  className='p-4 bg-blue-500 rounded-full mt-10'
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ?
                    <ActivityIndicator color='#fff' />
                    :
                    <Text className='text-white text-center text-[16px]'>Submit</Text>
                  }
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 17,
    textAlignVertical: 'top',
    fontSize: 17
  }
})