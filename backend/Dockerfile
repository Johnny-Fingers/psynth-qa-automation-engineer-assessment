# Using Python 3.10 which was used during the development of this project
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# 1. Copy requirements from the backend folder
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2. Copy the backend application code
COPY backend/ .

# 3. Copy the sample data from the project root to the container root
# The Python logic (../../..) expects the file at the filesystem root level
COPY sample_data.json /sample_data.json

# Expose and Run
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]