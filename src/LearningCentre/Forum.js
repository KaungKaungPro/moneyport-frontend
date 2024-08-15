import RouteNav from "../components/RouteNav";
import { useEffect, useState } from "react";
import style from "./style.module.css";
import request from "../utils/request";
import { Trash } from "lucide-react";
import { NavLink } from "react-router-dom";

async function loadData() {
  try {
    console.log("Fetching forum data...");
    const response = await request.get("/learn/forum");
    console.log("Forum data received:", response);
    return response;
  } catch (error) {
    console.error("Error fetching forum data:", error);
    throw new Error("Failed to fetch data from the endpoint");
  }
}

function Forum() {
  let [list, setList] = useState([]);
  let [content, setContent] = useState("");
  let [title, setTitle] = useState("");
  let [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await loadData();
      setList(response);
    } catch (err) {
      console.error("Error in fetchData:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  async function submit() {
    if (!title || title.trim().length === 0) {
      alert("Please enter a title for your question");
      return;
    }
    if (!content || content.trim().length === 0) {
      alert("Please enter a description of your problem");
      return;
    }
    setIsLoading(true);
    try {
      console.log("Submitting new question:", { title, content });
      let response = await request.post("/learn/question/add", {
        name: title,
        content: content,
      });
      console.log("Submit response:", response);
      if (response.status === 200) {
        setTitle("");
        setContent("");
        await fetchData();
      }
    } catch (error) {
      console.error("Error submitting question:", error);
      alert("Failed to submit question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }
    setIsLoading(true);
    try {
      console.log("Attempting to delete question with id:", id);
      await request.get(`/learn/question/del-${id}`);
      console.log("Delete operation completed for question id:", id);
    } catch (error) {
      console.error("Error during delete operation:", error);
    } finally {

      await fetchData();
      setIsLoading(false);
    }
  }

  return (
      <>
        <RouteNav />
        <div className={style.lc_main}>
          <div className="max-w-4xl mx-auto p-4">
            {/* Post a Question Section */}
            <section className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Post a Question</h2>
              <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                  placeholder="Enter your question title"
              />
              <textarea
                  name="content"
                  rows="5"
                  id="question"
                  value={content}
                  onChange={handleContentChange}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please enter a description of your problem"
              ></textarea>
              <div className="text-right mt-4">
                <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    onClick={submit}
                    disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </div>
            </section>

            {/* Frequently Asked Questions Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              {isLoading ? (
                  <p>Loading...</p>
              ) : (
                  <div className="space-y-4">
                    {list.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
                          <div className="flex justify-between items-start mb-2">
                            <NavLink
                                to={`/app/forum/question/${item.id}`}
                                className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              {item.name}
                            </NavLink>
                            <button
                                onClick={() => remove(item.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                                disabled={isLoading}
                            >
                              <Trash size={20} />
                            </button>
                          </div>
                          <p className="text-gray-700 mb-2">{item.content}</p>
                          <div className="text-right text-sm text-gray-500">
                            {item.createTime}
                          </div>
                        </div>
                    ))}
                  </div>
              )}
            </section>
          </div>
        </div>
      </>
  );
}

export default Forum;