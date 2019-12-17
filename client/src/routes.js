import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MainPage from './components/mainpage/MainPage.jsx';
import PlannerPage from './components/plannerpage/PlannerPage.jsx';
import Login from './components/reglog/Login';
import Registration from './components/reglog/Registration';
import ProfilePage from './components/profilepage/ProfilePage'

const createRoutes = () => (
    <Router>
      <Route exact path="/" component={MainPage}/>
      <Route exact path="/planner" component={PlannerPage}/>
      <Route exact path="/login" component={Login}/>
      <Route exact path="/registration" component={Registration}/>
      <Route exact path="/profile" component={ProfilePage}/>
      <Route path="/planner/:id" component={PlannerPage}/>
    </Router>
);

export default createRoutes;
