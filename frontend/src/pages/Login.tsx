import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  CssBaseline,
  Alert,
  ThemeProvider,
  createTheme,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import api from "../services/api";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#9c27b0",
    },
    background: {
      default: "#121212",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderColor: 'rgba(156, 39, 176, 0.5)',
            color: '#fff',
            '&:hover fieldset': {
              borderColor: 'rgba(156, 39, 176, 0.7)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#9c27b0',
            },
            '& input::placeholder': {
              color: 'rgba(255, 255, 255, 0.5)',
            },
          },
          '& label': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& label.Mui-focused': {
            color: '#9c27b0',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(to right, #9c27b0, #3f51b5)',
          '&:hover': {
            background: 'linear-gradient(to right, #8e24aa, #3949ab)',
            transform: 'scale(1.05)',
            boxShadow: '0 0 20px rgba(156, 39, 176, 0.2)',
          },
          transition: 'all 0.3s',
          padding: '12px 16px',
          borderRadius: '8px',
          fontWeight: '600',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 82, 82, 0.1)',
          color: '#fff',
          border: '1px solid rgba(255, 82, 82, 0.5)',
        },
      },
    },
  },
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/login", { email, password });
      const token = response.data.accessToken;
      localStorage.setItem("token", token);
      navigate("/home"); // agora redireciona para /home
    } catch (err) {
      console.error(err);
      setError("Falha no login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#121212',
          position: 'relative',
          overflow: 'hidden',
          p: 2,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            zIndex: 0,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '-10rem',
              right: '-10rem',
              width: '24rem',
              height: '24rem',
              backgroundColor: '#9c27b0',
              borderRadius: '50%',
              mixBlendMode: 'screen',
              filter: 'blur(80px)',
              opacity: 0.3,
              animation: 'blob 7s infinite',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '-10rem',
              left: '-10rem',
              width: '24rem',
              height: '24rem',
              backgroundColor: '#ff4081',
              borderRadius: '50%',
              mixBlendMode: 'screen',
              filter: 'blur(80px)',
              opacity: 0.3,
              animation: 'blob 7s infinite 2s',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '10rem',
              left: '10rem',
              width: '24rem',
              height: '24rem',
              backgroundColor: '#3f51b5',
              borderRadius: '50%',
              mixBlendMode: 'screen',
              filter: 'blur(80px)',
              opacity: 0.3,
              animation: 'blob 7s infinite 4s',
            }}
          />
        </Box>
        
        <style>
          {`
            @keyframes blob {
              0% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.2); }
              66% { transform: translate(-20px, 20px) scale(0.8); }
              100% { transform: translate(0, 0) scale(1); }
            }
          `}
        </style>

        <Container
          maxWidth="lg"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: 8,
            alignItems: 'center',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <CssBaseline />
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', lg: 'start' } }}>
              <motion.img
                src="https://storage.googleapis.com/hostinger-horizons-assets-prod/6ec2d8a5-910f-4ce0-b30d-ff109657bb02/71fcca377b62f4a5fa0294b960e95e5b.png"
                alt="Logo Projeto Desenvolve"
                style={{ height: '80px' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              />
            </Box>
            <Typography
              variant="h3"
              sx={{ fontWeight: 'bold', color: '#fff', fontFamily: '"Roboto", sans-serif' }}
            >
              PD for Teachers
            </Typography>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Typography
                variant="h6"
                sx={{ color: 'rgba(255, 255, 255, 0.8)', maxWidth: '28rem', mx: { xs: 'auto', lg: 0 } }}
              >
                Transforme suas aulas com metodologias ativas e planejamento inteligente.
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                maxWidth: '28rem',
              }}
            >
              {[
                { icon: '📚', text: 'Bridge' },
                { icon: '🎯', text: 'Real' },
                { icon: '👥', text: 'Investigate' },
                { icon: '💡', text: 'Generate' },
              ].map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '1rem',
                    textAlign: 'center',
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Typography sx={{ fontSize: '2rem', color: '#9c27b0', mb: 1 }}>
                    {item.icon}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem', fontWeight: '500' }}>
                    {item.text}
                  </Typography>
                </Box>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ maxWidth: '40rem', margin: 'auto' }}
          >
            <Box
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)',
                p: 4,
                height: '100%',
                width: '600px'
              }}
            >
              <Typography
                variant="h5"
                sx={{ textAlign: 'center', color: '#fff', fontWeight: 'bold', mb: 1 }}
              >
                Acessar Plataforma
              </Typography>
              <Typography
                variant="body2"
                sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}
              >
                Insira suas credenciais para começar
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  id="email"
                  label="Endereço de Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Box sx={{ position: 'relative' }}>
                  <TextField
                    fullWidth
                    id="password"
                    label="Senha"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&:hover': { color: '#fff' },
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Box>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Entrar'}
                </Button>
                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
