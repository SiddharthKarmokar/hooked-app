import os
import sys
import logging

ENABLE_LOGGING = os.getenv("ENABLE_LOGGING", "true").lower() == "true"  # Set to "false" to disable logging

logger = logging.getLogger("hookedlogger")

if ENABLE_LOGGING:
    logging_str = "[%(asctime)s: %(levelname)s: %(module)s: %(message)s]"
    log_dir = "logs"
    log_filepath = os.path.join(log_dir, "logging.log")
    os.makedirs(log_dir, exist_ok=True)

    logging.basicConfig(
        level=logging.INFO,
        format=logging_str,
        handlers=[
            logging.FileHandler(log_filepath),
            logging.StreamHandler(sys.stdout)
        ]
    )
    logger.setLevel(logging.INFO)
else:
    logger.addHandler(logging.NullHandler()) 
