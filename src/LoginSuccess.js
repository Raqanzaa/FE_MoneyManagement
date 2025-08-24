// src/LoginSuccess.js

import React, { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const LoginSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Gunakan useRef untuk memastikan redirect hanya terjadi sekali
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Jangan jalankan lagi jika sudah redirect
    if (hasRedirected.current) return;

    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken && refreshToken) {
      console.log("Login successful! Storing tokens...");
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Tandai bahwa kita sudah redirect
      hasRedirected.current = true;

      // Langsung redirect ke dashboard
      navigate("/dashboard", { replace: true });
    } else {
      console.error("Authentication failed: Tokens not found in URL.");
      hasRedirected.current = true;
      navigate("/", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Authenticating...</h1>
      <p>Please wait while we log you in.</p>
    </div>
  );
};

export default LoginSuccess;
