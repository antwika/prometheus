import {
  collectDefaultMetrics,
  Registry,
} from 'prom-client';
import { IHttpHandlable, IHttpHandler } from '@antwika/http';

export interface IPrometheusHttpHandlerArgs {
  appLabel: string;
}

export class PrometheusHttpHandler implements IHttpHandler {
  private readonly appLabel: string;

  private readonly registry: Registry;

  constructor(args: IPrometheusHttpHandlerArgs) {
    this.appLabel = args.appLabel;
    this.registry = new Registry();
    this.registry.setDefaultLabels({
      app: this.appLabel,
    });

    collectDefaultMetrics({ register: this.registry });
  }

  async canHandle(handlable: IHttpHandlable) {
    return !!handlable;
  }

  async handle(handlable: IHttpHandlable) {
    const res = handlable.res();
    res.setHeader('Content-Type', this.registry.contentType);
    res.end(await this.registry.metrics());
  }
}
