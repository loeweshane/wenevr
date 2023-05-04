import next from 'next';
import { stringify } from 'querystring';
import React, { useEffect, useState, useRef } from 'react';
import ReactFlow, { useNodesState, useEdgesState } from 'reactflow';
import Draggable from "react-draggable"
import CollisionDetectionFlow from './SentenceBuilder';
import styles from './dragstyle.module.css'
import { IncomingMessage } from 'http';

function Component2(props) {
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
    const [resultMessage, setResultMessage] = useState("");

    useEffect(() => {
        if (correctAnswer) {
            props.onNew(true);
        }
        console.log("Correct asnwer check ran fr, it was:")
        console.log(correctAnswer)
    }, [props.userEmail, correctAnswer])

    useEffect(() => {
        if (incorrectAnswer) {
            props.onNew(false)
        }
        console.log("Incorrect asnwer check ran fr, it was:")
        console.log(incorrectAnswer)
    }, [incorrectAnswer])

    /*
    const checkCorrect = (correct) => {
        console.log(incorrectAnswer)
        if (correct) {
            setNextQuestion(true)
            setCorrectAnswer(true)
        } else {
            var count = incorrectAnswer;
            console.log(incorrectAnswer)
            count += 1;
            console.log(count)
            setIncorrectAnswer(count)
        }
        console.log("Po")
    }
    */

    function nextPlease(correct) {
        if (correct) {
            setNextQuestion(true)
            setCorrectAnswer(true)
            console.log("correct")
        } else {
            /*var count = incorrectAnswer;
            console.log(incorrectAnswer)
            count += 1;
            console.log(count)*/ // Move all result handling to upstream component
            setIncorrectAnswer(true)
            console.log("incorrect")
        }

    }

    const instructionString = "Click the screen"


    return (
        <div>
            {/* 1. Header  */}
            <h1 className={styles.prompt}>{instructionString}</h1>

            {/* 4. Question  */}
            <h1 className={styles.question}>{english}</h1>
            <button onClick={nextPlease}>
                Click me!
            </button>
        </div>
    )
}


export default Component2;