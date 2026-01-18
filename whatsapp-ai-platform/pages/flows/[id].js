import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Panel
} from 'reactflow';
import TriggerNode from '@/components/FlowBuilder/NodeTypes/TriggerNode';
import MessageNode from '@/components/FlowBuilder/NodeTypes/MessageNode';
import AINode from '@/components/FlowBuilder/NodeTypes/AINode';
import ConditionNode from '@/components/FlowBuilder/NodeTypes/ConditionNode';
import NodePanel from '@/components/FlowBuilder/NodePanel';
import PropertiesPanel from '@/components/FlowBuilder/PropertiesPanel';
import styles from '@/styles/flow-builder.module.css';
import toast from 'react-hot-toast';

const nodeTypes = {
    trigger: TriggerNode,
    message: MessageNode,
    ai_response: AINode,
    condition: ConditionNode
};

export default function FlowEditor() {
    const router = useRouter();
    const { id } = router.query;

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [flowName, setFlowName] = useState('Nuevo Flujo');
    const [flowStatus, setFlowStatus] = useState('draft');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (id && id !== 'new') {
            loadFlow();
        } else {
            const initialNode = {
                id: '1',
                type: 'trigger',
                position: { x: 250, y: 50 },
                data: { label: 'Inicio', keyword: '' }
            };
            setNodes([initialNode]);
        }
    }, [id]);

    const loadFlow = async () => {
        try {
            const res = await fetch(`/api/flows/${id}`);
            const flow = await res.json();
            setFlowName(flow.name);
            setFlowStatus(flow.status);
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error cargando flujo');
        }
    };

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const onNodeClick = (event, node) => {
        setSelectedNode(node);
    };

    const onAddNode = (nodeType) => {
        const newNode = {
            id: `${Date.now()}`,
            type: nodeType,
            position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 150 },
            data: {
                label: `${nodeType}`,
                messageText: nodeType === 'message' ? 'Escribe tu mensaje' : '',
                aiPrompt: nodeType === 'ai_response' ? 'Eres un asistente amable' : '',
                aiModel: 'gpt-4',
                temperature: 0.7,
                maxTokens: 150
            }
        };
        setNodes((nds) => [...nds, newNode]);
        toast.success('Nodo agregado');
    };

    const onUpdateNodeData = (nodeId, newData) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, ...newData } };
                }
                return node;
            })
        );
    };

    const onSaveFlow = async () => {
        setSaving(true);

        try {
            const flowData = {
                name: flowName,
                status: flowStatus,
                nodes,
                edges,
                trigger: {
                    type: 'keyword',
                    value: nodes.find(n => n.type === 'trigger')?.data.keyword || ''
                }
            };

            const url = id === 'new' ? '/api/flows' : `/api/flows/${id}`;
            const method = id === 'new' ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(flowData)
            });

            const savedFlow = await res.json();

            if (id === 'new') {
                router.push(`/flows/${savedFlow._id}`);
            }

            toast.success('✅ Flujo guardado');
        } catch (error) {
            console.error('Error:', error);
            toast.error('❌ Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const onToggleStatus = async () => {
        const newStatus = flowStatus === 'active' ? 'paused' : 'active';
        setFlowStatus(newStatus);

        try {
            await fetch(`/api/flows/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            toast.success(`Flujo ${newStatus === 'active' ? 'activado' : 'pausado'}`);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <Head>
                <title>{flowName} - Editor de Flujos</title>
            </Head>

            <div className={styles.flowEditor}>
                <div className={styles.header}>
                    <input
                        type="text"
                        value={flowName}
                        onChange={(e) => setFlowName(e.target.value)}
                        className={styles.flowNameInput}
                    />

                    <div className={styles.headerActions}>
                        <span className={`${styles.badge} ${styles[flowStatus]}`}>
                            {flowStatus}
                        </span>

                        {id && id !== 'new' && (
                            <button onClick={onToggleStatus} className={styles.toggleBtn}>
                                {flowStatus === 'active' ? 'Pausar' : 'Activar'}
                            </button>
                        )}

                        <button onClick={onSaveFlow} disabled={saving} className={styles.saveBtn}>
                            {saving ? 'Guardando...' : '💾 Guardar'}
                        </button>

                        <button onClick={() => router.push('/flows')} className={styles.closeBtn}>
                            ✕
                        </button>
                    </div>
                </div>

                <div className={styles.canvasContainer}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        <Background />
                        <Controls />
                        <MiniMap />

                        <Panel position="top-left">
                            <div className={styles.infoPanel}>
                                <span>📊 {nodes.length} nodos</span>
                                <span>🔗 {edges.length} conexiones</span>
                            </div>
                        </Panel>
                    </ReactFlow>
                </div>

                <NodePanel onAddNode={onAddNode} />

                {selectedNode && (
                    <PropertiesPanel
                        node={selectedNode}
                        onUpdate={onUpdateNodeData}
                        onClose={() => setSelectedNode(null)}
                    />
                )}
            </div>
        </>
    );
}
