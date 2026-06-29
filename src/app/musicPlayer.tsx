import Slider from '@react-native-community/slider';
import TrackPlayer, { Event, useIsPlaying, useProgress } from "@rntp/player";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity } from "react-native";

import { Song, getSongById } from '@/db/SongsManager';

type MediaItem = {
    mediaId: string;
    url: string;
    title: string;
    artist: string;
    artworkUrl: string;
}

export default function MusicPlayer() {
    const params = useLocalSearchParams<{
        ids: string[];
    }>();
    const playing = useIsPlaying();
    const { position, duration } = useProgress();

    const [songs, setSongs] = useState<Song[]>([{
            id: 0,
            name: "",
            file_path: "",
            cover: "",
            last_time_played: "",
            time_listened: 0,
            time_started: 0
        }]);

    const [curr_song, setCurrSong] = useState<Song>({
            id: 0,
            name: "",
            file_path: "",
            cover: "",
            last_time_played: "",
            time_listened: 0,
            time_started: 0
        });
    
    useEffect(() => {
        async function loadSongs() {
        let ids:number[] = []

        for (const id in params.ids) {
            ids.push(+id)
        }
        
        let results = await Promise.all(
            ids.map(id => getSongById(+id))
        );

        results = results.filter(result => result != null)

        const all_songs: MediaItem[] = results
            .map(result => ({
                mediaId: result!.id.toString(),
                url: result!.file_path,
                title: result!.name,
                artist: '',
                artworkUrl: result!.cover,
            }));

        if (results[0]) {
            setCurrSong(results[0]);            
        }
        TrackPlayer.setMediaItems(all_songs, 0);
    }

    loadSongs().catch(console.error);
        
        
    }, []);
   
    TrackPlayer.addEventListener(Event.MediaItemTransition, ({ item, index }) => {
        console.log('Played:', curr_song.name);
        console.log('Now playing:', item?.title, 'at index', index);
    });

    return (
        <ScrollView>

            <Slider value={position} maximumValue={duration} style={{marginTop: 100}}/>
            <TouchableOpacity onPress={() => {playing ? TrackPlayer.pause() : TrackPlayer.play()}}>
                <Text>{playing ? 'Pause' : 'Play'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {TrackPlayer.skipToNext()}}>
                <Text>Skip</Text>
            </TouchableOpacity>

        </ScrollView>
    )
}