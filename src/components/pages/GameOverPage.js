import PageHeader from '../PageHeader'
import { useState } from 'react'
import { NameInput, GameOverWrapper, GameOverPanel, GameOverTitle, ContinueButton, GameOverForm, GameOverParagraph } from '../styles';
import { Navigate } from 'react-router-dom';


export default function GameOverPage() {

  const [info, setInfo] = useState({
    name: "",
    errorText: "",
    complete: false
  })

  function submit() {
    if (info.name !== null && info.name !== "") {
      localStorage.setItem('playerName', info.name);
      setInfo((prevState) => {
        return {
          ...prevState,
          complete: true
        }
      });
    }
  }

  if (info.complete) {
    return <Navigate to="/leaderboard" />
  }
  else {
    return (
      <GameOverWrapper>
        <PageHeader />
        <GameOverPanel>
          <GameOverTitle>
            game over
          </GameOverTitle>
          <GameOverParagraph>
            Congratulations! You scored {localStorage.score} points and got to the leaderboard!
          </GameOverParagraph>
          <GameOverForm >
            <label style={{ fontWeight: "600" }}>Type your name in to continue:</label>
            <br />
            <NameInput
              errorText={info.errorText}
              onChange={(event) => { setInfo({ name: event.target.value.trim() }) }} />
            <ContinueButton type="button" value="Continue" onClick={() => submit()} />

          </GameOverForm>
        </GameOverPanel>
      </GameOverWrapper>
    )
  }
}
