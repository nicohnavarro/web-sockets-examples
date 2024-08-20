import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";
import { Input } from "./components/input";

function App() {
  const [score, setScore] = useState({});
  const [playerScores, setPlayerScores] = useState([]);

  const socket = io("localhost:3000");

  function connectSocket() {
    // socket.on("connection", (socket) => {
    //   console.log(socket);
    // });
  }

  function handleInput(event) {
    let { name, value } = event.target;
    let currentObj = { [name]: value };
    setScore((prev) => ({ ...prev, ...currentObj }));
  }

  function sendScore() {
    socket.emit("score", score);
    socket.on("playerScores", (scores) => {
      setPlayerScores(scores);
    });
  }

  useEffect(() => {
    connectSocket();
  }, []);

  return (
    <div>
      <h1>React Multiplayer Dashboard</h1>
      <Input
        name="name"
        handleInput={handleInput}
        placeholder="Enter your Name"
      />
      <Input
        name="score"
        handleInput={handleInput}
        placeholder="Enter your Score"
      />

      <button onClick={sendScore} className="send-scores">
        Publish Score
      </button>
      {playerScores.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {playerScores.map((player) => (
              <tr key={player.id}>
                <td>{player.name}</td>
                <td>{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
