import { Platform } from "react-native";

// Polyfill for laravel-echo / pusher-js
if (Platform.OS !== "web") {
  (global as any).window = global;
}

import Toast from 'react-native-toast-message';
import UserStack from './src/navigation/stack/UserStack';
import { StripeProvider } from '@stripe/stripe-react-native';

function App() {
  const publishableKey = 'pk_test_51SL2WMFplCO4qSsKjHkdQM6DTzGDpKnPOmR5notq4kcPQZl1cM2fECeBAEvlyvbd1pRhx2ENonmMCAkslhnxR13B00hWWwOmZJ';

  return (
    <StripeProvider publishableKey={publishableKey}>
      <UserStack />
      <Toast />
    </StripeProvider>
  );
}

export default App;