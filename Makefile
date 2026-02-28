.PHONY: help install dev build build-mac build-win build-linux clean lint format type-check preview

# Default target
help:
	@echo "🚀 BeyondChats - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make dev            - Start development server (Vite + Electron)"
	@echo "  make preview        - Preview the built app"
	@echo ""
	@echo "Building:"
	@echo "  make build          - Build for current platform"
	@echo "  make build-mac      - Build for macOS"
	@echo "  make build-win      - Build for Windows"
	@echo "  make build-linux    - Build for Linux"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint           - Run ESLint"
	@echo "  make format         - Format code with Prettier"
	@echo "  make type-check     - Check TypeScript types"
	@echo ""
	@echo "Maintenance:"
	@echo "  make install        - Install dependencies"
	@echo "  make clean          - Clean build artifacts"
	@echo "  make help           - Show this help message"
	@echo ""

install:
	npm install

dev:
	npm run dev

build:
	npm run build

build-mac:
	npm run build:mac

build-win:
	npm run build:win

build-linux:
	npm run build:linux

lint:
	npm run lint

format:
	npm run format

type-check:
	npm run type-check

preview:
	npm run preview

clean:
	rm -rf dist
	rm -rf node_modules/.cache
	rm -rf .vite

.DEFAULT_GOAL := help
