import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import api from "../services/api";
import logo from "../assets/logo.png";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#9c27b0",
    },
  },
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setError("Por favor, preencha o campo de email.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/login", { email });
      const token = response.data.accessToken;
      localStorage.setItem("token", token);
      navigate("/users");
    } catch (err) {
      console.error(err);
      setError("Falha no login. Verifique se o e-mail está cadastrado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#121212",
          p: 2,
        }}
      >
        <Container
          maxWidth="xs"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(250, 246, 246, 0.05)",
            borderRadius: 2,
            boxShadow: "0 0 20px rgba(255, 251, 251, 0.8)",
            backdropFilter: "blur(10px)",
            py: 4,
          }}
        >
          <CssBaseline />
          <Box sx={{ mb: 2 }}>
            <img
              src={logo}
              alt="Logo"
              style={{ width: "250px", maxWidth: "100%" }}
            />
          </Box>
          <Typography component="h1" variant="h5">
            Login
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Endereço de Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Entrar"}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
              {error}
            </Alert>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
