import React, { useState, useEffect } from "react";
import axios from "axios";
import { Book, GutenbergApiResponse } from "../../types/book";
import { Link } from "react-router-dom";
import {
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Container,
  Grid,
  Pagination,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const booksPerPage = 10;

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError("");

      try {
        // Construct the URL with the search term and pagination details
        const url = `https://gutendex.com/books/`;
        const params = {
          search: searchTerm,
          page: currentPage,
          pageSize: booksPerPage, // Assuming you've defined this variable earlier
        };

        const response = await axios.get<GutenbergApiResponse>(url, { params });

        if (response.data && response.data.results) {
          setBooks(response.data.results);
          // Calculate the total number of pages
          const totalItems = response.data.count; // assuming the API returns the count in a 'count' key
          setTotalPages(Math.ceil(totalItems / booksPerPage));
        } else {
          setError("The API response does not contain the 'results' key.");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        setError("An error occurred while fetching the books.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchTerm, currentPage]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page for new searches
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, display: "flex", justifyContent: "center" }}>
        <TextField
          fullWidth
          id="search"
          label="Search book titles"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
          margin="normal"
        />
      </Box>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card
                variant="outlined"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" noWrap>
                    {book.title}
                  </Typography>
                  <Typography color="textSecondary">
                    by {book.authors.map((author) => author.name).join(", ")}
                  </Typography>
                  {/* Include other book details you wish to show */}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    component={Link}
                    to={`/book/${book.id}`} // Assuming you're using React Router for navigation
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          <Box
            sx={{
              width: "100%",
              mt: 2,
              mb:2,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </Grid>
      )}
    </Container>
  );
};

export default BookList;
