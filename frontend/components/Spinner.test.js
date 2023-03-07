// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react';
import App from "./App"
import { render, fireEvent, screen } from '@testing-library/react';
import { Browser } from 'bonjour-service';
import { BrowserRouter } from 'react-router-dom';
import Spinner from './Spinner';
import '@testing-library/jest-dom/extend-expect';



const token = () => window.localStorage.getItem('token')
const logoutBtn = () => screen.queryByText('Logout from app')
// login screen
const usernameInput = () => screen.queryByPlaceholderText('Enter username')
const passwordInput = () => screen.queryByPlaceholderText('Enter password')
const loginBtn = () => screen.queryByText('Submit credentials')
// articles screen
const articlesLink = () => screen.queryByRole('link', { name: 'Articles' })
const titleInput = () => screen.queryByPlaceholderText('Enter title')
const textInput = () => screen.queryByPlaceholderText('Enter text')
const topicSelect = () => screen.queryByRole('combobox')
const submitArticleBtn = () => screen.queryByText('Submit')



beforeEach(() => {
  render(<BrowserRouter> <App/> </BrowserRouter>);
})


describe('Advanced Applications', () => {
  describe('Login', () => {
    test(`[1] Submit credentials button is disabled until
        - username (after trimming) is at least 3 chars AND
        - password (after trimming) is at least 8 chars
        - Review how to conditionally disable a button element.`, () => {
      expect(loginBtn()).toBeDisabled()
      fireEvent.change(usernameInput(), { target: { value: ' 12 ' } })
      fireEvent.change(passwordInput(), { target: { value: ' 1234567 ' } })
      expect(loginBtn()).toBeDisabled()
      fireEvent.change(usernameInput(), { target: { value: ' 123 ' } })
      fireEvent.change(passwordInput(), { target: { value: ' 12345678 ' } })
      expect(loginBtn()).toBeEnabled()
        })
      })
    })
