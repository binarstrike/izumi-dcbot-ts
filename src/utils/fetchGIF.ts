import axios, { AxiosError } from "axios";
import { URLSearchParams } from "url";
import { newLogger } from "../libs/logger";

const logger = newLogger("utils:fetchTenorGIF");

export async function fetchGIF(params: GIFApiFetchQueryParam): Promise<string[]> {
  const queryParam = new URLSearchParams({
    q: params.q.split(" ").join("+"),
    limit: params.limit || "20",
    client_key: params.client_key,
  } satisfies GIFApiFetchQueryParam);
  try {
    const fetchGIF = await axios.get<FetchGIFResult>(
      `https://tenor.googleapis.com/v2/search?key=${
        process.env.TENOR_API_KEY
      }&random=true&media_filter=gif&${queryParam.toString()}`,
    );
    return fetchGIF.data.results.map((result) => result.media_formats.gif.url);
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error(error.message);
      throw new Error("An error occurred when fetching GIF from API", {
        cause: error.message,
      });
    }
    logger.error(error);
    throw new Error("Failed to fetching GIF from API");
  }
}

type GIFApiFetchQueryParam = {
  q: string;
  limit: string;
  client_key: string;
};

type FetchGIFResult = {
  results: [
    {
      id: string;
      title: string;
      media_formats: {
        gif: {
          url: string;
          duration: number;
          preview: string;
          dims: number[];
          size: number;
        };
      };
      created: number;
      content_description: string;
      itemurl: string;
      url: string;
      tags: string[];
      flags: string[] | number[];
      hasaudio: boolean;
    },
  ];
};
