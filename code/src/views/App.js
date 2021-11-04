import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Dashboard from './Dashboard';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";


export default function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Router>
          <Switch>
            <Route exact path="/">
              <Dashboard/>
            </Route>
            <Route path="/">
              <Redirect to="/" />;
            </Route>
          </Switch>  
        </Router>
      </Box>
    </Container>
  );
}
