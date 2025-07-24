# Makefile for the University Library Frontend

.PHONY: all clean build install

all: build

# Install dependencies if node_modules directory doesn't exist
install: node_modules

node_modules: package.json
	@echo "Installing frontend dependencies..."
	npm install

# Build the React application for production
build: install
	@echo "Building frontend application for production..."
	npm run build
	@echo "Build complete. Output is in the dist/ directory."

# Clean up node_modules and build artifacts
clean:
	@echo "Cleaning up frontend build artifacts and dependencies..."
	rm -rf dist/
	rm -rf node_modules/
	@echo "Cleanup complete."