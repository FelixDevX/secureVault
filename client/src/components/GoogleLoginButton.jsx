import React, { useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const GoogleLoginButton = ({ text = "signup_with" }) => {
  const { googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const buttonRef = useRef(null);

  useEffect(() => {
    // Dynamically load Google Identity Services script if not already loaded
    const loadGoogleScript = () => {
      if (window.google) {
        initializeGoogle();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.head.appendChild(script);
    };

    const initializeGoogle = () => {
      try {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId) {
          console.warn("VITE_GOOGLE_CLIENT_ID is not configured in client environment.");
        }

        window.google.accounts.id.initialize({
          client_id: clientId || 'dummy-client-id',
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });

        if (buttonRef.current) {
          const isDark = document.documentElement.classList.contains('dark');
          window.google.accounts.id.renderButton(buttonRef.current, {
            type: "standard",
            theme: isDark ? "filled_black" : "outline",
            size: "large",
            text: text, // "signin_with" or "signup_with"
            shape: "pill",
            width: "384" // Max width to fit form nicely
          });
        }
      } catch (err) {
        console.error("Google script initialization error:", err);
      }
    };

    const handleCredentialResponse = async (response) => {
      const loadingToast = toast.loading("Authenticating with Google...");
      try {
        const result = await googleLogin(response.credential);
        toast.dismiss(loadingToast);
        if (result && result.success) {
          navigate('/dashboard');
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Google authentication failed. Please try again.");
      }
    };

    loadGoogleScript();
  }, [googleLogin, navigate, text]);

  return (
    <div className="w-full flex justify-center py-1 min-h-[44px]">
      <div ref={buttonRef} className="w-full flex justify-center"></div>
    </div>
  );
};

export default GoogleLoginButton;
