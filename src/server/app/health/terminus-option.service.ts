import {
  TerminusEndpoint,
  TerminusModuleOptions,
  TerminusOptionsFactory
} from '@nestjs/terminus';

import { CharacterHealthIndicator } from '@Character/character.health';

export class TerminusOptionsService implements TerminusOptionsFactory {
  constructor(private readonly charHealth: CharacterHealthIndicator) {
    console.log('TerminusOptionsService constructed');
  }

  createTerminusOptions(): TerminusModuleOptions {
    console.log(this.charHealth);
    const healthEndpoint: TerminusEndpoint = {
      url: '/health/character',
      healthIndicators: [
        async () => this.charHealth.isHealthy('character').toPromise()
      ]
    };
    return {
      endpoints: [healthEndpoint]
    };
  }
}
