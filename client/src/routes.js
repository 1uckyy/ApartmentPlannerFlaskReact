import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MainPage from './components/mainpage/MainPage.jsx';
import PlannerPage from './components/plannerpage/PlannerPage.jsx';
import Login from './components/reglog/Login';
import Registration from './components/reglog/Registration';

const createRoutes = () => (
    <Router>
      <Route exact path="/" component={MainPage}/>
      <Route exact path="/planner" component={PlannerPage}/>
      <Route exact path="/login" component={Login}/>
      <Route exact path="/registration" component={Registration}/>
    </Router>
);

export default createRoutes;
