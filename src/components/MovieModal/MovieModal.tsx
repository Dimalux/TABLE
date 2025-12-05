import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Movie } from '../../types/movie';
import styles from './MovieModal.module.css';

interface MovieModalProps {
    movie: Movie; // Вибраний фільм
    onClose: () => void; // Функція закриття модалки
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Escape') {
                onClose(); // Закриваємо модалку при натисканні ESC
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden'; // Блокуємо скрол сторінки

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'visible'; // Відновлюємо скрол
        };
    }, [onClose]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose(); // Закриваємо модалку при кліку на бекдроп
        }
    };

    return createPortal(
        <div className={styles.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Закрити модальне вікно">
                    &times;
                </button>
                <img
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title}
                    className={styles.image}
                />
                <div className={styles.content}>
                    <h2>{movie.title}</h2>
                    <p>{movie.overview}</p>
                    <p>
                        <strong>Release Date:</strong> {movie.release_date}
                    </p>
                    <p>
                        <strong>Rating:</strong> {movie.vote_average}/10
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
}