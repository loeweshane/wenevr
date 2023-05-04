import next from 'next';
import { stringify } from 'querystring';
import React, { useEffect, useState } from 'react';
import styles from "./getsentence.module.css"

function Tracker(props: any) {
    const [initiator, setInitiator] = useState(true);

    

    var dragItem = document.getElementById(props.id);
    var container = document.querySelector("#container");
    var active = false;
    var currentX: any;
    var currentY: any;
    var initialX: any;
    var initialY: any;
    var xOffset = 0;
    var yOffset = 0;

    container?.addEventListener("touchstart", dragStart, false);
    container?.addEventListener("touchend", dragEnd, false);
    container?.addEventListener("touchmove", drag, false);

    container?.addEventListener("mousedown", dragStart, false);
    container?.addEventListener("mouseup", dragEnd, false);
    container?.addEventListener("mousemove", drag, false);

    function dragStart(e: any) {
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        if (e.target === dragItem) {
            active = true;
        }
    }

    function dragEnd(e: any) {
        initialX = currentX;
        initialY = currentY;

        active = false;
    }

    function drag(e: any) {
        if (active) {

            e.preventDefault();

            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, dragItem);
            console.log(props.id)
            return { x: currentX, y: currentY }

        }
    }

    function setTranslate(xPos: any, yPos: any, el: any) {
        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }

    return (
        <div>

        </div>
    )
}

export default Tracker;