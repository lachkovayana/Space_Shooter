import { CSSTransition } from 'react-transition-group';
import React, { useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom';
import ArrowPanel from '../ArrowPanel'
import PageHeader from '../PageHeader'
import { Wrapper, GameArea } from '../styles'
import img from '../../content/starships/Hero_Ship.png'
import playerShot from '../../content/shots/Hero_Shot.png'
import enemyShotFaster from '../../content/shots/Enemy_Shot_1.png'
import enemyShotUsual from '../../content/shots/Enemy_Shot_2.png'
import enemyShotTwo from '../../content/shots/Enemy_Shot_3.png'
import enemyImg1 from '../../content/starships/Enemy_Ship_1.png'
import enemyImg2 from '../../content/starships/Enemy_Ship_2.png'
import enemyImg3 from '../../content/starships/Enemy_Ship_3.png'
import bonusImg1 from '../../content/bonuses/HP_Bonus.png'
import bonusImg2 from '../../content/bonuses/Hero_Speed_Bonus.png'
import bonusImg3 from '../../content/bonuses/Attack_Speed_Bonus.png'
import bonusImg4 from '../../content/bonuses/Enemy_Speed_Debuff_Bonus.png'
import "../../animation.css"

let bulletSpeed;
let additionalSpeed;
let addEnemyBulletSpeed;
let enemyRenderInterval;
let enemyGenerationInterval;
let enemyShootingInterval;
let bonusGenerationInterval;
let cellWidth = 60;
let cellHeight = 100;
let playerSpeed = 0;
let countOfKilledEnemies = 0;

const directionsForEnemies = {
    DOWN: "down",
    RIGHT: "right",
    LEFT: "left"
}
const directions = {
    UP: "up",
    DOWN: "down",
    RIGHT: "right",
    LEFT: "left"
}
const subjects = {
    PLAYER: "player",
    BULLET: "bullet",
    ENEMY: "enemy",
}
const bonusTypes = {
    HEALTH: "health",
    ENEMIES_SLOW: "enemies_slow",
    PLAYER_SPEED: "player_speed",
    BULLET_SPEED: "bullet_speed",
}

const enemyTypes = {
    //  USUAL: "usual",
    FASTER: "faster",
    USUAL: "moving_only",
    TWO_LIFES: "two_lifes"

}

export default function GamePage() {
    const [state, setState] = useState({
        bullets: [],
        enemies: [],
        bonuses: [],
        enemiesBullets: [],
        currentBonus: {},
        //  deadEnemies: [],
        hero: {
            left: 0, top: 0, wasShot: false
        },
        lives: 2,
        score: 0,
        health: 100,
        gameOver: false,
        coefficient: 1,

    })

    const fieldRef = useRef()
    const playerRef = useRef();
    const idIntervalEnemyGen = useRef();
    const idIntervalEnemyMove = useRef();
    const idIntervalEnemyUpd = useRef();
    const idIntervalBulletUpd = useRef();
    const idIntervalBonusGen = useRef();


    useEffect(() => {
        setState((prevState) => {
            let { hero } = prevState;
            hero = {
                left: (fieldRef.current.clientWidth - cellWidth) / 2,
                top: fieldRef.current.clientHeight - 2 * cellHeight,
                wasShot: false
            };
            let newState = { ...prevState, hero: hero };
            return newState;
        });
        bulletSpeed = 15;
        additionalSpeed = 0;
        bonusGenerationInterval = 10000;
        switch (localStorage.getItem("level")) {
            case "1":
                enemyRenderInterval = 500;
                enemyShootingInterval = 2600;
                enemyGenerationInterval = 1500;
                // addEnemyBulletSpeed = 0;
                break;
            case "2":
                enemyRenderInterval = 430;
                enemyShootingInterval = 2200;
                enemyGenerationInterval = 1000;
                // addEnemyBulletSpeed = 0.1;
                break;
            case "3":
                enemyRenderInterval = 380;
                enemyShootingInterval = 1800;
                enemyGenerationInterval = 800;
                //addEnemyBulletSpeed = 0.5;
                break;
            default:
                break;
        }

        startIntervals();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    useEffect(() => {
        if (state.gameOver) {
            localStorage.setItem("hp", state.health)
            localStorage.setItem("score", state.score)
            localStorage.setItem("coefficient", state.coefficient)
            clearInterval(idIntervalEnemyUpd.current);
            clearInterval(idIntervalEnemyMove.current);
            clearInterval(idIntervalEnemyGen.current);
            clearInterval(idIntervalBulletUpd.current);
            clearInterval(idIntervalBonusGen.current);
            console.log("gameOver", state.health, state.lives);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.gameOver])

    useEffect(() => {
        if (state)
            if (state.score > 0 && countOfKilledEnemies % 10 === 0) {
                additionalSpeed += 0.5;
                enemyRenderInterval -= enemyRenderInterval >= 200 ? 20 : 0;
                enemyShootingInterval -= enemyShootingInterval >= 250 ? 50 : 0;
                setState((prevState) => { return { ...prevState, coefficient: prevState.coefficient + 1 } })
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.score])

    function startIntervals() {
        idIntervalEnemyGen.current = setInterval(() => {
            // removeDeadEnemy();
            generateEnemies();
        }, enemyGenerationInterval)

        idIntervalBulletUpd.current = setInterval(() => {
            updateEnemiesBullets();
            updatePlayerBullets();
        }, bulletSpeed)

        idIntervalBonusGen.current = setInterval(() => {
            generateBonus();
        }, bonusGenerationInterval)

        idIntervalEnemyUpd.current = setInterval(() => {
            randomMoveEnemies();
        }, enemyRenderInterval)
        setInterval(() => {
            randomShootEnemies();
        }, enemyShootingInterval)
        moveBonuses();
    }


    // ------------------------------------------< bonuses > ------------------------------------

    const generateBonus = () => {
        setState((prevState) => {
            let x = getRandomInt(fieldRef.current.clientWidth - cellWidth);
            let y = -cellHeight;
            let type = getRandomElem(bonusTypes)
            let { bonuses } = prevState;
            let newBonus = { left: x, top: y, type: type, alive: true };
            bonuses.push(newBonus)
            return ({ ...prevState, bonuses: bonuses })
        })
    }

    function getBonus(type) {
        switch (type) {
            case bonusTypes.HEALTH:
                setState((prev) => {
                    return { ...prev, health: 100, currentBonus: null }
                })
                break;
            case bonusTypes.PLAYER_SPEED:
                playerSpeed += 1;
                setState((prev) => {
                    return { ...prev, currentBonus: { img: bonusImg2, time: Date.now() } }
                })
                setTimeout(() => {
                    playerSpeed -= 1;
                    setState((prev) => {
                        return { ...prev, currentBonus: null }
                    })
                }, 7000)
                break;
            case bonusTypes.BULLET_SPEED:
                bulletSpeed += 15;
                setState((prev) => {
                    return { ...prev, currentBonus: { img: bonusImg3, time: Date.now() } }
                })
                setTimeout(() => {
                    bulletSpeed -= 15;
                    setState((prev) => {
                        return { ...prev, currentBonus: null }
                    })
                }, 7000)
                break;
            case bonusTypes.ENEMIES_SLOW:
                additionalSpeed = -1
                setState((prev) => {
                    return { ...prev, currentBonus: { img: bonusImg4, time: Date.now() } }
                })
                setTimeout(() => {
                    additionalSpeed += 1
                    setState((prev) => {
                        return { ...prev, currentBonus: null }
                    })
                }, 7000)
                break;
            default:
                break;
        }
    }

    function moveBonuses() {
        setInterval(function () {
            setState((prev) => {
                let { bonuses } = prev;
                let { hero } = prev;
                bonuses = bonuses.map((bonus) => {
                    bonus.top += 1;
                    if (bonus.top >= fieldRef.current.clientHeight) {
                        bonus.alive = false;
                    }
                    if (Math.abs(bonus.top - hero.top) < cellWidth &&
                        Math.abs(bonus.left - hero.left) < cellWidth) {
                        getBonus(bonus.type);
                        bonus.alive = false;
                    }
                    return bonus
                })
                bonuses = bonuses.filter((b) => b.alive)
                return { ...prev, bonuses: bonuses }
            })
        }, 20);
    }

    // ------------------------------------------< enemies > ------------------------------------

    const generateEnemies = () => {
        setState((prevState) => {
            let x = getRandomInt(fieldRef.current.clientWidth - cellWidth);

            if (!(prevState.enemies.filter((enemy) =>
                enemy.alive &&
                Math.abs(enemy.left - x) <= cellWidth &&
                enemy.top < cellHeight).length > 0)) {

                let y = -cellHeight;

                let { enemies } = prevState;
                let randType = getRandomElem(enemyTypes)
                let speed = 0.5, livesCount = 1;
                switch (randType) {
                    case enemyTypes.FASTER:
                        speed = 2;
                        break;
                    case enemyTypes.TWO_LIFES:
                        livesCount = 2
                        break;
                    default:
                        speed = 0.5;
                        break;
                }
                enemies.push({ left: x, top: y, alive: true, wasShot: false, type: randType, speed: speed, livesCount: livesCount })
                return { ...prevState, enemies: enemies };
            }
            else {
                return { ...prevState }
            }
        })
    }

    // ------------------------------------------< bullets > ------------------------------------
    const generatePlayerBullets = () => {
        let { bullets } = state;
        bullets.push({ left: state.hero.left + cellWidth / 3, top: state.hero.top, alive: true })
        setState((prevState) => {
            return { ...prevState, bullets: bullets }
        })
    }

    const updatePlayerBullets = () => {
        setState((prevState) => {
            let { enemies } = prevState;
            let { score } = prevState;

            let newBullets = prevState.bullets.map((bullet) => {
                bullet.top -= bulletSpeed;
                enemies = enemies.map((enemy) => {
                    if (Math.abs(bullet.top - enemy.top) < cellHeight &&
                        Math.abs(bullet.left - enemy.left) <= cellWidth && enemy.alive) {
                        if ((enemy.type === enemyTypes.TWO_LIFES && enemy.livesCount === 1) ||
                            enemy.type === enemyTypes.USUAL ||
                            enemy.type === enemyTypes.FASTER) {
                            score += 5 * prevState.coefficient;
                            bullet.alive = false;
                            countOfKilledEnemies++;
                            return { ...enemy, alive: false }
                        }
                        else if (enemy.type === enemyTypes.TWO_LIFES && enemy.livesCount === 2) {
                            score += 5 * prevState.coefficient;
                            bullet.alive = false;
                            return { ...enemy, wasShot: true, livesCount: 1 }
                        }
                    }
                    return enemy
                })
                return bullet
            })

            enemies = enemies.filter((enemy) => enemy.alive)
            let bulletsLeftOnField = newBullets.filter((bullet) => bullet.top > -40 && bullet.alive)
            return { ...prevState, bullets: bulletsLeftOnField, enemies: enemies, score: score };
        })
    }

    function randomShootEnemies() {

        setState((prevState) => {
            let { hero } = prevState;
            let { enemies } = prevState;
            let { enemiesBullets } = prevState;
            enemies.forEach((enemy) => {
                if (enemy.top + 2 * cellHeight < hero.top && enemy.top >= 0 && getRandomInt(10) < 3 && enemy.alive) {
                    let img;
                    switch (enemy.type) {
                        case enemyTypes.FASTER: img = enemyShotFaster; break;
                        case enemyTypes.USUAL: img = enemyShotUsual; break;
                        case enemyTypes.TWO_LIFES: img = enemyShotTwo; break;
                        default: break;
                    }
                    enemiesBullets.push({
                        targetX: hero.left + cellWidth / 2,
                        targetY: hero.top - cellHeight / 2,
                        left: enemy.left + cellWidth / 2,
                        top: enemy.top + cellHeight,
                        image: img,
                        alive: true
                    })
                }
            })
            return { ...prevState, enemiesBullets: enemiesBullets }
        })
    }

    const updateEnemiesBullets = () => {
        setState((prevState) => {
            let { enemiesBullets } = prevState;
            let { health } = prevState;
            let { lives } = prevState;
            let { gameOver } = prevState;
            let { hero } = prevState

            enemiesBullets = enemiesBullets.map((bullet) => {
                var dx = bullet.targetX - bullet.left;
                var dy = bullet.targetY - bullet.top;
                var d = Math.sqrt(dx * dx + dy * dy);
                if (Math.abs(hero.left - bullet.left) <= cellWidth / 2 && Math.abs(hero.top - bullet.top) <= cellHeight) {
                    health -= 10;
                    bullet.alive = false;
                    hero.wasShot = true
                    setTimeout(() => {
                        setState((prev) => {
                            let { hero } = prev;
                            hero.wasShot = false;
                            return { ...prev, hero: hero }
                        })
                    }, 1500)
                }
                else if (d <= 5) {
                    bullet.targetX = bullet.targetX * dx * 100;
                    bullet.targetY = bullet.targetY * dy * 100;
                }
                else {
                    bullet.left += 5 * dx / d;
                    bullet.top += 5 * dy / d;
                }
                return bullet
            })

            enemiesBullets = enemiesBullets.filter((bullet) => (bullet.top < fieldRef.current.clientHeight - 40) && bullet.alive)
            if (health <= 0 && lives >= 1) {
                lives--;
                health = 100;
            }
            if (lives === 0) {
                health = 0;
                gameOver = true;
            }

            return { ...prevState, enemiesBullets: enemiesBullets, health: health, lives: lives, gameOver: gameOver, hero: hero };
        })
    }

    // ------------------------------------------< enemy movement > ------------------------------------

    const randomMoveEnemies = () => {
        setState((prevState) => {
            let { health } = prevState;
            let { gameOver } = prevState;
            let { lives } = prevState;

            let newEnemies = prevState.enemies.map((enemy) => {
                // if (Math.abs(enemy.top - prevState.hero.top) <= cellHeight &&
                //     Math.abs(enemy.left - prevState.hero.left) <= cellWidth && enemy.alive) {
                //     enemy.alive = false;
                //     countOfKilledEnemies++;
                //     health -= 20;
                // }
                if (getRandomInt(10) < 6) {
                    // if (enemy.alive) {
                    // console.log("move");
                    let dir = getRandomElem(directionsForEnemies);

                    switch (dir) {
                        case directionsForEnemies.DOWN:

                            let start = Date.now();
                            let timer = setInterval(() => {
                                let timePassed = Date.now() - start;
                                if (timePassed >= enemyRenderInterval) {
                                    clearInterval(timer);
                                    return;
                                }
                                enemy.top += additionalSpeed + enemy.speed + timePassed / 100;
                            }, 20);

                            break;

                        case directionsForEnemies.LEFT:
                            if (enemy.left >= 50 * additionalSpeed + 50 * enemy.speed + 55 &&
                                prevState.enemies.filter((en) =>
                                    en.alive &&
                                    (enemy.left - en.left <= cellWidth + 25 * additionalSpeed + 25 * enemy.speed + 55) &&
                                    (Math.abs(en.top - enemy.top) < cellHeight) && en.alive).length === 1) {
                                let start = Date.now();
                                let timer = setInterval(() => {
                                    let timePassed = Date.now() - start;
                                    if (timePassed >= enemyRenderInterval) {
                                        clearInterval(timer);
                                        return;
                                    }
                                    enemy.left -= additionalSpeed + enemy.speed + timePassed / 100
                                }, 20);
                            }
                            break;

                        case directionsForEnemies.RIGHT:
                            if (enemy.left < fieldRef.current.clientWidth - 55 - cellWidth - 50 * additionalSpeed - 50 * enemy.speed &&
                                prevState.enemies.filter((en) =>
                                    en.alive &&
                                    en.left - enemy.left <= cellWidth + 25 * additionalSpeed + 25 * enemy.speed + 55 &&
                                    Math.abs(en.top - enemy.top) < cellHeight && en.alive).length === 1) {
                                let start = Date.now();
                                let timer = setInterval(() => {
                                    let timePassed = Date.now() - start;
                                    if (timePassed >= enemyRenderInterval) {
                                        clearInterval(timer);
                                        return;
                                    }
                                    enemy.left += additionalSpeed + enemy.speed + timePassed / 100
                                }, 20);
                            }
                            break;
                        default: break;
                    }
                    // }
                    // else {
                    //     enemy.top += 1000;
                    // }

                    if (Math.abs(enemy.top - prevState.hero.top) <= cellHeight &&
                        Math.abs(enemy.left - prevState.hero.left) <= cellWidth && enemy.alive) {
                        enemy.alive = false;
                        countOfKilledEnemies++;
                        health -= 20;
                    }
                    if (health <= 0 && lives >= 1) {
                        lives--;
                        health = 100;
                    }
                    if (lives === 0 || (enemy.alive && enemy.top >= fieldRef.current.clientHeight - cellHeight)) {
                        health = 0;
                        gameOver = true;
                    }

                    return enemy;
                }
                else {
                    if (Math.abs(enemy.top - prevState.hero.top) <= cellHeight &&
                        Math.abs(enemy.left - prevState.hero.left) <= cellWidth && enemy.alive) {
                        enemy.alive = false;
                        countOfKilledEnemies++;
                        health -= 20;
                    } return enemy
                }
            })



            let aliveEnemies = newEnemies.filter((enemy) =>
                enemy.top < fieldRef.current.clientHeight + cellHeight
                // && enemy.alive
            )
            return { ...prevState, health: health, gameOver: gameOver, enemies: aliveEnemies, lives: lives };
        });
    }

    // ------------------------------------------< player movement > ------------------------------------
    function movePlayer(direction) {
        let start = Date.now();
        let timer = setInterval(function () {
            let timePassed = Date.now() - start;
            if (timePassed >= 500) {
                clearInterval(timer);
                return;
            }
            move(timePassed, direction);
        }, 20);
    }
    function move(timePassed, direction) {
        setState((prevState) => {
            let { hero } = prevState;
            let { left, top } = hero
            switch (direction) {
                case directions.RIGHT:
                    if (left < fieldRef.current.clientWidth - cellWidth) {
                        left += playerSpeed + timePassed / 100;
                    }
                    break;
                case directions.LEFT:
                    if (left > 0)
                        left -= playerSpeed + timePassed / 100;
                    break;
                case directions.UP:
                    if (top > 0)
                        top -= playerSpeed + timePassed / 100;
                    break;
                case directions.DOWN:
                    if (top < fieldRef.current.clientHeight - cellHeight)
                        top += playerSpeed + timePassed / 100;
                    break;
                default:
                    break;
            }

            hero.left = left;
            hero.top = top;

            return { ...prevState, hero: hero }
        })
    }

    // ------------------------------------------< random > ------------------------------------

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    function getRandomElem(elem) {
        let rand = Math.floor(Math.random() * Object.keys(elem).length);
        return elem[Object.keys(elem)[rand]];
    }

    // ------------------------------------------< keyboard > ------------------------------------
    function handleClick(e) {
        if (e.keyCode === 32) {
            generatePlayerBullets();
        }
        if (e.keyCode === 39) {
            movePlayer(directions.RIGHT, subjects.PLAYER);
        }
        if (e.keyCode === 40) {
            movePlayer(directions.DOWN, subjects.PLAYER);
        }
        if (e.keyCode === 38) {
            movePlayer(directions.UP, subjects.PLAYER);
        }
        if (e.keyCode === 37) {
            movePlayer(directions.LEFT, subjects.PLAYER);
        }
    }

    // ------------------------------------------< functions for render > ------------------------------------
    function renderEnemies() {
        return (
            state.enemies.map((enemy) => {
                let source;
                switch (enemy.type) {
                    case enemyTypes.USUAL:
                        source = enemyImg1
                        break;
                    case enemyTypes.FASTER:
                        source = enemyImg2
                        break;
                    case enemyTypes.TWO_LIFES:
                        source = enemyImg3;
                        break;
                    default: break;
                }
                if (enemy.type === enemyTypes.TWO_LIFES && enemy.wasShot && enemy.alive) {
                    return (
                        <CSSTransition in={true} timeout={enemyRenderInterval} classNames="enshot">
                            <img src={source} alt="enemy" style={{ filter: "hue-rotate(150deg)", position: "absolute", left: `${enemy.left}px`, top: `${enemy.top}px`, width: `${cellWidth}px`, height: `${cellHeight}px` }} />
                        </CSSTransition>)
                }
                else {
                    return (
                        <CSSTransition in={!(enemy.alive)} timeout={enemyRenderInterval * 10} classNames="fade">
                            <img src={source} alt="enemy" style={{ position: "absolute", left: `${enemy.left}px`, top: `${enemy.top}px`, width: `${cellWidth}px`, height: `${cellHeight}px` }} />
                        </CSSTransition>
                    )
                }
            })
        )
    }

    function renderBonuses() {
        return (
            state.bonuses.map((bonus) => {
                let source;
                switch (bonus.type) {
                    case bonusTypes.HEALTH:
                        source = bonusImg1;
                        break;
                    case bonusTypes.PLAYER_SPEED:
                        source = bonusImg2;
                        break;
                    case bonusTypes.BULLET_SPEED:
                        source = bonusImg3;
                        break;
                    case bonusTypes.ENEMIES_SLOW:
                        source = bonusImg4;
                        break;
                    default:
                        break;
                }

                return (
                    <img src={source} alt="bonus" style={{ position: "absolute", left: `${bonus.left}px`, top: `${bonus.top}px`, width: `${cellWidth}px`, height: `${cellWidth}px` }} />
                )
            })
        )
    }

    function renderPlayerBullets() {
        return (
            state.bullets.map((bullet) => {
                return (
                    <img src={playerShot} alt="bullet" style={{ position: "absolute", left: `${bullet.left}px`, top: `${bullet.top}px`, width: "20px", height: "40px" }} />
                )
            })
        )
    }

    function renderEnemiesBullets() {
        return (
            state.enemiesBullets.map((bullet) => {
                return (
                    <img src={bullet.image} alt="bullet" style={{ position: "absolute", left: `${bullet.left}px`, top: `${bullet.top}px`, width: "20px", height: "40px" }} />
                )
            })
        )
    }

    // ------------------------------------------< main render > ------------------------------------

    if (state.gameOver) {
        return <Navigate to="/gameOver" />
    } else {
        return (
            <CSSTransition in={state.hero.wasShot} timeout={300} classNames="shot">
                <div style={{ height: "100vh" }}>
                    <PageHeader info={{
                        score: state.score, hp: state.health,
                        coefficient: state.coefficient, bonus: state.currentBonus, lives: state.lives
                    }} />
                    <Wrapper>
                        <GameArea style={{ zIndex: "1" }} ref={fieldRef} onKeyDown={handleClick} tabIndex="0">
                            {renderEnemies()}
                            {renderPlayerBullets()}
                            {renderEnemiesBullets()}
                            {renderBonuses()}
                            <img src={img} alt="player" ref={playerRef}
                                style={{
                                    left: state.hero.left, top: state.hero.top,
                                    position: "absolute", width: cellWidth, height: cellHeight
                                }} />
                        </GameArea >
                        <ArrowPanel shoot={generatePlayerBullets} move={movePlayer} />
                    </Wrapper >
                </div >
            </CSSTransition>
        )
    }
}