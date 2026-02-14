import {getJson} from "serpapi";

export async function serpApiSearch(params: Record<string, any>) {
    return getJson({
        ...params,
        api_key: process.env.SERP_API_KEY!,
    });
}
