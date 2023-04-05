import axios from "axios"

const SEARCH_ENDPOINT: string = `https://tenor.googleapis.com/v2/search?key=${process.env.TENOR_API_KEY}&random=true&media_filter=gif`

type fetchParam = {
  q: string
  limit?: number
  client_key?: string
}

const genTenorAPIUrl = (params: fetchParam): string =>
  `${SEARCH_ENDPOINT}&limit=${params.limit || 20}&client_key=${
    params.client_key || "any_key"
  }&q=${params.q.split(" ").join("+")}`

export async function fetchGif(params: fetchParam): Promise<string[]> {
  try {
    const urls: string[] = []
    const fetchData = await axios(genTenorAPIUrl(params), { method: "GET" })
    if (typeof fetchData.data?.results === "object") {
      fetchData.data.results
        .map((result: any) => result.media_formats.gif.url)
        .forEach((url: string) => urls.push(url))
      return urls
    }
  } catch (error) {
    if (error?.response?.status != "200") {
      console.log(error?.response?.statusText)

      throw new Error("An error occurred when send requests to Tenor API", {
        cause: error?.response?.statusText,
      })
    } else if (error?.code === "ENOTFOUND")
      throw new Error("Something wrong with the internet")
    else throw new Error("Fail to send API requests")
  }
}
