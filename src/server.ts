/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Server } from 'http';
import app from './app';
import config from './config';

const port = config.port;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log('Sever is running on port ', port);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info('Server closed!');
      });
    }
    process.exit(1);
  };
  process.on('uncaughtException', error => {
    console.log(error);
    exitHandler();
  });

  process.on('unhandledRejection', error => {
    console.log(error);
    exitHandler();
  });
}
main();
