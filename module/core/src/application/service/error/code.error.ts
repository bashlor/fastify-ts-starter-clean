const ErrorCode = {
  OperationFailed: 'OperationFailed',
} as const;

type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

export { ErrorCode, type ErrorCodeType };
