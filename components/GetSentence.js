// TEMP FILE
// The contents of this file will eventually be put into the
// Google-Sign-On file. For now, it just runs on the Home page
// and 

import next from 'next';
import { stringify } from 'querystring';
import React, { useEffect, useState } from 'react';
import styles from "./getsentence.module.css"

function GetSentence(props) {
    console.log(props.userEmail)
    console.log(props.test)
    const [data, setData] = useState({ sentences: [], word: "" })
    const [english, setEnglish] = useState("")
    const [score, setScore] = useState(0);
    const [nextQuestion, setNextQuestion] = useState(true);
    const [correctAnswer, setCorrectAnswer] = useState(false);
    const [incorrectAnswer, setIncorrectAnswer] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [success, setSuccess] = useState(false);
    const [resultMessage, setResultMessage] = useState("");

    useEffect(() => {
        console.log("I am inside the first useEffect function")
        fetch(`http://127.0.0.1:5000/sentence/${props.userEmail}`)
            .then(res => res.json())
            .then(data => {
                console.log("Blogey")
                setData(data)
                const sentencesEnglish = data.sentences.map(sentence => sentence.english);
                const selector = Math.floor(Math.random() * 3);
                setEnglish(sentencesEnglish[selector]);
                console.log(sentencesEnglish[selector])
                console.log("Eugey")
                //console.log(key)
                //console.log(data.dictionary[key])
            })
    }, [])

    useEffect(() => {
        if (correctAnswer) {
            const encodedWord = encodeURIComponent(data.word);
            fetch(`http://127.0.0.1:5000/correct_answer?userEmail=${props.userEmail}&word=${encodedWord}`)
            props.onNew(true);
        }
    }, [correctAnswer])

    useEffect(() => {
        if (incorrectAnswer) {
            fetch(`http://127.0.0.1:5000/incorrect_answer/${props.userEmail}`)
            props.onNew(false);
        }
    }, [incorrectAnswer])

    // Pick one of the sentences to be the correct one
    // Set the english hook = the 'english' field of our correct sentence


    // .map() returns a new array and always takes a function as a parameter
    // => takes a parameter 'sentence' and returns the hanzi for that sentence.

    const optionClicked = (sentence) => {
        // Increment the score
        if (sentence.english == english) {
            setCorrectAnswer(true);
            console.log("correct")
        } else {
            setIncorrectAnswer(true);
            console.log("incorrect")
        }
    };



    return (
        <div>
            {/* 1. Header  */}
            <h1 className={styles.prompt}>Pick the right translation of the sentence below</h1>

            {/* 4. Question  */}
            <div>
                {/* Current Question -- English Text to Be Translated */}
                <h2 className={styles.question}>{english}</h2>

                {/* List of possible answers  */}
                <ul className={styles.all_options}>
                    {data.sentences.map((sentence, index) => {
                        return (
                            <li
                                key={index}
                                onClick={() => optionClicked(sentence)}
                                className={styles.single_option}
                            >
                                {sentence.hanzi}
                            </li>
                        );
                    })}
                </ul>
            </div>

        </div >
    )
}


export default GetSentence;