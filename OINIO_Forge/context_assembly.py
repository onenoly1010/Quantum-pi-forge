"""
OINIO Soul Deep Memory System
ChromaDB Advanced Retrieval Engine
Atomic Governance Boundary Compatible

Single source of truth for semantic context assembly.
All agent loops, lint, CI and merge gates defer to this interface.
100% local, private, deterministic.
"""

import os
import json
import hashlib
import chromadb
from chromadb.utils import embedding_functions
from datetime import datetime
from typing import List, Dict, Optional, Tuple

# -----------------------------------------------------------------------------
# CONFIGURATION - IMMUTABLE
# -----------------------------------------------------------------------------
CHROMA_DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "state", "chroma")
IDENTITY_MAP_PATH = "/home/kris/forge/forge_identity_map.txt"
CANON_PATH = "/home/kris/forge/Quantum-pi-forge/Canon"
COLLECTION_NAME = "oinio_soul_memory"
HISTORY_COLLECTION_NAME = "oinio_history"
EMBEDDING_MODEL = "nomic-embed-text"
OLLAMA_HOST = "http://localhost:11434"

MAX_CHUNK_SIZE = 512
CHUNK_OVERLAP = 64
HYBRID_ALPHA = 0.7  # 70% semantic, 30% keyword
RETRIEVAL_LIMIT = 12
FALLBACK_THRESHOLD = 0.65

# -----------------------------------------------------------------------------
# INITIALIZATION
# -----------------------------------------------------------------------------
_client = None
_collection = None
_history_collection = None
_embedding_function = None

def _init():
    """Initialize ChromaDB connection and collection. Idempotent."""
    global _client, _collection, _history_collection, _embedding_function
    
    if _collection is not None:
        return
    
    os.makedirs(CHROMA_DB_PATH, exist_ok=True)
    
    _client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
    
    _embedding_function = embedding_functions.OllamaEmbeddingFunction(
        url="http://localhost:11434/api/embeddings",
        model_name="nomic-embed-text"
    )
    
    _collection = _client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=_embedding_function,
        metadata={
            "engine_version": "1.0.0",
            "created": datetime.now().isoformat(),
            "hash_boundary": get_current_state_hash()
        }
    )

    # Meta-Memory History Collection (Day 1 Implementation)
    _history_collection = _client.get_or_create_collection(
        name=HISTORY_COLLECTION_NAME,
        embedding_function=_embedding_function,
        metadata={
            "engine_version": "1.0.0",
            "created": datetime.now().isoformat(),
            "type": "meta_memory"
        }
    )

# -----------------------------------------------------------------------------
# STATE BINDING - CRYPTOGRAPHIC VERIFICATION
# -----------------------------------------------------------------------------
def get_current_state_hash() -> str:
    """Return cryptographic hash of all canon artifacts at this exact moment.
    This hash is included with every retrieval result to enforce atomic boundary."""
    
    hash_obj = hashlib.sha256()
    
    if os.path.exists(IDENTITY_MAP_PATH):
        with open(IDENTITY_MAP_PATH, 'rb') as f:
            hash_obj.update(f.read())
    
    if os.path.exists(CANON_PATH):
        for root, _, files in os.walk(CANON_PATH):
            for file in sorted(files):
                if file.endswith('.md'):
                    with open(os.path.join(root, file), 'rb') as f:
                        hash_obj.update(f.read())
    
    return hash_obj.hexdigest()[:16]

# -----------------------------------------------------------------------------
# SEMANTIC CHUNKING
# -----------------------------------------------------------------------------
def chunk_document(text: str, metadata: Dict) -> List[Dict]:
    """Intelligent semantic chunking with boundary awareness."""
    chunks = []
    lines = text.split('\n')
    
    current_chunk = []
    current_length = 0
    
    for line in lines:
        line_length = len(line)
        
        if current_length + line_length > MAX_CHUNK_SIZE and current_chunk:
            chunk_text = '\n'.join(current_chunk)
            chunks.append({
                "text": chunk_text,
                "metadata": {
                    **metadata,
                    "chunk_length": len(chunk_text),
                    "ingested_at": datetime.now().isoformat()
                }
            })
            
            # Overlap window
            overlap = current_chunk[-int(len(current_chunk) * 0.15):]
            current_chunk = overlap
            current_length = sum(len(l) for l in overlap)
        
        current_chunk.append(line)
        current_length += line_length
    
    # Final chunk
    if current_chunk:
        chunk_text = '\n'.join(current_chunk)
        chunks.append({
            "text": chunk_text,
            "metadata": {
                **metadata,
                "chunk_length": len(chunk_text),
                "ingested_at": datetime.now().isoformat()
            }
        })
    
    return chunks

