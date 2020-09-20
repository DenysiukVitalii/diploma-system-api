import { Logger } from '@nestjs/common';
import { ApplicationContext } from './app.context';

declare const module: any;

async function bootstrap() {
  const app = await ApplicationContext();

  await app.listen(3000);
  Logger.log(`Application is running on: ${await app.getUrl()}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
