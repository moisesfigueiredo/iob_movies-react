import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'

import api from '../../services/api';

import './styles.css';

import logoImage from '../../assets/iob_logo.png';

export default function NewFilm(){

    const [id, setId] = useState();
    const [director, setDirector] = useState('');
    const [title, setTitle] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [year, setYear] = useState('');

    const { filmId } = useParams();

    const navigate = useNavigate();

    const accessToken = localStorage.getItem('accessToken');

    const authorization = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }

    useEffect(() => {
        if(filmId === '0') return;
        else loadFilm();
    }, [filmId]);

    async function loadFilm() {
        try {
            const response = await api.get(`api/movie/v1/${filmId}`, authorization)

            let adjustedDate = response.data.releaseDate.split("T", 10)[0];

            setId(response.data.id);
            setTitle(response.data.title);
            setDirector(response.data.director);
            setYear(response.data.year);
            setReleaseDate(adjustedDate);
        } catch (error) {            
            alert('Error recovering Film! Try again!')
            navigate('/films');
        }
    }

    async function saveOrUpdate(e) {
        e.preventDefault();

        const data = {
            title,
            director,
            releaseDate,
            year,
        }

        try {
            if(filmId === '0') {
                await api.post('api/movie/v1', data, authorization);
            } else {
                data.id = id;
                await api.put('api/movie/v1', data, authorization);
            }
        } catch (err) {
            alert('Error while recording Film! Try again!')
        }
        navigate('/films');
    }

    return (
        <div className="new-film-container">
            <div className="content">
                <section className="form">
                    <img src={logoImage} alt="IOB Logo"/>
                    <h1>{filmId === '0'? 'Add New' : 'Update'} Film</h1>
                    <p>Enter the film information and click on {filmId === '0'? `'Add'` : `'Update'`}!</p>
                    <Link className="back-link" to="/films">
                        <FiArrowLeft size={16} color="#251fc5"/>
                        Back to Films
                    </Link>
                </section>

                <form onSubmit={saveOrUpdate}>
                    <input 
                        placeholder="Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <input 
                        placeholder="Director"
                        
                        value={director}
                        onChange={e => setDirector(e.target.value)}
                    />
                    <input 
                        type="date"
                        
                        value={releaseDate}
                        onChange={e => setReleaseDate(e.target.value)}
                    />
                    <input 
                        placeholder="Year"
                        
                        value={year}
                        onChange={e => setYear(e.target.value)}
                    />

                    <button className="button" type="submit">{filmId === '0'? 'Add' : 'Update'}</button>
                </form>
            </div>
        </div>
    );
}