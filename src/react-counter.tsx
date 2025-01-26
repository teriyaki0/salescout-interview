import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  const increase = () => setCount((prevCount) => prevCount + 1);
  const decrease = () => setCount((prevCount) => prevCount - 1);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Counter: {count}</h1>
      <button
        onClick={increase}
        style={{ marginRight: "10px", padding: "10px 20px" }}
      >
        Increase
      </button>
      <button onClick={decrease} style={{ padding: "10px 20px" }}>
        Decrease
      </button>
    </div>
  );
}

export default Counter;
