

import { updateDBToLatest } from '@/db/DBManager';
import { deleteAllDatas, exportDatas, importDatas } from '@/Managers/StorageManager';
import { colors, globalStyles } from '@/styles/global';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { killApp } from '../../modules/app-killer';

export default function AppSettings() {
  
  const [loading, setLoading] = useState<boolean>(false)

  async function handleSave() {
    setLoading(true)
    await exportDatas().then(() => {
          setLoading(false)
    });
  }

  async function handleImport() {
    setLoading(true)
    await importDatas().then(async () => {
          setLoading(false)
          updateDBToLatest()
          killApp()
    });
  }

  async function handleDelete() {
    setLoading(true)
    await deleteAllDatas().then(() => {
          setLoading(false)
          killApp()
    });
  }

  return (
    <LinearGradient 
      style={globalStyles.main_container}
      colors={[colors.grad_prim, colors.grad_sec, colors.grad_tri]}
      start={{x:0, y:0}}
      end={{x:1, y:1}}
    >
      <ScrollView style={styles.main_scroll}>
        <Text style={styles.title}>Datas</Text>
        {loading ? (
            <ActivityIndicator style={{margin: 20}} size="large" color={colors.primary} />
          ) : (
            <View>
            <TouchableOpacity style={styles.button_container} onPress={handleSave} disabled={loading}>
                <MaterialIcons name="save-alt" size={30} color={colors.primary} />
                <Text style={styles.button_text}>Save datas</Text>
            </TouchableOpacity> 
            <TouchableOpacity style={styles.button_container} onPress={handleImport} disabled={loading}>
              <Octicons name="upload" size={24} color={colors.primary} />
              <Text style={styles.button_text}>Import datas</Text>
            </TouchableOpacity> 
            <TouchableOpacity style={styles.button_container_danger} onPress={handleDelete} disabled={loading}>
              <MaterialIcons name="delete-outline" size={30} color={colors.primary} />
              <Text style={styles.button_text}>Erase datas</Text>
            </TouchableOpacity>
            </View>
          )} 
        
      </ScrollView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  
  title: {
    flex: 1,
    fontSize: 30,
    fontFamily: 'SpaceGrotesk_700Bold',
    color: colors.primary
  },
  main_scroll: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },  
  button_container:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    gap: 20,
    maxHeight: 50,
    minHeight: 50,
    borderWidth: 2,
    borderRadius: 30,
    borderColor: colors.primary,
    marginVertical: 10
  },
  button_container_danger:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    maxHeight: 50,
    gap: 20,
    borderRadius: 30,
    backgroundColor: colors.danger,
    marginVertical: 10
  },
  button_icon:{
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button_text:{
    flex: 0.8,
    flexDirection: 'row',
    fontSize: 20,
    color: colors.primary,    
    justifyContent: 'center',
    alignItems: 'center',
  },
  filler_text: {
    flex: 1,
    color: colors.secondary,
    fontFamily: 'SpaceGrotesk_400Regular',
  }
});
