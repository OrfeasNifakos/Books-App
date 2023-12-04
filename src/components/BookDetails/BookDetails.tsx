import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Box,
  Chip,
  Stack,
  CardActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Book } from "../../types/book"; 
import ListIcon from "@mui/icons-material/List";

const BookDetails = () => {
  const [bookDetails, setBookDetails] = useState<Book | null>(null);
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get<Book>(
          `https://gutendex.com/books/${id}`
        );
        setBookDetails(response.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [id]);

  const addToFavorites = () => {
    if (bookDetails) {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (!favorites.includes(bookDetails.id)) {
        favorites.push(bookDetails.id);
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }
    } else {
      console.error("No book details available to add to favorites.");
    }
  };

  const goToFavorites = () => {
    navigate("/favorites");
  };

  if (!bookDetails) return <div>Loading...</div>;

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ marginBottom: "16px" }}
        >
          Back to list
        </Button>
        <Card raised elevation={3}>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom>
              {bookDetails.title}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Authors:{" "}
              {bookDetails.authors.map((author) => author.name).join(", ")}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Downloads: {bookDetails.download_count}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Languages: {bookDetails.languages.join(", ")}
            </Typography>
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle1" component="h2">
                Bookshelves
              </Typography>
              <Stack direction="row" spacing={1}>
                {bookDetails.bookshelves.map((shelf, index) => (
                  <Chip key={index} label={shelf} />
                ))}
              </Stack>
            </Box>
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle1" component="h2">
                Subjects
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {bookDetails.subjects.map((subject, index) => (
                  <Chip key={index} label={subject} />
                ))}
              </Stack>
            </Box>
          </CardContent>
          <CardActions
            style={{ justifyContent: "space-between", padding: "0.75rem 1rem" }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<FavoriteIcon />}
              onClick={addToFavorites}
            >
              Add to Favorites
            </Button>
            <Button
              startIcon={<ListIcon />}
              onClick={goToFavorites}
              sx={{ marginLeft: "auto" }}
            >
              Go to Favorites
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Container>
  );
};

export default BookDetails;
