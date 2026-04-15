import pandas as pd
import os

CSV_PATH = 'token-OINIO-0xbebc1a40a18632cee19d220647e7ad296a1a5f37-2026.04.15.csv'

if not os.path.exists(CSV_PATH):
    print(f"CSV file not found: {CSV_PATH}")
    exit(1)

# Load transaction data
df = pd.read_csv(CSV_PATH)

# Calculate total received balances for each address
holder_balances = df.groupby('To')['Quantity'].sum().sort_values(ascending=False)

# Get top 5 largest holders
top_whales = holder_balances.head(5)

# Format results
output = []
output.append("OINIO Top 5 Largest Holders")
output.append("=" * 40)
output.append("")

for rank, (address, balance) in enumerate(top_whales.items(), 1):
    output.append(f"#{rank} | {address}")
    output.append(f"     Balance: {balance:.6f} OINIO")
    output.append("")

# Save to whales.txt
with open('whales.txt', 'w') as f:
    f.write('\n'.join(output))

print(f"✅ Top 5 largest holders calculated and saved to whales.txt")
print(f"\nResults:")
print('\n'.join(output))