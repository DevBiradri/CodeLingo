SHELL := /bin/bash

.PHONY: prepare dev backend frontend logs logs-backend logs-frontend clean-logs

LOG_DIR := logs
BACKEND_LOG := $(LOG_DIR)/backend.log
FRONTEND_LOG := $(LOG_DIR)/frontend.log

prepare:
	@echo "Preparing backend and frontend environments..."
	@if [ ! -x ./.venv/bin/python ]; then \
		echo "Creating Python virtual environment at .venv"; \
		python3 -m venv .venv; \
	fi
	./.venv/bin/python -m pip install --upgrade pip
	./.venv/bin/python -m pip install -r backend/requirements.txt
	cd frontend && npm install

backend:
	@mkdir -p $(LOG_DIR)
	./.venv/bin/python -m uvicorn backend.app.main:app --reload --port 8000 2>&1 | tee -a $(BACKEND_LOG)

frontend:
	@mkdir -p $(LOG_DIR)
	cd frontend && npm run dev 2>&1 | tee -a ../$(FRONTEND_LOG)

dev:
	@mkdir -p $(LOG_DIR)
	@echo "Starting backend and frontend..."
	@echo "Backend log: $(BACKEND_LOG)"
	@echo "Frontend log: $(FRONTEND_LOG)"
	@trap 'kill 0' INT TERM EXIT; \
		./.venv/bin/python -m uvicorn backend.app.main:app --reload --port 8000 2>&1 | tee -a $(BACKEND_LOG) & \
		(cd frontend && npm run dev 2>&1 | tee -a ../$(FRONTEND_LOG)) & \
		wait

logs:
	@mkdir -p $(LOG_DIR)
	@touch $(BACKEND_LOG) $(FRONTEND_LOG)
	tail -n 100 -f $(BACKEND_LOG) $(FRONTEND_LOG)

logs-backend:
	@mkdir -p $(LOG_DIR)
	@touch $(BACKEND_LOG)
	tail -n 100 -f $(BACKEND_LOG)

logs-frontend:
	@mkdir -p $(LOG_DIR)
	@touch $(FRONTEND_LOG)
	tail -n 100 -f $(FRONTEND_LOG)

clean-logs:
	rm -f $(BACKEND_LOG) $(FRONTEND_LOG)
