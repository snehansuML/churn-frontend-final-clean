import React, { useState, useEffect } from "react";

export default function ExampleComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Component mounted or count changed:", count);
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add</button>
    </div>
  );
}
