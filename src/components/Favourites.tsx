import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Container, Box,IconButton } from '@mui/material';
import axios from 'axios';
import { Book } from '../types/book';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';




const Favorites: React.FC = () => {
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const navigate = useNavigate();


  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    Promise.all(favorites.map((id: number) =>
      axios.get<Book>(`https://gutendex.com/books/${id}`)
    )).then(results => {
      setFavoriteBooks(results.map(response => response.data));
    }).catch(error => {
      console.error('Error fetching favorite books:', error);
    });
  };

  const deleteFromFavorites = (id: number) => {
    const updatedFavorites = favoriteBooks.filter(book => book.id !== id);
    setFavoriteBooks(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites.map(book => book.id)));
  };

  const goToBookDetails = (id: number) => {
    navigate(`/book/${id}`);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
        >
          Back to List
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          My Favorites
        </Typography>
        {favoriteBooks.length === 0 ? (
          <Typography variant="subtitle1">No favorites added yet.</Typography>
        ) : (
          favoriteBooks.map((book) => (
            <Card 
              key={book.id} 
              sx={{ mb: 2 }} 
              variant="outlined"
            >
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" component="h2" sx={{ cursor: 'pointer' }} onClick={() => goToBookDetails(book.id)}>
                  {book.title}
                </Typography>
                <IconButton onClick={() => deleteFromFavorites(book.id)} aria-label="delete from favorites">
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Container>
  );
};

export default Favorites;