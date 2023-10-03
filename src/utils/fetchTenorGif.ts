import axios, { AxiosError } from "axios";
import envConfig from "../env.config";
import { TENOR_GIF_SEARCH_API_URL } from "../consts";
import { URLSearchParams } from "url";
import { FetchGifResult, GifApiFetchQueryParam } from "../types";
import { MyLogger } from "./MyLogger";

const logger = new MyLogger("utils>fetchTenorGif");

export async function fetchGifUrl(params: GifApiFetchQueryParam): Promise<string[]> {
  const queryParam = new URLSearchParams({
    q: params.q.split(" ").join("+"),
    limit: String(params.limit || 20),
    client_key: params.client_key,
  } satisfies Record<keyof GifApiFetchQueryParam, string>);
  try {
    const fetchGif = await axios<FetchGifResult>(
      `${TENOR_GIF_SEARCH_API_URL`${envConfig.TENOR_API_KEY}`}&${queryParam.toString()}`,
      {
        method: "GET",
      },
    );
    return fetchGif.data.results.map((result) => result.media_formats.gif.url);
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error(error.message);
      throw new Error("An error occurred when send requests to Tenor API", {
        cause: error.message,
      });
    }
    logger.error(error);
    throw new Error("Failed to send API requests");
  }
}
