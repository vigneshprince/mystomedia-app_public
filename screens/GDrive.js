import React, { useState, useRef } from 'react';
import { Box, Button, Icon, Modal, Input, VStack, HStack, Select, CheckIcon, FlatList, Accordion, Text, Center, ScrollView, Pressable, Spacer, Container, Dimensions } from "native-base";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Consts } from './Consts';
import axios from 'axios';
import SpinnerProp from './SpinnerProp';
import _, { size } from 'lodash';
import SkeletonContent from 'react-native-skeleton-content';
import { useSelector, useDispatch } from 'react-redux';
import { setDownloadGD } from '../redux/actions';

export default function GDrive({ route, navigation }) {
  const dispatch = useDispatch();
  const [search, setSearch] = useState(route.params.search);
  const [loading, setloading] = useState(false);
  const [loading_1, setloading_1] = useState(false);
  const [MovieData, setMovieData] = useState(route.params.data);
  const [longpress, setlongpress] = useState(false);
  const [fsize, setfsize] = useState(route.params.fsize);
  const { downloadgd } = useSelector(state => state.userReducer)
  const [popup, setpopup] = useState(false);
  const [folderName, setFolderName] = useState("");
  const inputRef = useRef(null);

  // useEffect(() => {
  //   console.log(search);
  //   //getData();
  //   setMovieData([
  //     {
  //       'name': 'asdasdasdasdasf sd fd asdfasdfas df sdsfasd dfasdf safsdf sfdsad sdf',
  //       'size': 12123123123,
  //       'id': '2132',
  //       'selected': false,
  //       'mimeType': 'application/vnd.google-apps.folder',
  //     },
  //     {
  //       'name': 'asdasdasdasdasf sd fd asdfasdfas df sdsfasd dfasdf safsdf sfdsad sdf',
  //       'size': 1256312313,
  //       'id': '213s2',
  //       'selected': false,
  //       'mimeType': 'application/vnd.google-apps.asd',
  //     }
  //   ]);

  // }, [search])


  function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }
  const pressItem = (item) => {
    if (longpress) {
      if (!item.mimeType.includes('folder'))
      {
        let idx = _.findIndex(MovieData, { 'id': item.id });
        let temp = _.map(MovieData, function (a, i) {
          return i == idx ? { ...a, 'selected': !a.selected } : a;
        })
        setMovieData(temp);
        
        if(_.filter(temp, { 'selected': true }).length == 0)
          setlongpress(false);
      }
      
    }
    else if (item.mimeType.includes('folder')) {
      setloading(true);
      axios.post(Consts.baseUrl + 'gdchildrensearch', {
        'name': item.id
      }).then(res => {
        navigation.push('GDrive', {
          'search': search,
          'data': [...res.data.files, ...res.data.folders],
          'fsize': res.data.folder_size
        })
        setloading(false);
      })

    }
    else {
      axios.post(Consts.baseUrl + 'gdfiletransfer', { "name": item.name, 'id': item.id }).then(res => {
        dispatch(setDownloadGD([...downloadgd, res.data]));
        navigation.navigate('DownloadsGdrive');
      }).catch(err => {
        console.log(err);
      }
      )
    }

  }

  const longPressItem = (item) => {

    if (!longpress) {
      let idx = _.findIndex(MovieData, { 'id': item.id });
      setMovieData(_.map(MovieData, function (a, i) {
        return i == idx ? { ...a, 'selected': !a.selected } : a;
      })
      )
      setlongpress(true);
    }
  }

  const cancelSelect = () => {
    setMovieData(_.map(MovieData, function (a, i) {
      return { ...a, 'selected': false }
    })
    )
    setlongpress(false)
  }
  const copySelected = () => {
    setloading_1(true);
    axios.post(Consts.baseUrl + 'gdfoldertransfer', { 'files': _.filter(MovieData, { 'selected': true }), 'folder': folderName }).then(res => {
      dispatch(setDownloadGD([...downloadgd, ...res.data]));
      setFolderName("");
      setpopup(false);
      setloading_1(false);
      navigation.navigate('DownloadsGdrive');
    }).catch(err => {
      console.log(err);
      setFolderName("");
      setpopup(false);
      setloading_1(false);
    }
    )
  }
  const selectall = () => {
    setMovieData(_.map(MovieData, function (a, i) {
      return { ...a, 'selected': true }
    })
    )
  }
  const openpopup = () => {
    setpopup(true)
    setTimeout(() => {
      inputRef.current.focus();
    }, 100)
  }
    return (
      <Box flex={1} bgColor='info.900'>
        <Center my='2'>
          <Text color='white' >Results for : {<Text color='white' fontSize='md' fontWeight='bold' > {search} </Text>}</Text>
        </Center>
        <HStack flexWrap='wrap' mb='2'>
          {fsize > 0 && <Container borderWidth='1' borderColor='white' rounded='sm' ml='2' p='2' >
            <Text color='white' >Size: {bytesToSize(fsize)}</Text>
          </Container>}
          {longpress && <HStack ml='auto' mr='2'>
            <Button mr='2' onPress={selectall} colorScheme="primary">
              Select All
            </Button>
            <Button mr='2' onPress={() => openpopup()} colorScheme="primary">
              {`Copy ${MovieData.filter(x => x.selected == true).length} items`}
            </Button>
            <Button onPress={cancelSelect} colorScheme="secondary">
              Cancel
            </Button>
          </HStack>}
        </HStack>
        <Modal isOpen={popup} onClose={() => setpopup(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Folder Name</Modal.Header>
            <Modal.Body>
              {!loading_1 && <Input value={folderName} onChangeText={setFolderName} ref={inputRef} onSubmitEditing={copySelected} bg='white' fontSize='md' placeholder={`Enter folder name`} />}
              {loading_1 && <SpinnerProp />}

            </Modal.Body>
          </Modal.Content>
        </Modal>
        {/* <SkeletonContent
        containerStyle={{ flex: 1, width: 300 }}
        isLoading={true}
        animationDirection="horizontalLeft"
        layout={[
          { key: 'someId', width: 220, height: 20, marginBottom: 6 },
          { key: 'someOtherId', width: 180, height: 20, marginBottom: 6 }
        ]}
      >
        <Text >Your content</Text>
        <Text>Other content</Text>
      </SkeletonContent> */}

        {loading && <Center flex={1}> <SpinnerProp /></Center>}
        {!loading && MovieData.length>0 && <FlatList data={MovieData} keyExtractor={(item) => item.id} renderItem={({ item }) => {
          return (
            <Pressable  delayLongPress={200} onPress={() => pressItem(item)} onLongPress={() => !item.mimeType.includes('folder') && longPressItem(item)} >
              {({
                isPressed
              }) => {
                return <Box borderWidth='2' shadow='10' rounded='sm' mx='2' my='3' p='2' bg={item.selected ? 'blue.300' : item.mimeType.includes('folder') ? 'yellow.300' : "white"} style={{

                  transform: [{
                    scale: isPressed ? 0.96 : 1
                  }]
                }}>

                  <HStack flex='1' >
                    {
                      item.selected && <Box mr='2' justifyContent='center'>
                        <Icon color="blue.500" size="sm" as={AntDesign} name="checkcircle" />
                      </Box>
                    }
                    {
                      item.mimeType.includes('folder') && <Box mr='2' justifyContent='center'>
                        <Icon ml='auto' color="black" size="sm" as={AntDesign} name="folder1" />
                      </Box>
                    }


                    <Text flex='6' >{item.name}</Text>

                    {
                      !item.mimeType.includes('folder') && <HStack>
                        <Box px='2' justifyContent='center' ml='2' mr='2' bg='cyan.300'>
                          <Text >{bytesToSize(item.size)}</Text>
                        </Box>
                        <Box justifyContent='center'>
                          <Icon ml='auto' color="black" size="sm" as={AntDesign} name="clouddownload" />
                        </Box>
                      </HStack>
                    }

                  </HStack>
                </Box>
              }}
            </Pressable>
          )
        }} />}

      </Box >
    )
  }