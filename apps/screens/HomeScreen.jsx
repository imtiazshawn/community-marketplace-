import { View, Text, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, doc, getDocs, getFirestore } from '@firebase/firestore';
import { app } from '../../firebaseConfig';

import Header from '../components/HomeScreen/Header';
import Slider from '../components/HomeScreen/Slider';
import Categories from '../components/HomeScreen/Categories';
import LatestItemList from '../components/HomeScreen/LatestItemList';

export default function HomeScreen() {
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const db = getFirestore(app);

  useEffect(() => {
    getSliders();
    getCategoryList();
    getLatestItemList();
  }, []);

  // Slider
  const getSliders = async () => {
    setSliderList([])
    const querySnapshot = await getDocs(collection(db, 'Sliders'));
    querySnapshot.forEach((doc) => {
      setSliderList(sliderList => [...sliderList, doc.data()])
    })
  }

  // Category
  const getCategoryList = async () => {
    setCategoryList([]);
    const querySnapshot = await getDocs(collection(db, 'Category'));

    querySnapshot.forEach((doc) => {
      setCategoryList(categoryList => [...categoryList, doc.data()])
    })
  }

  // Latest Post
  const getLatestItemList = async () => {
    const querySnapshot = await getDocs(collection(db, 'UserPost'));
    querySnapshot.forEach((doc) => {
      console.log('Docs', doc.data())
    })
  }
  return (
    <View className='py-8 px-6 bg-white flex-1'>
      <Header />
      <Slider sliderList={sliderList} />
      <Categories categoryList={categoryList} />
      <LatestItemList />
    </View>
  )
}