import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

export default function InputConfigCard() {
  const [state, setState] = React.useState({
    name: "",
    apiKey: "",
    secret: "",
    password: "",
    allocation: 0.05,
    orderhistory: []
  })
  
  function handleChange(evt) {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  }

  function handleClick(evt) {
    axios.post("/configs/",state)
    .then((response) => {
        console.log( response.data_id + " submit new config.")
    }).catch(function (error) {
        console.log(error);
      })
  }

  return (
    <Card sx={{ minWidth: 275 ,height: 300}}>
      <CardContent       sx={{'& > :not(style)': { m: 1}, width : "95%"}}>
        <Typography  variant="h6" component="div">
            {"Enter new API config"}
        </Typography>
        <Grid container  spacing={{ xs: 1, md: 1 }} >
          <Grid container item direction="row" alignItems="center" justifyContent="space-around" >
            <TextField
                required
                id="outlined-required"
                label="Name"
                name="name"
                value={state.name}
                onChange={handleChange}
              />
            <TextField
                required
                id="outlined-required"
                label="API KEY"
                name="apiKey"
                value={state.apiKey}
                onChange={handleChange}
              />
          </Grid>
          <Grid container item direction="row" alignItems="center" justifyContent="space-around"  >
            <TextField
              required
              id="outlined-required"
              label="Secret"
              name="secret"
              value={state.secret}
              onChange={handleChange}
            />
            <TextField
              required
              id="outlined-required"
              label="Password"
              name="password"
              value={state.password}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx = {{ mr : 6}}>
        <Grid container justifyContent="flex-end">
          <Button size="small" onClick = {handleClick}>Add config</Button>
        </Grid>
      </CardActions>
    </Card>
  );
}
