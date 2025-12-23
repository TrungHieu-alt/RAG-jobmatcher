import { useState } from 'react';
import { SignIn } from './authComponents/SignIn';
import { SignUp } from './authComponents/SignUp';
import { ForgotPassword } from './authComponents/ForgetPassword';
import { PolicyPopup } from './authComponents/Policy';

type Screen = 'signin' | 'signup' | 'forgot';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('signin');
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleOpenPolicy = () => {
    setIsPolicyOpen(true);
  };

  const handleClosePolicy = () => {
    setIsPolicyOpen(false);
  };

  return (
    <>
      {currentScreen === 'signin' && (
        <SignIn onNavigate={handleNavigate} onOpenPolicy={handleOpenPolicy} />
      )}
      {currentScreen === 'signup' && (
        <SignUp onNavigate={handleNavigate} onOpenPolicy={handleOpenPolicy} />
      )}
      {currentScreen === 'forgot' && (
        <ForgotPassword onNavigate={handleNavigate} onOpenPolicy={handleOpenPolicy} />
      )}
      
      {isPolicyOpen && <PolicyPopup onClose={handleClosePolicy} />}
    </>
  );
}