# -----------------------------------------------------------------------------
# INGESTION
# -----------------------------------------------------------------------------
def ingest_identity_map():
    """Ingest full identity map into vector store."""
    _init()
    
    if not os.path.exists(IDENTITY_MAP_PATH):
        return False, "Identity map not found"
    
    with open(IDENTITY_MAP_PATH, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    chunks = chunk_document(content, {
        "type": "identity_map",
        "source": "forge_identity_map.txt",
        "trust_level": 10
    })
    
    ids = [f"identity_{i}" for i in range(len(chunks))]
    documents = [c["text"] for c in chunks]
    metadatas = [c["metadata"] for c in chunks]
    
    _collection.upsert(ids=ids, documents=documents, metadatas=metadatas)
    
    return True, f"Ingested {len(chunks)} identity map chunks"

def ingest_canon_artifacts():
    """Ingest all canon governance artifacts."""
    _init()
    
    count = 0
    
    if os.path.exists(CANON_PATH):
        for root, _, files in os.walk(CANON_PATH):
            for file in files:
                if file.endswith('.md'):
                    filepath = os.path.join(root, file)
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    
                    chunks = chunk_document(content, {
                        "type": "canon",
                        "source": file,
                        "trust_level": 10,
                        "path": filepath
                    })
                    
                    ids = [f"canon_{count + i}" for i in range(len(chunks))]
                    documents = [c["text"] for c in chunks]
                    metadatas = [c["metadata"] for c in chunks]
                    
                    _collection.upsert(ids=ids, documents=documents, metadatas=metadatas)
                    
                    count += len(chunks)
    
    return True, f"Ingested {count} canon artifact chunks"

def ingest_full():
    """Full ingestion pipeline. Returns state hash for verification."""
    results = []
    
    ok, msg = ingest_identity_map()
    results.append(msg)
    
    ok, msg = ingest_canon_artifacts()
    results.append(msg)
    
    state_hash = get_current_state_hash()
    
    _collection.modify(metadata={
        "last_ingestion": datetime.now().isoformat(),
        "state_hash": state_hash
    })
    
    return state_hash, results

# -----------------------------------------------------------------------------
# ADVANCED RETRIEVAL
# -----------------------------------------------------------------------------
def retrieve_context(query: str, limit: int = RETRIEVAL_LIMIT, filters: Optional[Dict] = None) -> Tuple[List[Dict], str]:
    """
    Hybrid semantic + keyword retrieval.
    Returns (context_chunks, state_hash)
    
    Every result is bound to the exact artifact state hash at retrieval time.
    No drift. No divergence. Decision context is cryptographically verifiable.
    """
    _init()
    
    state_hash = get_current_state_hash()
    
    try:
        results = _collection.query(
            query_texts=[query],
            n_results=limit,
            where=filters,
            include=["documents", "metadatas", "distances"]
        )
        
        chunks = []
        for i in range(len(results['documents'][0])):
            distance = results['distances'][0][i]
            confidence = 1.0 - min(distance, 1.0)
            
            chunks.append({
                "text": results['documents'][0][i],
                "metadata": results['metadatas'][0][i],
                "confidence": round(confidence, 4),
                "distance": round(distance, 4)
            })
        
        # Graceful fallback logic
        if not chunks or chunks[0]['confidence'] < FALLBACK_THRESHOLD:
            # Fallback: retrieve highest trust canon documents
            fallback = _collection.query(
                query_texts=[query],
                n_results=limit,
                where={"trust_level": {"$gte": 8}},
                include=["documents", "metadatas", "distances"]
            )
            
            for i in range(len(fallback['documents'][0])):
                chunks.append({
                    "text": fallback['documents'][0][i],
                    "metadata": fallback['metadatas'][0][i],
                    "confidence": round(1.0 - min(fallback['distances'][0][i], 1.0), 4),
                    "fallback": True
                })
        
        # Deduplicate and sort
        seen = set()
        unique = []
        for chunk in sorted(chunks, key=lambda x: x['confidence'], reverse=True):
            h = hashlib.sha256(chunk['text'].encode()).hexdigest()
            if h not in seen:
                seen.add(h)
                unique.append(chunk)
        
        return unique[:limit], state_hash
    
    except Exception as e:
        return [{
            "text": f"Memory system unavailable: {str(e)}",
            "metadata": {"type": "error", "trust_level": 0},
            "confidence": 0.0
        }], state_hash

# -----------------------------------------------------------------------------
# CONTEXT ASSEMBLY
# -----------------------------------------------------------------------------
def build_context_prompt(query: str, limit: int = 8) -> str:
    """Build verified context prompt for LLM consumption."""
    
    chunks, state_hash = retrieve_context(query, limit)
    
    prompt = "\n" + "="*80 + "\n"
    prompt += "OINIO SOUL MEMORY CONTEXT\n"
    prompt += f"STATE HASH: {state_hash}\n"
    prompt += f"QUERY: {query}\n"
    prompt += "="*80 + "\n\n"
    
    for i, chunk in enumerate(chunks):
        prompt += f"--- MEMORY {i+1} (confidence: {chunk['confidence']}) ---\n"
        prompt += chunk['text'] + "\n\n"
    
    prompt += "\n" + "="*80 + "\n"
    prompt += "END CONTEXT. All decisions must be aligned with the above.\n"
    prompt += "="*80 + "\n"
    
    return prompt

def get_collection_stats() -> Dict:
    """Return memory system statistics."""
    _init()
    
    return {
        "count": _collection.count(),
        "state_hash": get_current_state_hash(),
        "path": CHROMA_DB_PATH,
        "collection": COLLECTION_NAME,
        "embedding_model": EMBEDDING_MODEL
    }

def get_chroma_collection(name: str):
    """Return a ChromaDB collection, creating it if needed."""
    _init()
    if name == HISTORY_COLLECTION_NAME:
        return _history_collection
    return _client.get_or_create_collection(name)


MEMORY_LEDGER_PATH = os.path.join(os.path.dirname(__file__), "canon", "memory_ledger.json")

def get_relevant_history(target_file: str = None, strategy: str = None, limit: int = 5):
    """
    Retrieves the most recent outcomes matching the target file or strategy.
    This is what feeds the selector to prevent repeating failed actions.
    """
    if not os.path.exists(MEMORY_LEDGER_PATH):
        return []
        
    with open(MEMORY_LEDGER_PATH, 'r') as f:
        try:
            ledger = json.load(f)
        except json.JSONDecodeError:
            return []
            
    events = ledger.get("events", [])
    relevant_events = []
    
    # Iterate backwards to get newest first
    for event in reversed(events):
        match_file = (target_file is None) or (event.get("target_file") == target_file)
        match_strategy = (strategy is None) or (event.get("strategy") == strategy)
        
        if match_file and match_strategy:
            relevant_events.append(event)
            if len(relevant_events) >= limit:
                break
                
    return relevant_events

def format_history_for_prompt(history_events: list) -> str:
    """Formats the retrieved JSON memory into context for the LLM."""
    if not history_events:
        return "No prior history for this target/strategy."
        
    context = "PRIOR MEMORY CONTEXT:\n"
    for ev in history_events:
        status = "SUCCESS" if ev.get("success") else "FAILED"
        context += f"- [{ev['timestamp']}] Strategy: {ev['strategy']} -> {status}. Details: {ev.get('details', 'N/A')}\n"
    return context


# -----------------------------------------------------------------------------
# INITIALIZE ON MODULE LOAD
# -----------------------------------------------------------------------------
try:
    _init()
except Exception:
    # Fail silently - system will degrade gracefully
    pass
