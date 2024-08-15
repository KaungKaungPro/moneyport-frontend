import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ThumbsUp, Trash } from "lucide-react";
import RouteNav from "../components/RouteNav";
import { useAuth } from "../UserAccount/AuthContext";
import request from "../utils/request";

async function loadData(questionId) {
  if (questionId) {
    try {
      const response = await request.get("/learn/question/" + questionId);
      return response;
    } catch (error) {
      throw new Error("Failed to fetch data from the endpoint");
    }
  } else {
    return request.get("/learn/question");
  }
}

function Question() {
  const { questionId } = useParams();
  const [list, setList] = useState([]);
  const [question, setQuestion] = useState({});
  const [content, setContent] = useState("");
  const { user } = useAuth();
  const [likedAnswers, setLikedAnswers] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await loadData(questionId);
        if (response.question) {
          setQuestion(response.question);
          setList(response.answers);
          // Initialize liked state for each answer
          const initialLikedState = {};
          response.answers.forEach(answer => {
            initialLikedState[answer.id] = answer.likedByCurrentUser || false;
          });
          setLikedAnswers(initialLikedState);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData(questionId);
  }, [questionId]);

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  async function submit() {
    if (!content || content.trim().length === 0) {
      alert("Please enter your answer");
      return;
    }
    try {
      let response = await request.post("/learn/answer/add", {
        questionId: questionId,
        content: content,
      });

      if (response.status === 200) {
        response = await loadData(questionId);
        setContent("");
        setQuestion(response.question);
        setList(response.answers);
        // Update liked state for new answers
        const newLikedState = { ...likedAnswers };
        response.answers.forEach(answer => {
          if (!(answer.id in newLikedState)) {
            newLikedState[answer.id] = false;
          }
        });
        setLikedAnswers(newLikedState);
      }
    } catch (error) {
      throw new Error("Failed to submit data from the endpoint");
    }
  }

  async function up(e) {
    const id = e.currentTarget.dataset.id;
    try {
      let response = await request.post(
          `/learn/answer/upvote/${user.userId}/${id}`,
          { id: id }
      );
      if (response.status === 200) {
        response = await loadData(questionId);
        setQuestion(response.question);
        setList(response.answers);
        // Toggle liked state for this answer
        setLikedAnswers(prev => ({
          ...prev,
          [id]: !prev[id]
        }));
      }
    } catch (error) {
      throw new Error("Failed to submit data from the endpoint");
    }
  }

  async function remove(e) {
    if (!window.confirm("Are you sure you want to delete this answer?")) {
      return;
    }
    const id = e.currentTarget.dataset.id;
    try {
      let response = await request.get("/learn/answer/del-" + id);
      if (response.status === 200 || response.answers) {
        setList(response.answers);
        // Remove liked state for deleted answer
        setLikedAnswers(prev => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
      <div className="bg-gray-100 min-h-screen">
        <RouteNav />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Question</h2>
            <p className="text-gray-700 mb-4">{question.content}</p>
            <p className="text-sm text-gray-500 text-right">
              {question.createTime}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Answer</h2>
            <textarea
                name="content"
                rows="5"
                value={content}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                placeholder="Enter your answer here"
            ></textarea>
            <div className="flex justify-end">
              <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                  onClick={submit}
              >
                Submit Answer
              </button>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">Answers from Contributors</h2>
          <div className="space-y-4">
            {list.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-gray-700 flex-grow">{item.content}</p>
                    <button
                        onClick={remove}
                        data-id={item.id}
                        className="text-red-500 hover:text-red-700 transition duration-300"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                <span className="flex items-center">
                  {item.upVote}
                  <button
                      onClick={up}
                      data-id={item.id}
                      className={`ml-2 transition duration-300 ${
                          likedAnswers[item.id]
                              ? "text-blue-500"
                              : "text-gray-500 hover:text-blue-500"
                      }`}
                  >
                    <ThumbsUp size={20} fill={likedAnswers[item.id] ? "currentColor" : "none"} />
                  </button>
                </span>
                    <span>{item.createTime}</span>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
}

export default Question;
