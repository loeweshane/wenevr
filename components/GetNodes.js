import next from 'next';
import { stringify } from 'querystring';
import React, { useEffect, useState, useRef } from 'react';

function Whatever(userEmail) {
    const [data, setData] = useState({ sentence: [], returnedNodes: [] })
    fetch(`http://127.0.0.1:5000/builder/${userEmail}`)
        .then(res => res.json())
        .then(data => {
            setData(data)
            const englishSentence = data.sentence[0].english
            console.log(englishSentence)
        })
    return data;
}

export default Whatever;