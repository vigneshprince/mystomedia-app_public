import React from 'react';
import TamilVideo_song from './TamilVideo_song';
export default function TamilVideo2({ route, navigation }) {
  const { data, tab_list } = route.params;
  return (
    <TamilVideo_song data={data} tab_list={tab_list} navigation={navigation}></TamilVideo_song>
  )
}