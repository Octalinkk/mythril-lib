
import Header from '@/components/Header';
import { colors, globalStyles } from '@/styles/global';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'react-native';

export default function HomeScreen() {
  return (
    <LinearGradient 
      style={globalStyles.main_container}
      colors={[colors.grad_prim, colors.grad_sec, colors.grad_tri]}
      start={{x:0, y:0}}
      end={{x:1, y:1}}
    >
      <Header />
      <Text>Accueil</Text>
    </LinearGradient>
  );
}
