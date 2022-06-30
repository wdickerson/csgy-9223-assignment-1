import logo from './logo.svg';
import './App.css';
import { useState } from 'react'

function App() {
  const [questionText, setQuestionText] = useState('');
  const [queryText, setQueryText] = useState('');
  const [fetchedQuery, setFetchedQuery] = useState('');
  const [fetchedAnswers, setFetchedAnswers] = useState([]);
  const [postedQuestion, setPostedQuestion] = useState('');
  const [postedQuestionId, setPostedQuestionId] = useState('');

  const fetchAnswers = () => {
    fetch(`https://yxtjaw62u7.execute-api.us-east-1.amazonaws.com/dev/answers?query=${queryText}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    }).then(res => res.json()).then((result) => {
        setFetchedQuery(queryText);
        setFetchedAnswers(result.posts);
      },
      () => {
        setFetchedQuery('');
        setFetchedAnswers(['Uh oh, there was a problem fetching questions :(']);
      }
    );
  }

  const postQuestion = () => {
    fetch(`https://yxtjaw62u7.execute-api.us-east-1.amazonaws.com/dev/questions?query=${queryText}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: JSON.stringify({ post: questionText })
    }).then(res => res.json()).then((result) => {
        setPostedQuestion(result.post);
        setPostedQuestionId(result.id);
      },
      () => {
        setPostedQuestion('There was a problem posting your question');
        setPostedQuestionId('');
      }
    );
  }

  const handleQuestionTextChange = (event) => {
    setQuestionText(event.target.value);
  }

  const handleQueryTextChange = (event) => {
    setQueryText(event.target.value);
  }

  const handlePostQuestion = (event) => {
    postQuestion();
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
          Post a question:
          <input type="text" value={questionText} onChange={handleQuestionTextChange} />
        </label>
        <input type="submit" value="Post Question" />
      </form>
      <form onSubmit={handleFindAnswers}>
        <label>
          Search for answers:
          <input type="text" value={queryText} onChange={handleQueryTextChange} />
        </label>
        <input type="submit" value="Find Answers" />
      </form>
      <p>
        Post a question or search for answers above.
      </p>
      <div>
        {fetchedQuery && `Answers related to ${fetchedQuery}:`}
        {
          fetchedAnswers.map(answer => {
            return <p key={answer.id}>{answer.text}</p>;
          })
        }
      </div>
      <div>
        <p>
          {postedQuestion && `You posted this question: ${postedQuestion}`}
        </p>
        <p>
          {postedQuestionId && `(Post ID: ${postedQuestionId})`}
        </p>
      </div>
    </div>
  );
}

export default App;
