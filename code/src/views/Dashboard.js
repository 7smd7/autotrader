import React from "react";
import Container from '@mui/material/Container';
import Typography from "@mui/material/Typography";
import Signals from "./Signals";
import Trades from "./Trades";
import InputConfigCard from "./InputConfigCard";
import ConfigCard from "./ConfigCard";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";

export default function Dashboard() {
  const [configs, setConfigs] = React.useState([]);
  let match = useRouteMatch();
  
  React.useEffect(() => {
    const fetchData = async () => {
      axios.get("/configs")
      .then((response) => {
          setConfigs(response.data)
      }).catch(function (error) {
          console.log(error);
        })
    };
    fetchData();
  }, [config]);

  return (
    <Container sx={{ width: "100%" }}>
      <Paper sx= {{my:4}}>
        <Grid container justifyContent="center">
          <Typography
            variant="h1"
            id="title"
            component="div"
          >
            AutoTrader bot
          </Typography>
        </Grid>
      </Paper>

      <Switch>
        <Route path={`${match.path}:configId`}>
          <Trades/>
        </Route>
        <Route exact path={`${match.path}`}>
          <Grid container sx= {{my:4}} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {
              configs.map((config, index) =>{
                return(
                  <Grid item xs={2} sm={4} md={4} key={index}>
                    <ConfigCard config = {config}/>
                  </Grid>
                )
              })
            }
            <Grid item xs={4} sm={8} md={8}>
              <InputConfigCard/>
            </Grid>
          </Grid>
        </Route>
      </Switch>

			<Signals/>
    </Container>
  );
}
