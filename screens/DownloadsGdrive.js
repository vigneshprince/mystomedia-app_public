import React, { useState, useEffect } from 'react';
import { Box, HStack, Spacer, Text, VStack, Progress, Center, Icon, Pressable, Spinner, useToast } from "native-base";
import { useSelector, useDispatch } from 'react-redux';
import { Consts } from './Consts';
import { SwipeListView } from 'react-native-swipe-list-view';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import SpinnerProp from './SpinnerProp';
import { setDownloadGD } from '../redux/actions';
import * as Clipboard from 'expo-clipboard';

export default function DownloadsGdrive({ navigation }) {
  const dispatch = useDispatch();
  const toast = useToast();
  const { screenW, screenH } = useSelector(state => state.userReducer);
  const { downloadgd } = useSelector(state => state.userReducer)

  useEffect(() => {
    if (downloadgd.length > 0) {
      var interval = setInterval(() => {
        startPolling();
      }, 1000);
    }
    return () => { clearInterval(interval) }
  }, [downloadgd]);

  const startPolling = () => {
    axios.post(Consts.baseUrl + 'jobstatus', { "jobid": downloadgd.map(x => x.key) }).then(res => {
      if (res.data.length > 0) {
        dispatch(setDownloadGD(res.data));
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
      case 'Transferring':
        return 'info.500'
      case 'Failed':
        return 'danger.500'
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
      dispatch(setDownloadGD(downloadgd.filter(x => x.key != swipeData.key)));
    }
  };

  const copyLink = (job) => {
    toast.show({
      description: "Link Copied"
    })
    Clipboard.setString('https://vignesh.mystogd.workers.dev/0:' + encodeURI(job.parent_path + job.name))
  }

  const renderItem = (job) => {
    job = job.item
    return (
      <Pressable flex={1} onPress={() => copyLink(job)}>
        {({
          isPressed
        }) => {
          return <Box bg={isPressed ? "coolGray.200" : "white"}  my='2' mx='3' rounded='sm' p='2'>
            <HStack >
              <VStack flex='1' mr='1'>
                <Text flexShrink='1' paddingBottom='2'>{job.name}</Text>
              </VStack>
              <Box space={1} ml='auto' justifyContent='center' bg={getcolor(job.status)} p='2'>
                <Text fontWeight='bold' color='white' >{job.status}</Text>
                {job.status == 'Transferring' && <Spinner color="white" />}
              </Box>
            </HStack>
          </Box>
        }}
      </Pressable >
    )
  }

  return (
    <Box flex={1} bgColor='info.900'
    >

      <SwipeListView
        data={downloadgd}
        disableRightSwipe
        rightOpenValue={-screenW}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        keyExtractor={item => item.key}
        onSwipeValueChange={onSwipeValueChange}
        useNativeDriver={false}
        renderItem={renderItem}
      />
    </Box>
  )
}