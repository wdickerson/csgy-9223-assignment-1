import logo from './logo.svg';
import './App.css';
import { useState } from 'react'

function App() {
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [message, setMessage] = useState('');

  const fetchAnswers = () => {
    fetch('https://yxtjaw62u7.execute-api.us-east-1.amazonaws.com/dev/answers?query=croissant', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    }).then(res => res.json()).then((result) => {
        setMessage(result.text);
      },
      () => {
        setMessage('Uh oh, there was a problem fetching questions :(');
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
    fetchAnswers();
    event.preventDefault();
  }

  const handleFindAnswers = (event) => {
    fetchAnswers();
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
      <form onSubmit={handleFindAnswers}>
        <label>
          Answer:
          <input type="text" value={answerText} onChange={handleAnswerTextChange} />
        </label>
        <input type="submit" value="Find Answers" />
      </form>
      <p>
        Post a question or search for answers above.
      </p>
      <p>
        {message}
      </p>
    </div>
  );
}

export default App;
