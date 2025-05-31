import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CssBaseline,
  Avatar,
  LinearProgress,
  Tooltip,
  Stack,
  ThemeProvider,
  createTheme,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
} from "@mui/material";
import RoomIcon from '@mui/icons-material/Room';
import InfoIcon from '@mui/icons-material/Info';
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import MonitorIcon from "@mui/icons-material/Monitor";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SchoolIcon from "@mui/icons-material/School";
import LinkIcon from "@mui/icons-material/Link";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import api from "../services/api";
import Header from "./Header";
import Footer from "./Footer";

// Tema do MUI
const theme = createTheme({
  palette: {
    primary: {
      main: "#7b4da0",
    },
    secondary: {
      main: "#a37ecf",
    },
    background: {
      default: "#f9f7fb",
      paper: "#fff",
    },
    text: {
      primary: "#362c42",
      secondary: "#6f5f7a",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 8px 24px rgba(123, 77, 160, 0.25)",
          },
        },
      },
    },
  },
});

// Interface do Usuário
export interface User {
  id: string;
  nome_aluno: string;
  email: string;
  pdita: string;
  patrimonio: string;
  nome_monitor: string;
  carreira_monitor: string;
  moedas: number;
  link_monitoria: string;
  dia_monitoria: string;
  data_nasc: string;
  ultimo_acesso: string;
}

// Interface para a Trilha de Aprendizado
interface LearningPath {
  name: string;
  subjects: string[];
}

