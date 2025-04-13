import pickle
import os

CACHE_FILE = "face_encodings_cache.pkl"

def save_encodings_to_cache(encodings, names):
    """Save face encodings and names to a pickle file for caching."""
    with open(CACHE_FILE, "wb") as cache_file:
        pickle.dump((encodings, names), cache_file)

def load_encodings_from_cache():
    """Load face encodings and names from the pickle cache file."""
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "rb") as cache_file:
            return pickle.load(cache_file)
    return None, None

def clear_cache():
    """Delete the cache file if needed."""
    if os.path.exists(CACHE_FILE):
        os.remove(CACHE_FILE)
