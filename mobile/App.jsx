import { View, Text } from 'react-native';
import { Amplify } from 'aws-amplify';
import { Login } from './src/screens/LoginScreen.jsx';
import { SignUp } from './src/screens/SignUpScreen.jsx';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.EXPO_PUBLIC_USER_POOL_ID,
      userPoolClientId: process.env.EXPO_PUBLIC_CLIENT_ID,
    }
  },
  API: {
    REST: {
      'apparel-api': {
        endpoint: API_BASE_URL,
        region: 'us-east-1',
      }
    }
  }
});

export default function App() {
  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Apparel</Text>
        <Text><Login /></Text>
        <Text><SignUp /></Text>
      </View>
  );
}