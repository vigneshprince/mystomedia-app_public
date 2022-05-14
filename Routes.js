
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import TamilVideo from './screens/TamilVideo';
import TamilVideo2 from './screens/TamilVideo2';
import GDrive from './screens/GDrive';
import GDriveSearch from './screens/GDriveSearch';
import Downloads from './screens/Downloads';
import DownloadsGdrive from './screens/DownloadsGdrive';
import TamilYogiMain from './screens/TamilYogiMain';
import MovieInfo from './screens/MovieInfo';
import AuthPage from './screens/AuthPage';
import { NativeBaseProvider, IconButton, Icon, VStack, Badge, HStack } from 'native-base';
import { Ionicons } from "@expo/vector-icons";
import { LogBox } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
LogBox.ignoreLogs(["contrast ratio"])
const Stack = createNativeStackNavigator();




export default function Routes() {

  const { downloads,downloadgd} = useSelector(state => state.userReducer);

  const rightHeader = (navigation) => {
    return (
      <HStack alignItems='center'>
        <IconButton
          onPress={() => navigation.navigate('HomeScreen')}
          mx="2" _icon={{
            color: "white",
            size: "sm"
          }}
          icon={<Icon as={Ionicons} name="ios-home" />}
          _pressed={{ bg: "orange.600:alpha.20" }} />

        <VStack>
          <Badge // bg="red.400"
            colorScheme="danger" rounded="full" mb={-5} mr={-2} zIndex={1} variant="solid" alignSelf="flex-end" _text={{
              fontSize: 12
            }}>
            {downloads.length}
          </Badge>
          <IconButton
            onPress={() => navigation.navigate('Downloads')}
            mx="2" _icon={{
              color: "white",
              size: "sm"
            }}
            icon={<Icon as={Ionicons} name="ios-cloud-download" />}
            _pressed={{ bg: "orange.600:alpha.20" }} /></VStack>
      </HStack>

    )
  }

  const rightHeader_1 = (navigation) => {
    return (
      <HStack alignItems='center'>
        <IconButton
          onPress={() => navigation.navigate('HomeScreen')}
          mx="2" _icon={{
            color: "white",
            size: "sm"
          }}
          icon={<Icon as={Ionicons} name="ios-home" />}
          _pressed={{ bg: "orange.600:alpha.20" }} />
<IconButton
            onPress={() => navigation.navigate('GDriveSearch')}
            mx="2" _icon={{
              color: "white",
              size: "sm"
            }}
            icon={<Icon as={Ionicons} name="search-sharp" />}
            _pressed={{ bg: "orange.600:alpha.20" }} />
        <VStack>
          <Badge // bg="red.400"
            colorScheme="danger" rounded="full" mb={-5} mr={-2} zIndex={1} variant="solid" alignSelf="flex-end" _text={{
              fontSize: 12
            }}>
            {downloads.length}
          </Badge>
          <IconButton
            onPress={() => navigation.navigate('DownloadsGdrive')}
            mx="2" _icon={{
              color: "white",
              size: "sm"
            }}
            icon={<Icon as={Ionicons} name="ios-cloud-download" />}
            _pressed={{ bg: "orange.600:alpha.20" }} />
          

          </VStack>
      </HStack>

    )
  }

  const rightHeader_2 = (navigation) => {
    return (
      <HStack alignItems='center'>
        <IconButton
          onPress={() => navigation.navigate('HomeScreen')}
          mx="2" _icon={{
            color: "white",
            size: "sm"
          }}
          icon={<Icon as={Ionicons} name="ios-home" />}
          _pressed={{ bg: "orange.600:alpha.20" }} />
        <VStack>
          <Badge // bg="red.400"
            colorScheme="danger" rounded="full" mb={-5} mr={-2} zIndex={1} variant="solid" alignSelf="flex-end" _text={{
              fontSize: 12
            }}>
            {downloadgd.length}
          </Badge>
          <IconButton
            onPress={() => navigation.navigate('Downloads')}
            mx="2" _icon={{
              color: "white",
              size: "sm"
            }}
            icon={<Icon as={Ionicons} name="ios-cloud-download" />}
            _pressed={{ bg: "orange.600:alpha.20" }} />
          

          </VStack>
      </HStack>

    )
  }

  return (
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#61005f' }, headerTintColor: 'white' }}>
            <Stack.Screen options={{ headerShown: false }} name="Auth" component={AuthPage} />
            <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
            <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
            <Stack.Screen options={({ navigation }) =>
            ({
              title: 'Tamil Video',
              headerRight: () => rightHeader(navigation)
            })
            } name="TamilVideo" component={TamilVideo} />
            <Stack.Screen options={({ navigation }) =>
            ({
              title: 'Tamil Video Files',
              headerRight: () => rightHeader(navigation)
            })
            } name="TamilVideo2" component={TamilVideo2} />
            
            <Stack.Screen options={({ navigation }) =>
            ({
              title: 'Google Drive',
              headerRight: () => rightHeader_1(navigation)
            })
            } name="GDrive" component={GDrive} />
             <Stack.Screen options={({ navigation }) =>
            ({
              title: 'TamilYogi Home',
              headerRight: () => rightHeader_2(navigation)
            })
            } name="tyogihome" component={TamilYogiMain} />
            <Stack.Screen options={({ navigation }) =>
           ({
             title: 'TamilYogi Info',
             headerRight: () => rightHeader_2(navigation)
           })
           } name="tyogiinfo" component={MovieInfo} />
            <Stack.Screen options={{title: 'Search'}} name="GDriveSearch" component={GDriveSearch} />
            <Stack.Screen options={{ title: 'Downloads' }} name="Downloads" component={Downloads} />
            <Stack.Screen options={{ title: 'Downloads' }} name="DownloadsGdrive" component={DownloadsGdrive} />
            <Stack.Screen options={{ headerShown: false }} name="HomeScreen" component={HomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
  );
}
