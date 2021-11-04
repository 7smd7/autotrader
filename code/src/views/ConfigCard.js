import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Grid } from '@mui/material';

export default function ConfigCard(props) {
  const [config, setConfig] = React.useState(props.config);

  React.useEffect(() => {
    const fetchData = async () => {
      let PAL = 0;
      config.orderHistory.forEach(order=>{
        PAL += order.PAL; 
      })
      setConfig({...config, PAL:PAL})
    };
    fetchData();
  }, [config]);

  return (
    <Card sx={{ minWidth: 275 , height: 300 }}>
      {console.log(config)}
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          exchange API: {config.apiKey}
        </Typography>
        <Typography variant="h3" component="div">
          {config.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {"ID: " + config._id}
        </Typography>
        <Typography variant="body2">
          <br/>
          <b>{'PAL: '}</b> {config.PAL} 
          <br/><br/>
        </Typography>
      </CardContent>
      <CardActions>
        <Grid 
          container
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <Button size="small" href = {"/"+config._id} >Trades history</Button>
        </Grid>
      </CardActions>
    </Card>
  );
}
