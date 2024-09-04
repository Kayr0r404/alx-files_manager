import express, { json } from 'express';
import routes from './routes/index';

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json())
app.use('/', routes);

app.listen(port, () => {
  console.log('web server listening on http://localhost:1245');
});

export default app;
