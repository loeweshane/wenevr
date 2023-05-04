// TEMP FILE
// The contents of this file will eventually be put into the
// Google-Sign-On file. For now, it just runs on the Home page
// and 

import { stringify } from 'querystring';
import React, { useEffect, useState } from 'react';
import styles from "./dictionary.module.css"

function GetUserDictionary(props) {
    console.log(props.userEmail)
    const [data, setData] = useState({ dictionary: {} })

    useEffect(() => {
        console.log("I am inside the useEffect function")
        fetch(`http://127.0.0.1:5000/dictionary/${props.userEmail}`)
            .then(res => res.json())
            .then(data => {
                setData(data)
                console.log("Hello")
                //console.log(key)
                //console.log(data.dictionary[key])
            })
    }, [props.userEmail])

    var keys = [];

    for (var key in data.dictionary) {
        keys.push(key)
    }
    console.log(keys)

    const rows = keys.map(key => (
        <tr key={key}>
            <td className={styles.leftCol}>{key}</td>
            <td className={styles.rightCol}>{data.dictionary[key]}</td>
        </tr>
    ));

    console.log(keys)

    /*const rows = Object.keys(collection).map(key => (
        <tr key={key}>
            <td>{key}</td>
            <td>{data.dictionary[key]}</td>
        </tr>
    ));*/


    return (
        <table className={styles.dictTable}>
            <thead>
                <tr>
                    <th className={styles.leftHead}>中文</th>
                    <th className={styles.rightHead}>English</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
}

export default GetUserDictionary;