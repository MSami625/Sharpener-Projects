import React from 'react';
import { PasswordProvider } from './PasswordContext';
import PasswordKeeper from './components/PasswordKeeper';

function App() {
  return (
    <PasswordProvider>
      <PasswordKeeper />
    </PasswordProvider>
  );
}

export default App;
