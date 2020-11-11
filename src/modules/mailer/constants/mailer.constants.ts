export enum MessageType {
  NewUser = 'NewUser',
  PasswordReset = 'PasswordReset',
  RequestCreated = 'RequestCreated',
  RequestConfirmed = 'RequestConfirmed',
  RequestRejected = 'RequestRejected',
  ThemeAction = 'ThemeAction',
}

export const MessageTypes = {
  [MessageType.NewUser]: {
    template: 'newUser',
    subject: 'Новий користувач',
  },
  [MessageType.PasswordReset]: {
    template: 'passwordReset',
    subject: 'Відновлення паролю',
  },
  [MessageType.RequestCreated]: {
    template: 'requestCreated',
    subject: 'Нова заявка!',
  },
  [MessageType.RequestConfirmed]: {
    template: 'requestConfirmed',
    subject: 'Заявка прийнята!',
  },
  [MessageType.RequestRejected]: {
    template: 'requestRejected',
    subject: 'Заявку відхилено',
  },
  [MessageType.ThemeAction]: {
    template: 'themeAction',
    subject: 'Затвердження теми',
  },
};
