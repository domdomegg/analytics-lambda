import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter, Switch, Link } from 'react-router-dom';
import './index.css';
import ProjectView from './ProjectView';
import StreamView from './StreamView';
import HomeView from './HomeView';
import axios from 'axios';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <header>
        <h1><Link to={'/'}>analytics-lambda/viewer</Link></h1>
        <button onClick={() => axios.post('/api/sync').then(() => window.location.reload())}>Sync data</button>
      </header>
      <div id="main">
        <Switch>
          <Route path={'/:project'}>
            <ProjectView>
              <Route path={'/:project/:streamId'} component={StreamView} />
            </ProjectView>
          </Route>
          <Route path={'/'} component={HomeView} />
        </Switch>
    </div>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
