import json
import os
import sys
from ..models import Assessment
from ..db import assessments

def load_data():
    """
    Loads sample_data.json into the in-memory assessments list.
    """
    try:
        # Calculate path to sample_data.json relative to this file
        current_dir = os.path.dirname(__file__)
        base_dir = os.path.abspath(os.path.join(current_dir, "..", "..", ".."))
        file_path = os.path.join(base_dir, "sample_data.json")

        print(f"Loading data from {file_path}")

        if not os.path.exists(file_path):
            print(f"Error: sample_data.json not found at {file_path}")
            return

        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Clear existing data to prevent duplicates (better safe than sorry)
        assessments.clear()

        # Validate and load
        loaded_count = 0
        raw_assessments = data.get("assessments", [])

        for item in raw_assessments:
            try:
                assessment_obj = Assessment(**item)
                assessments.append(assessment_obj)
                loaded_count += 1
            except Exception as e:
                print(f"Error loading assessment: {e}")
        
        print(f"Loaded {loaded_count} assessments")

    except Exception as e:
      print(f"Error loading data: {str(e)}")






        