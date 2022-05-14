import { Provider } from 'react-redux';
import { Store } from './redux/store';
import { initializeApp } from 'firebase/app';
import { LogBox } from 'react-native';
import Routes from './Routes';
import { StatusBar } from 'expo-status-bar';
LogBox.ignoreLogs(["contrast ratio"])
const firebaseConfig = {
  
};

initializeApp(firebaseConfig);




export default function App() {


  return (

    <Provider store={Store}>
      <StatusBar backgroundColor='black' style="light" />
      <Routes />
    </Provider>
  );
}
