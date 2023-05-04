import React, { useEffect, useState, useRef } from 'react';
import ReactFlow, { useNodesState, useEdgesState } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

import 'reactflow/dist/style.css';
import styles from './dragstyle.module.css';

const CustomNodeComponent = ({ data }) => {
    // Use data to render the custom node
    return <div className={styles.customNode}>{data['0']}</div>;
};

const nodeTypes = {
    customNode: CustomNodeComponent,
};

function CollisionDetectionFlow(initialNodes) {
    const [nextQuestion, setNextQuestion] = useState(true);
    const [correctAnswer, setCorrectAnswer] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [success, setSuccess] = useState(false);
    const [resultMessage, setResultMessage] = useState("");

    // this ref stores the current dragged node
    //Whatever(props.userEmail)

    //console.log(Whatever)
    const dragRef = useRef(null);

    // target is the node that the node is dragged over
    const [target, setTarget] = useState(null);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    //const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);


    const onNodeDragStart = (evt, node) => {
        dragRef.current = node;
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
                    x: (dragRef.current.position.x + target.position.x) / 2,
                    y: (dragRef.current.position.y + target.position.y) / 2,
                },
                type: "customNode",
            }
            console.log(newNode)
            newNodes.push(newNode);
            setNodes(newNodes);
        };
        dragRef.current = null;
        setTarget(null);
        if (nodes.length === 1 && nodes[0].data['0']) {

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
