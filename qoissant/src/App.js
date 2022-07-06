import logo from './logo.svg';
import './App.css';
import { useState } from 'react'

function App() {
  const [questionText, setQuestionText] = useState('');
  const [tagQuery, setTagQuery] = useState('');
  const [textQuery, setTextQuery] = useState('');
  const [fetchedTags, setFetchedTags] = useState('');
  const [fetchedAnswers, setFetchedAnswers] = useState([]);
  const [postedQuestion, setPostedQuestion] = useState('');
  const [postedQuestionId, setPostedQuestionId] = useState('');

  const fetchAnswers = (queryString) => {
    fetch(`https://yxtjaw62u7.execute-api.us-east-1.amazonaws.com/dev/answers?${queryString}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    }).then(res => res.json()).then((result) => {
        setFetchedTags(result.searched_tags);
        setFetchedAnswers(result.posts);
      },
      () => {
        setFetchedTags('');
        setFetchedAnswers(['Uh oh, there was a problem fetching questions :(']);
      }
    );
  }

  const postQuestion = () => {
    fetch(`https://yxtjaw62u7.execute-api.us-east-1.amazonaws.com/dev/questions?query=${questionText}`, {
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

  const handleTagQueryChange = (event) => {
    setTagQuery(event.target.value);
  }

  const handleTextQueryChange = (event) => {
    setTextQuery(event.target.value);
  }

  const handlePostQuestion = (event) => {
    postQuestion();
    event.preventDefault();
  }

  const handleFindAnswers = (event) => {
    fetchAnswers(`query=${tagQuery}`);
    event.preventDefault();
  }

  const handleFindAnswersBySentence = (event) => {
    fetchAnswers(`text=${textQuery}`);
    event.preventDefault();
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          A website for questions and answers.
        </p>
      </header>
      <h3>Post a question</h3>
      <form onSubmit={handlePostQuestion}>
        <label>
          Your question:&nbsp;
          <input type="text" value={questionText} onChange={handleQuestionTextChange} />
        </label>
        <input type="submit" value="Post Question" />
      </form>
      <h3>-OR- Search for a post tag (ie, "python")</h3>
      <form onSubmit={handleFindAnswers}>
        <label>
          Search by tag:&nbsp;
          <input type="text" value={tagQuery} onChange={handleTagQueryChange} />
        </label>
        <input type="submit" value="Find Answers" />
      </form>
      <h3>-OR- Search by typing a phrase (ie, "show me posts about python and api-design")</h3>
      <form onSubmit={handleFindAnswersBySentence}>
        <label>
          Search by phrase:&nbsp;
          <input type="text" value={textQuery} onChange={handleTextQueryChange} />
        </label>
        <input type="submit" value="Find Answers" />
      </form>
      <div>
        <h2>
          {fetchedTags && `Answers related to ${fetchedTags.join(', ')}:`}
        </h2>
        <h3>
          {fetchedTags && 'These results were sent to the email address registered with Qoissant'}
        </h3>
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
