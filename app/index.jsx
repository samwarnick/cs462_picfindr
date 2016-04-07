import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory} from 'react-router';

import App from './components/App.jsx';

let routes =  (
  <Router history={browserHistory}>
    <Route path="/" component={App} />
  </Router>
);

ReactDOM.render(routes, document.getElementById('root'));
