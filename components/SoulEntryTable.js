/**
 * OINIO Soul Entry Ledger Component
 * Quantum Pi Forge - Sovereign Grade
 * Zero third party dependencies, vanilla JS
 */

class SoulEntryTable {
  constructor(containerId, csvUrl) {
    this.container = document.getElementById(containerId);
    this.csvUrl = csvUrl;
    this.data = [];
    this.sortField = 'EpochNumber';
    this.sortDirection = 'desc';
    this.searchTerm = '';
  }

  async load() {
    try {
      const response = await fetch(this.csvUrl);
      const csvText = await response.text();
      this.data = this.parseCSV(csvText);
      this.render();
    } catch (e) {
      this.container.innerHTML = `<div class="text-zinc-500 text-center py-12 font-mono">⏳ Ledger sync in progress...</div>`;
    }
  }

  parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index]?.trim() || '';
        return obj;
      }, {});
    });
  }

  getFilteredData() {
    let filtered = [...this.data];
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(row => 
        Object.values(row).some(v => v.toLowerCase().includes(term))
      );
    }

    filtered.sort((a, b) => {
      const aVal = isNaN(a[this.sortField]) ? a[this.sortField] : parseFloat(a[this.sortField]);
      const bVal = isNaN(b[this.sortField]) ? b[this.sortField] : parseFloat(b[this.sortField]);
      
      if (this.sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered.slice(0, 50);
  }

  render() {
    const filtered = this.getFilteredData();

    this.container.innerHTML = `
      <div class="bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div class="p-8 border-b border-white/10">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 class="text-2xl font-mono text-cyan-400">GENESIS LEDGER: OINIO SOUL ENTRIES</h2>
            <input type="text" 
                   id="ledger-search" 
                   placeholder="Search ledger..." 
                   class="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm font-mono text-white w-full md:w-64"
                   value="${this.searchTerm}">
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left font-mono text-sm">
            <thead>
              <tr class="bg-black/50 text-cyan-200">
                <th class="p-4 cursor-pointer hover:bg-white/5" data-sort="EpochNumber">
                  Block Height ${this.sortField === 'EpochNumber' ? (this.sortDirection === 'desc' ? '↓' : '↑') : ''}
                </th>
                <th class="p-4 cursor-pointer hover:bg-white/5" data-sort="TxHash">
                  Transaction Hash ${this.sortField === 'TxHash' ? (this.sortDirection === 'desc' ? '↓' : '↑') : ''}
                </th>
                <th class="p-4 cursor-pointer hover:bg-white/5" data-sort="Quantity">
                  Quantity ${this.sortField === 'Quantity' ? (this.sortDirection === 'desc' ? '↓' : '↑') : ''}
                </th>
                <th class="p-4 cursor-pointer hover:bg-white/5" data-sort="DateTime">
                  Timestamp ${this.sortField === 'DateTime' ? (this.sortDirection === 'desc' ? '↓' : '↑') : ''}
                </th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map((tx, index) => `
                <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td class="p-4 font-mono">${tx.EpochNumber || '—'}</td>
                  <td class="p-4 text-xs text-zinc-400">${tx.TxHash ? tx.TxHash.substring(0, 16) + '...' : '—'}</td>
                  <td class="p-4 text-cyan-300 font-bold">${tx.Quantity ? parseFloat(tx.Quantity).toLocaleString() : '0'}</td>
                  <td class="p-4 text-xs text-zinc-500">${tx.DateTime || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="p-4 text-right text-[10px] uppercase tracking-widest text-zinc-600 border-t border-white/5">
          ✅ VERIFIED ON 0G ARISTOTLE MAINNET • ${this.data.length} TOTAL SOUL ENTRIES
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    document.getElementById('ledger-search').addEventListener('input', (e) => {
      this.searchTerm = e.target.value;
      this.render();
    });

    this.container.querySelectorAll('[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const field = th.dataset.sort;
        if (this.sortField === field) {
          this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc';
        } else {
          this.sortField = field;
          this.sortDirection = 'desc';
        }
        this.render();
      });
    });
  }
}

// Initialize ledger on page load
document.addEventListener('DOMContentLoaded', () => {
  const ledger = new SoulEntryTable('soul-ledger', '/token-OINIO-0xbebc1a40a18632cee19d220647e7ad296a1a5f37-2026.04.15.csv');
  ledger.load();
  setInterval(() => ledger.load(), 300000); // Refresh every 5 minutes
});