import os
from src import logger
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from src.constants import VERIFICATION_LINK, NO_REPLY_MAIL
from src.config.common_setting import settings


async def send_verification_email(to_email: str, token: str):
    verify_link = f"{VERIFICATION_LINK}?token={token}"

    message = Mail(
        from_email=NO_REPLY_MAIL,
        to_emails=to_email,
        subject='Verify your email',
        plain_text_content=f'Click this link to verify your email: {verify_link}'
    )

    try:
        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        response = sg.send(message)
        logger.info(f"SendGrid response status code: {response.status_code}")
    except Exception as e:
        logger.exception("SendGrid Error:", str(e))