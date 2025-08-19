FROM docker-hub.nexus.infr.gsprom.local/ubuntu:22.04

RUN echo "deb http://ubuntu.repo.gsprom.local/ubuntu jammy main restricted universe multiverse" > /etc/apt/sources.list && \
    echo "deb http://ubuntu.repo.gsprom.local/ubuntu jammy-updates main restricted universe multiverse" >> /etc/apt/sources.list && \
    echo "deb http://ubuntu.repo.gsprom.local/ubuntu jammy-security main restricted universe multiverse" >> /etc/apt/sources.list

RUN echo 'Acquire::GPGCheck "0";' > /etc/apt/apt.conf.d/01-no-gpg-check && \
    echo 'Acquire::https::Verify-Peer "false";' > /etc/apt/apt.conf.d/99-insecure-https

RUN apt-get clean && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    unixodbc-dev \
    gcc \
    g++ \
    make \
    libffi-dev \
    libssl-dev \
    build-essential \
    curl \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /tmp
RUN curl -k -sSL -o packages-microsoft-prod.deb "https://nexus.infr.gsprom.local/repository/microsoft-ubuntu/config/ubuntu/22.04/packages-microsoft-prod.deb" && \
    dpkg -i packages-microsoft-prod.deb && \
    echo "deb [arch=amd64,arm64,armhf signed-by=/usr/share/keyrings/microsoft-prod.gpg] https://nexus.infr.gsprom.local/repository/microsoft-ubuntu/ubuntu/22.04/prod jammy main" | tee /etc/apt/sources.list.d/microsoft-prod.list > /dev/null && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql17 && \
    rm -rf /tmp/*

ENV PATH="$PATH:/opt/mssql-tools/bin"

WORKDIR /app

COPY requirements.txt .

RUN pip install --trusted-host nexus.infr.gsprom.local --index-url https://nexus.infr.gsprom.local/repository/pip/simple -r requirements.txt

COPY . .

EXPOSE 8000

RUN mkdir /prometheus

CMD ["sh", "-c", "gunicorn main:app --workers ${BACKEND_WORKERS} --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000"]