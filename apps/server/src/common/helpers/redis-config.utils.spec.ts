import { parseRedisUrl } from './utils';

describe('parseRedisUrl', () => {
  it('defaults the port to 6379 when the URL omits it', () => {
    expect(parseRedisUrl('redis://localhost')).toMatchObject({
      host: 'localhost',
      port: 6379,
    });
  });

  it('uses the explicit port, database, and credentials', () => {
    expect(
      parseRedisUrl('redis://user:p%40ss@cache.internal:6380/2'),
    ).toMatchObject({
      host: 'cache.internal',
      port: 6380,
      username: 'user',
      password: 'p@ss',
      db: 2,
    });
  });

  it('keeps the default database when the path is empty', () => {
    expect(parseRedisUrl('redis://cache:6379').db).toBe(0);
  });

  it('reads the address family from the query string', () => {
    expect(parseRedisUrl('redis://cache?family=6').family).toBe(6);
    expect(parseRedisUrl('redis://cache?family=4').family).toBe(4);
    expect(parseRedisUrl('redis://cache').family).toBeUndefined();
  });

  it('builds TLS options only for rediss URLs', () => {
    expect(parseRedisUrl('rediss://cache:6380').tls).toEqual({});
    expect(
      parseRedisUrl('rediss://cache:6380?rejectUnauthorized=false').tls,
    ).toEqual({ rejectUnauthorized: false });
    expect(parseRedisUrl('redis://cache:6379').tls).toBeUndefined();
  });
});
