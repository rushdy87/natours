import app from './app.js';
import connectDB from '../config/db.js';

const PORT = process.env.PORT || 3000;

// Connect to the database
await connectDB();

app.listen(PORT, () => {
  console.log(
    'Server is up and running on port ' +
      `${PORT}`.red +
      ' on ' +
      `${app.get('env')}`.green +
      ' mode',
  );
});
