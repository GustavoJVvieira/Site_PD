import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import Footer from "./Footer";
import Header from "./Header";
import imagem1 from "../assets/imagem1.jpg";
import imagem2 from "../assets/imagem2.jpg";
import imagem3 from "../assets/imagem3.jpg";
import imagem4 from "../assets/imagem4.jpg";
import imagem5 from "../assets/imagem5.jpg";
import imagem6 from "../assets/imagem6.jpg";
import imagem7 from "../assets/imagem7.jpg";
import imagem8 from "../assets/imagem8.jpg";


// Dados fictícios para os posts (substitua por API real)
const mockPosts = [
  {
    id: 1,
    title: "Como Planejar Sua Semana em 5 Passos",
    excerpt: "Técnicas simples para aumentar sua produtividade e organizar sua semana.",
    image: imagem1,
    category: "Planejamento",
    date: "2025-05-20",
  },
  {
    id: 2,
    title: "Rotina Matinal Produtiva",
    excerpt: "Estratégias para começar o dia com energia e foco.",
    image: imagem2,
    category: "Hábitos",
    date: "2025-05-18",
  },
  {
    id: 3,
    title: "Ferramentas de Organização",
    excerpt: "Melhores ferramentas digitais e analógicas para sua rotina.",
    image: imagem3,
    category: "Ferramentas",
    date: "2025-05-15",
  },
  {
    id: 4,
    title: "Como Criar um Bullet Journal Eficiente",
    excerpt: "Dicas para personalizar seu bullet journal e manter tudo organizado.",
    image: imagem4,
    category: "Planejamento",
    date: "2025-05-12",
  },
  {
    id: 5,
    title: "Técnicas de Gestão de Tempo para Estudantes",
    excerpt: "Métodos práticos para equilibrar estudos, trabalho e vida pessoal.",
    image: imagem5,
    category: "Gestão de Tempo",
    date: "2025-05-10",
  },
  {
    id: 6,
    title: "Minimalismo na Rotina: Menos é Mais",
    excerpt: "Como simplificar sua rotina para focar no que realmente importa.",
    image: imagem6,
    category: "Hábitos",
    date: "2025-05-08",
  },
  {
    id: 7,
    title: "Apps para Acompanhar Hábitos Diários",
    excerpt: "Os melhores aplicativos para rastrear e manter seus hábitos.",
    image: imagem7,
    category: "Ferramentas",
    date: "2025-05-05",
  },
  {
    id: 8,
    title: "Como Evitar a Procrastinação",
    excerpt: "Estratégias para superar a procrastinação e manter o foco.",
    image: imagem8,
    category: "Produtividade",
    date: "2025-05-03",
  },
 
];

const BlogArea = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Filtra posts
  const filteredPosts = mockPosts.filter(
    (post) =>
      (selectedCategory === "Todos" || post.category === selectedCategory) &&
      (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Categorias únicas
  const categories = ["Todos", ...new Set(mockPosts.map((post) => post.category))];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        borderRadius: "16px",
        overflowX: "hidden", // Evita barra de rolagem horizontal
      }}
    >
        <Box sx={{ width: "100%", mb: 4, flexShrink: 0 }}><Header/></Box>
      

      {/* Filtros e Busca */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          gap: 2,
          px: { xs: 2, sm: 4 },
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              clickable
              color={selectedCategory === category ? "primary" : "default"}
              onClick={() => setSelectedCategory(category)}
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 500,
                borderRadius: "20px",
                padding: "6px 12px",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
                },
              }}
            />
          ))}
        </Box>

        <TextField
          placeholder="Buscar posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            width: { xs: "100%", sm: "300px" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              fontFamily: "'Poppins', sans-serif",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />
      </Box>

      {/* Lista de Posts */}
      <Box sx={{ flexGrow: 1, px: { xs: 2, sm: 4 } }}>
        <Grid
          container
          spacing={3}
          sx={{
            alignItems: "stretch",
            justifyContent: "center",
            maxWidth: "1280px", // Ajustado para acomodar 4 cards
            mx: "auto",
          }}
        >
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Grid item xs={12} sm={6} md={3} key={post.id}>
                <Card
                  sx={{
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 6px 25px rgba(0, 0, 0, 0.2)",
                    },
                    backgroundColor: theme.palette.background.paper,
                    height: "460px",
                    maxWidth: "300px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    mx: "auto",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.image}
                    alt={post.title}
                    sx={{
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                      objectFit: "cover",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                  <CardContent
                    sx={{
                      padding: 2,
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {post.date} | {post.category}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          mt: 1,
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {post.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          color: theme.palette.text.secondary,
                          mt: 1,
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {post.excerpt}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => navigate(`/blog/${post.id}`)}
                      sx={{
                        borderRadius: "20px",
                        textTransform: "none",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 500,
                        paddingX: 3,
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        transition: "all 0.3s ease",
                        mt: 2,
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
                          backgroundColor: theme.palette.secondary.dark || "#6f5f7a",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Ler mais
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Box sx={{ textAlign: "center", width: "100%", py: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  color: theme.palette.text.secondary,
                }}
              >
                Nenhum post encontrado.
              </Typography>
            </Box>
          )}
        </Grid>
      </Box>

      {/* Footer com largura total */}
      <Box sx={{ width: "100%", mt: 4, flexShrink: 0 }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default BlogArea;