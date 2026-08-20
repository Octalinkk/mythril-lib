

import { deleteAllDatas, exportDatas, importDatas } from '@/Managers/StorageManager';
import { colors, globalStyles } from '@/styles/global';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  

  return (
    <LinearGradient 
      style={globalStyles.main_container}
      colors={[colors.grad_prim, colors.grad_sec, colors.grad_tri]}
      start={{x:0, y:0}}
      end={{x:1, y:1}}
    >

      <ScrollView style={styles.main_scroll}>
        <Text style={styles.title}>Datas</Text>
        <TouchableOpacity style={styles.button_container} onPress={async () => await exportDatas()}>
          <MaterialIcons name="save-alt" size={30} color={colors.primary} />
          <Text style={styles.button_text}>Save datas</Text>
        </TouchableOpacity> 
        <TouchableOpacity style={styles.button_container} onPress={async () => await importDatas()}>
          <Octicons name="upload" size={24} color={colors.primary} />
          <Text style={styles.button_text}>Import datas</Text>
        </TouchableOpacity> 
        <TouchableOpacity style={styles.button_container_danger} onPress={async () => await deleteAllDatas()}>
          <MaterialIcons name="delete-outline" size={30} color={colors.primary} />
          <Text style={styles.button_text}>Erase datas</Text>
        </TouchableOpacity>
        
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
