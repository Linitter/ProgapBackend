import { app } from './app';
import { APPDataSource } from './database/data-source';

APPDataSource.initialize().then(() => {
  app.listen(3011, () =>
    console.log(
      'Server is running!  🏆 Open http://localhost:3011 to see results',
    ),
  );
});
