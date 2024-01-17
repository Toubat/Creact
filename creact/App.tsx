import { update } from "./core/creact";

let count = 10;
let defaultProps = { style: "color: orange" };
let props: any = {};

function Counter({ num }) {
  const handleClick = () => {
    count++;
    props = count % 2 === 0 ? {} : defaultProps;
    update();
  };

  return (
    <div id="counter">
      <div>parent count: {num}</div>
      <div>my count: {count}</div>
      <button onClick={handleClick} {...props}>
        increment my count
      </button>
    </div>
  );
}

let containerCount = 1;

function Container() {
  const handleClick = () => {
    containerCount++;
    update();
  };

  return (
    <div
      id={`count-${containerCount}`}
      style={containerCount % 2 === 0 ? "color: red" : "color: green"}
    >
      <button onClick={handleClick}>container</button>
      <Counter num={containerCount} />
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
      <div id="9">bottom</div>
    </div>
  );
};

export default App;
