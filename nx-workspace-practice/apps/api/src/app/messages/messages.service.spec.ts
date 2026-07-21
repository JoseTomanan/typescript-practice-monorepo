import { MessagesService } from './messages.service';

describe('MessagesService', () => {
  it('returns the placeholder message', () => {
    const service = new MessagesService();

    expect(service.getPlaceholderMessage()).toEqual({ message: 'Hello Ireland Baby!' });
  });
});
