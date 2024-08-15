import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RouteNav from "../components/RouteNav";
import request from "../utils/request";
import { Search } from "lucide-react";

async function loadData(term) {
  try {
    const response = await request.get("learn/terminology?term=" + term);
    return response;
  } catch (error) {
    throw new Error("Failed to fetch data from the endpoint");
  }
}

function Terminology() {
  const [list, setList] = useState([]);
  const [term, setTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await loadData(term);
        setTerm(response.term);
        setList(response.terminologies);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [term]);

  const handleChange = (e) => {
    setTerm(e.target.value);
  };

  async function search() {
    const response = await loadData(term);
    setTerm(response.term);
    setList(response.terminologies);
  }

  return (
      <div className="bg-gray-100 min-h-screen">
        <RouteNav />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <label className="font-bold text-gray-700 w-1/4">
                Search term:
              </label>
              <input
                  type="text"
                  name="term"
                  value={term}
                  placeholder="Please enter a keyword term"
                  onChange={handleChange}
                  className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                  onClick={search}
                  className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                <Search size={20} />
              </button>
            </div>
            <div className="text-center">
              <Link
                  to="/app/forum/termQuestions"
                  className="text-blue-500 hover:text-blue-700 transition duration-300"
              >
                Ask a question
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {list &&
                list
                    .sort((i1, i2) => (i1.definition > i2.definition ? 1 : -1))
                    .map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                        >
                          <div className="p-4">
                            <h3 className="font-bold text-lg mb-2 text-gray-800">
                              {item.definition}
                            </h3>
                            <p className="text-gray-600 overflow-ellipsis overflow-hidden h-20">
                              {item.term}
                            </p>
                          </div>
                        </div>
                    ))}
          </div>
        </div>
      </div>
  );
}

export default Terminology;