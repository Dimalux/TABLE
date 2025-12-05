import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { fetchMovies } from "../../services/movieService";
import { Movie } from "../../types/movie";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import styles from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const {
    data: moviesData,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "", // Запит виконується тільки при наявності query
    staleTime: 120000, // 2 хвилини
    placeholderData: keepPreviousData, //  Уникнення "миготіння" інтерфейсу під час повторних запитів
  });

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1); // Скидаємо сторінку до 1 при новому пошуку
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  // Показуємо повідомлення, якщо фільмів не знайдено
  if (moviesData?.results.length === 0 && !isLoading && !isFetching) {
    toast.error("No movies found for your request.");
  }

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}

      {isError && <ErrorMessage />}

      {moviesData && moviesData.results.length > 0 && (
        <>
          {moviesData.total_pages > 1 && (
            <ReactPaginate
              pageCount={moviesData.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={styles.pagination}
              activeClassName={styles.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}

          <MovieGrid movies={moviesData.results} onSelect={handleSelectMovie} />
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
