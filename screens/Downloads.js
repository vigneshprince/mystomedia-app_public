import React, { useState, useEffect,useRef } from 'react';
import { Box, HStack, Spacer, Text, VStack, Progress, Center, Icon, Pressable } from "native-base";
import { useSelector, useDispatch } from 'react-redux';
import { Consts } from './Consts';
import { SwipeListView } from 'react-native-swipe-list-view';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import SpinnerProp from './SpinnerProp';
import { setDownloads } from '../redux/actions';
import { Video, AVPlaybackStatus } from 'expo-av';
export default function Downloads({ navigation }) {
  const video = React.useRef(null);
  const dispatch = useDispatch();
  const { screenW, screenH } = useSelector(state => state.userReducer);
  const { downloads } = useSelector(state => state.userReducer)

  useEffect(() => {
    if (downloads.length > 0) {
      var interval = setInterval(() => {
        startPolling();
      }, 1000);
    }
    return () => { clearInterval(interval) }
  }, [downloads]);

  const startPolling = () => {
    axios.post(Consts.baseUrl + 'jobstatus', { "jobid": downloads.map(x => x.key) }).then(res => {
      if (res.data.length > 0) {
        dispatch(setDownloads(res.data));
      }
    }).catch(err => {
      console.log(err);
    }
    )
  }


  const getcolor = (status) => {
    switch (status) {
      case 'Finished':
        return 'success.500'
      case 'Downloading':
        return 'info.500'
      case 'Failed':
        return 'danger.500'
      case 'Uploading':
        return 'secondary.500'
      default:
        return 'info.900'
    }
  }

  const renderHiddenItem = (data, props) => {

    return (

      <HStack flex="1" my='2' mx='3'>
        <Box justifyContent='center' alignItems='center' w="100%" bg="danger.500" rounded='sm'>
          <Icon ml='auto' mr='2' color="white" size="md" as={Ionicons} name="ios-close-circle" />
        </Box>
      </HStack>
    );
  }

  const onSwipeValueChange = swipeData => {
    if (
      swipeData.value < -screenW
    ) {
      dispatch(setDownloads(downloads.filter(x => x.key != swipeData.key)));
    }
  };

  const renderItem = (job) => {
    job = job.item
    return (
      <Box bg='white' my='2' mx='3' rounded='sm' p='2'>
        <HStack >
          <VStack flex='1' mr='1'>
            <Text flexShrink='1' paddingBottom='2'>{job.name}</Text>
            <Progress value={job.percent} />
            <Center paddingTop='2'>
              <HStack>
                <Text mr='3'>{job.percent}%</Text>
                <Text>{job.done.toFixed(2)} MB / {job.total.toFixed(2)} MB </Text>
              </HStack>
            </Center>
          </VStack>
          <Box ml='auto' justifyContent='center' bg={getcolor(job.status)} p='2'>
            <Text fontWeight='bold' color='white' >{job.status}</Text>
          </Box>

        </HStack>
      </Box>
    )
  }

  return (
    <Box flex={1} bgColor='info.900'
    >

      <SwipeListView
        data={downloads}
        disableRightSwipe
        rightOpenValue={-screenW}
        keyExtractor={(item, index) => item.key}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onSwipeValueChange={onSwipeValueChange}
        useNativeDriver={false}
        renderItem={renderItem}
      />
      <Video
        ref={video}
        style={{ width: 300, height: 300 }}
        source={{
          uri: 'https://vignesh.mystogd.workers.dev/0:/Scream%20(2022)%201080p%2010bit%20WEBRip%2060FPS%20x265%20HEVC%20%5BEnglish%5D%20-%20ViiR%20.mkv',
        }}
        useNativeControls
        resizeMode="cover"
        shouldPlay={false}
        isLooping
      />
    </Box>
  )
}