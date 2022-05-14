import React, { useState, useEffect } from 'react';
import { Box, Image, Button, Icon, Modal, Input, VStack, HStack, Select, CheckIcon, FlatList, Accordion, Text, Center, ScrollView, Pressable, Spacer, Container, Dimensions } from "native-base";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Consts } from './Consts';
import axios from 'axios';
import SpinnerProp from './SpinnerProp';
import _, { size } from 'lodash';
import SkeletonContent from 'react-native-skeleton-content';
import { useSelector, useDispatch } from 'react-redux';
import { setDownloadGD } from '../redux/actions';

export default function TamilYogiMain({ route, navigation }) {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    if (search.length == 0) {
      setloading(true);
      axios.get(Consts.baseUrl + 'tamiyogilatest').then(res => {
        setloading(false);
        console.log(res.data);
        setData(res.data);
      })
    }


  }, [search])

  const searchMovie = (val) => {
    setloading(true);
    setData([]);
    axios.post(Consts.baseUrl + 'tamilyogisearch', { "name": search }).then(res => {
      setData(res.data);
      setloading(false)
    }).catch(err => {
      setloading(false)
    }
    )
  }
  return (
    <Box flex={1} bgColor='info.900'>
      <VStack flex='1' p='2' space='2'>
        <Input InputRightElement={ search.length>0 && <Icon onPress={() => setSearch('')} as={<Ionicons name="close-circle" />} size={5} mr="2" color="muted.400" />} onSubmitEditing={() => searchMovie(search)} onChangeText={setSearch} bg='white' fontSize='md' value={search} placeholder={`Enter Movie name`} />

        {loading && <Center > <SpinnerProp /></Center>}
        {!loading && data.length==0 && <Center> <Text color='white'>No Data Found</Text></Center>}
        <FlatList numColumns='3' data={data} keyExtractor={(item, index) => item.link.toString()}
          renderItem={({ item }) => (

            <Pressable onPress={() => navigation.push('tyogiinfo', {
              'link': item.link, 'name': item.name,'fullname':item.fullname
            })} w='30%' p='1' m='2' bg='white' >
              {({
                isPressed
              }) => {
                return <Box w='100%' bg={isPressed ? 'gray.200' : 'white'} style={{

                  transform: [{
                    scale: isPressed ? 0.96 : 1
                  }]
                }}>
                  <Image alt='-' resizeMode='contain' source={{ uri: Consts.baseUrl + 'imgs/' + item.name + '.jpg' }} fallbackSource={require('../assets/noimg.png')} size='xl' />
                  <Center>
                    <Text>{item.name}</Text>
                  </Center>
                </Box>
              }}
            </Pressable>
          )} />

      </VStack>
    </Box >
  )
}