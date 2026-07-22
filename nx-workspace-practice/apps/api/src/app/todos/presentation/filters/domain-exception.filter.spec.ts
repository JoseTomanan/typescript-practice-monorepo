import { ArgumentsHost, BadRequestException, NotFoundException } from '@nestjs/common';
import { DomainExceptionFilter } from './domain-exception.filter';
import { TodoNotFoundError } from '../../exceptions/todo-not-found.error';

function makeHost() {
  const mockJson = jest.fn();
  const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
  const mockGetResponse = jest.fn().mockReturnValue({ status: mockStatus });
  const host = {
    switchToHttp: jest.fn().mockReturnValue({ getResponse: mockGetResponse }),
  } as unknown as ArgumentsHost;
  return { host, mockStatus, mockJson };
}

describe('DomainExceptionFilter', () => {
  let filter: DomainExceptionFilter;

  beforeEach(() => {
    filter = new DomainExceptionFilter();
  });

  it('maps TodoNotFoundError to the same 404 body NotFoundException would produce', () => {
    const { host, mockStatus, mockJson } = makeHost();

    filter.catch(new TodoNotFoundError(5), host);

    const expected = new NotFoundException('Todo 5 not found');
    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith(expected.getResponse());
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: 404,
      message: 'Todo 5 not found',
      error: 'Not Found',
    });
  });

  it('passes other HttpExceptions through unchanged (e.g. Zod BadRequestException)', () => {
    const { host, mockStatus, mockJson } = makeHost();
    const body = { statusCode: 400, message: 'Validation failed', errors: [] };
    const exception = new BadRequestException(body);

    filter.catch(exception, host);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith(exception.getResponse());
  });

  it('returns 500 for unknown errors', () => {
    const { host, mockStatus, mockJson } = makeHost();

    filter.catch(new Error('something unexpected'), host);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'something unexpected',
      error: 'Error',
    });
  });

  it('returns 500 for non-Error exceptions', () => {
    const { host, mockStatus, mockJson } = makeHost();

    filter.catch('something unexpected', host);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'something unexpected',
      error: 'UnknownError',
    });
  });
});
