import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiEdit, FiTrash2 } from 'react-icons/fi'

import api from '../../services/api';

import './styles.css';

import logoImage from '../../assets/iob_logo.png'

export default function Films(){

    const [films, setFilms] = useState([]);
    const [page, setPage] = useState(0);

    const userName = localStorage.getItem('userName');
    const accessToken = localStorage.getItem('accessToken');

    const authorization = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }

    const navigate = useNavigate();

    useEffect(() => {
        fetchMoreFilms();
    }, [accessToken]);

    async function fetchMoreFilms() {
        const response = await api.get(`api/movie/v1/asc/4/${page}`, authorization);
        setFilms([ ...films, ...response.data.list]);
        setPage(page + 1);
    }
    
    async function logout() {
        try {
            await api.get('api/auth/v1/revoke', authorization);

            localStorage.clear();
            navigate('/');
        } catch (err) {
            alert('Logout failed! Try again!');
        }
    }
    
    async function editFilm(id) {
        try {
            navigate(`/film/new/${id}`)
        } catch (err) {
            alert('Edit film failed! Try again!');
        }
    }

    async function deleteFilm(id) {
        try {
            await api.delete(`api/movie/v1/${id}`, authorization);

            setFilms(films.filter(film => film.id !== id))
        } catch (err) {
            alert('Delete failed! Try again!');
        }
    }

    return (
        <div className="film-container">
            <header>
                <img src={logoImage} alt="IOB Logo"/>
                <span>Welcome, <strong>{userName.charAt(0).toUpperCase() + userName.slice(1)}</strong>!</span>
                <Link className="button" to="/film/new/0">Add New Film</Link>
                <button onClick={logout} type="button">
                    <FiLogOut size={18} color="#251FC5" />
                </button>
            </header>

            <h1>Registered Films</h1>
            <ul>
                {films.map(film => (
                    <li key={film.id}>
                        <strong>Title:</strong>
                        <p>{film.title}</p>
                        <strong>Director:</strong>
                        <p>{film.director}</p>
                        <strong>Year:</strong>
                        <p>{film.year}</p>
                        <strong>Release Date:</strong>
                        <p>{Intl.DateTimeFormat('pt-BR').format(new Date(film.releaseDate))}</p>
                        
                        <button onClick={() => editFilm(film.id)} type="button">
                            <FiEdit size={20} color="#251FC5"/>
                        </button>
                        
                        <button onClick={() => deleteFilm(film.id)} type="button">
                            <FiTrash2 size={20} color="#251FC5"/>
                        </button>
                    </li>
                ))}
            </ul>
            <button className="button" onClick={fetchMoreFilms} type="button">Load More</button>
        </div>
    );
}