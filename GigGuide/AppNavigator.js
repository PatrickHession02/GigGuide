import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ConcertInfo from './screens/Concertinfo';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Concertinfo" component={ConcertInfo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;