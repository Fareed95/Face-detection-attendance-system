import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import pandas as pd
from dotenv import load_dotenv
import os

load_dotenv()

def send_attendance_emails(recognized_faces, subject, class_time):
    sender_email = os.getenv("Email")
    sender_password = os.getenv('Password')  # App-specific password if using Gmail

    for face in recognized_faces:
        if pd.notna(face['parent_email']) and face['parent_email']:
            message = MIMEMultipart()
            message["From"] = sender_email
            message["To"] = face["parent_email"]
            message["Subject"] = "Attendance Notification"

            body = f"Dear Parent,\n\nYour student {face['name']} (UIN: {face['uin']}) was present in class.\nSubject: {subject}\nTime: {class_time}\n\nRegards,\nAttendance System"
            message.attach(MIMEText(body, "plain"))

            try:
                with smtplib.SMTP("smtp.gmail.com", 587) as server:
                    server.starttls()
                    server.login(sender_email, sender_password)
                    server.send_message(message)
                print(f"📧 Email sent to {face['parent_email']}")
            except Exception as e:
                print(f"[Error] Failed to send email to {face['parent_email']}: {e}")
