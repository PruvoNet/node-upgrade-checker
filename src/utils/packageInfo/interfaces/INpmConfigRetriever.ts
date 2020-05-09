import { Options } from 'npm-registry-fetch';

export type INpmConfig = Options;

export abstract class INpmConfigRetriever {
  public abstract async retrieve(): Promise<INpmConfig>;
}
