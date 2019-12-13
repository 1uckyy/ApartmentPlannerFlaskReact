import ReactDOM from 'react-dom';
// import the routes from routes.js
import createRoutes from './routes';
//css
import './css/GeneralStyle.css';

const routes = createRoutes();

ReactDOM.render(
    routes,
    document.getElementById('content')
  );