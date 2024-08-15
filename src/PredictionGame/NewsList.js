import React, { useEffect, useState } from "react";
import axios from "axios";
import request from "../utils/request";

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sentimentResults, setSentimentResults] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      const cachedNews = localStorage.getItem("cachedNews");
      const cachedDate = localStorage.getItem("cachedNewsDate");
      const today = new Date().toDateString();

      if (cachedNews && cachedDate === today) {
        if (JSON.parse(cachedNews).code === 500) {
          localStorage.removeItem("cachedNews");
          localStorage.removeItem("cachecNewsDate");
          return;
        }
        setNews(JSON.parse(cachedNews));
        await analyzeSentiment(JSON.parse(cachedNews));
        setLoading(false);
      } else {
        try {
          const response = await request.get("/news/fetch-news");
          const newsData = response;
          setNews(newsData);
          localStorage.setItem("cachedNews", JSON.stringify(newsData));
          localStorage.setItem("cachedNewsDate", today);
          await analyzeSentiment(newsData);
        } catch (err) {
          setError("Error fetching news");
          console.error("Error fetching news:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    const analyzeSentiment = async (newsData) => {
      try {
        const headlines = newsData.map((article) => article.headline);
        const tickers = newsData.map((article) => article.ticker);
        const response = await axios.post("http://localhost:5082/analyze-sentiment", {
          headlines,
          tickers,
        });
        setSentimentResults(response.data);
      } catch (err) {
        console.error("Error analyzing sentiment:", err);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p className="text-base font-semibold text-gray-600">Loading...</p>;
  if (error) return <p className="text-base font-semibold text-red-600">{error}</p>;

  return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <h1 className="text-xl font-bold text-gray-800 mb-4">News Articles</h1>
        {news.length === 0 ? (
            <p className="text-base text-gray-600">No news articles found.</p>
        ) : (
            <ul className="space-y-4">
              {news.map((article, index) => (
                  <li key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    {article.imageUrl && (
                        <img
                            src={article.imageUrl}
                            alt={article.headline}
                            className="w-full h-32 object-cover rounded-md mb-2"
                        />
                    )}
                    <h2 className="text-base font-semibold text-gray-800 mb-1">{article.headline}</h2>
                    <p className="text-sm text-gray-600 mb-1">{article.summary}</p>
                    <p className="text-xs font-medium text-blue-600 mb-1">Ticker: {article.ticker}</p>
                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 transition duration-300"
                    >
                      Read more
                    </a>
                  </li>
              ))}
            </ul>
        )}
      </div>
  );
};

export default NewsList;