import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Login from './pages/Login';
import Films from './pages/Films';
import NewFilm from './pages/NewFilm';


export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<Login/>}/>
                <Route path="/films" element={<Films/>}/>
                <Route path="/film/new/:filmId" element={<NewFilm/>}/>
            </Routes>
        </BrowserRouter>
    );
}