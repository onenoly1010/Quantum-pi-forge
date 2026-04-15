import pandas as pd
import chromadb

# Load your 0G transaction data
df = pd.read_csv('token-OINIO-0xbebc1a40a18632cee19d220647e7ad296a1a5f37-2026.04.15.csv')

# Initialize local Vector DB
client = chromadb.PersistentClient(path="./0g_intelligence_db")
collection = client.get_or_create_collection(name="oinio_transactions")

# Add transactions to memory
for i, row in df.iterrows():
    collection.add(
        documents=[f"Tx {row['TxHash']}: From {row['From']} to {row['To']} quantity {row['Quantity']}"],
        metadatas=[{"hash": row['TxHash'], "qty": row['Quantity']}],
        ids=[f"id_{i}"]
    )
print("Memory synchronized.")