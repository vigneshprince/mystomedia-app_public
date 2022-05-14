import React, { useState, useEffect } from 'react';
import { Box, Image, Button, Icon, Badge, Divider, VStack, HStack, Select, CheckIcon, FlatList, Accordion, Text, Center, ScrollView, Pressable, Spacer, Container, Dimensions } from "native-base";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Consts } from './Consts';
import axios from 'axios';
import SpinnerProp from './SpinnerProp';
import _, { size } from 'lodash';
import SkeletonContent from 'react-native-skeleton-content';
import { useSelector, useDispatch } from 'react-redux';
import { setDownloads } from '../redux/actions';

export default function MovieInfo({ route, navigation }) {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [data, setData] = useState({});
  const [quality, setquality] = useState({});
  const [loading, setloading] = useState(false);
  const [nodata, setnodata] = useState(false);
  const { downloads } = useSelector(state => state.userReducer)

  useEffect(() => {
    setloading(true);
    axios.post(Consts.baseUrl + 'tamilyogiselectprint', { "link": route.params.link }).then(res => {
      setquality(res.data);
    })


    axios.post(Consts.baseUrl + 'imdbmovie', { "name": route.params.name }).then(res => {
      if (res.data != null)
        setData(res.data);
      else
        setnodata(true);
      setloading(false);
    })

  }, [])

  const tohours_minutes = (minutes) => {
    var h = Math.floor(minutes / 60);
    var m = minutes % 60;
    return h > 0 ? h + 'h ' + m + 'm' : m + 'm';
  }

  var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

  function abbreviateNumber(number) {

    // what tier? (determines SI symbol)
    var tier = Math.log10(Math.abs(number)) / 3 | 0;

    // if zero, we don't need a suffix
    if (tier == 0) return number;

    // get suffix and determine scale
    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    // scale the number
    var scaled = number / scale;

    // format number and add suffix
    return scaled.toFixed(1) + suffix;
  }

  const dlFile = (link) => {
    let name = route.params.name + ' ' + quality[link] + '.mp4'
    axios.post(Consts.baseUrl + 'tamilyogidownload', { "link": link, "name": name }).then(res => {
      dispatch(setDownloads([...downloads, res.data]));
      navigation.navigate('Downloads');
    }).catch(err => {
      console.log(err);
    }
    )
  }

  return (
    <ScrollView flex={1} bgColor='info.900'>
      {loading && <Center> <SpinnerProp /></Center>}
      {nodata && <Center> <Text color='white'>No Data Found</Text></Center>}
      {Object.keys(data).length > 0 && <VStack my='2' >
        <HStack >
          <Image alt='-' resizeMode='contain' source={{ uri: data['cover url'] }} fallbackSource={require('../assets/noimg.png')} size='xl' />
          <VStack flex='1' >
            <Text bold fontSize='lg' color='white'>{route.params.name}</Text>
            <HStack flex='1' alignItems='center' height='30%' >
              <Icon mr='2' color="yellow.500" size="xs" as={Ionicons} name="ios-star" />
              <Text bold fontSize='md' mr='3' color='white' fontStyle='italic'>{data['rating']}</Text>
              {data['votes']!=null && <Text bold fontSize='md' mr='3' color='white' fontStyle='italic'>{abbreviateNumber(data['votes'])} votes</Text>}
              <Text px='2' bg='warning.700' fontSize='md' color='white'>{data['certificates']}</Text>
            </HStack>
            <Box alignItems='center' flexWrap='wrap' flexDirection='row'>
              {data['genres'].map((genre, index) => {
                return <Badge colorScheme="coolGray">{genre}</Badge>
              })}
             {data['runtimes']!=null && <Text mb='2' px='2' bg='warning.700' fontSize='md' ml='2' mr='2' color='white' >{tohours_minutes(parseInt(data['runtimes'][0]))}</Text>}


            </Box >

          </VStack>
        </HStack>
        <Divider bg="emerald.500" thickness="2" m="2" />
        <Text m='2' fontSize='md' mr='3' color='white'>{data['plot']}</Text>
        <Divider bg="emerald.500" thickness="2" m="2" />
        <Container m='2' flexDirection='row'>
          <Text fontSize='md' color='white' bold>Director: </Text>
          <Text fontSize='md' mr='3' color='white'>{data['director']}</Text>
        </Container>
        <Divider bg="emerald.500" thickness="2" m="2" />
        <FlatList ml='2'
          horizontal={true}
          data={data['cast']}
          renderItem={({ item }) => <Box bg='emerald.800' p='5' h='75' justifyContent='center'>
            <Text color='white' fontSize='md' >{item}</Text>
          </Box>
          }
          ItemSeparatorComponent={() => <Divider bg="emerald.500" orientation='vertical' thickness="2" m="2" />}
          keyExtractor={(item) => item}
        />


      </VStack>}
      <VStack rounded='md' justifyContent='center'  p='5' m='2' flex='1' bg='coolGray.800'>
        <Text m='2' fontSize='md' color='white'>{route.params.fullname}</Text>
        <Box m='2' flexDirection='row' justifyContent='center' >
          {Object.keys(quality).map((qlkey, index) => {
            return <Button color='blueGray.800' mr='2' onPress={() => dlFile(qlkey)}>
              <Text color='white'>{quality[qlkey]}</Text>
            </Button>
          })}
        </Box>
      </VStack>

    </ScrollView >
  )
}