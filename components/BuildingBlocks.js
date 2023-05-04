import next from 'next';
import { stringify } from 'querystring';
import React, { useEffect, useState, useRef } from 'react';
import ReactFlow, { useNodesState, useEdgesState } from 'reactflow';
import Draggable from "react-draggable"
import CollisionDetectionFlow from './SentenceBuilder';
import styles from './dragstyle.module.css'
import { IncomingMessage } from 'http';

function BuildingBlocks(props) {
    console.log(props.onNew)
    //console.log(props.userEmail)
    const [data, setData] = useState({ sentence: [], nodes: [], word: "", words: [] })
    const [english, setEnglish] = useState("")
    const [nextQuestion, setNextQuestion] = useState(true);
    const [checkForNext, setCheckForNext] = useState(true);
    const [correctAnswer, setCorrectAnswer] = useState(false);
    const [incorrectAnswer, setIncorrectAnswer] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [success, setSuccess] = useState(false);
    const [nodesSet, setNodesSet] = useState(false);
    const [nodes, setNodes] = useState([]);

    // UseEffect with empty dependency array runs once to prompt a question to the user upon call
    useEffect(() => {
        console.log("I am inside the useEffect function in building blocks")
        fetch(`http://127.0.0.1:5000/builder/${props.userEmail}`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setData(data)
                const englishSentence = data.sentence[0].english
                console.log(data.nodes)
                console.log(englishSentence)
                setEnglish(englishSentence);
                //console.log(data.words)
                const nodesData = data.nodes.map((nodeData) => ({
                    id: nodeData.id,
                    type: nodeData.type,
                    data: nodeData.data,
                    position: nodeData.position,
                    height: nodeData.height,
                    width: nodeData.width
                }));
                setNodes(nodesData);
                setNodesSet(true);
            })
    }, [])

    // useEffect with [correctAnswer] dependency array checks for any updates in the correctAnswer state and returns 
    // true to the onNew prop function
    useEffect(() => {
        if (correctAnswer) {
            setNodes([]);
            const encodedWord = encodeURIComponent(data.word);
            fetch(`http://127.0.0.1:5000/correct_answer?userEmail=${props.userEmail}&word=${encodedWord}`)
            props.onNew(true);
            console.log("Correct asnwer check ran fr, it was:")
            console.log(correctAnswer)
        }
    }, [correctAnswer])

    // useEffect with [incorrectAnswer] dependency array checks for any updates in the incorrectAnswer state and returns
    // false to the onNew prop function
    useEffect(() => {
        if (incorrectAnswer) {
            fetch(`http://127.0.0.1:5000/incorrect_answer/${props.userEmail}`)
            props.onNew(false);
        }
        console.log("Incorrect answer check ran fr, it was:")
        console.log(incorrectAnswer)
    }, [incorrectAnswer])

    // Checks the state of the function sent to the CollisionDetectionFlow component upon its return, sets respective state to true
    const checkCorrect = (correct) => {
        console.log(incorrectAnswer)
        if (correct) {
            setCorrectAnswer(true)
            console.log("correct")
        } else {
            setIncorrectAnswer(true)
            console.log("incorrect")
        }
    }

    const instructionString = "Build this sentence using the word " + data.word + " by dragging the correct character onto its corresponding English meaning below"

    console.log(nodes)
    return (
        <div>
            {/* 1. Header  */}
            <h1 className={styles.prompt}>{instructionString}</h1>

            {/* 4. Question  */}
            <h1 className={styles.question}>{english}</h1>
            {nodesSet ? (
                <div>
                    <CollisionDetectionFlow initialNodes={nodes} onCorrectAnswerCheck={checkCorrect} sentence={data.sentence} wordList={data.words} />
                </div>
            ) : (
                <div className={styles.container}>
                    {console.log("loading...")}
                </div>
            )}

        </div>
    )
}


export default BuildingBlocks;