export const CACHE_KEY = {
  chatGptChannelId: (strings: TemplateStringsArray, id: string) => `chatGpt-${id}`,
  tenorGifUrl: "tenorGifUrlCache",
};

export const TENOR_GIF_SEARCH_API_URL = (strings: TemplateStringsArray, apiKey: string) =>
  `https://tenor.googleapis.com/v2/search?key=${apiKey}&random=true&media_filter=gif`;

export const CACHE_EXPIRES_TIME = {
  chatGptChannelId: 1800,
} as const;

export const REGEXP_MENTION = /<(?:[^\d>]+|:[A-Za-z0-9]+:)[0-9]+>/gim;
