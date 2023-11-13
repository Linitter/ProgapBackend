import { app } from './app';
import { APPDataSource } from './database/data-source';

APPDataSource.initialize().then(() => {
  app.listen(3000, () =>
    console.log(
      'Server is running!  🏆 Open http://localhost:3000 to see results',
    ),
  );
});
