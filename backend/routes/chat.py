from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import logging

from ..models.chat import ChatCreate, ChatResponse, MessageCreate, ChatDetailResponse, MessageResponse
from ..database.session import get_db
from ..utils.auth import get_current_user
from ..database.models import User, Chat, Message, Parameter
from ..utils.logging import log_error

router = APIRouter()

@router.get("/chats", response_model=List[ChatResponse])
def get_chats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Get all chats for the current user
    """
    chats = db.query(Chat).filter(Chat.user_id == current_user.id).all()
    return chats


@router.post("/chats", response_model=ChatDetailResponse)
def create_chat(chat: ChatCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Create a new chat with an initial message
    """
    db_chat = Chat(title=chat.title, user_id=current_user.id)
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)

    parameter = Parameter(tokens=chat.initial_message.parameters.tokens, temperature=chat.initial_message.parameters.temperature)
    db.add(parameter)
    db.commit()
    db.refresh(parameter)

    message = Message(user_prompt=chat.initial_message.user_prompt,
                        model_response="",
                        chat_id=db_chat.id,
                        parameter_id=parameter.id)
    db.add(message)
    db.commit()
    db.refresh(message)

    ###################################
    #### CONSIDER REFACTORING THIS ####
    ###################################
    try:
        from groq import Groq
        from dotenv import load_dotenv
        import os

        load_dotenv()
        GROQ_API_KEY = os.getenv("GROQ_API_KEY")

        client = Groq(
            api_key=GROQ_API_KEY,
        )
        completion = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {
                    "role": "user",
                    "content": chat.initial_message.user_prompt
                },
                # the following assistant role dictionary will be fed into the messages parameter in a loop for every new add_message route call,
                # to give the LLM the chat history. Thus every two message (user & assistant) is one Message model in our database.
                # {
                #     "role": "assistant",
                #     "content": "\"Eda Nattoli\" is a popular Malayalam song from the 2000s."
                # }
            ],
            # the following parameter values (temp & tokens) will be equal to whatever the most recent message's values are.
            temperature=chat.initial_message.parameters.temperature,
            max_tokens=chat.initial_message.parameters.tokens,
            top_p=1,
            stream=False, # not sure what to do about this, will manually test later in frontend
            stop=None,
        )

        # response_string = "".join([chunk.choices[0].delta.content or "" for chunk in completion])
        # IF stream=False:
        response_string = completion.choices[0].message.content
        if completion.choices[0].finish_reason != "stop":
            raise Exception("LLM response did not finish successfully.")

        message.model_response = response_string
        db.commit()
        db.refresh(message)
    except Exception as e:
        log_error(current_user.id, db_chat.id, message.id, str(e))
        db.rollback()
        raise HTTPException(status_code=500, detail="Error generating LLM response. Please try again.")

    return db_chat


@router.post("/chats/{chat_id}/message", response_model=MessageResponse)
def add_message(chat_id: int, message: MessageCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Add a new message to an existing chat
    """
    db_chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not db_chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    parameter = Parameter(tokens=message.parameters.tokens, temperature=message.parameters.temperature)
    db.add(parameter)
    db.commit()
    db.refresh(parameter)

    db_message = Message(user_prompt=message.user_prompt,
                        model_response="",
                        chat_id=db_chat.id,
                        parameter_id=parameter.id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)

    ###################################
    #### CONSIDER REFACTORING THIS ####
    ###################################
    try:
        from groq import Groq
        from dotenv import load_dotenv
        import os

        load_dotenv()
        GROQ_API_KEY = os.getenv("GROQ_API_KEY")

        client = Groq(
            api_key=GROQ_API_KEY,
        )

        chat_history = []
        for msg in db_chat.messages:
            chat_history.append({"role": "user", "content": msg.user_prompt})
            chat_history.append({"role": "assistant", "content": msg.model_response})

        chat_history.append({"role": "user", "content": message.user_prompt})

        completion = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=chat_history,
            temperature=message.parameters.temperature,
            max_tokens=message.parameters.tokens,
            top_p=1,
            stream=False,
            stop=None,
        )
        # response_string = "".join([chunk.choices[0].delta.content or "" for chunk in completion])
        # IF stream=False
        response_string = completion.choices[0].message.content
        if completion.choices[0].finish_reason != "stop":
            raise Exception("LLM response did not finish successfully.")

        db_message.model_response = response_string
        db.commit()
        db.refresh(db_message)
    except Exception as e:
        log_error(current_user.id, db_chat.id, message.id, str(e))
        db.rollback()
        raise HTTPException(status_code=500, detail="Error generating LLM response. Please try again.")

    return db_message
