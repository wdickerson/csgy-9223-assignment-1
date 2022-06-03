import logo from './logo.svg';
import './App.css';
import { useState } from 'react'

function App() {
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [message, setMessage] = useState('');

  const fetchJoke = () => {
    fetch('https://icanhazdadjoke.com/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    }).then(res => res.json()).then((result) => {
        setMessage(result.joke);
      },
      () => {
        setMessage('Uh oh, there was a problem fetching a joke :(');
      }
    );
  }

  const handleQuestionTextChange = (event) => {
    setQuestionText(event.target.value);
  }
  const handleAnswerTextChange = (event) => {
    setAnswerText(event.target.value);
  }

  const handlePostQuestion = (event) => {
    fetchJoke();
    event.preventDefault();
  }

  const handleShowAnswers = (event) => {
    fetchJoke();
    event.preventDefault();
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          A webiste for questions and answers.
        </p>
      </header>
      <form onSubmit={handlePostQuestion}>
        <label>
          Question:
          <input type="text" value={questionText} onChange={handleQuestionTextChange} />
        </label>
        <input type="submit" value="Post Question" />
      </form>
      <form onSubmit={handleShowAnswers}>
        <label>
          Answer:
          <input type="text" value={answerText} onChange={handleAnswerTextChange} />
        </label>
        <input type="submit" value="Show Answers" />
      </form>
      <p>
        Question/answer functionality coming soon. For now, click either button to enjoy a joke.
      </p>
      <p>
        {message}
      </p>
    </div>
  );
}

export default App;
