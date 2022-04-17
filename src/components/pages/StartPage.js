import PageHeader from '../PageHeader'
import { BlurBG, LevelAndBtn, StartButton, Level } from '../styles'
import { Link } from 'react-router-dom'
import { useRef } from 'react';
import { useEffect } from 'react/cjs/react.development';

export default function StartPage() {
  useEffect(() => {
    localStorage.clear();
    localStorage.setItem("score", 0);
    localStorage.setItem("hp", 100);
    localStorage.setItem("coefficient", 1);
    localStorage.setItem("level", 1);
  }, [])

  let levelRef = useRef();

  return (
    <div>
      <PageHeader />
      <BlurBG />
      <LevelAndBtn>
        <form style={{ display: "flex", flexDirection: "column" }}>
          <Link to='/gamePage' >
            <StartButton onClick={() => { localStorage.setItem("level", parseInt(levelRef.current.value)); }}>Start!</StartButton>
          </Link>

          <Level ref={levelRef}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </Level>
        </form>
      </LevelAndBtn>
    </div>
  )
}
