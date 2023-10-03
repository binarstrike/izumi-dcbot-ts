export type GifApiFetchQueryParam = {
  q: string;
  limit: number;
  client_key: string;
};

export type FetchGifResult = {
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
