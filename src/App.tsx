import BookList from './components/Booklist/Booklist';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookDetails from './components/BookDetails/BookDetails';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Favorites from './components/Favourites';

const theme = createTheme({

  palette: {
    primary: {
      main: '#556cd6',
    },
  },

});

function App() {
  return (
  <ThemeProvider theme={theme}>
    <Router>

      <Routes>
      <Route path="/" element={<BookList />} />
    <Route path="/book/:id" element={<BookDetails />} />
    <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Router>
  </ThemeProvider>
  );
}

export default App;
