import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Avatar,
  Button,
  Stack,
  Link as MuiLink,
  Paper,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../assets/logobranca.png";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [showSubmenu, setShowSubmenu] = useState(false);

  const handleMouseEnter = () => {
    setShowSubmenu(true);
  };

  const handleMouseLeave = () => {
    setShowSubmenu(false);
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(90deg, #3B82F6, #A855F7)", // Novo gradiente
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: "0 6px 25px rgba(0, 0, 0, 0.2)",
        },
        paddingY: { xs: 1, sm: 2 },
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          paddingY: { xs: 1, sm: 2 },
        }}
      >
        <Avatar
          src={logo}
          alt="Logo"
          sx={{
            height: { xs: 50, sm: 60 },
            width: { xs: 50, sm: 60 },
            cursor: "pointer",
            borderRadius: "8px",
            border: `2px solid ${theme.palette.primary.contrastText}`,
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
          variant="square"
          onClick={() => navigate("/users")}
        />
      </Box>

      {/* Links e Logout */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingY: 1,
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1, sm: 2 },
          position: "relative",
        }}
      >
        {/* Stack dos links */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 3 }}
          sx={{
            alignItems: "center",
          }}
        >
          <MuiLink
            href="https://forms.monday.com/forms/f38d162ddec63c1fd1d65e815c613b75?r=use1"
            underline="none"
            sx={linkStyle(theme)}
          >
            Bem-Estar Semanal
          </MuiLink>

          {/* Link Desafios com Submenu */}
          <Box
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{ position: "relative" }}
          >
            <MuiLink
              underline="none"
              sx={{
                ...linkStyle(theme),
                cursor: "pointer",
                backgroundColor: showSubmenu
                  ? "rgba(255, 255, 255, 0.1)"
                  : "transparent",
              }}
            >
              Desafios
            </MuiLink>

            {showSubmenu && (
              <Paper
                elevation={6}
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  mt: 1,
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.2,
                  border: `1px solid rgba(0, 0, 0, 0.1)`,
                  zIndex: 20,
                  minWidth: "180px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <Button
                  component="a"
                  href="https://forms.monday.com/forms/d5276f34b566fb68dad98e9f677b3112?r=use1"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={submenuButtonStyle(theme)}
                >
                  Desafio Inicial
                </Button>
                <Button
                  component="a"
                  href="https://forms.monday.com/forms/4fe83a0bd2394eef484c483cd841cff7?r=use1"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={submenuButtonStyle(theme)}
                >
                  Desafio Módulo 1
                </Button>
                <Button
                  component="a"
                  href="https://forms.monday.com/forms/e0be4feb4ab9baaafb5b75d9301ccb16?r=use1"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={submenuButtonStyle(theme)}
                >
                  Desafio Módulo 2
                </Button>
              </Paper>
            )}
          </Box>

          <MuiLink
            href="/blog"
            underline="none"
            sx={linkStyle(theme)}
          >
            Área da Retenção
          </MuiLink>
          <MuiLink
            href="https://apps.projetodesenvolve.online/authn/login"
            underline="none"
            sx={linkStyle(theme)}
          >
            Acessar AVA
          </MuiLink>
        </Stack>

        {/* Botão Logout */}
        <Button
          variant="contained"
          color="secondary"
          startIcon={<LogoutIcon />}
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          sx={{
            borderRadius: "20px",
            textTransform: "none",
            fontWeight: 500,
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "0.9rem", sm: "1rem" },
            paddingX: 3,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
              backgroundColor: "#D946EF", // Ajustado para roxo claro da imagem
              transform: "translateY(-2px)",
            },
            marginLeft: { xs: 0, sm: 2 },
            marginTop: { xs: 1, sm: 0 },
          }}
        >
          Sair
        </Button>
      </Box>
    </AppBar>
  );
};

// 🔗 Estilo dos links principais
const linkStyle = (theme: any) => ({
  color: "#FFFFFF", // Texto branco para contraste com o novo gradiente
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  fontSize: { xs: "0.9rem", sm: "1rem" },
  padding: "6px 12px",
  borderRadius: "20px",
  transition: "all 0.3s ease",
  "&:hover": {
    color: "#FFFFFF", // Mantém branco no hover
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Ajustado para melhor visibilidade
    transform: "translateY(-2px)",
  },
});

// 🎨 Estilo dos botões do submenu
const submenuButtonStyle = (theme: any) => ({
  color: theme.palette.text.primary,
  borderColor: "rgba(0, 0, 0, 0.2)",
  borderRadius: "12px",
  textTransform: "none",
  fontFamily: "'Poppins', sans-serif",
  justifyContent: "flex-start",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "translateX(4px)",
    borderColor: theme.palette.primary.main,
  },
});

export default Header;