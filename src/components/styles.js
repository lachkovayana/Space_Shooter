import styled, { keyframes } from 'styled-components'
import bg from '../content/Game_Field_Background.png'

export const Header = styled.header`
  background: #241400;
  color: #f0a03f;
  height: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: default;
  padding: 0 25px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2;
`
export const HeaderIMG = styled.img`
  margin-right: 15px;
  height: 20px;
  width: 20px;
`
export const HeaderParagraph = styled.p`
  font-size: 14px;
  font-family: 'Courier New', Courier, monospace;
  font-weight: 600;
  margin:0;
`

export const StartButton = styled.button`
    // position: absolute;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%, -50%);
    cursor: pointer;
    color: #f0a03f;
    background-color: #241400;
    font-size: 20px;
    font-family: Courier New, Courier, monospace;
    font-weight: 600;
    border-radius: 12px;
    padding: 7px 15px;
    border: 3px solid #f0a03f;
`

export const LevelAndBtn = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

export const Opt = styled.option`

`
export const Level = styled.select`
margin: 30px 0 0 0;
  background-color: transparent; 
  border: 3px solid #f0a03f;
  border-radius: 12px;
  padding: 7px 10px;
  color: #f0a03f
`

export const BlurBG = styled.div`
    filter: blur(3px);
    display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(${bg})
`

export const Panel = styled.div`
  width: 27%;
  min-height: 100%;
  background-color: #044972;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media (max-width: 800px) {
    width: 100%;
    min-height: fit-content;
    height: max-content;
    flex-direction: row;
  }
`

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: row;
  
  @media (max-width: 800px) {
    flex-direction: column;
  }
`

export const ArrowButton = styled.button`
  background-color: #241400;
  color: #ffab44;
  border: 3px solid #f0a03f;
  border-radius: 15px;
  height: 60px;
  width: 60px;
  margin: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform:uppercase;
  font-weight: 600;
  @media (min-width:1000px) {
    height: 80px;
    width: 80px;
    font-size: 8px;
  }
`

export const fadeIn = keyframes`
0% {
  filter: saturate(90%);
}

50% {
  filter: saturate(150%);
}

100% {
  filter:  saturate(90%);
}
`

export const GameArea = styled.div`
  position: relative;
  overflow: hidden;
  background-image: url(${bg});
  margin-top: 30px;
  width: 73%;
  height: calc(100% - 30px);
  background-size: cover;
 // animation: ${fadeIn} 15s ease infinite;
  @media (max-width: 800px) {
    width:100%;
}
`

export const GameOverPanel = styled.div`
  background-color: #241400;
  min-height: fit-content;
  height: 85%;
  width: 600px;
  margin: 20px 0;
  color: #faa742;
  font-family:  Courier New, Courier, monospace;
  padding: 30px 25px;
  border-radius: 15px;
  border: 3px solid #db9948;
  @media (max-width: 850px) {
    width:500px;
  }
  @media (max-width: 600px) {
    width:85%;
  }
`

export const GameOverForm = styled.form`
@media (max-width: 500px) {
  display: flex;
  flex-direction: column;
  align-items: center;
}
`
export const GameOverParagraph = styled.p`
font-weight: 600;
margin-bottom: 20px;
@media (max-width: 500px) {
  text-align: center
}
`
export const GameOverTitle = styled.h1`
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 60px;
  font-weight: 600
`
export const ContinueButton = styled.input`
  background-color: transparent;
  border: 3px solid #db9948;
  border-radius: 12px;
  padding: 7px 10px;
  color: #f0a03f;
  margin: 30px 0;
  
`
export const NameInput = styled.input`
  margin: 0 15px 0 0;
  background-color: transparent; 
  border: 3px solid #f0a03f;
  border-radius: 12px;
  padding: 7px 10px;
  color: #f0a03f
`

export const GameOverWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  height: 100vh;
  min-wight: 350px;
  background-image: url(${bg})
`