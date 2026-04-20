# Offline Dev Guardian v1.5 – Hermetic Edition

**Quickstart Guide**

✅ Completely local. No internet. No accounts. No telemetry.  
Built by Kris J. Olofson (onenoly) / OINIO

## 1. Unpack
```bash
unzip offline-dev-guardian-v1.5.zip
cd offline-dev-guardian

2. Installbash

# User-space only. No root required.
chmod +x install-forge.sh
./install-forge.sh

You will see 7 green checkmarks on success.
Everything installs to ~/.oinio/.3. Run GuardianOne-time check (recommended first):bash

./guardian check

Start background daemon:bash

./guardian daemon start

4. Verifybash

./guardian status
tail -n 30 ~/.oinio/logs/guardian.log

File LocationsPath
Purpose
~/.oinio/config/guardian.toml
Configuration
~/.oinio/logs/
Operation logs
~/.oinio/store/
Local state
~/.oinio/bin/
Executables

Uninstallbash

./guardian uninstall

Removes everything cleanly.Everything I build installs cleanly and stays working.
No clouds. No keys. No surprises.
— Kris J. Olofson / OINIO
⟨OO⟩