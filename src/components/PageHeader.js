import { useState, useEffect } from 'react'
import logo from '../content/HITS_Logo.png'
import playerImg from '../content/starships/Hero_Ship.png'
import { Header, HeaderParagraph, HeaderIMG } from './styles'

export default function PageHeader(props) {
  const [info, setInfo] = useState({
    score: 0,
    hp: 100,
    coefficient: 1,
  })

  useEffect(() => {
    if (typeof (props.info) !== 'undefined') {
      setInfo(props.info)
    }
    if (typeof (props.info) === 'undefined' &&
      (localStorage.score !== info.score || localStorage.hp !== info.hp)) {
      setInfo({ score: localStorage.score, hp: localStorage.hp, coefficient: localStorage.coefficient })
    }
  }, [props, info])

  const renderBonuses = () => {
    let livesCount = typeof (props.info) === 'undefined' ? 0 : props.info.lives;
    if (typeof (props.info) !== 'undefined' && props.info.bonus && props.info.bonus.img) {
      let lives = [];
      for (let i = 0; i < livesCount; i++) {
        lives.push(<HeaderIMG src={playerImg} style={{ height: "25px", width: "25px" }} alt="bonus" />);
      }
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <HeaderIMG src={props.info.bonus.img} style={{ height: "25px", width: "25px" }} alt="bonus" />
          <span style={{ marginRight: "15px" }}>{7000 - (Date.now() - props.info.bonus.time)} ms</span>
          {lives}
        </div>
      )
    }
    else {
      let lives = [];
      for (let i = 0; i < livesCount; i++) {
        lives.push(<HeaderIMG src={playerImg} style={{ height: "25px", width: "25px" }} alt="bonus" />);
      }
      return (<div>
        {lives}
      </div>)
    }
  }


  return (
    <Header>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <HeaderIMG src={logo} alt='logo' />
        <HeaderParagraph>
          HP:
          <span id='HP' style={{ marginRight: '10px' }}>{info.hp}</span>
          Score:
          <span id='score' style={{ marginRight: '10px' }}>{info.score}</span>
          Coefficient:
          <span id='coefficient' style={{ marginLeft: '4px' }}>x{info.coefficient}</span>
        </HeaderParagraph>
      </div>
      {renderBonuses()}

    </Header>
  )
}
