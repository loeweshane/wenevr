import React, { useEffect, useState, useRef } from 'react';
import ReactFlow, { useNodesState, useEdgesState } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import ReactDOM from 'react-dom';

import 'reactflow/dist/style.css';
import styles from './dragstyle.module.css';

// Handles custom node styling
const CustomNodeComponent = React.memo(({ data, wordTranslation, showWordTranslation }) => {
    // Use data to render the custom node
    return (
        <div>
            {showWordTranslation ? (
                <div>
                    <div className={styles.customNode}> {data['0']}</div>
                    <div>Yo</div>
                </div>
            ) : (
                <div className={styles.customNode}>{data['0']}</div>
            )
            }
        </div>
    )
});

const nodeTypes = {
    customNode: CustomNodeComponent,
};

function CollisionDetectionFlow(props) {
    const [nextQuestion, setNextQuestion] = useState(true);
    const [correctAnswer, setCorrectAnswer] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [dataSent, setDataSent] = useState(false);
    const [resultMessage, setResultMessage] = useState("");
    const [moveHistory, setMoveHistory] = useState([])
    const [showWordTranslation, setShowWordTranslation] = useState(true)
    const [wordTranslation, setWordTranslation] = useState("")

    // this ref stores the current dragged node
    //Whatever(props.userEmail)

    //console.log(Whatever)
    const dragRef = useRef(null);
    const draggingRef = useRef(false);
    const selectRef = useRef(null);
    const mouseRef = useRef("up")
    const liftedRef = useRef(false);

    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.voice = voices[22];
    msg.lang = 'zh';

    // target is the node that the node is dragged over
    const [target, setTarget] = useState(null);

    // Creates the nodes with the initial nodes being grabbed from the initialNodes prop
    const [nodes, setNodes, onNodesChange] = useNodesState(props.initialNodes);
    //const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onNodeDragStart = (evt, node) => {
        dragRef.current = node;
        // Double click handles splitting
        if (evt.detail == 2) {
            if (dragRef.current.data['0'].length > 1) {
                const newNodes = nodes
                console.log("New nodes: ")
                console.log(newNodes)
                const previousNodeSet = moveHistory.pop()
                setNodes(previousNodeSet);
                /*
                for (var n = 0; n < dragRef.current.data['0'].length; n++) {
                    console.log(dragRef.current.data['0'][n])
                    const randX = Math.floor(Math.random() * dragRef.current.position.x) + 200;
                    const randY = Math.floor(Math.random() * dragRef.current.position.y) + 200;
                    const newNode = {
                        id: uuidv4(),
                        data: { 0: dragRef.current.data['0'][n] },
                        position: {
                            x: (randX),
                            y: (randY),
                        },
                        type: "customNode",
                    }
                    console.log(newNode)
                    newNodes.push(newNode);
                }
                setNodes(newNodes);
                dragRef.current = null;*/
            }
        }
    };

    const onNodeDrag = (evt, node) => {
        // calculate the center point of the node from position and dimensions
        const centerX = node.position.x + node.width / 2;
        console.log(node.position)
        const centerY = node.position.y + node.height / 2;
        console.log(node.height)
        // find a node where the center point is inside
        const targetNode = nodes.find(
            (n) =>
                centerX > n.position.x &&
                centerX < n.position.x + n.width &&
                centerY > n.position.y &&
                centerY < n.position.y + n.height &&
                n.id !== node.id // this is needed, otherwise we would always find the dragged node
        );
        if (targetNode != null) {
            setTarget(targetNode);
        }
        if (targetNode == null) {
            setTarget(null);
        }
        console.log("TARGET NODE:")
        console.log(targetNode)
    };

    // Handles what happens when a node is dropped, either on a target node or otherwise.
    const onNodeDragStop = (evt, node) => {
        if (target) {
            console.log(dragRef.current)
            console.log(target)
            //const draggedNode = nodes.find((node) => node.id === dragRef.current.id);
            // console.log(draggedNode)
            //const targetNode = nodes.find((node) => node.id === target.id);
            //console.log(targetNode)
            const combinedLabel = target.data['0'] + dragRef.current.data['0'];
            console.log(combinedLabel)
            // Grabs all nodes except for dragRef.current and target
            const newNodes = nodes.filter((node) => node.id !== dragRef.current.id && node.id !== target.id);
            console.log(newNodes)
            const newNode = {
                id: uuidv4(),
                data: { 0: combinedLabel },
                position: {
                    x: (target.position.x),
                    y: (target.position.y),
                },
                type: "customNode",
            }
            console.log(newNode.data['0'])

            //const filterWords = props.wordList.filter((word) => word.hanzi == newNode.data['0'])
            speechSynthesis.cancel();
            msg.text = newNode.data['0'];
            speechSynthesis.speak(msg);

            newNodes.push(newNode);
            setNodes(newNodes);
            // Puts the node-set into the moveHistory
            var newHistory = moveHistory;
            newHistory.push(nodes);
            console.log("MOVEHISTORY")
            console.log(moveHistory)
        } else if (dragRef.current.data['0'].length === 1) {
            speechSynthesis.cancel();
            console.log(dragRef.current.data['0'])
            msg.text = dragRef.current.data['0'];
            speechSynthesis.speak(msg);
        };
        console.log(dragRef.current.data['0'].length)

        const hanziList = props.wordList.map((word) => word.hanzi)

        // Returns either true or false to the onCorrectAnswerCheck prop function
        dragRef.current = null;
        setTarget(null);
        console.log(props.sentence['0'].hanzi)
        console.log(nodes.length)
        if (nodes.length === 1 && (nodes[0].data['0'] === props.sentence['0'].hanzi)) {
            console.log("DINGDINGDING")
            setNodes([]);
            setTarget(null);
            props.onCorrectAnswerCheck(true);
            setDataSent(true);
        } else if (nodes.length === 1) {
            console.log("WRONG")
            props.onCorrectAnswerCheck(false);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.instructions}>Drop any node on top of another node to swap their colors</div>
            <ReactFlow
                nodes={nodes}
                onPaneClick={(evt) => evt.preventDefault()}
                onPaneContextMenu={(evt) => evt.preventDefault()}
                //edges={edges}
                onNodesChange={onNodesChange}
                //onEdgesChange={onEdgesChange}
                fitView
                onNodeDragStart={onNodeDragStart}
                onNodeDrag={onNodeDrag}
                onNodeDragStop={onNodeDragStop}
                nodeTypes={nodeTypes}
            />
        </div>
    );
};

export default CollisionDetectionFlow;
