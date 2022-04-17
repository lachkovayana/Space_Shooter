import arrUp from '../content/controls/ArrowUp.png'
import arrRight from '../content/controls/ArrowRight.png'
import arrDown from '../content/controls/ArrowDown.png'
import arrLeft from '../content/controls/ArrowLeft.png'
import { ArrowButton, Panel } from './styles'

export default function ArrowPanel(props) {



    return (<Panel>
        <ArrowButton onClick={() => props.move("up")}>
            <img src={arrUp} alt='up' style={{ height: '45px' }} />
        </ArrowButton>
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '10px',
                marginBottom: '10px'
            }}
        >
            <ArrowButton onClick={() => props.move("left")}>
                <img src={arrLeft} alt='left' style={{ height: '45px' }} />
            </ArrowButton>
            <ArrowButton onClick={props.shoot} style={{ fontSize: '14px', borderRadius: '50%' }}>
                shoot
            </ArrowButton>
            <ArrowButton onClick={() => props.move("right")}>
                <img src={arrRight} alt='right' style={{ height: '45px' }} />
            </ArrowButton>
        </div>
        <ArrowButton onClick={() => props.move("down")}>
            <img src={arrDown} alt='down' style={{ height: '45px' }} />
        </ArrowButton>
    </Panel>)
}