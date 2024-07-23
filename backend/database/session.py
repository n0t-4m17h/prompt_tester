from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

from .models import Base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

# # Update existing messages to set a default value for top_p
# db = SessionLocal()
# db.execute(text("UPDATE messages SET top_p = 1 WHERE top_p IS NULL"))
# db.commit()
# db.close()

def get_db():
    db = SessionLocal()
    try:
        # prevents manual closing
        yield db
    finally:
        db.close()
