# Makefile for the University Library Frontend
##
# frontend/Makefile.mk
#
# This file is part of the University Library project.
# It provides Makefile commands to simplify common development tasks for the
# frontend application, such as installing dependencies, building for
# production, and cleaning the project directory.
#
# Author: Raul Berrios
##

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