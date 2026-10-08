import hashlib
import math
import re

from .models import EMBEDDING_DIMENSIONS

TOKEN_RE = re.compile(r"[a-z0-9]+")
STOPWORDS = {
    "a", "an", "and", "are", "as", "at", "be", "built", "by", "for", "from", "how",
    "i", "in", "is", "it", "me", "of", "on", "or", "show", "some", "something",
    "that", "the", "this", "to", "using", "was", "what", "with", "me", "my", "find",
}


def _tokens(text: str) -> list[str]:
    out = []
    for tok in TOKEN_RE.findall(text.lower()):
        if tok in STOPWORDS:
            continue
        if len(tok) > 3 and tok.endswith("s"):  # crude plural stemming
            tok = tok[:-1]
        out.append(tok)
    return out


def embed_text(text: str):
    """Return a unit-length vector of EMBEDDING_DIMENSIONS floats, or None if no usable words."""
    tokens = _tokens(text)
    if not tokens:
        return None
    grams = tokens + [f"{a}_{b}" for a, b in zip(tokens, tokens[1:])]  # unigrams + bigrams
    vec = [0.0] * EMBEDDING_DIMENSIONS
    for gram in grams:
        h = int(hashlib.md5(gram.encode()).hexdigest(), 16)
        vec[h % EMBEDDING_DIMENSIONS] += 1.0
    norm = math.sqrt(sum(v * v for v in vec))
    return [v / norm for v in vec]


def project_text(project) -> str:
    stack = project.tech_stack if isinstance(project.tech_stack, list) else []
    parts = [
        project.title, project.title,  # title counts double
        project.description,
        project.get_category_display(),
        " ".join(str(s) for s in stack),
        project.problem_statement,
        project.solution,
    ]
    return " ".join(p for p in parts if p)