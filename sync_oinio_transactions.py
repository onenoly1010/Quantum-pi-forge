import pandas as pd
import chromadb
from chromadb.utils.embedding_functions import OllamaEmbeddingFunction
import os
from tqdm import tqdm

def sync_transactions():
    """Synchronize OINIO transaction data into Chroma vector database"""
    
    CSV_PATH = 'token-OINIO-0xbebc1a40a18632cee19d220647e7ad296a1a5f37-2026.04.15.csv'
    DB_PATH = "./0g_intelligence_db"
    
    # Check for CSV file
    if not os.path.exists(CSV_PATH):
        print(f"⚠️  Transaction file not found at: {CSV_PATH}")
        print("\n📋 Required CSV columns: TxHash, From, To, Quantity")
        return False
    
    # Load transaction data
    print(f"📥 Loading transaction data from {CSV_PATH}...")
    try:
        df = pd.read_csv(CSV_PATH)
        print(f"✅ Loaded {len(df)} transactions")
    except Exception as e:
        print(f"❌ Failed to read CSV: {e}")
        return False

    # Verify required columns
    required_columns = ['TxHash', 'From', 'To', 'Quantity']
    missing = [col for col in required_columns if col not in df.columns]
    if missing:
        print(f"❌ Missing required columns in CSV: {missing}")
        return False
    
    # Initialize ChromaDB with local Ollama LLaMA 3 embeddings
    print(f"\n🔌 Connecting to vector database at {DB_PATH}...")
    print("🧠 Using local Ollama LLaMA 3 embeddings")
    
    ollama_ef = OllamaEmbeddingFunction(
        url="http://localhost:11434/api/embeddings",
        model_name="llama3"
    )
    
    client = chromadb.PersistentClient(path=DB_PATH)
    collection = client.get_or_create_collection(
        name="oinio_transactions",
        embedding_function=ollama_ef,
        metadata={"token": "OINIO", "contract": "0xbebc1a40a18632cee19d220647e7ad296a1a5f37", "import_date": "2026.04.15", "embedding_model": "llama3"}
    )
    
    existing_count = collection.count()
    print(f"ℹ️  Collection currently has {existing_count} records")
    
    if existing_count == len(df):
        print("\n✅ All transactions already synchronized. No action needed.")
        return True
    
    # Add transactions in batches for performance
    print(f"\n⚡ Synchronizing {len(df)} transactions to vector memory...")
    
    documents = []
    metadatas = []
    ids = []
    
    for i, row in tqdm(df.iterrows(), total=len(df)):
        doc = f"Tx {row['TxHash']}: From {row['From']} to {row['To']} quantity {row['Quantity']}"
        documents.append(doc)
        metadatas.append({"hash": row['TxHash'], "qty": float(row['Quantity'])})
        ids.append(f"id_{i}")
    
    # Batch insert (Chroma handles batching internally)
    collection.add(
        documents=documents,
        metadatas=metadatas,
        ids=ids
    )
    
    final_count = collection.count()
    print(f"\n✅ Memory synchronized successfully.")
    print(f"📊 Final collection size: {final_count} transactions")
    print(f"⬆️  Added {final_count - existing_count} new records")
    
    # Example query test
    print("\n🔍 Test query: searching for largest transactions...")
    results = collection.query(
        query_texts=["largest quantity transaction"],
        n_results=3
    )
    
    for idx, (doc, meta) in enumerate(zip(results['documents'][0], results['metadatas'][0])):
        print(f"  {idx+1}. {meta['hash']} - Qty: {meta['qty']:.6f}")
    
    return True

if __name__ == "__main__":
    sync_transactions()