// TEMP FILE
// The contents of this file will eventually be put into the
// Google-Sign-On file. For now, it just runs on the Home page
// and 

import { stringify } from 'querystring';
import React, { useEffect, useState } from 'react';
import styles from "./dictionary.module.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

ChartJS.register(...registerables, ArcElement, Tooltip, Legend);

function GetProfileStats(props) {
    console.log(props.userEmail)
    const [data, setData] = useState({ stats: {} })

    useEffect(() => {
        console.log("I am inside the getProfileStats function")
        fetch(`http://127.0.0.1:5000/profile/${props.userEmail}`)
            .then(res => res.json())
            .then(data => {
                setData(data)
                //console.log(key)
                //console.log(data.dictionary[key])
            })
    }, [props.userEmail])

    const progress = data.stats.progress

    var words = [];

    for (var word in data.stats.progress) {
        words.push(word)
    }

    const rows = words.map(word => (
        <tr word={word}>
            <td className={styles.leftCol}>{word}</td>
            <td className={styles.rightCol}>{data.stats.progress[word]}</td>
        </tr>
    ));

    const options = {
        legend: {
            display: false,
            labels: {
                boxWidth: 0,     // lable box size
            }
        },
        tooltips: {
            enabled: false
        },
        indexAxis: 'y',
        elements: {
            bar: {
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                display: false,
                max: 10,
                min: 0,
                ticks: {
                    stepSize: 0.5
                },
                grid: {
                    display: false
                },
                indexAxis: {
                    display: false
                }
            },
            y: {
                display: false,
                grid: {
                    display: false
                }
            }
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                display: false
            },
            title: {
                display: false,
            },
        },
    };

    const progress_rows = words.map(word => (
        <div>
            <tr word={word}>
                <td className={styles.progressCol}>{word}</td>
            </tr>
            <tr word={word} style={{ maxWidth: "100px" }}>
                <Bar options={options} data={{
                    labels: [''],
                    datasets: [
                        {
                            data: [data.stats.progress[word]],
                            options: {
                                maintainAspectRatio: false,
                            },
                            backgroundColor: [
                                'rgba(255, 206, 86, 0.8)',
                                'rgba(255, 206, 86, 0.4)',
                            ],
                            borderColor: [
                                'rgba(255, 216, 0, 1)',
                                'rgba(255, 206, 86, 0)',
                            ],
                            barThickness: 12,
                        },
                    ],
                }} />
            </tr>
        </div>
    ))

    return (
        <div>
            <div className={styles.row}>
                <div className={styles.container}>
                    <div className={styles.columnDiv}>
                        <table className={styles.correctWordTable}>
                            <thead>
                                <tr>
                                    <th className={styles.leftHead}>Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                {progress_rows}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={styles.column}><h1>Accuracy</h1>
                    <div style={{ maxWidth: "400px" }}>
                        <Pie data={{
                            labels: ['Correct', 'Incorrect'],
                            datasets: [
                                {
                                    label: '# of Votes',
                                    data: [data.stats.correct, data.stats.incorrect],
                                    backgroundColor: [
                                        'rgba(255, 206, 86, 0.8)',
                                        'rgba(255, 206, 86, 0.4)',
                                    ],
                                    borderColor: [
                                        'rgba(255, 216, 0, 1)',
                                        'rgba(255, 206, 86, 0)',
                                    ],
                                    borderWidth: 1,
                                },
                            ],
                        }} />
                    </div></div>
                <div className={styles.container}>
                    <div className={styles.columnDiv}>
                        <table className={styles.correctWordTable}>
                            <thead>
                                <tr>
                                    <th className={styles.leftHead}>Word</th>
                                    <th className={styles.rightHead}># Correct</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default GetProfileStats;