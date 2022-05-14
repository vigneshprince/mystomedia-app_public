import React, { useState, useEffect, useRef } from 'react';
import { Box, InputGroup, IconButton, Icon, Input, Image, InputRightAddon, VStack, HStack, Select, CheckIcon, Accordion, Text, Center, ScrollView, Pressable, Spacer, Container, Dimensions, FlatList } from "native-base";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Consts } from './Consts';
import axios from 'axios';
import SpinnerProp from './SpinnerProp';
import _ from 'lodash';
import { useFocusEffect } from '@react-navigation/native';
import Constants from "expo-constants";

const { manifest } = Constants;

export default function GDriveSearch({ route, navigation }) {

  const [search, setSearch] = useState('');
  const [loading, setloading] = useState(false);
  const [result, setResult] = useState([]);
  const [file_folder, setfile_folder] = useState('File');
  const [maxload, setmaxload] = useState(10);
  const inputRef = useRef(null);


  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100)

    }, [])
  )
    

  const getData = (val) => {
    if (val.length > 1) {
      setSearch(val)
      setloading(true);
      if (file_folder === 'File') {
        console.log(Consts.baseUrl);
        axios.post(Consts.baseUrl + 'gdfilesearch', {
          'name': val
        }).then(res => {
          setloading(false);
          navigation.navigate('GDrive', { search: val, data: res.data ,fsize:0})

        })
      }
      else {
        axios.post(Consts.baseUrl + 'gdfoldersearch', {
          'name': val
        }).then(res => {
          setloading(false);
          navigation.navigate('GDrive', { search: val, data: res.data ,fsize:0})
        })

      }
    }
  }


  useEffect(() => {

    search.length > 3 ?
      axios.get(Consts.tmdb, {
        params: {
          query: search
        }
      }).then(res => {
        let options = res.data.results.length > 0 ? res.data.results.filter(x => x.title !== undefined && x.release_date !== undefined) : []
        setResult(options.length > 0 ? options.sort((a, b) => (a.release_date < b.release_date ? 1 : -1)) : []);
      }) :
      setResult([]);

  }, [search])

  const searchSetter = (val) => {
    inputRef.current.focus()
    setSearch(val)
  }

  return (
    <Box safeArea flex='1' bgColor='info.900'>
      <InputGroup m='2'>
        <Input flex='5' ref={inputRef} onSubmitEditing={() => getData(search)} onChangeText={(txt) => setSearch(txt)} bg='white' fontSize='md' value={search} placeholder={`Enter ${file_folder} name`} />
        <InputRightAddon children={<Select bgColor='white' w='100' selectedValue={file_folder} placeholder="File/Folder" _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size="5" />
        }} onValueChange={itemValue => setfile_folder(itemValue)}>
          <Select.Item label="File" value="File" />
          <Select.Item label="Folder" value="Folder" />
        </Select>} />
      </InputGroup>
      {loading && <Center flex={1}> <SpinnerProp /></Center>}
        {!loading && result.length > 0 && <FlatList data={result} keyExtractor={(item, index) => item.id} renderItem={({ item }) => {
            let url = Consts.imgpath + item.poster_path
            let name = item.title + ' ' + item.release_date.substring(0, 4)
            return (

              <HStack  alignItems='center' bg='white' pl='.5' borderRadius='sm' m='1' borderColor='black' borderWidth={1}>
                <Pressable onPress={() => getData(name)} flex='1' >
                  {({
                    isPressed
                  }) => {
                    return <HStack alignItems='center' bg={isPressed ? "coolGray.200" : "white"}>
                      <Image alt='-' resizeMode='contain' source={{ uri: url }} fallbackSource={require('../assets/noimg.png')} size='md' />
                      <VStack flex='1' mr='2' >
                        <HStack justifyContent='center'>
                          <Text fontSize='md' fontWeight='bold'  mr='2' >{item.title}</Text>
                          <Text fontSize='md' fontWeight='bold' >{item.release_date.substring(0, 4)}</Text>
                        </HStack>
                        <Text  >{item.overview}</Text>
                      </VStack>
                    </HStack>
                  }}
                </Pressable>

                <Pressable onPress={() => searchSetter(name)} mr='1.5' ml='auto'>
                  <Box justifyContent='center' flex='1'> <Icon style={{ transform: [{ rotateZ: '320deg' }] }} color="black" size="sm" as={AntDesign} name="arrowup" /> </Box>

                </Pressable>
              </HStack>
            )
          }}
          />
        }


    </Box >
  )
}