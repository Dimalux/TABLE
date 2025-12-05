import { Movie } from '../../types/movie';
import styles from './MovieGrid.module.css';

interface MovieGridProps {
    movies: Movie[]; // Масив фільмів для відображення
    onSelect: (movie: Movie) => void; // Функція для вибору фільму
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
    return (
        <ul className={styles.grid}>
            {movies.map((movie) => (
                <li key={movie.id}>
                    <div className={styles.card} onClick={() => onSelect(movie)}>
                        <img
                            className={styles.image}
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            loading="lazy"
                        />
                        <h2 className={styles.title}>{movie.title}</h2>
                    </div>
                </li>
            ))}
        </ul>
    );
}