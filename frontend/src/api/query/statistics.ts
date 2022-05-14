// import { fetchGet } from "../fetch"
import { IArticle } from "../../common/interfaces/article";
import { IArticleStatistics } from "../../common/interfaces/statistics";

const article: IArticle = {
    id: "123",
    name: "Victor is a sad cunt",
    description: "Very bad stuff...",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}

const articleStatistics: IArticleStatistics = {
    article,
    statistics: [
        { name: "trustworthiness", positive: 125, negative: 54 },
        { name: "concise", positive: 54, negative: 24 }
    ]
}

export const getStatisticsByArticleID = async (id: string | undefined): Promise<IArticleStatistics | undefined> => {
    // if ID is not defined, fetch median statistics
    if (!id) {
        // const articleStatistics = await fetchGet("/api/statistics/") as unknown as ArticleStatistics;
        return {
            ...articleStatistics,
            article: undefined
        }
    };

    // const articleStatistics = await fetchGet("/api/statistics/:id") as unknown as ArticleStatistics;
    return articleStatistics;
}