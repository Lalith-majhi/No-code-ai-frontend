from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List
from collections import defaultdict

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from backend!"}

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def is_dag(nodes: List[Dict], edges: List[Dict]) -> bool:
    # Create adjacency list
    graph = defaultdict(list)
    for edge in edges:
        graph[edge['source']].append(edge['target'])
    
    # Keep track of visited and currently exploring nodes
    visited = set()
    exploring = set()
    
    def has_cycle(node: str) -> bool:
        if node in exploring:
            return True
        if node in visited:
            return False
            
        exploring.add(node)
        
        # Check all neighbors
        for neighbor in graph[node]:
            if has_cycle(neighbor):
                return True
                
        exploring.remove(node)
        visited.add(node)
        return False
    
    # Check each node for cycles
    for node in nodes:
        if node['id'] not in visited:
            if has_cycle(node['id']):
                return False
    
    return True

@app.post('/pipelines/parse')
async def parse_pipeline(pipeline: Dict = Body(...)):
    try:
        nodes = pipeline.get('nodes', [])
        edges = pipeline.get('edges', [])
        
        # Calculate metrics
        num_nodes = len(nodes)
        num_edges = len(edges)
        is_dag_result = is_dag(nodes, edges)
        
        return {
            'num_nodes': num_nodes,
            'num_edges': num_edges,
            'is_dag': is_dag_result,
            'status': 'success'
        }
    except Exception as e:
        return {
            'error': str(e),
            'status': 'error'
        }
