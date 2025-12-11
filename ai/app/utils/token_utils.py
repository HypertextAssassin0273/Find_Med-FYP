import re
from rapidfuzz import process, fuzz

def clean_tokens(text):
    text = text.lower()
    tokens = re.findall(r"[a-z0-9]+(?:mg|g|mcg)?", text)
    return tokens

def fuzzy_best(token, candidates, limit=5):
    return process.extract(token, candidates, scorer=fuzz.ratio, limit=limit)
