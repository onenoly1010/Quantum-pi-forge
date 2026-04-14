import json
import datetime


def verify_sovereign_heartbeat():
    try:
        with open('manifest.json', 'r') as f:
            manifest = json.load(f)

        canon = manifest['constellation']['canon_of_autonomy']

        # Check for 396Hz Foundation Resonance
        if canon['resonance']['frequency'] == "396Hz" and canon['local_sovereign']:
            print(f"[{datetime.datetime.now()}] HEARTBEAT: LOCAL SOVEREIGNTY VERIFIED.")
            print(f"RESONANCE: {canon['resonance']['frequency']} FOUNDATION RELEASE.")
            return True
        else:
            print("HEARTBEAT ERROR: Foundation resonance mismatch.")
            return False

    except FileNotFoundError:
        print("FORGE ERROR: manifest.json not found. Sovereignty cannot be verified.")
        return False


if __name__ == "__main__":
    verify_sovereign_heartbeat()