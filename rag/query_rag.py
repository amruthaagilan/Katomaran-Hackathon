# query_rag.py

import os
from langchain.chat_models import ChatOpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA

VECTOR_STORE_PATH = "data/face_rag_faiss"

def load_vector_store():
    if not os.path.exists(VECTOR_STORE_PATH):
        print("[ERROR] Vector store not found. Run build_vector_store.py first.")
        return None
    embeddings = OpenAIEmbeddings()
    return FAISS.load_local(VECTOR_STORE_PATH, embeddings, allow_dangerous_deserialization=True)

def create_qa_chain(vectorstore):
    retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
    llm = ChatOpenAI(model="gpt-3.5-turbo")  # or "gpt-4" if you have access
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        return_source_documents=False
    )
    return qa_chain

def ask_question(qa_chain, question):
    result = qa_chain.run(question)
    print(f"\n🧠 Q: {question}\n💬 A: {result}")

if __name__ == "__main__":
    vectorstore = load_vector_store()
    if not vectorstore:
        exit()

    qa_chain = create_qa_chain(vectorstore)

    while True:
        query = input("\n🔎 Ask a question (or 'exit'): ")
        if query.lower() in ["exit", "quit"]:
            break
        ask_question(qa_chain, query)
