import { Box, Typography, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
import logoPDWhite from "../assets/logo.png"; // Ajuste o caminho conforme necessário
import { useTheme } from "@mui/material/styles";

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(90deg, #3B82F6, #A855F7)", // Novo gradiente
        color: "#fff",
        py: { xs: 4, sm: 6 }, // Responsivo
        px: { xs: 2, sm: 3 },
        mt: "auto",
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.15)", // Sombra suave
      }}
    >
      <Box
        sx={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: "space-between",
        }}
      >
        {/* Coluna 1: Logo + Endereço */}
        <Box sx={{ flex: "1 1 100%", md: { flex: "1 1 35%" } }}>
          <Box
            component="img"
            src={logoPDWhite}
            alt="Projeto Desenvolve"
            sx={{ height: { xs: 35, sm: 40 }, mb: 2 }}
          />
          <Typography
            variant="body2"
            color="grey.200" // Cinza claro para contraste
            sx={{ lineHeight: 1.5 }}
          >
            PROSPERARE EDUCAÇÃO, CULTURA E CIDADANIA S.A. <br />
            Rua Tomé de Souza, 810, Cj 401, Savassi <br />
            Belo Horizonte/MG – CEP: 30.140-135 <br />
            CNPJ nº 10.976.971/0001-25
          </Typography>
        </Box>

        {/* Coluna 2: Produto */}
        <Box sx={{ flex: "1 1 40%", mt: { xs: 4, md: 0 } }}>
          <Typography
            variant="subtitle1" // Tamanho maior para títulos
            fontWeight={600}
            mb={2}
            color="#fff"
          >
            Produto
          </Typography>
          <Stack spacing={1}>
            <Link to="/how-it-works" style={{ textDecoration: "none" }}>
              <Typography
                variant="body2"
                color="grey.200"
                sx={{
                  transition: "color 0.3s ease",
                  "&:hover": { color: "#fff" },
                }}
              >
                Como Funciona
              </Typography>
            </Link>
            <Link to="/mobile-app" style={{ textDecoration: "none" }}>
              <Typography
                variant="body2"
                color="grey.200"
                sx={{
                  transition: "color 0.3s ease",
                  "&:hover": { color: "#fff" },
                }}
              >
                App Mobile
              </Typography>
            </Link>
            <Link to="/web-admin" style={{ textDecoration: "none" }}>
              <Typography
                variant="body2"
                color="grey.200"
                sx={{
                  transition: "color 0.3s ease",
                  "&:hover": { color: "#fff" },
                }}
              >
                Web Admin
              </Typography>
            </Link>
          </Stack>
        </Box>

        {/* Coluna 3: Casos de Uso */}
        <Box sx={{ flex: "1 1 40%", mt: { xs: 4, md: 0 } }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            mb={2}
            color="#fff"
          >
            Casos de Uso
          </Typography>
          <Stack spacing={1}>
            <Link to="/use-cases/city-halls" style={{ textDecoration: "none" }}>
              <Typography
                variant="body2"
                color="grey.200"
                sx={{
                  transition: "color 0.3s ease",
                  "&:hover": { color: "#fff" },
                }}
              >
                Prefeituras
              </Typography>
            </Link>
            <Link to="/use-cases/schools" style={{ textDecoration: "none" }}>
              <Typography
                variant="body2"
                color="grey.200"
                sx={{
                  transition: "color 0.3s ease",
                  "&:hover": { color: "#fff" },
                }}
              >
                Escolas
              </Typography>
            </Link>
            <Link to="/use-cases/students-families" style={{ textDecoration: "none" }}>
              <Typography
                variant="body2"
                color="grey.200"
                sx={{
                  transition: "color 0.3s ease",
                  "&:hover": { color: "#fff" },
                }}
              >
                Alunos e Famílias
              </Typography>
            </Link>
          </Stack>
        </Box>

        {/* Coluna 4: Contato */}
        <Box sx={{ flex: "1 1 40%", mt: { xs: 4, md: 0 } }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            mb={2}
            color="#fff"
          >
            Contato
          </Typography>
          <Stack spacing={1}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ color: theme.palette.secondary.light || "#a37ecf" }}>📞</Box>
              <MuiLink
                href="https://wa.me/553182146973"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  textDecoration: "none",
                  color: "grey.200",
                  transition: "color 0.3s ease",
                  "&:hover": { color: "#fff" },
                }}
              >
                +55 (31) 9632-1234
              </MuiLink>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ color: theme.palette.secondary.light || "#a37ecf" }}>📸</Box>
              <MuiLink
                href="https://instagram.com/projetodesenvolvedor"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  textDecoration: "none",
                  color: "grey.200",
                  transition: "color 0.3s ease",
                  "&:hover": { color: "#fff" },
                }}
              >
                @projetodesenvolvedor
              </MuiLink>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ color: theme.palette.secondary.light || "#a37ecf" }}>🔗</Box>
              <MuiLink
                href="https://linkedin.com/company/projetodesenvolve"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  textDecoration: "none",
                  color: "grey.200",
                  transition: "color 0.3s ease",
                  "&:hover": { color: "#fff" },
                }}
              >
                LinkedIn
              </MuiLink>
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Linha inferior */}
      <Box
        sx={{
          maxWidth: "1280px",
          margin: "0 auto",
          mt: 4,
          pt: 3,
          borderTop: "1px solid rgba(255, 255, 255, 0.1)", // Borda mais suave
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="caption" color="grey.300">
          © 2025 Projeto Desenvolve. Todos os direitos reservados · versão 3.1.1
        </Typography>
        <Link to="/privacy-policy" style={{ textDecoration: "none" }}>
          <Typography
            variant="caption"
            color="grey.300"
            sx={{
              transition: "color 0.3s ease",
              "&:hover": { color: "#fff" },
            }}
          >
            Política de Privacidade
          </Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;