from pydantic import BaseModel
from typing import List

class ParameterCreate(BaseModel):
    tokens: int
    temperature: float
    top_p: float

class MessageCreate(BaseModel):
    user_prompt: str
    parameters: ParameterCreate

class ChatCreate(BaseModel):
    title: str
    initial_message: MessageCreate

class ChatResponse(BaseModel):
    id: int
    title: str
    user_id: int

class MessageResponse(BaseModel):
    id: int
    user_prompt: str
    model_response: str
    chat_id: int
    parameters: ParameterCreate

class ChatDetailResponse(BaseModel):
    id: int
    title: str
    user_id: int
    messages: List[MessageResponse]