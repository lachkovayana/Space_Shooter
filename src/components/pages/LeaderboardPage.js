import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { GameOverWrapper, GameOverPanel, GameOverTitle, StartButton } from '../styles';
import PageHeader from '../PageHeader'

export default function LeaderboardPage() {

    const [leaders] = useState([
        {
            name: "Tom",
            score: 1000
        },
        {
            name: "Jane",
            score: 1545
        },
        {
            name: "Robert",
            score: 15
        },
        {
            name: "Nick",
            score: 760
        }
    ])
    // useEffect(() => {
    //     setLeaders((prevState) => {
    // let newLeadersArray = leaders;
    // newLeadersArray.push({ name: localStorage.getItem("playerName"), score: localStorage.getItem("score") })
    // newLeadersArray.sort((a, b) => a.score > b.score ? -1 : 1);
    //         return newLeadersArray
    //     })
    // }, [])

    function renderLeaders() {
        let newLeadersArray = leaders;
        newLeadersArray.push({ name: localStorage.getItem("playerName"), score: localStorage.getItem("score") })
        newLeadersArray.sort((a, b) => a.score > b.score ? -1 : 1);
        return (
            <ol style={{ width: "100%", fontWeight: "600" }}>
                {leaders.map((leader) =>
                    <li>
                        <p style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>{leader.name}</span>
                            <span>{leader.score}</span>
                        </p>
                    </li>
                )}
            </ol>
        )
    }

    return (
        <GameOverWrapper>
            <PageHeader />
            <GameOverPanel style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center"
            }}>
                <GameOverTitle>
                    LeaderBoard
                </GameOverTitle>
                {renderLeaders()}
                <Link to='/startPage'>
                    <StartButton style={{ position: "relative" }}>Play again</StartButton>
                </Link>
            </GameOverPanel>
        </GameOverWrapper >
    )
}