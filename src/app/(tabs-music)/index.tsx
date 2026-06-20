
import Header from '@/components/Header';
import { globalStyles } from '@/styles/global';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={globalStyles.main_container}>
      <Header />
      <Text>Accueil</Text>
    </View>
  );
}
