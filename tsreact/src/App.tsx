import a from './analytics'

function App() {
  return (
    <>
      <h1>analytics-lambda/react</h1>
      <button onClick={() => a({ name: 'button_click' })}>Click me!</button>
    </>
  );
}

export default App;
