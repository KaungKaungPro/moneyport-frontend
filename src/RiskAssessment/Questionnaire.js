import React, { useEffect, useState } from "react";
import RouteNav from "../components/RouteNav";
import { useNavigate, useParams } from "react-router-dom";
import request from "../utils/request";
import { useAuth } from "../UserAccount/AuthContext";

function Questionnaire() {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const { user } = useAuth();
  const [error, setError] = useState("");
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    request
        .get("/questions")
        .then((response) => {
          console.dir(response);
          setQuestions(response);
        })
        .catch((error) => {
          console.error("There was an error fetching questions!", error);
        });
  }, []);

  const handleChange = (questionId, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const allAnswered = questions.every(
        (question) => responses[question.id] !== undefined
    );
    if (!allAnswered) {
      setError("Please answer all the questions before submitting.");
      return;
    }
    const responseArray = Object.entries(responses).map(
        ([questionId, responseValue]) => ({
          questionId,
          responseValue,
        })
    );
    request
        .post("/responses/", {
          userId,
          responses: responseArray,
        })
        .then(() => {
          navigate(`/app/recommendations/${userId}`);
        })
        .catch((error) => {
          console.error("There was an error submitting responses!", error);
        });
  };

  return (
      <div className="bg-gray-100 min-h-screen">
        <RouteNav />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Questionnaire</h1>
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {questions.length === 0 ? (
                <p className="text-gray-700">Loading questions...</p>
            ) : (
                questions.map((question) => (
                    <div key={question.id} className="mb-6">
                      <h3 className="text-xl font-semibold mb-2">{question.questionText}</h3>
                      {question.options && question.options.length > 0 ? (
                          <div className="space-y-2">
                            {question.options.map((option, index) => (
                                <div
                                    className="flex items-center"
                                    key={index}
                                >
                                  <input
                                      type="radio"
                                      name={`question-${question.id}`}
                                      value={index + 1}
                                      onChange={() => handleChange(question.id, index + 1)}
                                      checked={responses[question.id] === index + 1}
                                      className="form-radio h-4 w-4 text-blue-600"
                                  />
                                  <label
                                      className="ml-2 text-gray-700"
                                  >
                                    {option.optionText}
                                  </label>
                                </div>
                            ))}
                          </div>
                      ) : (
                          <p className="text-gray-600">No options available</p>
                      )}
                    </div>
                ))
            )}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
  );
}

export default Questionnaire;