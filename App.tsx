import Toast from 'react-native-toast-message';
import UserStack from './src/navigation/stack/UserStack';

function App() {
  return (
    <>
      <UserStack />
      <Toast />
    </>
  );
}

export default App;
