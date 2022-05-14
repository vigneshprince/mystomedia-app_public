import React, { useState, useEffect } from 'react';
import { Box, IconButton, Icon, Input, VStack, HStack, Select, CheckIcon, Accordion, Text, Center, ScrollView, Pressable, Spacer } from "native-base";
import { Ionicons } from '@expo/vector-icons';
import { Consts } from './Consts';
import axios from 'axios';
import SpinnerProp from './SpinnerProp';
import { useSelector, useDispatch } from 'react-redux';
import { setDownloads } from '../redux/actions';
import { TabView,TabBar } from "react-native-tab-view";

export default function TamilVideo_song(props) {
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const { downloads } = useSelector(state => state.userReducer)
  const { data, tab_list,navigation } = props;

  const getSongsandNavigate = (name,link) => {
    axios.post(Consts.baseUrl + 'downloadtamilvideo', { "link": link,"name":name }).then(res => {
      dispatch(setDownloads([...downloads, res.data]));
      navigation.navigate('Downloads');
    }).catch(err => {
      console.log(err);
    }
    )
  }


  const renderScene = ({ route, jumpTo }) => {
    let track_list = data.find(x => x.category == route.key).items;
    return (
      <ScrollView flex={1} bgColor='info.900'>
        {track_list.map((item, index) => <Pressable key={item.level3} onPress={() => getSongsandNavigate(item.level3,item.level3_link)}>
          {({
            isPressed
          }) => {
            return <Box borderWidth='2' rounded='sm' mx='2' my='3' p='3' bg={isPressed ? "coolGray.200" : "white"} style={{

              transform: [{
                scale: isPressed ? 0.96 : 1
              }]
            }}>

              <HStack alignItems='center'>
                <Text flex='1' >{item.level3}</Text>
                <Icon ml='auto' color="primary.900" size="sm" as={Ionicons} name="ios-cloud-download" />
              </HStack>
            </Box>
          }}
        </Pressable>
        )}
      </ScrollView>
    )

  };


  return (

    <TabView
      flex={1}
      navigationState={tab_list}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={props => <TabBar labelStyle={{fontWeight:'bold'}} style={{backgroundColor:'#af38ff' }} {...props} />}
    />


  )
}