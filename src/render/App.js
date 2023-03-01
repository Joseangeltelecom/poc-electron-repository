import "./App.css";

function App({ authenticated }) {
  return (
    <div className="App">
      {authenticated ? (
        <p>Estoy authenticated</p>
      ) : (
        <p>No estoy authenticated</p>
      )}
    </div>

    // <div className="App">
    //   <p>Hello world</p>
    // </div>
  );
}

export default App;
