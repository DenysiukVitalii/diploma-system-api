export enum MessageType {
  NewUser = 'NewUser',
  PasswordReset = 'PasswordReset',
}

export const MessageTypes = {
  [MessageType.NewUser]: {
    template: 'newUser',
    subject: 'New user',
  },
  [MessageType.PasswordReset]: {
    template: 'passwordReset',
    subject: 'Password Reset initiated',
  },
};
