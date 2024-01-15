function Counter({ num }) {
  return <div id="counter">count: {num}</div>;
}

function Container() {
  return (
    <div>
      container
      <Counter num={10} />
      <Counter num={20} />
    </div>
  );
}

const App = () => {
  return (
    <div id="1">
      <div id="2">hi</div>
      <Container />
      <Container />
      <Container />
      <div id="3">
        <div id="4" />
        <div id="5">
          mini-react
          <div id="6">is good</div>
        </div>
      </div>
      <div id="7">hahaha</div>
      <div>
        <div>
          <div>
            <div>
              <div>
                <div>nested</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="9" />
    </div>
  );
};

export default App;
