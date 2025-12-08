// App.js
// 메인 애플리케이션 진입점
// 화면 간 네비게이션과 전체 앱 구조를 관리합니다.
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import CarDetailsScreen from './screens/CarDetailsScreen';
import BookingScreen from './screens/BookingScreen';
import BookingsHistoryScreen from './screens/BookingsHistoryScreen';

// 스택 네비게이션 생성 (화면을 스택처럼 쌓아서 관리)
const Stack = createStackNavigator();

// 주 앱 컴포넌트 - 전체 네비게이션 구조를 정의
export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2563eb',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          {/* 홈 화면 - 사용 가능한 자동차 목록 표시 */}
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Available Cars' }}
          />
          {/* 자동차 상세정보 화면 */}
          <Stack.Screen 
            name="CarDetails" 
            component={CarDetailsScreen}
            options={{ title: 'Car Details' }}
          />
          {/* 예약 화면 - 자동차 예약 정보 입력 */}
          <Stack.Screen 
            name="Booking" 
            component={BookingScreen}
            options={{ title: 'Book Your Ride' }}
          />
          {/* 예약 이력 화면 - 사용자의 모든 예약 목록 */}
          <Stack.Screen 
            name="BookingsHistory" 
            component={BookingsHistoryScreen}
            options={{ title: 'My Bookings' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

