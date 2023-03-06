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
    setMessage("");
    axios.post(loginUrl, {username, password})
    .then(res => {
      console.log(res.data.token)
      localStorage.setItem("token", res.data.token)
      setMessage(res.data.message)
      redirectToArticles();
    })
    .catch(err => {
      console.log(err);
    })
  }

  const getArticles = () => {
    // ✨ implement
    const token = localStorage.getItem('token');
    setMessage("");
    setSpinnerOn(true);
    axios.get(articlesUrl, {headers: {
      authorization: token
    }})
    .then(res => {
      console.log(res.data);
      setMessage(res.data.message);
      setArticles(res.data.articles);
    })
    setTimeout(() => {
      setSpinnerOn(false);
    }, 3000)
  }

  const postArticle = article => {
    // ✨ implement
    const token = localStorage.getItem('token');
    setMessage("");
    setSpinnerOn(true);
    axios.post(articlesUrl, article, {headers: {
      authorization: token
    }})
    .then(res => {
      console.log(res.data);
      getArticles();
      setMessage(res.data.message);
    })
    setTimeout(() => {
      setSpinnerOn(false);
    }, 1000)
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    const token = localStorage.getItem('token');
    setSpinnerOn(true);
    axios.post(articlesUrl, article_id, article, {headers : {
      authorization: token
    }})
    .then(res => {
      console.log(res.data);
      setMessage(res.data.message);
      getArticles();
    })
    // You got this!
    setTimeout(() => {
      setSpinnerOn(false)
    }, 1000)
  }

  const deleteArticle = article_id => {
    // ✨ implement
    const token = localStorage.getItem('token');
    setSpinnerOn(true);
    axios.delete(articlesUrl, article_id, {headers: {
      authorization: token
    }})
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    })
    setTimeout(() => {
      setSpinnerOn(false)
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
              <Articles deleteArticle={deleteArticle} articles={articles} getArticles={getArticles} setCurrentArticleId={setCurrentArticleId}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
