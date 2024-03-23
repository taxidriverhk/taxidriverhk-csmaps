import type { Map, Tutorial } from "../schemas";

export abstract class MapDatabase {
  abstract mapsAsync(): Promise<Array<Map>>;
  abstract mapAsync(name: string): Promise<Map>;
  abstract tutorialsAsync(): Promise<Array<Tutorial>>;
  abstract tutorialAsync(id: string): Promise<Tutorial>;
}
