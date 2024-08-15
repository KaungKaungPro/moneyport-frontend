import RouteNav from "../components/RouteNav"
import {useEffect, useState} from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';

async function loadData(questionId) {
  try {
    const response = await axios.get('http://localhost:8080/api/learn/question/'+questionId);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch data from the endpoint');
  }
}

function Question() {
    const { questionId }=useParams();

    let [list, setList] = useState([]);
    let [question, setQuestion] = useState({});
    let [content, setContent] = useState("");
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await loadData(questionId);
            setQuestion(response.question);
            setList(response.answers);
          } catch (err) {
            console.log(err);
          }
        };
        fetchData(questionId);
      }, []);
    const handleChange = (e) => {
        setContent(e.target.value);
    };
    async function submit(){
        if(!content || content.trim().length===0){
            alert('Please enter your answer')
            return;
        }
      try {
        let response = await axios.post('http://localhost:8080/api/learn/answer/add',{questionId:questionId,content:content});
        if(response.status===200){
         try {
            response = await loadData(questionId);
            setContent("")
            setQuestion(response.question);
            setList(response.answers);
          } catch (err) {
            console.log(err);
          }
        }
      } catch (error) {
        window.alert(error.response.data.msg);
      }
    }
    async function up(e){
     const id=e.target.dataset.id;
     let datas=localStorage.getItem("data");
     if(!datas){
         datas=[];
     }else{
         datas=JSON.parse(datas);
     }
     let url;
     if(datas.includes(id+"")){
         url='http://localhost:8080/api/learn/answer/downvote'
         datas.splice(datas.indexOf(id+""),1)
     }else{
         url='http://localhost:8080/api/learn/answer/upvote'
         datas.push(id+"");
     }
      try {
        let response = await axios.post(url,{id:id});
        if(response.status===200){
         try {
            localStorage.setItem("data",JSON.stringify(datas));
            response = await loadData(questionId);
            setQuestion(response.question);
            setList(response.answers);
          } catch (err) {
            console.log(err);
          }
        }
      } catch (error) {
        throw new Error('Failed to submit data from the endpoint');
      }
    }
    async function remove(e){
        if(!window.confirm("Are you sure delete this answer?")){
            return;
        }
        const id=e.target.dataset.id;
        try {
            let response = await axios.get('http://localhost:8080/api/learn/answer/del-'+id);
            if(response.status===200){
            try {
                response = await loadData(questionId);
                setList(response.answers);
            } catch (err) {
                console.log(err);
            }
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <RouteNav/>
            <div className="lc_main">
                <div className="cc_text">{question.content}</div>
                <div className="text_r">
                    <span>{question.createTime}</span>
                </div>
                <div className="form-group">
                    <label htmlFor="question">Answer</label>
                    <textarea name="content" rows="5" cols="50" id="question" value={content} onChange={handleChange}
                              className="form-control" placeholder="Please enter your answer"></textarea>
                </div>
                <div className="pull-right">
                    <button type="button" className="btn btn-primary" onClick={submit}>Add Answer</button>
                </div>
                <div className="new_list clearfix">
                    {list.map((item, index) => (
                        <div key={index}>
                            <input type="button" value="Delete" data-id={item.id} onClick={remove}/>
                            <div className="panel panel-info">
                                <div className="panel-body">{item.content}</div>
                                <div className="text_r m10">
                                    <span className="ml50 text-danger">
                                        {item.upVote}&nbsp;<span className="glyphicon glyphicon-thumbs-up"
                                                                 aria-hidden="true" data-id={item.id}
                                                                 onClick={up}></span>
                                    </span>
                                    <span className="ml50">{item.createTime}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Question
