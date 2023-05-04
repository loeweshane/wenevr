import React, { useEffect, useState, useRef } from 'react';
import ReactFlow, { useNodesState, useEdgesState } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import ReactDOM from 'react-dom';

import 'reactflow/dist/style.css';
import styles from './dragstyle.module.css';
import BuildingBlocks from './BuildingBlocks';
import GetSentence from './GetSentence';
import CollisionDetectionFlow from './SentenceBuilder';

function RandomizeActivity(props) {

    const genNew = (noo) => {
        if (noo) {
            const Randomize = NewHOC();
        }
    }

    const activities = [<BuildingBlocks userEmail={props.userEmail} onNew={genNew} />, <GetSentence userEmail={props.userEmail} onNew={genNew} />]

    const NewHOC2 = () => {
        const activity = (Math.floor(Math.random() * activities.length));
        console.log(activity)
        console.log(activities)
        return activity
    }

    const NewHOC = (PassedComponent) => {

        var act = NewHOC2();

        return class extends React.Component {
            render() {
                return (
                    <div>
                        {activities[act]}
                    </div>
                )
            }
        }
    }

    const Randomize = NewHOC();

    return (
        <div>
            <Randomize />
        </div>
    )
};

export default RandomizeActivity;
