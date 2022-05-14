import React, { useState, useEffect } from 'react';
import { Box, IconButton, Icon, Input, InputGroup, InputRightAddon, VStack, HStack, Select, CheckIcon, Accordion, Text, Center, ScrollView, Pressable, Spacer, Container, Dimensions } from "native-base";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Consts } from './Consts';
import axios from 'axios';
import SpinnerProp from './SpinnerProp';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import TamilVideo_song from './TamilVideo_song';


export default function TamilVideo({ navigation }) {
  const { screenW, screenH } = useSelector(state => state.userReducer);
  const [search, setSearch] = useState('');
  const [loading, setloading] = useState(false);
  const [M_S, setM_S] = useState('movie');
  const [MovieData, setMovieData] = useState([]);
  const [songData, setSongData] = useState(null);
  useEffect(() => {
    setMovieData([]);
    setSongData(null);
    searcher();
    

  }, [M_S])

  const searcher = () => {

    if (search.length >= 3) {
      setloading(true);
      M_S === 'movie' ? movieList(Consts.baseUrl + 'gettamilmoviename') : songList(Consts.baseUrl + 'gettamiltrackfromsearch');

    }

  }

  const movieList = (url) => {
    axios.post(url, { "name": search }).then(res => {
      setloading(false);
      setMovieData(res.data);
    }).catch(err => {
      console.log(err);
      setloading(false);
    })
  }

  const songList = (url) => {

    axios.post(url, { "name": search }).then(res => {
      
      let { final_track_list, tab_list } = processSong(res.data);
      setSongData(
        {
          final_track_list: final_track_list,
          tab_list: tab_list
        }
      );
      setloading(false);
    }).catch(err => {
      console.log(err);
      setloading(false);
    })


  }

  const processSong = (data) => {
    let categories = ['1080p', '720p', '4K', '2K']
    let final_track_list = []
    let included = []
    categories.forEach(category => {
      let tracks = data.filter(x => x.level3.includes(category));
      included = [...included, ...tracks]
      tracks.length > 0 && final_track_list.push({ category: category, items: tracks })
    })
    let remaining = _.difference(data, included)
    remaining.length > 0 && final_track_list.push({ category: 'Other', items: remaining })
    let tab_list = { index: 0, routes: [] }
    tab_list['routes'] = final_track_list.map(x => {
      return {
        key: x.category,
        title: x.category,
      }
    })
    return { tab_list: tab_list, final_track_list: final_track_list }
  }

  const getSongsandNavigate = (name) => {
    setloading(true);
    axios.post(Consts.baseUrl + 'gettamiltrackname', { "name": name }).then(res => {

      let { final_track_list, tab_list } = processSong(res.data);
      setloading(false);
      navigation.navigate('TamilVideo2', { data: final_track_list, tab_list: tab_list })

    }
    ).catch(err => {
      setloading(false);
      console.log(err);
    }
    )

  }



  return (
    <Box flex={1} bgColor='info.900'>
      <Container rounded='sm' m='2' p='3'>
        <InputGroup w='100%'>
          <Input onSubmitEditing={searcher} bg='white' w='80%' fontSize='md' value={search} onChangeText={(val) => setSearch(val)} placeholder="Enter Movie/Song name" />
          <InputRightAddon children={<Select bgColor='white' w="100" selectedValue={M_S} placeholder="Movie/Song" _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />
          }} onValueChange={itemValue => setM_S(itemValue)}>
            <Select.Item label="Movie" value="movie" />
            <Select.Item label="Song" value="song" />
          </Select>} />
        </InputGroup>
      </Container>

      {loading && <Center flex={1}> <SpinnerProp /></Center>}

      {!loading && M_S === 'movie' && <ScrollView>
        {MovieData.map((item, idx) => <Pressable key={item.level1} onPress={() => getSongsandNavigate(item.level1)}>
          {({
            isPressed
          }) => {
            return <Box borderWidth='2' shadow='10' rounded='sm' mx='2' my='3' p='3' bg={isPressed ? "coolGray.200" : "white"} style={{

              transform: [{
                scale: isPressed ? 0.96 : 1
              }]
            }}>

              <HStack alignItems='center'>
                <Text flex='1' >{item.level1}</Text>
                <Icon ml='auto' color="black" size="sm" as={AntDesign} name="rightcircleo" />
              </HStack>
            </Box>
          }}
        </Pressable>
        )}
      </ScrollView>
      }
      {
        !loading && M_S === 'song' && songData!=null && <TamilVideo_song data={songData.final_track_list} tab_list={songData.tab_list} navigation={navigation} ></TamilVideo_song>
      }
    </Box >
  )
}