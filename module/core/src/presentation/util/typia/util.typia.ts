import { TypeGuardError } from 'typia';
import { HttpErrorPayload } from '../../error/code.error';

export const ParsingErrorTypeEnum = {
  RequestBody: 'RequestBody',
  Query: 'Query',
  Param: 'Param',
  Unknown: 'Unknown',
  Header: 'Header',
} as const;

type ParsingErrorType = (typeof ParsingErrorTypeEnum)[keyof typeof ParsingErrorTypeEnum];

export function formatTypeGuardErrorToSafeErrorResponse(
  parsingErrorType: ParsingErrorType,
  error: TypeGuardError,
  instanceUrl: string
): HttpErrorPayload {
  const parsedErrorInfo = parseErrorTypeToInfo(parsingErrorType);

  const details =
    parsedErrorInfo.code >= 500
      ? undefined
      : {
          explanation: error.message.split(':')[1].toLowerCase().replace('type', 'value'),
          expected: error.expected,
          value: error.value,
        };

  return {
    code: parsedErrorInfo.code,
    instance: instanceUrl,
    message: parsedErrorInfo.message,
    details,
  };
}

function transformToSentenceCase(inputString: string) {
  const words = inputString.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');

  const transformedWords = words.map((word) => word.toLowerCase());

  return transformedWords.join(' ');
}

function parseErrorTypeToInfo(parsingErrorType: ParsingErrorType) {
  if (parsingErrorType === ParsingErrorTypeEnum.Unknown) {
    return { code: 503, message: 'unprocessable entity' };
  }

  return {
    code: 400,
    message: `invalid ${transformToSentenceCase(parsingErrorType)}`,
  };
}
