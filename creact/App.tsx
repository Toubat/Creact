let count = 10;
function Counter({ num }) {
  const handleClick = () => {
    count++;
    console.log(count);
  };

  return (
    <div id="counter">
      count: {num}
      <button onClick={handleClick}>click</button>
    </div>
  );
}

function Container() {
  return (
    <div>
      container
      <Counter num={10} />
    </div>
  );
}

const App = () => {
  return (
    <div id="1">
      <div id="2">hi</div>
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
