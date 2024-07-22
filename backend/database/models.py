from sqlalchemy import Column, Integer, String, ForeignKey, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    firstname = Column(String, index=True)
    lastname = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    chats = relationship("Chat", back_populates="user")

class Chat(Base):
    __tablename__ = "chats"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="chats")
    messages = relationship("Message", back_populates="chat")

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    user_prompt = Column(Text)
    model_response = Column(Text)
    chat_id = Column(Integer, ForeignKey("chats.id"))
    chat = relationship("Chat", back_populates="messages")
    parameter_id = Column(Integer, ForeignKey("parameters.id"))
    parameters = relationship("Parameter", back_populates="message", uselist=False)

class Parameter(Base):
    __tablename__ = "parameters"
    id = Column(Integer, primary_key=True, index=True)
    tokens = Column(Integer)
    temperature = Column(Float)
    # each message can only have one set of params
    message = relationship("Message", back_populates="parameters", uselist=False)
