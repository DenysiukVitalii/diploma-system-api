import { Logger } from '@nestjs/common';

import { ApplicationContext } from './app.context';

async function bootstrap() {
  const app = await ApplicationContext();

  await app.listen(3000);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
