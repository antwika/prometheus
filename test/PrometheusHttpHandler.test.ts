import { PrometheusHttpHandler } from '../src/PrometheusHttpHandler';

describe('PrometheusHttpHandler', () => {
  it('can handle and respond to incoming requests', async () => {
    const prometheusHttpHandler = new PrometheusHttpHandler({ appLabel: '@antwika/test-app' });

    const req: any = {};
    const res: any = {
      setHeader: jest.fn(),
      writeHead: jest.fn(),
      end: jest.fn(),
    };
    const handlable = { req: () => req, res: () => res };

    await expect(prometheusHttpHandler.canHandle(handlable)).resolves.toBeTruthy();
    await prometheusHttpHandler.handle(handlable);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', expect.stringMatching(/^text\/plain; version=*.*.*; charset=utf-8$/));
    expect(res.end).toHaveBeenCalledWith(expect.stringMatching(/process_cpu_user_seconds_total/));
    expect(res.end).toHaveBeenCalledWith(expect.stringMatching(/nodejs_version_info/));
    expect(res.end).toHaveBeenCalledWith(expect.stringMatching(/app="@antwika\/test-app"}/));
  });
});
