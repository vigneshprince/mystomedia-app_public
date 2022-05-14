
import React, { useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen';
import {
    getAuth
} from 'firebase/auth';


const AuthPage = ({ navigation }) => {

     const auth = getAuth();

    useEffect(() => {

        SplashScreen.preventAutoHideAsync();

        auth.onAuthStateChanged(user => {
            if (user) 
            // navigation.replace("tyogihome")
            // navigation.replace('tyogiinfo', {
            //     'link': 'http://tamilyogi.best/valimai-2022-tamil-movie-hdrip-720p-watch-online/','name':'Valimai 2022'
            //   })
            navigation.replace("HomeScreen")

            else navigation.replace("Login")

            SplashScreen.hideAsync();
        })

    }, [])


    return null
}

export default AuthPage
