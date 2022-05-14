import React, { useState, useEffect } from 'react';
import { Box, Center, FlatList, Pressable, Text, Image, HStack,IconButton,Icon } from "native-base";
import { FontAwesome } from '@expo/vector-icons';
import {
  GoogleAuthProvider, signInWithCredential,
  getAuth,signOut
} from 'firebase/auth';
export default function HomeScreen({ navigation }) {

  useEffect(() => {
    console.log("Home");
  }, []);
  const auth = getAuth();
  const screens = [
    {
      name: "Google Drive",
      component: "GDriveSearch",
      params: { search: '' }
    },
    {
      name: "Tamil Video",
      component: "TamilVideo",
      params: {}
    },{
      name: "Tamil Yogi",
      component: "tyogihome",
      params: {}
    }
  ]

  return (
    <Box
      flex={1}
    >

      <Image position='absolute' source={require('../assets/texture.jpg')} size='100%' resizeMode='cover' />
      <Box mt='10' alignItems='center'>
        <HStack space={1} alignItems='center'>
          <Text color='white' fontSize='2xl'>Welcome to MystoMedia</Text>
          <IconButton onPress={()=>signOut(auth)} icon={<Icon as={FontAwesome} name="sign-out" />} borderRadius="full" _icon={{
            color: "orange.500",
            size: "md"
          }} />
        </HStack>
        <Image size='xl' source={require('../assets/icon.png')} alt="image" />
      </Box>
      <FlatList keyExtractor={(item)=>item.component} numColumns={2} data={screens} renderItem={({ item }) =>
        <Pressable onPress={() => navigation.navigate(item.component, item.params)}>
          {({
            isHovered,
            isPressed
          }) => {
            return <Center rounded='full' w="150" h="100" m="5" bg={isPressed ? "coolGray.400" : "coolGray.100"} style={{
              transform: [{
                scale: isPressed ? 0.96 : 1
              }]

            }} >
              <Box _text={{
                fontWeight: "bold",
                fontSize: "xl",
                color: "info.900"
              }}>
                {item.name}
              </Box>
            </Center>

          }
          }


        </Pressable>
      } />

    </Box>
  )
}