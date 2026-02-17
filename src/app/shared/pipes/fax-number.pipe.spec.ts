import { FaxNumberPipe } from './fax-number.pipe';

describe('FaxNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new FaxNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
