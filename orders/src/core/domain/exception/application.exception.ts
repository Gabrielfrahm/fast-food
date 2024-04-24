export class ApplicationException extends Error {
  constructor(message: string, status: number) {
    const bodyError = {
      code: status,
      body: {
        message: message,
        shortMessage: message.toLowerCase(),
      },
    };
    super(JSON.stringify(bodyError));
  }
}
