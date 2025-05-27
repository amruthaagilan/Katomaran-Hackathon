# build_vector_store.py

import os
import pickle
from datetime import datetime
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from langchain.docstore.document import Document

VECTOR_STORE_PATH = "data/face_rag_faiss"
ENCODINGS_PATH = "data/encodings.pkl"

def load_registration_data():
    if not os.path.exists(ENCODINGS_PATH):
        print("[ERROR] No registration data found.")
        return []
    with open(ENCODINGS_PATH, "rb") as f:
        return pickle.load(f)

def convert_to_documents(registrations):
    documents = []
    for idx, reg in enumerate(registrations):
        name = reg.get("name", "Unknown")
        timestamp = reg.get("timestamp", "Unknown")
        content = f"Person {name} was registered at {timestamp}."
        documents.append(Document(page_content=content, metadata={"id": idx, "name": name}))
    return documents

def build_and_save_vector_store():
    registrations = load_registration_data()
    if not registrations:
        return

    documents = convert_to_documents(registrations)
    embeddings = OpenAIEmbeddings()

    # Build FAISS vector store
    vectorstore = FAISS.from_documents(documents, embeddings)
    vectorstore.save_local(VECTOR_STORE_PATH)
    print(f"[INFO] Vector store saved to: {VECTOR_STORE_PATH}")

if __name__ == "__main__":
    build_and_save_vector_store()
