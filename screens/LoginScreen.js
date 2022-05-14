
import React, { useEffect, useState } from 'react'
import { Button, Center, Icon } from 'native-base'
import { Ionicons } from '@expo/vector-icons';
import {
    GoogleAuthProvider, signInWithCredential,
    getAuth
} from 'firebase/auth';
import { getFirestore, collection, query, getDocs, where } from 'firebase/firestore';
import * as Google from 'expo-google-app-auth';

const LoginScreen = ({ navigation }) => {

    const db = getFirestore();
    const [loader, setloader] = useState(false);

    const auth = getAuth();


    // useEffect(() => {
    //     if (response?.type === 'success') {
    //         setloader(true);
    //         axios.get('https://www.googleapis.com/oauth2/v3/userinfo?access_token=' + response.params.access_token).then(res => {
    //             getDocs(query(collection(db, 'user'), where('email', '==', res.data.email))).then(snapshot => {
    //                 if (!snapshot.empty) {
    //                     const credential = GoogleAuthProvider.credential(null,response.params.access_token);
    //                     signInWithCredential(auth, credential);
    //                 }
    //                 else
    //                 setloader(false);
    //             })
    //         })
    //     }
    // }, [response]);

    const signInWithGoogleAsync = async () => {
        const info = Google.logInAsync(
            {
                androidClientId: '873538358153-4ap8v0cq4leja2lp7dbh0rvmdcvnn2g0.apps.googleusercontent.com',
                androidStandaloneAppClientId: '873538358153-tf0ep4plsgojeqclr0u2ork7nvs754jt.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
            }

        ).then(info => {
            if (info.type == 'success') {
                setloader(true);
                getDocs(query(collection(db, 'user'), where('email', '==', info.user.email))).then(snapshot => {
                    if (!snapshot.empty) {
                        const credential = GoogleAuthProvider.credential(info.idToken);
                        signInWithCredential(auth, credential);
                    }
                    else
                        setloader(false);
                })
                console.log(info);
            }
        })
    }

    return (
        <Center flex={1}>
            {
                !loader && <Button variant='solid' leftIcon={<Icon as={Ionicons} name="logo-google" size="sm" />} size='md' onPress={() => {
                    signInWithGoogleAsync()
                }} > Sign In</Button>
            }
            {
                loader && <Button isLoading spinnerPlacement="end" isLoadingText="Signing In.." />
            }



        </Center>
    )
}

export default LoginScreen
