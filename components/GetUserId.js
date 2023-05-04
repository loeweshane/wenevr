// TEMP FILE
// The contents of this file will eventually be put into the
// Google-Sign-On file. For now, it just runs on the Home page
// and 

import React, { useEffect } from 'react';

function GetUserId(props) {
    GetUserId = function () { }; // empties the function so it code below only runs once
    console.log(props.userEmail)

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/${props.userEmail}`)
    }, [props.userEmail])

    return (
        <div>
            <></>
        </div>
    )
}

export default GetUserId;