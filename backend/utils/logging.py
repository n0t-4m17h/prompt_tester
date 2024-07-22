import logging
import os
from datetime import datetime

# might be more reliable to get path of this file, then relative checks
if not os.path.exists("logs"):
    os.makedirs("logs")

logger = logging.getLogger("LLMLogger")
logger.setLevel(logging.ERROR)
# log files based on date and time
file_handler = logging.FileHandler(f"logs/LLM_{datetime.datetime.now().strftime("%Y-%m-%d_%H-%M")}.log")
formatter = logging.Formatter("%(asctime)s - %(levelname)s - user_id: %(user_id)s - chat_id: %(chat_id)s - message_id: %(message_id)s - %(message)s")
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

# custom logger for unique attributes, for user activities
def log_error(user_id, chat_id, message_id, error_msg):
    extra = {
        "user_id": user_id,
        "chat_id": chat_id,
        "message_id": message_id
    }
    logger.error(error_msg, extra=extra)
