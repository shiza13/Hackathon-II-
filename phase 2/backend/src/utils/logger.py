import logging
from datetime import datetime
from typing import Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def log_user_action(action: str, user_id: str = None, details: Dict[str, Any] = None):
    """Log user actions for audit trail"""
    log_data = {
        "timestamp": datetime.utcnow().isoformat(),
        "action": action,
        "user_id": user_id,
        "details": details
    }
    logger.info(f"User action: {log_data}")

def log_authentication_event(event: str, user_email: str = None, success: bool = True):
    """Log authentication events"""
    log_data = {
        "timestamp": datetime.utcnow().isoformat(),
        "event": event,
        "user_email": user_email,
        "success": success
    }
    log_level = logging.INFO if success else logging.WARNING
    logger.log(log_level, f"Auth event: {log_data}")