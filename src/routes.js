import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MainPage from './components/mainpage/MainPage.jsx';
import PlannerPage from './components/plannerpage/PlannerPage.jsx';

const createRoutes = () => (
    <Router>
      <Route exact path="/" component={MainPage}/>
      <Route exact path="/planner" component={PlannerPage}/>
    </Router>
);

export default createRoutes;
