import type { Category, Map, Statistics, Tutorial } from "../schemas";

export type Nullable<T> = T | null;

export abstract class MapDatabase {
  close(): void {}

  abstract categoriesAsync(): Promise<Array<Category>>;
  abstract mapsAsync(): Promise<Array<Map>>;
  abstract mapAsync(name: string): Promise<Nullable<Map>>;
  abstract mapAsyncById(id: string): Promise<Nullable<Map>>;
  abstract statisticsAsync(): Promise<Statistics>;
  abstract tutorialsAsync(): Promise<Array<Tutorial>>;
  abstract tutorialAsync(id: string): Promise<Nullable<Tutorial>>;
}
