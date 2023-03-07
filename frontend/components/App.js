import React, { useEffect, useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner';
import axios from 'axios';

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { /* ✨ implement */ 
  navigate("/");
}
  const redirectToArticles = () => { /* ✨ implement */ 
  navigate("/articles");
}

  const logout = () => {
    const token = localStorage.getItem('token');
    // ✨ implement
    if(token){
      localStorage.removeItem("token");
      setMessage("Goodbye!")
    }
    redirectToLogin();
  }

  const login = ({ username, password }) => {
    // ✨ implement
    //setMessage("Here are your articles, " + `${username}!`);
    setSpinnerOn(true);
    //setMessage('');
    axios.post(loginUrl, {username, password})
    .then(res => {
      redirectToArticles();
      localStorage.setItem("token", res.data.token);
      setMessage("Here are your articles, " + `${username}` + "!")
    })
    .catch(err => {
      console.log(err);
    })
    setTimeout(() => {
      setSpinnerOn(false)
    }, 1000);
  }

  const getArticles = () => {
    // ✨ implement
    const token = localStorage.getItem('token');
    //setMessage("");
    setSpinnerOn(true);
    axios.get(articlesUrl, {headers: {
      authorization: token
    }})
    .then(res => {
      console.log(res.data);
      setArticles(res.data.articles);
    })
    setTimeout(() => {
      setSpinnerOn(false);
    }, 2000)
  }

  const postArticle = article => {
    // ✨ implement
    const token = localStorage.getItem('token');
    setMessage("");
    setSpinnerOn(true);
    console.log(token);
    axios.post(articlesUrl, article, {headers: {
      authorization: token
    }})
    .then(res => {
      console.log(res.data.message);
      getArticles();
      setMessage(res.data.message);
    })
    setTimeout(() => {
      setSpinnerOn(false);
    }, 1000)
  }

  const updateArticle = (details) => {
    // ✨ implement
    const token = localStorage.getItem('token');
    const { values } = details;
    const params = {
      title: values.title,
      text: values.text,
      topic: values.topic
    }
    setSpinnerOn(true);
    axios.put("http://localhost:9000/api/articles" + `/${values.article_id}`, params, {headers : {
      authorization: token
    }})
    .then(res => {
      console.log(res.data);
      setMessage(res.data.message);
      getArticles();
    })
    // You got this!
    setTimeout(() => {
      setSpinnerOn(false);
      setCurrentArticleId();
    }, 1000)
    }

  const deleteArticle = article_id => {
    // ✨ implement
    const token = localStorage.getItem('token');
    setSpinnerOn(true);
    console.log(article_id);
    console.log(articlesUrl)
    axios.delete("http://localhost:9000/api/articles" + `/${article_id}`, {headers: {
      authorization: token
    }})
    .then(res => {
      console.log(res);
      setMessage(res.data.message)
      getArticles();
    })
    .catch(err => {
      console.log(err);
    })
    setTimeout(() => {
      setSpinnerOn(false)
      setCurrentArticleId();
    }, 1000)
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm currentArticleId={currentArticleId} postArticle={postArticle} updateArticle={updateArticle} setCurrentArticleId={setCurrentArticleId} articles={articles}/>
              <Articles deleteArticle={deleteArticle} articles={articles} getArticles={getArticles} setCurrentArticleId={setCurrentArticleId} currentArticleId={currentArticleId}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