// Componente Principal
export default function Users() {
  const [user, setUser] = useState<User | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    }
    fetchUser();
  }, []);

  const togglePath = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.palette.background.default,
            margin: 0,
            padding: 0,
            overflowX: "hidden",
          }}
        >
          <Typography variant="h6">Carregando dados do usuário...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  // Dados Mockados
  const diasAcessados = 20;
  const totalDias = 30;
  const cursosCompletados = 4;
  const modulosCompletados = 15;

  // Cálculo do Elo
  const calcularElo = (moedas: number, dias: number) => {
    if (moedas >= 200 && dias >= 25)
      return { nome: "Mestre", cor: "#7b4da0", progresso: 100 };
    if (moedas >= 150 && dias >= 20)
      return { nome: "Diamante", cor: "#a37ecf", progresso: 80 };
    if (moedas >= 100 && dias >= 15)
      return { nome: "Ouro", cor: "#f2c94c", progresso: 60 };
    if (moedas >= 50 && dias >= 10)
      return { nome: "Prata", cor: "#bdc3c7", progresso: 40 };
    return { nome: "Bronze", cor: "#cd7f32", progresso: 20 };
  };

  const elo = calcularElo(user.moedas, diasAcessados);

  // Categorias de Troféus
  const trofeusFrequencia = Array.from({ length: 6 }, (_, i) => ({
    label: `${(i + 1) * 5} Dias`,
    earned: diasAcessados >= (i + 1) * 5,
  }));

  const trofeusMoedas = [
    { label: "50 Moedas", earned: user.moedas >= 50 },
    { label: "100 Moedas", earned: user.moedas >= 100 },
    { label: "200 Moedas", earned: user.moedas >= 200 },
  ];

  const trofeusAulas = [
    { label: "1 Aula", earned: true },
    { label: "5 Aulas", earned: false },
    { label: "10 Aulas", earned: false },
  ];

  const trofeusCursos = [
    { label: "1 Curso", earned: cursosCompletados >= 1 },
    { label: "3 Cursos", earned: cursosCompletados >= 3 },
    { label: "5 Cursos", earned: cursosCompletados >= 5 },
  ];

  const trofeusModulos = [
    { label: "5 Módulos", earned: modulosCompletados >= 5 },
    { label: "10 Módulos", earned: modulosCompletados >= 10 },
    { label: "20 Módulos", earned: modulosCompletados >= 20 },
  ];

  const contatosFixos = [
    {
      nome: "Suporte ao Aluno",
      link: "https://wa.me/+5531982146973",
      icon: <WhatsAppIcon color="success" />,
    },
    {
      nome: "Suporte ao Rosetta",
      link: "https://wa.me/+555190037063",
      icon: <WhatsAppIcon color="success" />,
    },
    {
      nome: "Suporte a Internet",
      link: "https://wa.me/+5531982146973",
      icon: <WhatsAppIcon color="success" />,
    },
    {
      nome: "Dados Cidade Itabira",
      icon: <InfoIcon color="primary" />,
    },
    {
      nome: "Suporte Técnico Cidade Itabira",
      link: "https://wa.me/SEUNUMERO",
      icon: <WhatsAppIcon color="success" />,
    },
    {
      nome: "Endereço Suporte Técnico Itabira",
      link: "https://maps.app.goo.gl/qgiD8vyxrLfb3GGD9",
      icon: <RoomIcon color="primary" />,
    },
    {
      nome: "Dados Cidade Bom Despacho",
      icon: <InfoIcon color="primary" />,
    },
    {
      nome: "Suporte Técnico Bom Despacho",
      link: "https://wa.me/SEUNUMERO",
      icon: <WhatsAppIcon color="success" />,
    },
    {
      nome: "Endereço Suporte Técnico Bom Despacho",
      link: "https://maps.app.goo.gl/4EMet4PLzixcVn4d7",
      icon: <RoomIcon color="primary" />,
    },
  ];

  // Dados da Trilha de Aprendizado
  const trilha = `Desenvolvedor Back-End
Python Básico, Python Intermediário, Banco de Dados, Programação Orientada a Objetos, Linux
Desenvolvedor Front-End
Introdução a Web, JavaScript, Fundamentos de Interface, React JS, Desenvolvimento de Websites com Mentalidade Ágil, Desenvolvimento de Interfaces Web Frameworks Front-End
Analista de Dados
Python Básico, Python Intermediário, Banco de Dados, Linux
Desenvolvedor Mobile
No Code, Banco de Dados, Programação Orientada a Objetos, Programação Multiplataforma com React Native, Programação Multiplataforma com Flutter`;

  const trilhaLines = trilha.split("\n").filter((line) => line.trim() !== "");
  const trilhaPaths: LearningPath[] = [];
  let currentPath: LearningPath | null = null;

  for (const line of trilhaLines) {
    if (line.includes("Desenvolvedor") || line.includes("Analista")) {
      if (currentPath) {
        trilhaPaths.push(currentPath);
      }
      currentPath = { name: line, subjects: [] };
    } else if (currentPath) {
      currentPath.subjects.push(line);
    }
  }
  if (currentPath) {
    trilhaPaths.push(currentPath);
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme.palette.background.default,
          margin: 0,
          padding: 0,
          overflowX: "hidden",
        }}
      >
        <CssBaseline />
        <Header />

        <Container
          maxWidth="lg"
          sx={{
            flexGrow: 1,
            py: 5,
            px: { xs: 2, sm: 3 },
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", gap: { xs: 2, md: 8 }, flexWrap: "wrap", justifyContent: "center" }}>
            {/* Coluna Esquerda */}
            <Stack spacing={4} sx={{ flex: "1 1 55%" }}>
              {/* Card de Nome e Email */}
              <Card
                sx={{
                  background: "linear-gradient(90deg, #3B82F6, #A855F7)", // Novo gradiente
                  color: "#fff",
                  borderRadius: 4,
                  p: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  boxShadow: "0 6px 20px rgba(123, 77, 160, 0.3)",
                }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    fontSize: 48,
                    fontWeight: "bold",
                    border: "2px solid #fff",
                  }}
                >
                  {user.nome_aluno.charAt(0)}
                </Avatar>
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}
                  >
                    {user.nome_aluno}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, mt: 0.5 }}>
                    {user.email}
                  </Typography>
                </Box>
              </Card>

              {/* Card de Dados Pessoais */}
              <Card
                sx={{
                  background: theme.palette.background.paper,
                  border: "1.5px solid #e0d7f1",
                  boxShadow: "0 4px 12px rgba(123, 77, 160, 0.15)",
                  p: 3,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      borderBottom: `3px solid ${theme.palette.primary.main}`,
                      pb: 1,
                      mb: 3,
                      fontWeight: 700,
                    }}
                  >
                    Dados Pessoais
                  </Typography>
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <MonitorIcon sx={{ color: theme.palette.primary.main }} />
                      <Typography>
                        <b>PDITA:</b> {user.pdita}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <AccountBalanceIcon
                        sx={{ color: theme.palette.primary.main }}
                      />
                      <Typography>
                        <b>Patrimônio:</b> 1331
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <CalendarTodayIcon
                        sx={{ color: theme.palette.primary.main }}
                      />
                      <Typography>
                        <b>Data de Nascimento:</b> {user.data_nasc}
                      </Typography>
                    </Stack>
                   
                  </Stack>
                </CardContent>
              </Card>

              {/* Card de Monitoria */}
              <Card
                sx={{
                  background: theme.palette.background.paper,
                  border: "1.5px solid #e0d7f1",
                  boxShadow: "0 4px 12px rgba(123, 77, 160, 0.15)",
                  p: 3,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      borderBottom: `3px solid ${theme.palette.primary.main}`,
                      pb: 1,
                      mb: 3,
                      fontWeight: 700,
                    }}
                  >
                    Monitoria
                  </Typography>
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <PersonIcon sx={{ color: theme.palette.primary.main }} />
                      <Typography>
                        <b>Monitor:</b> {user.nome_monitor}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <SchoolIcon sx={{ color: theme.palette.primary.main }} />
                      <Typography>
                        <b>Número Monitor:</b> 37 988129344
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <CalendarTodayIcon
                        sx={{ color: theme.palette.primary.main }}
                      />
                      <Typography>
                        <b>Dia Monitoria:</b> {user.dia_monitoria}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <LinkIcon sx={{ color: theme.palette.primary.main }} />
                      <Typography>
                        <b>Link Monitoria:</b>{" "}
                        <a
                          href={user.link_monitoria}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {user.link_monitoria}
                        </a>
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              {/* Card de Contatos Fixos */}
              <Card sx={{ p: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} mb={2}>
                    Contatos Fixos
                  </Typography>
                  <Stack spacing={2}>
                    {contatosFixos.map(({ nome, link, icon }, i) => (
                      <Box
                        key={i}
                        display="flex"
                        gap={2}
                        alignItems="center"
                      >
                        {icon}
                        <Typography
                          component="a"
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            textDecoration: "none",
                            color: theme.palette.text.primary,
                          }}
                        >
                          {nome}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              {/* Card de Trilha de Aprendizado */}
              <Card sx={{ p: 3, borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} mb={3}>
                    Trilha de Aprendizado
                  </Typography>
                  <Stack spacing={1}>
                    {trilhaPaths.map((path, index) => (
                      <Box
                        key={index}
                        sx={{
                          borderRadius: 2,
                          bgcolor: "grey.800",
                          "&:hover": {
                            boxShadow: "0 0 0 2px #7b4da0",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 2,
                            cursor: "pointer",
                          }}
                          onClick={() => togglePath(index)}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            color="common.white"
                          >
                            {path.name}
                          </Typography>
                          <IconButton sx={{ color: "primary.main" }}>
                            {openIndex === index ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </IconButton>
                        </Box>
                        <Collapse in={openIndex === index}>
                          <List
                            dense
                            sx={{
                              pl: 4,
                              pb: 2,
                              bgcolor: "grey.800",
                              color: "grey.300",
                            }}
                          >
                            {path.subjects.map((subject, subIndex) => (
                              <ListItem key={subIndex} sx={{ py: 0.5 }}>
                                <ListItemText
                                  primary={subject}
                                  primaryTypographyProps={{ variant: "body2" }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Collapse>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>

            {/* Coluna Direita */}
            <Stack spacing={4} sx={{ flex: "1 1 35%" }}>
              {/* Card de Moedas */}
              <Card
                sx={{
                  py: 4,
                  px: 3,
                  background: "linear-gradient(90deg, #3B82F6, #A855F7)", // Novo gradiente
                  color: "#fff",
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Tooltip title="Quantidade de moedas acumuladas">
                    <MonetizationOnIcon sx={{ fontSize: 50, mb: 1 }} />
                  </Tooltip>
                  <Typography variant="h3" fontWeight={700}>
                    {user.moedas}
                  </Typography>
                  <Typography variant="subtitle1">Moedas</Typography>
                </CardContent>
              </Card>

              {/* Card de Elo */}
              <Card sx={{ p: 3, borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Elo
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        backgroundColor: elo.cor,
                      }}
                    />
                    <Typography fontWeight={600} fontSize={20}>
                      {elo.nome}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={elo.progresso}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: elo.cor,
                      },
                    }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Progresso até próximo elo
                  </Typography>
                </CardContent>
              </Card>

              {/* Card de Dias Acessados e Troféus */}
              <Card sx={{ p: 3, borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} mb={2}>
                    Dias Acessados
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(diasAcessados / totalDias) * 100}
                    sx={{ height: 10, borderRadius: 5, mb: 2 }}
                  />
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {diasAcessados} dias de {totalDias}
                  </Typography>

                  {[
                    { titulo: "Frequência", trofeus: trofeusFrequencia },
                    { titulo: "Moedas", trofeus: trofeusMoedas },
                    { titulo: "Aulas", trofeus: trofeusAulas },
                    { titulo: "Cursos", trofeus: trofeusCursos },
                    { titulo: "Módulos", trofeus: trofeusModulos },
                  ].map((categoria, idx) => (
                    <Box key={idx} sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        mb={1}
                      >
                        {categoria.titulo}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {categoria.trofeus.map(({ label, earned }, i) => (
                          <Tooltip
                            key={i}
                            title={
                              earned
                                ? `Conquistado: ${label}`
                                : `Falta conquistar: ${label}`
                            }
                          >
                            <Box
                              sx={{
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                                backgroundColor: earned
                                  ? theme.palette.primary.main
                                  : "#ccc",
                                color: earned ? "#fff" : "#888",
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <EmojiEventsIcon fontSize="small" /> {label}
                            </Box>
                          </Tooltip>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Container>

        <Footer />
      </Box>
    </ThemeProvider>
  );
}