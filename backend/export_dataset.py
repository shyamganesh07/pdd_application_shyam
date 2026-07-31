"""
TradeMind Historical Dataset Exporter
Generates offline CSV datasets from backend history for academic demonstration.
"""
import json
import csv
import os

backend_dir = os.path.dirname(os.path.abspath(__file__))
history_file = os.path.join(backend_dir, "history.json")
dataset_dir = os.path.join(backend_dir, "dataset")

os.makedirs(dataset_dir, exist_ok=True)

if os.path.exists(history_file):
    with open(history_file, "r") as f:
        data = json.load(f)

    # Save complete dataset CSV
    csv_path = os.path.join(dataset_dir, "TradeMind_Historical_Financial_Dataset.csv")
    with open(csv_path, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["Symbol", "Timestamp", "Price", "Probability_T1", "Regime", "User_ID"])
        
        count = 0
        if isinstance(data, list):
            for item in data:
                writer.writerow([
                    item.get("symbol", ""),
                    item.get("timestamp", ""),
                    item.get("price", ""),
                    item.get("result", {}).get("probabilities", {}).get("T1", ""),
                    item.get("result", {}).get("regime", ""),
                    item.get("user_id", "")
                ])
                count += 1

    print(f"Successfully exported {count} historical records to {csv_path}")
else:
    print("No history file found to export.")
