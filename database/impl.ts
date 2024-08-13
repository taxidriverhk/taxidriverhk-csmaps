import { PoolClient } from "pg";
import {
  Category,
  GameVersion,
  Map,
  ReleaseStatus,
  Statistics,
  Tutorial,
} from "../schemas";
import { MapDatabase, Nullable } from "./types";

export class SqlMapDatabase extends MapDatabase {
  sqlClient: PoolClient;

  constructor(sqlClient: PoolClient) {
    super();
    this.sqlClient = sqlClient;
  }

  close(): void {
    this.sqlClient.release();
  }

  async categoriesAsync(): Promise<Array<Category>> {
    const { rows } = await this.sqlClient.query<Category>(
      "SELECT * FROM categories"
    );
    return rows;
  }

  async mapsAsync(): Promise<Array<Map>> {
    const { rows } = await this.sqlClient.query<Map>(
      "SELECT category_id, icon, name, progress_percentage, release_date, status, target_game_version, update_date FROM maps"
    );
    return rows;
  }

  async mapAsync(name: string): Promise<Nullable<Map>> {
    const { rowCount, rows } = await this.sqlClient.query<Map>(
      "SELECT * FROM maps WHERE name = $1 AND status <> 2",
      [name]
    );
    return rowCount == null || rowCount < 1 ? null : rows[0];
  }

  async mapAsyncById(id: string): Promise<Nullable<Map>> {
    const { rowCount, rows } = await this.sqlClient.query<Map>(
      "SELECT * FROM maps WHERE id = $1 AND status <> 2",
      [id]
    );
    return rowCount == null || rowCount < 1 ? null : rows[0];
  }

  async statisticsAsync(): Promise<Statistics> {
    const [mapQueryCounts, tutorialQueryCounts] = await Promise.all([
      this.sqlClient.query<{
        released_count: number;
        in_progress_count: number;
        unavailable_count: number;
      }>(
        "SELECT" +
          " COUNT(*) FILTER (WHERE status = 0) AS released_count," +
          " COUNT(*) FILTER (WHERE status = 1) AS in_progress_count," +
          " COUNT(*) FILTER (WHERE status = 2) AS unavailable_count" +
          " FROM maps"
      ),
      this.sqlClient.query<{ count: number }>(
        "SELECT COUNT(*) FROM tutorials WHERE is_draft = FALSE"
      ),
    ]);

    const {
      rows: [{ released_count, in_progress_count, unavailable_count }],
    } = mapQueryCounts;
    const {
      rows: [{ count: tutorialsCount }],
    } = tutorialQueryCounts;

    return {
      num_released_maps: released_count,
      num_in_progress_maps: in_progress_count,
      num_unavailable_maps: unavailable_count,
      num_tutorials: tutorialsCount,
    };
  }

  async tutorialsAsync(): Promise<Array<Tutorial>> {
    const { rows } = await this.sqlClient.query<Tutorial>(
      "SELECT creation_date, is_draft, hash_key, last_update_date, target_game_version, thumbnail, title FROM tutorials"
    );
    return rows;
  }

  async tutorialAsync(id: string): Promise<Nullable<Tutorial>> {
    const { rowCount, rows } = await this.sqlClient.query<Tutorial>(
      "SELECT * FROM tutorials WHERE hash_key = $1",
      [id]
    );
    return rowCount == null || rowCount < 1 ? null : rows[0];
  }
}

export class MockMapDatabase extends MapDatabase {
  async categoriesAsync(): Promise<Array<Category>> {
    return [];
  }

  async mapsAsync(): Promise<Array<Map>> {
    return [
      {
        id: 201,
        category_id: 3,
        name: "de_taxi_plaza",
        full_name: "Battle at Plaza",
        version: "0.01",
        release_date: new Date("2024-02-25"),
        update_date: new Date("2024-02-25"),
        status: ReleaseStatus.InProgress,
        max_players: 10,
        icon: "/csmaps/icon201.jpg",
        target_game_version: GameVersion.COUNTER_STRIKE_2,
        images: [
          {
            url: "https://live.staticflickr.com/65535/53526262316_f541a34e77_o_d.jpg",
            caption: "Terrorist Spawn",
          },
          {
            url: "https://live.staticflickr.com/65535/53526578144_3b8e431586_o_d.jpg",
            caption: "Shopping Mall (Lower Level) - 1",
          },
          {
            url: "https://live.staticflickr.com/65535/53526695935_fd11d6021c_o_d.jpg",
            caption: "Shopping Mall (Lower Level) - 2",
          },
          {
            url: "https://live.staticflickr.com/65535/53526439698_b4e3b68f16_o_d.jpg",
            caption: "Shopping Mall (Lower Level) - 3",
          },
          {
            url: "https://live.staticflickr.com/65535/53551145610_1d2b70e5f7_h.jpg",
            caption: "Cinema",
          },
          {
            url: "https://live.staticflickr.com/65535/53550701376_0f544ed54c_h.jpg",
            caption: "Shopping Mall (Upper Level) - 1",
          },
          {
            url: "https://live.staticflickr.com/65535/53526439693_9fe997b8d9_o_d.jpg",
            caption: "Bomb Planting Site A",
          },
        ],
        download_links: [],
        progress_percentage: 40,
      },
    ];
  }

  async mapAsync(_name: string): Promise<Nullable<Map>> {
    return (await this.mapsAsync())[0];
  }

  async mapAsyncById(_id: string): Promise<Nullable<Map>> {
    return (await this.mapsAsync())[0];
  }

  async statisticsAsync(): Promise<Statistics> {
    return {
      num_released_maps: 0,
      num_in_progress_maps: 1,
      num_unavailable_maps: 2,
      num_tutorials: 3,
    };
  }

  async tutorialsAsync(): Promise<Array<Tutorial>> {
    return [
      {
        title: "Play your own addon/workshop map",
        hash_key: "play-your-own-addon-map",
        content: `
# Test Header
Test content with a \`code block\` here.
    `,
        creation_date: new Date("2023-10-30"),
        last_update_date: new Date("2023-12-26"),
        thumbnail: "/csmaps/tutorial202.jpg",
        target_game_version: GameVersion.COUNTER_STRIKE_2,
        is_draft: false,
      },
    ];
  }

  async tutorialAsync(_id: string): Promise<Nullable<Tutorial>> {
    return (await this.tutorialsAsync())[0];
  }
}
