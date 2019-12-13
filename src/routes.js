import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MainPage from './components/mainpage/MainPage';

const createRoutes = () => (
    <Router>
      <Route exact path="/" component={MainPage}/>
    </Router>
);

export default createRoutes;
