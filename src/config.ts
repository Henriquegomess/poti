import { readFileSync } from 'fs';

export class ConfigManager {
  private config: any;

  constructor(configFilePath: string) {
    this.config = JSON.parse(readFileSync(configFilePath, 'utf-8'));
  }

  get(key: string): any {
    return this.config[key];
  }
}
